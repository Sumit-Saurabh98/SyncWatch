import syncapi from "@/utils/axios";
import { IMessage } from "@/utils/interfaces";
import { create } from "zustand";

export interface IMessageStore {
  isSendingMessages: boolean;
  isGettingMessages:boolean;
  messages: IMessage[];
  sendMessages: (message: string, roomId: string) => Promise<boolean>;
  getMessages: (roomId: string) => Promise<boolean>;
}

export const useMessageStore = create<IMessageStore>((set, get) => ({
  messages: [],
  isSendingMessages: false,
  isGettingMessages: false,

  sendMessages: async (message, roomId) => {
    set({ isSendingMessages: false });
    try {
      const response = await syncapi.post(`/message/send/${roomId}`, { message });

      if (!response.data.success) {
        set({ isSendingMessages: false });
        return false;
      }

      set({ isSendingMessages: false });
      return true;
    } catch (error) {
      console.error(error);
      set({ isSendingMessages: false });
      return false;
    } finally {
      set({ isSendingMessages: false });
    }
  },

  getMessages: async (roomId: string) => {
    set({ isGettingMessages: true });
    try {
      const response = await syncapi.get(`/message/${roomId}`);
      if (!response.data.success) {
        set({ isGettingMessages: false });
        return false;
      }
      set({ messages: response.data.messages, isGettingMessages: false });
      return true;
    } catch (error) {
      console.error(error);
      set({ isGettingMessages: false });
      return false;
    } finally {
      set({ isGettingMessages: false });
    }
  }
}));
