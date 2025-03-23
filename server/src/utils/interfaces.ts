export interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  emailVerified: boolean;
  verificationToken: string;
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
  createdBy: string;
  isPrivate: boolean;
  accessCode: string;
  participants: IParticipant[];
  videoState: {
    currentTime: number;
    isPlaying: boolean;
    lastUpdated: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  sender: string;
  message: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IParticipant {
  userId: string;
  role: string;
}
