import axios from "axios";
import { IUserProfile, IUserComment } from "@/types/userservice.interface"

axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
})

export class UserService {
    static async getUserProfile() {
        return new Promise<IUserProfile>(res => {
            const userId = localStorage.getItem('userId');
            axios.get<IUserProfile>(`api/user/profile/${userId}`, {
                withCredentials: true,
            })
               .then(response => res(response.data))
               .catch(error => {
                    console.error('Error getting user profile:', error);
                    throw error;
                });
        });
    }

    static async createUserComment(comment: { filmName: string; rating: number; text: string }) {
        return new Promise<IUserComment>((resolve, reject) => {
            const userId = localStorage.getItem('userId');
            axios.post<IUserComment>(`api/user/comment/${userId}`, {
                filmName: comment.filmName,
                rating: comment.rating,
                text: comment.text,
            }, {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => {
                    console.error('Error creating user comment:', error);
                    reject(error);
                });
        });
    }
}