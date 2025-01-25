/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// const BASE_URL = "http://localhost:3001/api";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3001/" : "/";

interface AuthState {
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: string[];
  authUser: any | null;
  socket: any;
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
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  authUser: null,
  socket: null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data,
        isCheckingAuth: false,
      });
      get().connectSocket();
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
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
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
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

export default useAuthStore;
