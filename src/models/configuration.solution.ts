import { Schema } from "mongoose";
import ConfigurationBase , { ConfigurationBaseI , options} from "./configuration.base";

export interface SolutionConfigurationI extends ConfigurationBaseI{
    canLimitToSpecificGroup: boolean,
    canOpenToAllCompany: boolean
}

const solutionConfiguration = ConfigurationBase.discriminator('SolutionDefaultConfiguration', new Schema ({
    canLimitToSpecificGroup: Boolean,
    canOpenToAllCompany: Boolean 
}, options))

export default solutionConfiguration