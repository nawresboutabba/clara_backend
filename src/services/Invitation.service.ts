import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import { SolutionInvitationI, SolutionInvitation } from "../models/invitation";
import { FilterQuery, Types, UpdateQuery } from "mongoose";

const InvitationService = {
  async newInvitation(
    invitation: SolutionInvitationI
  ): Promise<SolutionInvitationI> {
    try {
      const invitationResp = await SolutionInvitation.create({ ...invitation });
      return invitationResp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.NEW_INVITATION,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getSolutionInvitations(queryTemp: FilterQuery<SolutionInvitationI>) {
    try {
      const invitations = await SolutionInvitation.find(queryTemp)
        .populate({
          path: "solution",
          populate: { path: "challenge" },
        })
        .populate("from")
        .populate("to");

      return invitations;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_INVITATION,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  // Deprecated
  async getInvitationById(invitationId: string) {
    try {
      const invitation = await SolutionInvitation.findOne({
        invitationId,
      })
        .populate({
          path: "solution",
          populate: { path: "challenge" },
        })
        .populate("from")
        .populate("to");
      return invitation;
    } catch (error) {
      return Promise.reject(
        new ServiceError(
          ERRORS.SERVICE.GET_INVITATION,
          HTTP_RESPONSE._500,
          error
        )
      );
    }
  },
  async updateInvitation(
    invitationId: Types.ObjectId,
    update: UpdateQuery<SolutionInvitationI>
  ) {
    try {
      const invitationResp = await SolutionInvitation.findByIdAndUpdate(
        invitationId,
        update,
        { new: true }
      )
        .populate({
          path: "solution",
          populate: { path: "challenge" },
        })
        .populate("from")
        .populate("to");
      return invitationResp;
    } catch (error) {
      return Promise.reject(
        new ServiceError(
          ERRORS.SERVICE.CONFIRM_INVITATION,
          HTTP_RESPONSE._500,
          error
        )
      );
    }
  },
};

export default InvitationService;
