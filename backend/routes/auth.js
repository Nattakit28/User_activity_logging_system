const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");
const verifyToken = require("../middleware/auth");
require("dotenv").config();

// Register
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  console.log("\n📝 REGISTER REQUEST");
  console.log(`   Username: ${username}`);
  console.log(`   Email: ${email}`);

  if (!username || !email || !password) {
    console.warn("   ⚠️  Missing required fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("❌ Registration failed:", err.message);
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const userId = result.insertId;
    console.log(`✅ User registered successfully - ID: ${userId}`);
    console.log(`   📊 Changes: 1 row inserted`);
    console.log(`   ✓ Verified in database: ${username} (${email})\n`);

    res.status(201).json({
      message: "User registered successfully",
      userId: userId,
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("\n🔐 LOGIN REQUEST");
  console.log(`   Username: ${username}`);

  if (!username || !password) {
    console.warn("   ⚠️  Missing username or password");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check total users
  db.query("SELECT COUNT(*) as count FROM users", (err, countResult) => {
    if (!err) {
      console.log(`   📊 Total users in database: ${countResult[0].count}`);
    }
  });

  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("❌ Database error during login:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      console.warn("   ⚠️  User not found");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      console.warn("   ⚠️  Invalid password");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    console.log(`✅ Login successful - User ID: ${user.id}`);
    console.log(`   Token issued for 7 days\n`);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
});

router.get("/profile", verifyToken, (req, res) => {
  const userId = req.userId;

  console.log("\n👤 GET USER PROFILE");
  console.log(`   User ID: ${userId}`);

  const query =
    "SELECT id, username, email, created_at FROM users WHERE id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      console.warn("   ⚠️  User not found\n");
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    console.log(`✅ User profile retrieved: ${user.username}\n`);
    res.json(user);
  });
});

module.exports = router;
