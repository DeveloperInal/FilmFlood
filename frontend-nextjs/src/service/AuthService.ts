import axios, { AxiosResponse } from "axios";
import {IUser, IVerifyUser} from "@/types/authservice.interface";

const responseUrl = 'http://localhost:4200/api'
axios.defaults.baseURL = responseUrl

class AuthService {
    static async createUser(username: string, email: string, password: string) {
        try {
            const response = await axios.post<IUser>('/auth/create-user', {username, email, password}, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }

    static async authUser(username: string, email: string, password: string) {
        try {
            const response = await axios.post<IUser>('/auth/auth-user', {username: username, email: email, password: password}, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async verifyEmail(user_code: number) {
        try {
            const response = await axios.post<IVerifyUser>(`/auth/verify-email/${user_code}`, {
                withCredentials: true,
            })
            const tokens = response.data.tokens
            const userId = response.data.userId;
            return { userId, tokens };
        } catch (error) {
            console.error(error);
        }
    }

    static async verifyUser(code: number) {
        try {
            const response = await axios.post<IVerifyUser>(`/auth/verify-user/${code}`, {
                withCredentials: true,
            })
            const tokens = response.data.tokens
            const userId = response.data.userId;
            return { userId, tokens };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async logoutUser(): Promise<AxiosResponse<any>> {
        try {
            const response = await axios.post('/auth/logout-user', {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default AuthService;