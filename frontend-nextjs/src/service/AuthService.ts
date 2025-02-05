import axios, { AxiosResponse } from "axios";
import {IUser, IVerifyUser} from "@/types/authservice.interface";

const responseUrl = 'https://filmflood.ru/'
axios.defaults.baseURL = responseUrl

class AuthService {
    static async createUser(username: string, email: string, password: string) {
        try {
            const response = await axios.post<IUser>('api/auth/create-user', {username, email, password}, {
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
            const response = await axios.post<IUser>('api/auth/auth-user', {username: username, email: email, password: password}, {
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
            const response = await axios.post<IVerifyUser>(`api/auth/verify-email/${user_code}`, {
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
            const response = await axios.post<IVerifyUser>(`api/auth/verify-user/${code}`, {
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
            const response = await axios.post('api/auth/logout-user', {
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