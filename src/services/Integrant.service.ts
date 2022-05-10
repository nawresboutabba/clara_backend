import { COMMITTE_ROLE, ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import { GroupValidatorI } from "../models/group-validator";
import Integrant, { IntegrantI } from "../models/integrant";
import { IntegrantStatusI } from "../models/integrant";
import { UserI } from "../models/users";

const IntegrantService = {
  async getIntegrantsOfGroupValidator(groupValidator: GroupValidatorI): Promise<any> {
    try{
      const integrants = Integrant.find({
        groupValidator: groupValidator,
        active: true
      })
        .populate('user')
      return integrants
    }catch(error){
      const customError = new ServiceError(
        ERRORS.SERVICE.GET_INTEGRANTS_OF_TEAM_VALIDATOR,
        HTTP_RESPONSE._500,
        error
      )
      return Promise.reject(customError)
    }
  },
  /**
   * Get integrant by user entity. 
   * @param user 
   * @returns 
   */
  async getIntegrantByUser(user: UserI): Promise<IntegrantI>{
    try{
      const integrant = await Integrant.findOne({
        user: user._id,
        active: true
      })
        .populate('user')
        .populate('groupValidator')
      return integrant
    }catch(error){
      const customError = new ServiceError(
        ERRORS.SERVICE.GET_INTEGRANT_ACTIVE_BY_ID,
        HTTP_RESPONSE._500,
        error
      )
      return Promise.reject(customError)
    }
  },
  /**
   * Deprecated, replaced by "getIntegrantByUser"
   * @param integrantId 
   * @returns 
   */
  async getIntegrantActiveById(integrantId: string): Promise<IntegrantI> {
    return new Promise((resolve, reject) => {
      try {
        const integrant = Integrant.findOne({
          integrantId: integrantId,
          active: true
        })
          .populate('groupValidator')
          .populate('user')
        return resolve(integrant)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.GET_INTEGRANT_ACTIVE_BY_ID,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }
    })
  },
  async getAllIntegrantsListById(integrants: Array<string>): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
      try {
        const integrantsResp = await Integrant.find({
          $and: [{
            integrantId: {
              $in: integrants
            },
            active: true
          }]
        })
          .populate('groupValidator')
          .populate('user')
        return resolve(integrantsResp)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.GET_ALL_VALIDATORS_BY_ID,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }

    })
  },
  async newIntegrant(integrant: IntegrantI): Promise<IntegrantI> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await Integrant.create(
          integrant
        )
        return resolve(resp)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.NEW_VALIDATOR,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }
    })
  },
  async deleteIntegrant(integrantId: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await Integrant.findOneAndUpdate({
          integrantId: integrantId
        }, {
          active: false,
          finished: new Date()
        })
        return resolve(true)
      } catch (error) {
        return reject(error)
      }

    })
  },
  async checkUserInCommitte(user: UserI): Promise<IntegrantStatusI> {
    try {
      /**
        * @TODO
        * FindOne return value, but user null when userId isn't OK.
        * FindOne don't have to return a value when userId isn't OK
        */
      const integrant = await Integrant
        .findOne({ user: user._id })

      /**
        * Relationated with @TODO above. 
        * If integrant is null then integrant.user throw error
        */
      if (integrant?.user) {
        if (integrant.active == true) {
          const resp: IntegrantStatusI = {
            isActive: true,
            exist: true,
            role: integrant.role,
            integrantId: integrant.integrantId
          }
          return resp
        }
        if (integrant.active == false) {
          const resp: IntegrantStatusI = {
            isActive: false,
            exist: true,
            role: integrant.role,
            integrantId: integrant.integrantId
          }
          return resp
        }
      } else {
        const resp: IntegrantStatusI = {
          isActive: false,
          exist: false,
        }
        return resp
      }
    } catch (error) {
      /**
        * Generic Error 
        */
      const customError = new ServiceError(
        ERRORS.SERVICE.CHECK_USER_IN_COMMITTE,
        HTTP_RESPONSE._500,
        error
      )
      return Promise.reject(customError)
    }
  },
  async activateIntegrant(integrantId: string, role: string): Promise<IntegrantI> {
    return new Promise((resolve, reject) => {
      try {
        const integrant = Integrant.findOneAndUpdate({
          integrantId: integrantId
        }, {
          created: new Date(),
          finished: null,
          role: role,
          active: true
        })
          .populate('groupValidator')
        return resolve(integrant)
      } catch (error) {
        return reject(error)
      }
    })
  },
  async checkIntegrantStatus(integrantId: string): Promise<IntegrantStatusI> {
    try {
      const integrant = await Integrant.findOne({
        integrantId: integrantId
      })
      if (integrant) {
        const integrantStatus: IntegrantStatusI = {
          isActive: integrant.active,
          exist: true,
          role: integrant.role,
          integrantId: integrant.integrantId
        }
        return integrantStatus
      }
      const integrantStatus: IntegrantStatusI = {
        isActive: false,
        exist: false,
      }
      return integrantStatus
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async convertToLeader(integrantId: string, currentData?: Date): Promise<IntegrantI> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!currentData) {
          currentData = new Date()
        }

        const integrant = await Integrant.findOneAndUpdate({
          integrantId: integrantId,
          active: true,
          role: COMMITTE_ROLE.GENERAL
        }, {
          lastChangePosition: currentData,
          role: COMMITTE_ROLE.LEADER
        },{
          returnOriginal: false 
        })
          .populate('user')
        return resolve(integrant)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.CONVERT_TO_LEADER,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }
    })
  },
  async currentLeader(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const currentLeader = await Integrant.findOne({
          role: COMMITTE_ROLE.LEADER,
          active: true
        })
          .populate('user')

        return resolve(currentLeader)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.GET_CURRENT_LEADER,
          HTTP_RESPONSE._500
        )
        return reject(customError)
      }
    })
  },
  async abdicationLeader(currentData?: Date): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!currentData) {
          throw new Error("currentData is required")
        }
        const general = await Integrant.findOneAndUpdate({
          active: true,
          role: COMMITTE_ROLE.LEADER
        }, {
          role: COMMITTE_ROLE.GENERAL,
          lastChangePosition: currentData,
          update: currentData
        })

        return resolve(general)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.ABDICATION_LEADER,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }
    })
  },
  async getAllActiveMembers(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const members = await Integrant.find({
          active: true,
          finished: null
        })
          .populate('groupValidator')
          .populate('user')
        return resolve(members)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.GET_COMMITTE_MEMBERS,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }
    })
  },
  async getGeneralMembers(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      try {
        const generalMembers = Integrant.find({
          active: true,
          finished: null,
          role: COMMITTE_ROLE.GENERAL
        })
          .populate('user')
          .populate('groupValidator')
        return resolve(generalMembers)
      } catch (error) {
        const customError = new ServiceError(
          ERRORS.SERVICE.GET_COMMITTE_GENERAL,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }
    })
  },
  async insertIntegrantsToGroupValidator(integrants: Array<IntegrantI>, groupValidator: GroupValidatorI): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await Integrant.updateMany({
          _id: { $in: integrants }
        }, {
          groupValidator: groupValidator
        })
        return resolve(resp)
      } catch (error) {
        return reject(new ServiceError(
          ERRORS.SERVICE.INSERT_INTEGRANT_TO_GROUP_VALIDATOR,
          HTTP_RESPONSE._500,
          error
        )
        )
      }
    })
  }
}

export default IntegrantService;