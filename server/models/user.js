// Step 14 - create user model for mongodb using mongoose

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    profilePicture: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFAOtp: {
      type: String,
      select: false, // Don't return OTP by default
    },
    twoFAOtpExpires: {
      type: Date,
      select: false, // Don't return OTP expiry by default
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
