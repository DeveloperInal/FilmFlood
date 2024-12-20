export interface IUser {
    username: string;
    email: string;
    password: string;
}

export interface IVerifyUser {
    code: number;
    tokens: ITokens;
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}