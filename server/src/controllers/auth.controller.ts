import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { strongPassword } from "../utils/password.js";
import User from "../models/user.model.js";
import { signToken } from "../utils/token.js";
import { setCookie } from "../utils/cookie.js";
import { sendVerificationEmail } from "../utils/email.js";
import { generateVerificationCode } from "../utils/generateVerificationToken.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!strongPassword(password)) {
      res.status(400).json({
        message:
          "Password must contain at least 6 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ success: false, message: "User already exists" });

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationToken = generateVerificationCode(email);
    newUser.verificationToken = verificationToken;
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await User.findOne({ email });

    if(user?.googleId){
      res.status(400).json({ success: false, message: "You have logged in with google" });
      return;
    }

    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (!user.emailVerified) {
      res
        .status(400)
        .json({ success: false, message: "Please verify your email" });

      const verificationToken = generateVerificationCode(email);
      user.verificationToken = verificationToken;
      await user.save();

      await sendVerificationEmail(email, verificationToken);

      return;
    }

    const token = signToken(user._id.toString());

    setCookie(res, token);

    const createdUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: createdUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ success: false, message: "Token is required" });
    return;
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid token" });
      return;
    }

    user.emailVerified = true;
    user.verificationToken = "";
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("synclearn_token", "", {
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: "Email is required" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }

    if (user.emailVerified) {
      res
        .status(400)
        .json({ success: false, message: "Email already verified" });
      return;
    }

    const verificationToken = generateVerificationCode(email);
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const resetPasswordToken = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: "Email is required" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if(user?.googleId){
      res.status(400).json({ success: false, message: "You have logged in with google" });
      return;
    }

    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }

    const verificationToken = generateVerificationCode(email);
    user.passwordResetToken = verificationToken;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Token sent successfully!, please check your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { password, token } = req.body;

  if (!password || !token) {
    res.status(400).json({ success: false, message: "Password and token are required" });
    return;
  }

  try {
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = "";
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}