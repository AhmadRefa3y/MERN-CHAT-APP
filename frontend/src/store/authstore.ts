import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Define the shape of the store
interface AuthState {
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  authUser: any | null; // Replace `string` with the type of your user object if it's more complex
  checkAuth: () => void;
  signUp: (formData: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  login: (formData: { email: string; password: string }) => Promise<void>;
  updateProfile: (formData: {
    profilePic: string | ArrayBuffer | null;
  }) => Promise<void>;
}

// Create the Zustand store with types
const useAuthStore = create<AuthState>((set) => ({
  isCheckingAuth: true,
  isUpdatingProfile: false,
  authUser: null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data,
        isCheckingAuth: false,
      });
    } catch (error: any) {
      console.log("error In check Auth Function", error);
      set({
        authUser: null,
      });
    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },
  isSigningUp: false,
  signUp: async (formData) => {
    set({
      isSigningUp: true,
    });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({
        authUser: res.data,
      });
      toast.success("Account Created Sucessfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({
        isSigningUp: false,
      });
    }
  },
  isLoggingIn: false,
  login: async (formData) => {
    set({
      isLoggingIn: true,
    });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({
        authUser: res.data,
      });
      toast.success("Login Sucessfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({
        isLoggingIn: false,
      });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (formData) => {
    set({
      isUpdatingProfile: true,
    });
    try {
      const res = await axiosInstance.put("/auth/update-profile", formData);
      set({
        authUser: res.data,
      });
      toast.success("Profile Updated Sucessfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({
        isUpdatingProfile: false,
      });
    }
  },
}));

export default useAuthStore;
