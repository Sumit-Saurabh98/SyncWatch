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
  createdBy: string;
  isPrivate: boolean;
  category: string;
  accessCode: string;
  thumbnailUrl: string;
  isActive: boolean;
  isLive: boolean;
  startDateTime: Date;
  messages: string[];
  videoId: string;
  participants: IParticipant[];
  videoState: {
    isPlaying: number;
    isMuted: boolean;
    volume: number;
    playbackRate: number;
    subtitles: boolean;
    seekTo: number;
  };
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
