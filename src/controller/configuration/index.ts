export interface ConfigurationBody {
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

export interface ChallengeConfigurationBody extends ConfigurationBody{
    WSALevel: string
    participation_mode_available: [string],
    is_strategic: boolean
}

export interface ChallengeConfigurationResponse extends ConfigurationResponse {
    WSALevel: string,
    participation_mode_available: string [],
    is_strategic: boolean
}