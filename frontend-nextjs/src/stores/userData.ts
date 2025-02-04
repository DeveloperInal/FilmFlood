import { create } from 'zustand';
import AuthService from "@/service/AuthService";
import {UserDataInterface} from "@/stores/userData.interface";

export const useUserStore = create<UserDataInterface>((set) => ({
  error: null,
  loading: false,

  createUser: async (username: string, email: string, password: string) => {
    set({loading: true, error: null});
    try {
      await AuthService.createUser(username, email, password)
      set({loading: false});
    } catch (error: any) {
      set({error: error.response?.data?.message || error.message, loading: false});
    }
  },

  verifyEmail: async (code: number) => {
    set({loading: true, error: null});
    try {
      const response = await AuthService.verifyEmail(code)
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('userId', response.userId);
      set({loading: false});
    } catch (error: any) {
      console.error('Error during verification:', error);
      set({error: error.response?.data?.message || error.message, loading: false});
    }
  },

  authUser: async (username: string, email: string, password: string) => {
    set({loading: true, error: null});

    try {
      await AuthService.authUser(username, email, password)
      set({loading: false});
    } catch (error: any) {
      set({error: error.response?.data?.message || error.message, loading: false});
    }
  },

  verifyUser: async (code: number) => {
    set({loading: true, error: null});
    try {
      const response = await AuthService.verifyUser(code)
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('userId', response.userId);
      set({loading: false});
    } catch (error: any) {
      console.error('Error during verification:', error);
      set({error: error.response?.data?.message || error.message, loading: false});
    }
  },

  logoutUser: async () => {
    set({loading: true, error: null});
    try {
      await AuthService.logoutUser()
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      set({loading: false});
    } catch (error: any) {
      console.error('Error during logout:', error);
      set({error: error.response?.data?.message || error.message, loading: false});
    }
  },
}));
