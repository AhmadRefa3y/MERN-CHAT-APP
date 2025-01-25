/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./authstore";

interface user {
  _id: string;
  fullName: string;
  profilePic?: string;
}
interface ThemeStore {
  messages: any[];
  users: user[];
  selectedUser: user | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
  isUserTyping: boolean;
  getUsers: () => void;
  getMessages: (userId: string) => void;
  sendMessage: (messageData: {}) => void;
  typing: () => void;
  setSelectedUser: (selectedUser: user | null) => void;
  subscribeToMessages: () => void;
  unSubscribeToMessages: () => void;
  subscribeToTyping: () => void;
  unSubscribeToTyping: () => void;
}

const useChatStore = create<ThemeStore>((set, get) => ({
  isMessagesLoading: false,
  isUsersLoading: false,
  isSendingMessage: false,
  isUserTyping: false,
  selectedUser: null,
  messages: [],
  users: [],
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({
        users: res.data,
      });
    } catch (error: any) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({
        messages: res.data,
      });
    } catch (error: any) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      set({
        messages: [...messages, res.data],
      });
      set({ isSendingMessage: false });
    } catch (error: any) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isSendingMessage: false });
    }
  },
  setSelectedUser: (selectedUser) => {
    set({
      selectedUser: selectedUser,
    });
  },
  typing: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.emit("typing", selectedUser?._id);
    console.log("front sent typing");
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage: any) => {
      const isMessageSenFromSelectedUser =
        newMessage.senderId === selectedUser?._id;
      if (!isMessageSenFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  subscribeToTyping: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    let typingTimeout: ReturnType<typeof setTimeout> | null = null; // Declare a timeout variable

    socket.on("userTyping", (userID: string) => {
      const isMessageSenFromSelectedUser = userID === selectedUser?._id;
      if (!isMessageSenFromSelectedUser) return;
      set({ isUserTyping: true });
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Set a timeout to reset the typing state after 2 seconds
      typingTimeout = setTimeout(() => {
        set({ isUserTyping: false });
      }, 2000);

      console.log("front received typing");
    });
  },
  unSubscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("userTyping");
  },
}));

export default useChatStore;
