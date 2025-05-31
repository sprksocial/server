import { Server } from "../lexicon/index.ts";
import { AppContext } from "../main.ts";
import getAccountInfos from "./com/atproto/admin/getAccountInfos.ts";
import getSubjectStatus from "./com/atproto/admin/getSubjectStatus.ts";
import updateSubjectStatus from "./com/atproto/admin/updateSubjectStatus.ts";

export default function (server: Server, ctx: AppContext) {
  getAccountInfos(server, ctx);
  getSubjectStatus(server, ctx);
  updateSubjectStatus(server, ctx);
}
