export interface ConfigurationBody {
    situation_config: string,
    can_show_disagreement: boolean,
    disagreement_default: boolean,
    can_fix_desapproved_idea: boolean,
    can_choose_scope: boolean,
    can_choose_WSALevel: boolean,
    is_private_default: boolean,
    can_chose_WSALevel: boolean,
    WSALevel_available: string[],
    WSALevel_default: string,
    community_can_see_reactions: boolean,
    maximun_dont_understand: number,
    minimun_likes: number,
    reaction_filter: boolean,
    external_contribution_available_for_generators: boolean,
    external_contribution_available_for_committee: boolean,
    participation_mode_available:string [],
    time_in_park: number,
    time_expert_feedback: number,
    time_idea_fix: number
}

export interface ConfigurationResponse {
    can_choose_scope: boolean,
    is_private: boolean,
    filter_reaction_filter: boolean,
    filter_minimum_likes: number,
    filter_maximum_dont_understand: number,
    community_can_see_reactions: boolean,
    can_show_disagreement: boolean,
    can_fix_disapproved_idea: boolean,
    time_in_park: number,
    time_expert_feedback: number,
    time_idea_fix: number
}

export interface ChallengeConfigurationBody {
    situation_config:string,
    can_show_disagreement: boolean,
    disagreement_default: boolean,
    can_fix_desapproved_idea: boolean,
    can_choose_scope: boolean,
    is_private_default: boolean ,
    can_choose_WSALevel : boolean,
    WSALevel_available: string[], 
    WSALevel_default: string,
    community_can_see_reactions: boolean,
    maximun_dont_understand: number,
    minimun_likes: number,
    reaction_filter: boolean,
    external_contribution_available_for_generators: boolean,
    external_contribution_available_for_committee:boolean,
    participation_mode_available: string[],
    time_in_park: number,
    time_expert_feedback: number,
    time_idea_fix:number
}

export interface ChallengeConfigurationResponse extends ConfigurationResponse {
    WSALevel: string,
    participation_mode_available: string[],
    is_strategic: boolean
}