import axios, { AxiosResponse } from "axios";
import {IUser, IVerifyUser} from "@/service/authservice.interface";

const responseUrl = 'http://localhost:4200/api'
axios.defaults.baseURL = responseUrl

axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
})

class AuthService {
    static async createUser(username: string, email: string, password: string) {
        try {
            const responce = await axios.post<IUser>('/auth/create-user', {username, email, password}, {
                withCredentials: true,
            });
            console.log(responce.data)
            return responce.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async authUser(username: string, email: string, password: string) {
        try {
            const responce = await axios.post<IUser>('/auth/auth-user', {username: username, email: email, password: password}, {
                withCredentials: true,
            })
            console.log(responce.data)
            return responce.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async verifyEmail(code: number) {
        try {
            const responce = await axios.post<IVerifyUser>(`/auth/verify-email/${code}`, {
                withCredentials: true,
            })
            console.log(responce.data)
            return responce.data.tokens;
        } catch (error) {
            console.error(error);
        }
    }

    static async verifyUser(code: number) {
        try {
            const responce = await axios.post<IVerifyUser>(`/auth/verify-user/${code}`, {
                withCredentials: true,
            })
            console.log(responce.data)
            return responce.data.tokens;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async logoutUser(): Promise<AxiosResponse<any>> {
        try {
            const responce = await axios.post('/auth/logout-user', {
                withCredentials: true,
            })
            console.log(responce.data)
            return responce.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default AuthService;