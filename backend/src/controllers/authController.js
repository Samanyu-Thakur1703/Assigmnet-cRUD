import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  refreshCookieOptions
} from "../utils/tokens.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registration successful.",
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select("+password +refreshTokenHash");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing. Please log in again." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token. Please log in again." });
    }

    const user = await User.findById(decoded.userId).select("+refreshTokenHash");

    if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: "Refresh token is invalid or has been revoked." });
    }

    // Rotate the refresh token: the old token becomes unusable.
    const newRefreshToken = generateRefreshToken(user);
    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    const newAccessToken = generateAccessToken(user);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions());

    return res.status(200).json({
      message: "Access token refreshed.",
      accessToken: newAccessToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("+refreshTokenHash");

    if (user) {
      user.refreshTokenHash = null;
      await user.save();
    }

    res.clearCookie("refreshToken", refreshCookieOptions());

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};
