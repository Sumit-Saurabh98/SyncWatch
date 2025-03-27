import { create } from "zustand";
import { IRoom } from "@/utils/interfaces";
import syncapi from "@/utils/axios.js";
import { toast } from "react-toastify";

export interface IRoomStore {
  isCreatingRoom: boolean;
  isGettingRoomsCreatedByUser: boolean;
  isGettingRoomsJoinedByUser: boolean;
  isGettingAllRooms: boolean;
  rooms: IRoom[];
  userCreatedRooms: IRoom[];
  userJoinedRooms: IRoom[];
  trendingRooms: IRoom[];
  createRoom: (
    name: string,
    description: string,
    videoUrl: string,
    category: string,
    startDateTime: Date
  ) => Promise<boolean>;
  getRoomsCreatedByUser: () => Promise<boolean>;
  getRoomsJoinedByUser: () => Promise<boolean>;
  getAllRooms: () => Promise<boolean>;
}

export const useRoomStore = create<IRoomStore>((set, get) => ({
  isCreatingRoom: false,
  isGettingRoomsCreatedByUser: false,
  isGettingRoomsJoinedByUser: false,
  isGettingAllRooms: false,
  rooms: [],
  userCreatedRooms: [],
  userJoinedRooms: [],
  trendingRooms: [],

  createRoom: async (name, description, videoUrl, category, startDateTime) => {
    set({ isCreatingRoom: true });
    try {
      const response = await syncapi.post("/room/create", {
        name,
        description,
        videoUrl,
        category,
        startDateTime,
      });
      if (!response.data.success) {
        toast.error(response.data.message || "Something went wrong", {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        });
        set({ isCreatingRoom: false });
        return false;
      }
      toast.success(response.data.message || "Room created successfully", {
        style: {
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        },
      });
      set({ rooms: [...get().rooms, response.data.room], isCreatingRoom: false, userCreatedRooms: [...get().userCreatedRooms, response.data.room] });
      return true;
    } catch (error) {
      console.error(error);
      set({ isCreatingRoom: false });
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || "Something went wrong",
        {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        }
      );
      return false;
    } finally {
      set({ isCreatingRoom: false });
    }
  },

  getRoomsCreatedByUser: async () => {
    set({ isGettingRoomsCreatedByUser: true });
    try {
      const response = await syncapi.get("/room/created-by-user");
      if (!response.data.success) {
        toast.error(response.data.message || "Something went wrong", {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        });
        set({ isGettingRoomsCreatedByUser: false });
        return false;
      }
      set({
        userCreatedRooms: response.data.rooms,
        isGettingRoomsCreatedByUser: false,
      });
      return true;
    } catch (error) {
      console.error(error);
      set({ isGettingRoomsCreatedByUser: false });
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || "Something went wrong",
        {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        }
      );
      return false;
    } finally {
      set({ isGettingRoomsCreatedByUser: false });
    }
  },

  getRoomsJoinedByUser: async () => {
    set({ isGettingRoomsJoinedByUser: true });
    try {
      const response = await syncapi.get("/room/joined-by-user");
      if (!response.data.success) {
        toast.error(response.data.message || "Something went wrong", {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        });
        set({ isGettingRoomsJoinedByUser: false });
        return false;
      }
      set({
        userJoinedRooms: response.data.rooms,
        isGettingRoomsJoinedByUser: false,
      });
      return true;
    } catch (error) {
      console.error(error);
      set({ isGettingRoomsJoinedByUser: false });
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || "Something went wrong",
        {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        }
      );
      return false;
    } finally {
      set({ isGettingRoomsJoinedByUser: false });
    }
  },

  getAllRooms: async () => {
    set({ isGettingAllRooms: true });
    try {
      const response = await syncapi.get("/room/all");
      if (!response.data.success) {
        toast.error(response.data.message || "Something went wrong", {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        });
        set({ isGettingAllRooms: false });
        return false;
      }
      set({ rooms: response.data.rooms, isGettingAllRooms: false });
      const trendingRooms = response.data.rooms.filter(
        (room: IRoom) => room.isLive === true
      )
      set({ trendingRooms });
      return true;
    } catch (error) {
      console.error(error);
      set({ isGettingAllRooms: false });
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || "Something went wrong",
        {
          style: {
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          },
        }
      );
      return false;
    } finally {
      set({ isGettingAllRooms: false });
    }
  },
}));
