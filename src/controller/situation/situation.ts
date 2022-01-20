import { AreaResponse } from "../area/area";
import { TeamResponse } from "../team";
import { UserResponse } from "../users";

export interface SituationBody {
    author?: string,
    title: string,
    description: string,
    images: Array<string>,
    WSALevel: "COMPANY" | "AREA",
    group_validator?: string,
    file_complementary: string,
    areas_available: Array<string>
}


export interface SituationResponse {
    /**
     * User that inserted the solution
    */
    inserted_by: UserResponse,
    author?: UserResponse,
    coauthor?: UserResponse[],
    team?: TeamResponse,
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
    areas_available: Array<AreaResponse>
}