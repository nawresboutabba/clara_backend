import { LightSolutionResponse } from "../solution";
import { LightUserInterface } from "../users";

export interface BaremoResponse {
    user: LightUserInterface,
    solution: LightSolutionResponse,
    created: Date,
    updated: Date,
    status: string,
    type: string,
    comment: string
}