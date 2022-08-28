import ServiceError from "../handle-error/error.service";
import GroupValidator, { GroupValidatorI } from "../models/group-validator";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { IntegrantI } from "../models/integrant";

const GroupValidatorService = {
  async getGroupValidatorById(GVId: string): Promise<GroupValidatorI> {
    try {
      /**
       * If group validator ID is null, then error
       */

      const groupValidator = await GroupValidator.findOne({
        groupValidatorId: GVId,
      });
      if (groupValidator) {
        return groupValidator.toObject();
      }
      return undefined;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_GROUP_VALIDATOR,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async newGroupValidator(groupValidator: GroupValidatorI): Promise<any> {
    try {
      const groupValidatorResp = GroupValidator.create({
        ...groupValidator,
      });
      return groupValidatorResp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.NEW_GROUP_VALIDATOR,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getAllGroupValidators(): Promise<any> {
    try {
      const groupValidatorsResp = await GroupValidator.find({});
      return groupValidatorsResp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_ALL_GROUP_VALIDATORS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};

export default GroupValidatorService;
