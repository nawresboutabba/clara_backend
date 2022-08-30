import { IntegrantStatusI } from "../../models/integrant";
import { UserI } from "../../models/users";
import IntegrantService from "../../services/Integrant.service";

export async function isCommitteMember(user: UserI): Promise<IntegrantStatusI> {
  const committeeMember = await IntegrantService.checkUserInCommittee(user);
  return committeeMember;
}
