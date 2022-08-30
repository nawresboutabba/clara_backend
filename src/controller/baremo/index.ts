import { LightSolutionResponse } from "../solutions";
import { LightUserInterface } from "../users";

export interface BaremoResponse {
    baremo_id: string,
    user: LightUserInterface,
    solution: LightSolutionResponse,
    created: Date,
    updated: Date,
    status: string,
    type: string,
    comment: string
}