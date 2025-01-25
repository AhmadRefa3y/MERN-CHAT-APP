/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

type Contact = {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
};

type ContactStore = {
  contacts: Contact[];
  isLoadingContacts: boolean;
  searchResults: Contact | null;
  isSearching: boolean;
  isAddingContact: boolean;
  searchUserByEmail: (email: string) => Promise<void>;
  addContact: (contactId: string) => Promise<void>;
  getContacts: () => Promise<void>;
};

const useContactStore = create<ContactStore>((set) => ({
  contacts: [],
  isLoadingContacts: false,
  searchResults: null,
  isSearching: false,
  isAddingContact: false,

  searchUserByEmail: async (email) => {
    try {
      set({ isSearching: true });
      const response = await axiosInstance.get(
        `/contacts/search?email=${email}`
      );
      set({ searchResults: response.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error searching user");
    } finally {
      set({ isSearching: false });
    }
  },

  addContact: async (contactId) => {
    try {
      set({ isAddingContact: true });
      await axiosInstance.post("/contacts/add", { contactId });
      toast.success("Contact added successfully");
      set({ searchResults: null });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error adding contact");
    } finally {
      set({ isAddingContact: false });
    }
  },

  getContacts: async () => {
    try {
      set({ isLoadingContacts: true });
      const response = await axiosInstance.get("/contacts");
      set({ contacts: response.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error fetching contacts");
    } finally {
      set({ isLoadingContacts: false });
    }
  },
}));

export default useContactStore;
