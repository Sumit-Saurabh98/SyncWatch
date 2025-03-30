export interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  emailVerified: boolean;
  verificationToken: string;
  passwordResetToken: string;
  googleId: string;
  joinedRooms: string[];
  createdRooms: string[];
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoom {
  _id: string;
  name: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  videoId: string;
  messages: IMessage[];
  createdBy: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  category: string;
  startDateTime: string;
  isLive: boolean;
  isActive: boolean;
  isPrivate: boolean;
  participants: {
    userId: string;
    role: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id?: string;
  sender: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  message: string;
  roomId: string;
  createdAt?: Date;
  updatedAt?: Date;
}