import { IntegrantStatusI } from "../../models/integrant";
import { UserI } from "../../routes/users/users.model";
import IntegrantService from "../../services/Integrant.service";

export async function isCommitteeMember(
  user: UserI
): Promise<IntegrantStatusI> {
  const committeeMember = await IntegrantService.checkUserInCommittee(user);
  return committeeMember;
}
