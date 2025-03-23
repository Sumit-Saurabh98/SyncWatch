import multer from 'multer';
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';
import fs from 'fs';

export const updateName = async (req: Request, res: Response): Promise<void> => {

  const {name} = req.body;
  if(!name){
    res.status(400).json({success: false, message: "Name is required"});
    return;
  }

  try {
    const user = await User.findById(req.user._id);
    if(!user){
      res.status(404).json({success: false, message: "User not found"});
      return;
    }
    user.name = name;
    await user.save();
    res.status(200).json({success: true, message: "Name updated successfully", user});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Internal server error"});
  }
}

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware to handle single file upload
const uploadMiddleware = upload.single('profilePicture');

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
  // Use multer middleware before this function
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: "Error uploading file" });
    }
    
    // After multer middleware, file is in req.file, not req.body
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }
    
    try {
      // Use the file path from multer
      const result = await cloudinary.uploader.upload(req.file.path);
      
      // Clean up the temporary file after upload to cloudinary
      fs.unlinkSync(req.file.path);
      
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      user.profilePicture = result.secure_url;
      await user.save();
      
      res.status(200).json({ 
        success: true, 
        message: "Profile picture updated successfully", 
        user 
      });
    } catch (error) {
      console.error(error);
      // Clean up file if it exists and there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
};


export const getProfile = async (req: Request, res: Response) => {
  try {
      const user = req.user;
      res.status(200).json({ success: true, message: "Profile fetched successfully", user });
  } catch (error) {
      console.log("Error in getting profile:", error);
      res.status(500).json({ message: "Internal server error: " + error });
  }
};