const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { memoryUsers, seedDemoAdmin } = require("../config/memoryStore");

function canUseMongo() {
  return User.db && User.db.readyState === 1;
}

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required.");
  }

  return process.env.JWT_SECRET;
}

function signToken(user) {
  return jwt.sign(
    {
      id: user._id?.toString?.() || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

function formatUser(user) {
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function register(req, res) {
  try {
    await seedDemoAdmin();
    const { name, email, password, role = "citizen" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;

    if (canUseMongo()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "User already exists." });
      }

      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
      });
    } else {
      const existingUser = memoryUsers.find((item) => item.email === normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ success: false, message: "User already exists." });
      }

      user = {
        id: `mem-user-${memoryUsers.length + 1}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
      };
      memoryUsers.push(user);
    }

    const safeUser = formatUser(user);
    return res.status(201).json({ success: true, user: safeUser, token: signToken(safeUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Registration failed.", error: error.message });
  }
}

async function login(req, res) {
  try {
    await seedDemoAdmin();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = canUseMongo()
      ? await User.findOne({ email: normalizedEmail })
      : memoryUsers.find((item) => item.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const safeUser = formatUser(user);
    return res.json({ success: true, user: safeUser, token: signToken(safeUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed.", error: error.message });
  }
}

async function getMe(req, res) {
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

module.exports = {
  register,
  login,
  getMe,
};
