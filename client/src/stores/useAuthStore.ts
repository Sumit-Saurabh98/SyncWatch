import { create } from "zustand";
import { IUser } from "@/utils/interfaces.js";
import syncapi from "@/utils/axios.js";
import {toast} from "react-toastify"
export interface IAuthStore {
  user: IUser | null;
  signUpLoading: boolean;
  loginLoading: boolean;
  checkAuthLoading: boolean;
  checkingAuth: boolean;
  isVerifyingToken: boolean;
  isResendingVerificationEmail: boolean;
  isSendingEmailForPasswordReset: boolean;
  isResettingPassword: boolean;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  sendtokenForresetPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<void>;
  setUser: (user: IUser) => void;
}

export const useAuthStore = create<IAuthStore>((set, get) => ({
  user: null,
  signUpLoading: false,
  loginLoading: false,
  checkAuthLoading: false,
  checkingAuth: true,
  isVerifyingToken: false,
  isResendingVerificationEmail: false,
  isSendingEmailForPasswordReset: false,
  isResettingPassword: false,


  register: async (name, email, password, confirmPassword) => {
    set({ signUpLoading: true});

    if (!name && !email && !password) {
      toast.error("All fields are required", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      set({ signUpLoading: false});
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      set({ signUpLoading: false});
      return false;
    }

    try {
      const response = await syncapi.post("/auth/register", {
        name,
        email,
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ signUpLoading: false, checkingAuth: false});
        return false;
      }

      set({
        signUpLoading: false,
        checkingAuth: false
      });
      toast.success("Account created successfully, please check your email to verify your account!", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return true;
    } catch (error) {
      console.error(error);
      set({ signUpLoading: false, checkingAuth: false});
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
      set({ signUpLoading: false, checkingAuth: false});
    }
  },

  login: async (email, password) =>{
    set({ loginLoading: true });

    if (!email && !password) {
      toast.error("All fields are required", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      set({ loginLoading: false });
      return false;
    }

    try {
      const response = await syncapi.post("/auth/login", {
        email,
        password,
      });

      if (!response.data.success) {
        if(response.data.message === "Please verify your email"){
          toast.error("Please verify your email is bahanchod", {
            style:{
              borderRadius: "10px",
              background: "#ec4899",
              color: "white",
            }
          });
          return true;
        }
        toast.error("Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ loginLoading: false, checkingAuth: false });
        return false;
      }

      set({
        user: response.data.user,
        loginLoading: false,
        checkingAuth: false,
      });
      toast.success(response.data.message || "Login successful", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });

      return false;
    } catch (error) {
      console.error(error);
      set({ loginLoading: false, checkingAuth: false });
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      if(axiosError.response?.data?.message === "Please verify your email"){
        return true;
      }
      toast.error(axiosError.response?.data?.message || "Something went wrong", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return false;
    } finally {
      set({ loginLoading: false, checkingAuth: false });
    }
  },

  logout: async () => {
    try {
      await syncapi.post("/auth/logout");
      set({ user: null });
    } catch (error: unknown) {
      console.error(error);
      set({ loginLoading: false });
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
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true, checkAuthLoading: true });
    try {
      const response = await syncapi.get("/user/profile");
  
      if (!response.data.success) {
        set({ user: null, checkingAuth: false, checkAuthLoading: false });
        return;
      }
  
      set({
        user: response.data.user,
        checkingAuth: false,
        checkAuthLoading: false,
      });
    } catch (error) {
      console.error("Auth error:", error);
      set({ user: null, checkingAuth: false, checkAuthLoading: false });
    } finally {
      set({ checkAuthLoading: false, checkingAuth: false });
    }
  },

  verifyEmail: async (token) =>{
    set({ isVerifyingToken: true });
    try {
      const response = await syncapi.patch("/auth/verification", { token });

      if(!response.data.success){
        toast.error(response.data.message || "Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ isVerifyingToken: false, });
        return false;
      }

      set({ isVerifyingToken: false});
      toast.success(response.data.message || "Email verified successfully", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return true
    } catch (error) {
      console.error(error);
      set({ isVerifyingToken: false,});
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
      set({ isVerifyingToken: false});
    }
  },

  resendVerificationEmail: async (email) => {
    set({ isResendingVerificationEmail: true });
    try {
      const response = await syncapi.patch("/auth/resend-verification", { email });

      if(!response.data.success){
        toast.error(response.data.message || "Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ isResendingVerificationEmail: false, });
        return false;
      }

      set({ isResendingVerificationEmail: false});
      toast.success(response.data.message || "Verification email sent successfully", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return true
    } catch (error) {
      console.error(error);
      set({ isResendingVerificationEmail: false,});
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
      set({ isResendingVerificationEmail: false});
    }
  },

  sendtokenForresetPassword: async (email) => {
    set({ isSendingEmailForPasswordReset: true });
    try {
      const response = await syncapi.post("/auth/send-password-reset-email", { email });

      if(!response.data.success){
        toast.error(response.data.message || "Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ isSendingEmailForPasswordReset: false, });
        return false;
      }

      set({ isSendingEmailForPasswordReset: false});
      toast.success(response.data.message || "Verification email sent successfully", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return true
    } catch (error) {
      console.error(error);
      set({ isSendingEmailForPasswordReset: false,});
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
    }finally{
      set({ isSendingEmailForPasswordReset: false});
    }
  },

  resetPassword: async (token, password) => {
    set({ isResettingPassword: true });
    try {
      const response = await syncapi.post("/auth/reset-password", { token, password });

      if(!response.data.success){
        toast.error(response.data.message || "Something went wrong", {
          style:{
            borderRadius: "10px",
            background: "#ec4899",
            color: "white",
          }
        });
        set({ isResettingPassword: false, });
        return false;
      }

      set({ isResettingPassword: false});
      toast.success(response.data.message || "Password reset successfully", {
        style:{
          borderRadius: "10px",
          background: "#ec4899",
          color: "white",
        }
      });
      return true
    } catch (error) {
      console.error(error);
      set({ isResettingPassword: false,});
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
    }finally{
      set({ isResettingPassword: false});
    }
  },

  googleLogin: async () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/google`;
},

  setUser: (user: IUser) => set({ user: user }),
}));
