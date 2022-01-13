import { UserResponse } from "../users";

export interface SituationBody {
    author?: string,
    /**
     * Not used for challenge
     */
    coauthor?: Array<string>,
    team?: string,
    title: string,
    description: string,
    images: Array<string>,
    WSALevel: "COMPANY" | "AREA",
    group_validator?: string,
    file_complementary: string,
}

export interface SituationResponse {
    /**
     * User that inserted the solution
    */
    inserted_by: UserResponse,
    author?: UserResponse,
    created: Date,
    status: string,
    updated: Date,
    title: string,
    description: string,
    images: Array<string>,
    WSALevel:string,
    file_complementary: string,
    reactions: {
        likes: number,
        confused: number,
        comments: number
    }
}