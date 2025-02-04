interface Comment {
    filmName: string
    yearProd: number
    text: string
    filmPoster: string
}

export interface IUserProfile {
    username: string
    email: string
    createProfile: string
    updatedProfile: string
    imageProfile: string
    comments: Comment[]
}

export interface IUserComment {
    filmName: string;
    userId: string;
    rating: number;
    text: string;
}