import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    { userId: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth"
});
