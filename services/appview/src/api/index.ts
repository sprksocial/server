import { Server } from '../lexicon/index.js'
import { AppContext } from "../index.js";
import getAccountInfos from "./com/atproto/admin/getAccountInfos.js";
import getSubjectStatus from "./com/atproto/admin/getSubjectStatus.js";
import updateSubjectStatus from "./com/atproto/admin/updateSubjectStatus.js";

export default function (server: Server, ctx: AppContext) {
    getAccountInfos(server, ctx);
    getSubjectStatus(server, ctx);
    updateSubjectStatus(server, ctx);
}
