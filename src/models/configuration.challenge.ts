import { Schema } from "mongoose";
import ConfigurationBase , { ConfigurationBaseI , options} from "./configuration.base";

export interface ChallengeConfigurationI extends ConfigurationBaseI {
    WSALevel: string,
    participationModeAvailable: String[],
    isStrategic: boolean
}

const challengeConfiguration = ConfigurationBase.discriminator('ChallengeDefaultConfiguration', new Schema ({
    WSALevel: String,
    participationModeAvailable: [String],
    isStrategic: Boolean
}, options))

export default challengeConfiguration