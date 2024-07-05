const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();
app.use(cors());

mongoose.connect(
  "mongodb+srv://tedlee000:Lgu2vtRn2nn08zNp@cluster0.59cqlq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
);

app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

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

    jwt.sign(
      { userId: user._id, name: user.name },
      "00Jwq9HjglwFLy5/5im4+2uy9s2WHqahtgkfTpEkPcI=",
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          name: user.name,
          userId: user._id,
        });
      },
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

  //try {
  //  const user = await User.findOne({ email });
  //  if (!user) {
  //    return res.status(404).json({ message: "User not found" });
  //  }

  //  const isPasswordValid = await bcrypt.compare(password, user.password);
  //  if (!isPasswordValid) {
  //    return res.status(401).json({ message: "Invalid credentials" });
  //  }

  //  res.status(200).json({ message: "Login successful", user });
  //} catch (err) {
  //  res.status(500).json({ message: "Server error" });
  //}
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
