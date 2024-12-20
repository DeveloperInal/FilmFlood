export interface UserDataInterface {
    loading: boolean;
    error: string | null;
    createUser: (username: string, email: string, password: string) => Promise<void>
    verifyEmail: (code: number) => Promise<void>
    authUser: (username: string, email: string, password: string) => Promise<void>
    verifyUser: (code: number) => Promise<void>
    logoutUser: () => Promise<void>
}