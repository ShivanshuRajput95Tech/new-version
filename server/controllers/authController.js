const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT || 10));
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      emailVerified: false,
    });

    await user.save();

    const secret = process.env.JWTPRIVATEKEY + user.password;
    const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      verificationLink: `http://localhost:5173/verify/${user._id}/${token}`,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("_id email firstName lastName status");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (_req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({ message: "Logged out" });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "Invalid link" });
    }

    const secret = process.env.JWTPRIVATEKEY + user.password;
    jwt.verify(token, secret);

    user.emailVerified = true;
    await user.save();

    const authToken = user.generateAuthToken();

    return res.json({
      message: "Email verified successfully",
      token: authToken,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch {
    return res.status(400).json({ message: "Invalid or expired link" });
  }
};
