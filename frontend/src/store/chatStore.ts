import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface user {
    _id: string;
    name: string;
    fullName: string;
    profilePic?: string;
}
interface ThemeStore {
    messages: any[];
    users: user[];
    selectedUser: user | null;
    isUsersLoading: boolean;
    IsMessagesLoading: boolean;
    getUsers: () => void;
    getMessages: (userId: string) => void;
    sendMessage: (messageData: {}) => void;
    setSelectedUser: (selectedUser: user | null) => void;
}

const useChatStore = create<ThemeStore>((set, get) => ({
    IsMessagesLoading: false,
    isUsersLoading: false,
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
        set({ IsMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log({ messages: res.data });

            set({
                messages: res.data,
            });
        } catch (error: any) {
            toast.error(error.response.data.messages);
        } finally {
            set({ IsMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser?._id}`,
                messageData
            );
            console.log({ res: res.data });
            set({
                messages: [...messages, res.data],
            });
        } catch (error: any) {
            toast.error(error.response.data.messages);
        }
    },
    setSelectedUser: (selectedUser) => {
        set({
            selectedUser: selectedUser,
        });
    },
}));

export default useChatStore;
