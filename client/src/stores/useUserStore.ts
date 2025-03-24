import { create } from "zustand";
import syncapi from "@/utils/axios.js";
import {toast} from "react-toastify"
import { useAuthStore } from "./useAuthStore";
export interface IUserStore {
  isUpdatingName: boolean;
  isUpdatingProfilePicture: boolean;
  updateUserName: (name: string) => Promise<boolean>;
  updateProfilePicture: (file: string) => Promise<boolean>;
}

export const useUserStore = create<IUserStore>((set, get) => ({
  isUpdatingName: false,
  isUpdatingProfilePicture: false,

  updateUserName: async (name) => {
    set({ isUpdatingName: true });
    try {
      const response = await syncapi.patch("/user/update-name", { name });
      if(!response.data.success){
        toast.error(response.data.message || "Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ isUpdatingName: false, });
        return false;
      }
      useAuthStore.getState().setUser(response.data.user);
      set({ isUpdatingName: false});
      toast.success(response.data.message || "Name updated successfully", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return true
    } catch (error) {
      console.error(error);
      set({ isUpdatingName: false,});
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError.response?.data?.message || "Something went wrong", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return false
    } finally {
      set({ isUpdatingName: false});
    }
  },

  updateProfilePicture: async (profilePicture) => {
    set({ isUpdatingProfilePicture: true });
    try {

      const response = await syncapi.patch("/user/update-profile-picture", {profilePicture});

      useAuthStore.getState().setUser(response.data.user);
      
      if(!response.data.success){
        toast.error(response.data.message || "Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ isUpdatingProfilePicture: false });
        return false;
      }
      
      set({ isUpdatingProfilePicture: false });
      toast.success(response.data.message || "Profile picture updated successfully", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return true;
    } catch (error) {
      console.error(error);
      set({ isUpdatingProfilePicture: false });
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError.response?.data?.message || "Something went wrong", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return false;
    } finally {
      set({ isUpdatingProfilePicture: false });
    }
  }
}));