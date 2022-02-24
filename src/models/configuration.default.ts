import { Schema, model } from "mongoose";

export interface ConfigurationBaseI {
    /**
     * Can those responsible express their disagreement? 
     * Affects an attribute in the Scale that indicates 
     * if the person responsible for the solution agrees 
     * or disagrees with the rating.
     */
    canShowDisagreement: boolean,
    /**
     * ¿Pueden los responsables hacer correcciones 
     * después de desaprobar una idea? 
     * Afecta a la posibilidad de hacer un update sobre la 
     * solucion para el estado de solucion = REJECTED
     */
    canFixDisapprovedIdea: boolean,
    /**
     * Can the generator choose the privacy of the solution? 
     * Affects the scope_chosed attribute. If can_chosose_scope = true, 
     * then the maintainer can edit is_privated 
     * (otherwise, the default value goes)
     */
    canChooseScope: boolean,
     /**
      * Determines if the user can choose the WSALevel_chosed.
      */
    canChooseWSALevel: boolean,
     /**
      * Space that the user can have to propose a resource. 
      * Affects the WSALevel_chosed (the user selects among those allowed).
      * Affects the publication of the challenge, solutions 
      * and problem statement
      */
    WSALevelAvailable: string[],
    /**
     * The number of reactions a solution has can be seen. 
     * Affects the solution: the reactions achieved can be seen
     */
    communityCanSeeReactions: boolean,
    /**
     * What is the maximum number of negative 
     * reactions of this type that can be had?
     */
    maximumDontUnderstand: number,
    /**
     * What is the minimum number of likes you must have to continue?
     */
    minimumLikes: number,
    /**
     * Used in the square, it indicates 
     * if a limit is established on the reactions. 
     * Enable choices made: minimum_likes, 
     * maximum_dont_understand
     */
    reactionFilter: boolean,
    /**
     * Are invitations to external contributors allowed by generators? 
     * affects whether authors, co-authors, 
     * and teams can be made up of externals. 
     * If the scope is at the COMPANY level, and this option is equal to true, 
     * then the author or creator of the team can invite people 
     * from outside the organization.
     */
    externalContributionAvailableForGenerators: boolean,
    /**
     * ¿Están permitidas invitaciones a contribuidores externos 
     * por parte del comite? afecta si autores, 
     * coautores y equipos pueden estar conformados por externos. 
     * Si el alcance en a nivel de COMPANY, y esta opcion es igual a true, 
     * entonces el autor o creador del equipo, puede invitar 
     * personas de afuera de la organización.
     */
    externalContributionAvailableForCommittee: boolean,
    /**
     * How can you participate in the proposal of a solution?
     */
    participationModeAvailable: string[],
    /**
     * Time In Park
     */
    timeInPark: number,
    /**
     * Time Expert Feedback
     */
    timeExpertFeedback: number,
    /**
     * Time Idea Fix
     */
    timeIdeaFix: number     
}

export interface ConfigurationSettingI extends ConfigurationBaseI {
  isPrivated: boolean,
  participationModeChosed: string,
  WSALevelChosed: string,
}

export interface ConfigurationDefaultI extends ConfigurationBaseI {
    updated: Date,
    /**
     * Could be CHALLENGE, SOLUTION or PROBLEM
     */
    situationConfig: string,
    /**
     * Default value. In case the user cannot choose, 
     * this attribute is taken as the chosen value
     */
    disagreementDefault: boolean,
    /**
     * Default value. In case the user cannot choose, 
     * this attribute is taken as the chosen value
     */
    isPrivateDefault: boolean,
    /**
     * Default value. 
     * In case the user cannot choose, 
     * this attribute is taken as the chosen value
     */
    WSALevelDefault: string,
}

/**
 * Configuration Default Model
 */
const configurationBase = new Schema ({
	updated: Date,
	situationConfig: {
		unique: true,
		type: String
	},
	canShowDisagreement: Boolean,
	disagreementDefault: Boolean,
	canFixDisapprovedIdea: Boolean,
	canChooseScope: Boolean,
	isPrivateDefault: Boolean,
	canChooseWSALevel: Boolean,
	WSALevelAvailable: [String],
	WSALevelDefault: String,
	communityCanSeeReactions: Boolean,
	maximumDontUnderstand: Number,
	minimumLikes: Number,
	reactionFilter: Boolean,
	externalContributionAvailableForGenerators: Boolean,
	externalContributionAvailableForCommittee: Boolean,
	participationModeAvailable: [String],
	timeInPark: Number,
	timeExpertFeedback: Number,
	timeIdeaFix: Number   
});

export default model('Configuration', configurationBase);