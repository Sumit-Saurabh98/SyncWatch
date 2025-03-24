
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';

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

export const getProfile = async (req: Request, res: Response) => {
  try {
      const user = req.user;
      res.status(200).json({ success: true, message: "Profile fetched successfully", user });
  } catch (error) {
      console.log("Error in getting profile:", error);
      res.status(500).json({ message: "Internal server error: " + error });
  }
};

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
    
  try {
    
    const { profilePicture } = req.body;

    let image = "";

  if (profilePicture) {
    // base64 format
    if (profilePicture.startsWith("data:image")) {
      try {
          const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
          image = uploadedResponse.secure_url;
      } catch (error) {
          console.log(error);
          res.status(500).json({ success: false, message: "Error uploading image" });
          return;
      }
    }
  }

  const user = await User.findById(req.user._id)

  if(!user){
    res.status(404).json({success: false, message: "User not found"});
    return;
  }
    
    user.profilePicture = image;
    await user.save();

    const updatedUser = await User.findById(req.user._id);
    if(!updatedUser){
      res.status(404).json({success: false, message: "User not found"});
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Profile picture updated successfully", 
      user:updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};