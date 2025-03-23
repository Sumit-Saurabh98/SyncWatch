export interface IUser {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
    joinedRooms: string[];
    createdRooms: string[];
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }