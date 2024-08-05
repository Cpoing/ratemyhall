const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  credentials: true,
  origin: "https://www.ratemyhall.com",
  //origin: "http://localhost:5173",
};

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(process.env.VITE_MONGOOSE_URI);

const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.VITE_ACCESS_KEY,
    secretAccessKey: process.env.VITE_SECRET_ACCESS_KEY,
  },
  region: process.env.VITE_BUCKET_REGION,
});

const reviewSchema = new mongoose.Schema({
  hallName: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  imageName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Review = mongoose.model("Review", reviewSchema);

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.VITE_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      sameSite: "None",
      secure: true,
      domain: "ratemyhall.com",
      maxAge: 3600,
    });

    res.json({
      name: user.name,
      userId: user._id,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.VITE_SECRET_KEY, {}, (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

app.post(
  "/api/reviews",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { hallName, rating, text } = req.body;
    const imageName = randomImageName();
    const image = req.file;

    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }

    if (image) {
      try {
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.VITE_BUCKET_NAME,
            Key: imageName,
            Body: image.buffer,
            ContentType: image.mimetype,
          },
        });

        await upload.done();
      } catch (err) {
        console.error("Error uploading to S3:", err);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    try {
      const newReview = new Review({
        hallName,
        rating,
        text,
        imageName,
        date: new Date(),
        userId: req.user.userId,
      });

      await newReview.save();
      res.status(201).json({ message: "Review submitted sucessfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.delete("/api/reviews/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const params = {
      Bucket: process.env.VITE_BUCKET_NAME,
      Key: review.imageName,
    };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    if (review.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/reviews/:hallName", async (req, res) => {
  const { hallName } = req.params;

  try {
    const reviews = await Review.find({ hallName }).populate("userId", "name");

    const reviewsWithUrls = await Promise.all(
      reviews.map(async (review) => {
        const getObjectParams = {
          Bucket: process.env.VITE_BUCKET_NAME,
          Key: review.imageName,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return {
          ...review.toObject(),
          imageUrl: url,
        };
      }),
    );

    res.json(reviewsWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/lecture-halls", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "lectureHalls.json");
    const data = fs.readFileSync(filePath, "utf8");
    let lectureHalls = JSON.parse(data);
    const reviews = await Review.find().lean();

    const hallsWithReviews = lectureHalls.map((hall) => {
      const hallReviews = reviews.filter(
        (review) => review.hallName === hall.name,
      );
      const ratingSum = hallReviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const averageRating = hallReviews.length
        ? ratingSum / hallReviews.length
        : 0;

      return {
        ...hall,
        averageRating: averageRating.toFixed(1),
        reviewCount: hallReviews.length,
      };
    });

    res.json(hallsWithReviews);
  } catch (err) {
    console.error("Error fetching lecture halls:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q;

  try {
    const filePath = path.join(__dirname, "lectureHalls.json");
    const data = fs.readFileSync(filePath, "utf8");
    const lectureHalls = JSON.parse(data);
    const reviews = await Review.find().lean();

    const searchResults = lectureHalls
      .filter((hall) => hall.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 9)
      .map((hall) => {
        const hallReviews = reviews.filter(
          (review) => review.hallName === hall.name,
        );
        const ratingSum = hallReviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        const averageRating = hallReviews.length
          ? ratingSum / hallReviews.length
          : 0;

        return {
          ...hall,
          averageRating: averageRating.toFixed(1),
          reviewCount: hallReviews.length,
        };
      });

    res.json(searchResults);
  } catch (err) {
    console.error("Error searching lecture halls:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
