import { ConfigurationDefaultI } from "../../models/configuration.default";
import { ChallengeI } from "../../routes/challenges/challenge.model";
import { UserI } from "../../models/users";
import { isCommitteeMember } from "../acl/function.is_committe_member";

/**
 * This functions is used for checking users external participation according to conditions defined in the challenge or default configuration solution
 * @param author or teamCreator
 * @param coauthor or members
 * @param configuration
 * @returns
 */
export const isCompositionUsersValid = async (
  author: UserI,
  coauthor: UserI[],
  configuration: ChallengeI | ConfigurationDefaultI
): Promise<boolean> => {
  let areThereExternalsUser = false;

  /**
   * Check if externals user was invited to compose the team for challenge
   */
  coauthor.forEach((user) => {
    if (user.externalUser === true) {
      areThereExternalsUser = true;
    }
  });

  if (!areThereExternalsUser) {
    /**
     * If don't have externals user, composition is ok. Don't need more validations.
     */
    return Promise.resolve(true);
  } else {
    const committeeMember = await isCommitteeMember(author);
    /**
     * User can invite external users like committee member or generator
     */
    if (
      configuration.externalContributionAvailableForCommittee &&
      configuration.externalContributionAvailableForGenerators
    ) {
      return Promise.resolve(true);
      /**
       * User can not invite external users like committee member or generator
       */
    } else if (
      !configuration.externalContributionAvailableForCommittee &&
      !configuration.externalContributionAvailableForGenerators
    ) {
      return Promise.resolve(false);
      /**
       * User can invite external users like committee member
       */
    } else if (
      configuration.externalContributionAvailableForCommittee &&
      committeeMember.isActive
    ) {
      return Promise.resolve(true);
      /**
       * User can invite external users like generator
       */
    } else if (
      configuration.externalContributionAvailableForGenerators &&
      !committeeMember.isActive
    ) {
      return Promise.resolve(true);
    } else {
      /**
       * User can not invite external users. Don't matter the role(committee member or generator).
       */
      return Promise.resolve(false);
    }
  }
};
