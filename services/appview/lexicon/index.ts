/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type AuthVerifier,
  createServer as createXrpcServer,
  type Options as XrpcOptions,
  Server as XrpcServer,
  type StreamAuthVerifier,
} from "@sprk/xrpc-server";
import { type Env } from "hono";
import { schemas } from "./lexicons.js";
import * as ComAtprotoAdminDeleteAccount from "./types/com/atproto/admin/deleteAccount.js";
import * as ComAtprotoAdminDisableAccountInvites from "./types/com/atproto/admin/disableAccountInvites.js";
import * as ComAtprotoAdminDisableInviteCodes from "./types/com/atproto/admin/disableInviteCodes.js";
import * as ComAtprotoAdminEnableAccountInvites from "./types/com/atproto/admin/enableAccountInvites.js";
import * as ComAtprotoAdminGetAccountInfo from "./types/com/atproto/admin/getAccountInfo.js";
import * as ComAtprotoAdminGetAccountInfos from "./types/com/atproto/admin/getAccountInfos.js";
import * as ComAtprotoAdminGetInviteCodes from "./types/com/atproto/admin/getInviteCodes.js";
import * as ComAtprotoAdminGetSubjectStatus from "./types/com/atproto/admin/getSubjectStatus.js";
import * as ComAtprotoAdminSearchAccounts from "./types/com/atproto/admin/searchAccounts.js";
import * as ComAtprotoAdminSendEmail from "./types/com/atproto/admin/sendEmail.js";
import * as ComAtprotoAdminUpdateAccountEmail from "./types/com/atproto/admin/updateAccountEmail.js";
import * as ComAtprotoAdminUpdateAccountHandle from "./types/com/atproto/admin/updateAccountHandle.js";
import * as ComAtprotoAdminUpdateAccountPassword from "./types/com/atproto/admin/updateAccountPassword.js";
import * as ComAtprotoAdminUpdateSubjectStatus from "./types/com/atproto/admin/updateSubjectStatus.js";
import * as ComAtprotoIdentityGetRecommendedDidCredentials from "./types/com/atproto/identity/getRecommendedDidCredentials.js";
import * as ComAtprotoIdentityRequestPlcOperationSignature from "./types/com/atproto/identity/requestPlcOperationSignature.js";
import * as ComAtprotoIdentityResolveHandle from "./types/com/atproto/identity/resolveHandle.js";
import * as ComAtprotoIdentitySignPlcOperation from "./types/com/atproto/identity/signPlcOperation.js";
import * as ComAtprotoIdentitySubmitPlcOperation from "./types/com/atproto/identity/submitPlcOperation.js";
import * as ComAtprotoIdentityUpdateHandle from "./types/com/atproto/identity/updateHandle.js";
import * as ComAtprotoLabelQueryLabels from "./types/com/atproto/label/queryLabels.js";
import * as ComAtprotoLabelSubscribeLabels from "./types/com/atproto/label/subscribeLabels.js";
import * as ComAtprotoModerationCreateReport from "./types/com/atproto/moderation/createReport.js";
import * as ComAtprotoRepoApplyWrites from "./types/com/atproto/repo/applyWrites.js";
import * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.js";
import * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.js";
import * as ComAtprotoRepoDescribeRepo from "./types/com/atproto/repo/describeRepo.js";
import * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.js";
import * as ComAtprotoRepoImportRepo from "./types/com/atproto/repo/importRepo.js";
import * as ComAtprotoRepoListMissingBlobs from "./types/com/atproto/repo/listMissingBlobs.js";
import * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.js";
import * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.js";
import * as ComAtprotoRepoUploadBlob from "./types/com/atproto/repo/uploadBlob.js";
import * as ComAtprotoServerActivateAccount from "./types/com/atproto/server/activateAccount.js";
import * as ComAtprotoServerCheckAccountStatus from "./types/com/atproto/server/checkAccountStatus.js";
import * as ComAtprotoServerConfirmEmail from "./types/com/atproto/server/confirmEmail.js";
import * as ComAtprotoServerCreateAccount from "./types/com/atproto/server/createAccount.js";
import * as ComAtprotoServerCreateAppPassword from "./types/com/atproto/server/createAppPassword.js";
import * as ComAtprotoServerCreateInviteCode from "./types/com/atproto/server/createInviteCode.js";
import * as ComAtprotoServerCreateInviteCodes from "./types/com/atproto/server/createInviteCodes.js";
import * as ComAtprotoServerCreateSession from "./types/com/atproto/server/createSession.js";
import * as ComAtprotoServerDeactivateAccount from "./types/com/atproto/server/deactivateAccount.js";
import * as ComAtprotoServerDeleteAccount from "./types/com/atproto/server/deleteAccount.js";
import * as ComAtprotoServerDeleteSession from "./types/com/atproto/server/deleteSession.js";
import * as ComAtprotoServerDescribeServer from "./types/com/atproto/server/describeServer.js";
import * as ComAtprotoServerGetAccountInviteCodes from "./types/com/atproto/server/getAccountInviteCodes.js";
import * as ComAtprotoServerGetServiceAuth from "./types/com/atproto/server/getServiceAuth.js";
import * as ComAtprotoServerGetSession from "./types/com/atproto/server/getSession.js";
import * as ComAtprotoServerListAppPasswords from "./types/com/atproto/server/listAppPasswords.js";
import * as ComAtprotoServerRefreshSession from "./types/com/atproto/server/refreshSession.js";
import * as ComAtprotoServerRequestAccountDelete from "./types/com/atproto/server/requestAccountDelete.js";
import * as ComAtprotoServerRequestEmailConfirmation from "./types/com/atproto/server/requestEmailConfirmation.js";
import * as ComAtprotoServerRequestEmailUpdate from "./types/com/atproto/server/requestEmailUpdate.js";
import * as ComAtprotoServerRequestPasswordReset from "./types/com/atproto/server/requestPasswordReset.js";
import * as ComAtprotoServerReserveSigningKey from "./types/com/atproto/server/reserveSigningKey.js";
import * as ComAtprotoServerResetPassword from "./types/com/atproto/server/resetPassword.js";
import * as ComAtprotoServerRevokeAppPassword from "./types/com/atproto/server/revokeAppPassword.js";
import * as ComAtprotoServerUpdateEmail from "./types/com/atproto/server/updateEmail.js";
import * as ComAtprotoSyncGetBlob from "./types/com/atproto/sync/getBlob.js";
import * as ComAtprotoSyncGetBlocks from "./types/com/atproto/sync/getBlocks.js";
import * as ComAtprotoSyncGetCheckout from "./types/com/atproto/sync/getCheckout.js";
import * as ComAtprotoSyncGetHead from "./types/com/atproto/sync/getHead.js";
import * as ComAtprotoSyncGetLatestCommit from "./types/com/atproto/sync/getLatestCommit.js";
import * as ComAtprotoSyncGetRecord from "./types/com/atproto/sync/getRecord.js";
import * as ComAtprotoSyncGetRepo from "./types/com/atproto/sync/getRepo.js";
import * as ComAtprotoSyncGetRepoStatus from "./types/com/atproto/sync/getRepoStatus.js";
import * as ComAtprotoSyncListBlobs from "./types/com/atproto/sync/listBlobs.js";
import * as ComAtprotoSyncListRepos from "./types/com/atproto/sync/listRepos.js";
import * as ComAtprotoSyncListReposByCollection from "./types/com/atproto/sync/listReposByCollection.js";
import * as ComAtprotoSyncNotifyOfUpdate from "./types/com/atproto/sync/notifyOfUpdate.js";
import * as ComAtprotoSyncRequestCrawl from "./types/com/atproto/sync/requestCrawl.js";
import * as ComAtprotoSyncSubscribeRepos from "./types/com/atproto/sync/subscribeRepos.js";
import * as ComAtprotoTempAddReservedHandle from "./types/com/atproto/temp/addReservedHandle.js";
import * as ComAtprotoTempCheckSignupQueue from "./types/com/atproto/temp/checkSignupQueue.js";
import * as ComAtprotoTempFetchLabels from "./types/com/atproto/temp/fetchLabels.js";
import * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.js";
import * as SoSprkActorGetPreferences from "./types/so/sprk/actor/getPreferences.js";
import * as SoSprkActorGetProfile from "./types/so/sprk/actor/getProfile.js";
import * as SoSprkActorGetProfiles from "./types/so/sprk/actor/getProfiles.js";
import * as SoSprkActorGetSuggestions from "./types/so/sprk/actor/getSuggestions.js";
import * as SoSprkActorPutPreferences from "./types/so/sprk/actor/putPreferences.js";
import * as SoSprkActorSearchActors from "./types/so/sprk/actor/searchActors.js";
import * as SoSprkActorSearchActorsTypeahead from "./types/so/sprk/actor/searchActorsTypeahead.js";
import * as SoSprkFeedDescribeFeedGenerator from "./types/so/sprk/feed/describeFeedGenerator.js";
import * as SoSprkFeedGetActorFeeds from "./types/so/sprk/feed/getActorFeeds.js";
import * as SoSprkFeedGetActorLikes from "./types/so/sprk/feed/getActorLikes.js";
import * as SoSprkFeedGetActorLooks from "./types/so/sprk/feed/getActorLooks.js";
import * as SoSprkFeedGetAuthorFeed from "./types/so/sprk/feed/getAuthorFeed.js";
import * as SoSprkFeedGetFeed from "./types/so/sprk/feed/getFeed.js";
import * as SoSprkFeedGetFeedGenerator from "./types/so/sprk/feed/getFeedGenerator.js";
import * as SoSprkFeedGetFeedGenerators from "./types/so/sprk/feed/getFeedGenerators.js";
import * as SoSprkFeedGetFeedSkeleton from "./types/so/sprk/feed/getFeedSkeleton.js";
import * as SoSprkFeedGetLikes from "./types/so/sprk/feed/getLikes.js";
import * as SoSprkFeedGetListFeed from "./types/so/sprk/feed/getListFeed.js";
import * as SoSprkFeedGetLooks from "./types/so/sprk/feed/getLooks.js";
import * as SoSprkFeedGetPostThread from "./types/so/sprk/feed/getPostThread.js";
import * as SoSprkFeedGetPosts from "./types/so/sprk/feed/getPosts.js";
import * as SoSprkFeedGetQuotes from "./types/so/sprk/feed/getQuotes.js";
import * as SoSprkFeedGetRepostedBy from "./types/so/sprk/feed/getRepostedBy.js";
import * as SoSprkFeedGetStories from "./types/so/sprk/feed/getStories.js";
import * as SoSprkFeedGetStoriesTimeline from "./types/so/sprk/feed/getStoriesTimeline.js";
import * as SoSprkFeedGetSuggestedFeeds from "./types/so/sprk/feed/getSuggestedFeeds.js";
import * as SoSprkFeedGetTimeline from "./types/so/sprk/feed/getTimeline.js";
import * as SoSprkFeedSearchPosts from "./types/so/sprk/feed/searchPosts.js";
import * as SoSprkFeedSendInteractions from "./types/so/sprk/feed/sendInteractions.js";
import * as SoSprkGraphGetActorStarterPacks from "./types/so/sprk/graph/getActorStarterPacks.js";
import * as SoSprkGraphGetBlocks from "./types/so/sprk/graph/getBlocks.js";
import * as SoSprkGraphGetFollowers from "./types/so/sprk/graph/getFollowers.js";
import * as SoSprkGraphGetFollows from "./types/so/sprk/graph/getFollows.js";
import * as SoSprkGraphGetKnownFollowers from "./types/so/sprk/graph/getKnownFollowers.js";
import * as SoSprkGraphGetList from "./types/so/sprk/graph/getList.js";
import * as SoSprkGraphGetListBlocks from "./types/so/sprk/graph/getListBlocks.js";
import * as SoSprkGraphGetListMutes from "./types/so/sprk/graph/getListMutes.js";
import * as SoSprkGraphGetLists from "./types/so/sprk/graph/getLists.js";
import * as SoSprkGraphGetMutes from "./types/so/sprk/graph/getMutes.js";
import * as SoSprkGraphGetRelationships from "./types/so/sprk/graph/getRelationships.js";
import * as SoSprkGraphGetStarterPack from "./types/so/sprk/graph/getStarterPack.js";
import * as SoSprkGraphGetStarterPacks from "./types/so/sprk/graph/getStarterPacks.js";
import * as SoSprkGraphGetSuggestedFollowsByActor from "./types/so/sprk/graph/getSuggestedFollowsByActor.js";
import * as SoSprkGraphMuteActor from "./types/so/sprk/graph/muteActor.js";
import * as SoSprkGraphMuteActorList from "./types/so/sprk/graph/muteActorList.js";
import * as SoSprkGraphMuteThread from "./types/so/sprk/graph/muteThread.js";
import * as SoSprkGraphSearchStarterPacks from "./types/so/sprk/graph/searchStarterPacks.js";
import * as SoSprkGraphUnmuteActor from "./types/so/sprk/graph/unmuteActor.js";
import * as SoSprkGraphUnmuteActorList from "./types/so/sprk/graph/unmuteActorList.js";
import * as SoSprkGraphUnmuteThread from "./types/so/sprk/graph/unmuteThread.js";
import * as SoSprkLabelerGetServices from "./types/so/sprk/labeler/getServices.js";
import * as SoSprkNotificationGetUnreadCount from "./types/so/sprk/notification/getUnreadCount.js";
import * as SoSprkNotificationListNotifications from "./types/so/sprk/notification/listNotifications.js";
import * as SoSprkNotificationPutPreferences from "./types/so/sprk/notification/putPreferences.js";
import * as SoSprkNotificationRegisterPush from "./types/so/sprk/notification/registerPush.js";
import * as SoSprkNotificationUpdateSeen from "./types/so/sprk/notification/updateSeen.js";
import * as SoSprkUnspeccedGetConfig from "./types/so/sprk/unspecced/getConfig.js";
import * as SoSprkUnspeccedGetPopularFeedGenerators from "./types/so/sprk/unspecced/getPopularFeedGenerators.js";
import * as SoSprkUnspeccedGetSuggestionsSkeleton from "./types/so/sprk/unspecced/getSuggestionsSkeleton.js";
import * as SoSprkUnspeccedGetTaggedSuggestions from "./types/so/sprk/unspecced/getTaggedSuggestions.js";
import * as SoSprkUnspeccedGetTrendingTopics from "./types/so/sprk/unspecced/getTrendingTopics.js";
import * as SoSprkUnspeccedSearchActorsSkeleton from "./types/so/sprk/unspecced/searchActorsSkeleton.js";
import * as SoSprkUnspeccedSearchPostsSkeleton from "./types/so/sprk/unspecced/searchPostsSkeleton.js";
import * as SoSprkUnspeccedSearchStarterPacksSkeleton from "./types/so/sprk/unspecced/searchStarterPacksSkeleton.js";
import * as SoSprkVideoGetJobStatus from "./types/so/sprk/video/getJobStatus.js";
import * as SoSprkVideoGetUploadLimits from "./types/so/sprk/video/getUploadLimits.js";
import * as SoSprkVideoUploadVideo from "./types/so/sprk/video/uploadVideo.js";

export const COM_ATPROTO_MODERATION = {
  DefsReasonSpam: "com.atproto.moderation.defs#reasonSpam",
  DefsReasonViolation: "com.atproto.moderation.defs#reasonViolation",
  DefsReasonMisleading: "com.atproto.moderation.defs#reasonMisleading",
  DefsReasonSexual: "com.atproto.moderation.defs#reasonSexual",
  DefsReasonRude: "com.atproto.moderation.defs#reasonRude",
  DefsReasonOther: "com.atproto.moderation.defs#reasonOther",
  DefsReasonAppeal: "com.atproto.moderation.defs#reasonAppeal",
};
export const SO_SPRK_FEED = {
  DefsRequestLess: "so.sprk.feed.defs#requestLess",
  DefsRequestMore: "so.sprk.feed.defs#requestMore",
  DefsClickthroughItem: "so.sprk.feed.defs#clickthroughItem",
  DefsClickthroughAuthor: "so.sprk.feed.defs#clickthroughAuthor",
  DefsClickthroughReposter: "so.sprk.feed.defs#clickthroughReposter",
  DefsClickthroughEmbed: "so.sprk.feed.defs#clickthroughEmbed",
  DefsContentModeUnspecified: "so.sprk.feed.defs#contentModeUnspecified",
  DefsContentModeVideo: "so.sprk.feed.defs#contentModeVideo",
  DefsInteractionSeen: "so.sprk.feed.defs#interactionSeen",
  DefsInteractionLike: "so.sprk.feed.defs#interactionLike",
  DefsInteractionRepost: "so.sprk.feed.defs#interactionRepost",
  DefsInteractionReply: "so.sprk.feed.defs#interactionReply",
  DefsInteractionQuote: "so.sprk.feed.defs#interactionQuote",
  DefsInteractionShare: "so.sprk.feed.defs#interactionShare",
};
export const SO_SPRK_GRAPH = {
  DefsModlist: "so.sprk.graph.defs#modlist",
  DefsCuratelist: "so.sprk.graph.defs#curatelist",
  DefsReferencelist: "so.sprk.graph.defs#referencelist",
};

export function createServer<T extends Env = Env>(
  options?: XrpcOptions,
): Server<T> {
  return new Server<T>(options);
}

export class Server<T extends Env = Env> {
  xrpc: XrpcServer<T>;
  com: ComNS<T>;
  so: SoNS<T>;

  constructor(options?: XrpcOptions) {
    this.xrpc = createXrpcServer<T>(schemas, options);
    this.com = new ComNS(this);
    this.so = new SoNS(this);
  }
}

export class ComNS<T extends Env> {
  _server: Server<T>;
  atproto: ComAtprotoNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.atproto = new ComAtprotoNS(server);
  }
}

export class ComAtprotoNS<T extends Env> {
  _server: Server<T>;
  admin: ComAtprotoAdminNS<T>;
  identity: ComAtprotoIdentityNS<T>;
  label: ComAtprotoLabelNS<T>;
  lexicon: ComAtprotoLexiconNS<T>;
  moderation: ComAtprotoModerationNS<T>;
  repo: ComAtprotoRepoNS<T>;
  server: ComAtprotoServerNS<T>;
  sync: ComAtprotoSyncNS<T>;
  temp: ComAtprotoTempNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.admin = new ComAtprotoAdminNS(server);
    this.identity = new ComAtprotoIdentityNS(server);
    this.label = new ComAtprotoLabelNS(server);
    this.lexicon = new ComAtprotoLexiconNS(server);
    this.moderation = new ComAtprotoModerationNS(server);
    this.repo = new ComAtprotoRepoNS(server);
    this.server = new ComAtprotoServerNS(server);
    this.sync = new ComAtprotoSyncNS(server);
    this.temp = new ComAtprotoTempNS(server);
  }
}

export class ComAtprotoAdminNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  deleteAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminDeleteAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminDeleteAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.deleteAccount"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  disableAccountInvites<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminDisableAccountInvites.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminDisableAccountInvites.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.disableAccountInvites"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  disableInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminDisableInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminDisableInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.disableInviteCodes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  enableAccountInvites<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminEnableAccountInvites.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminEnableAccountInvites.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.enableAccountInvites"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInfo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetAccountInfo.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetAccountInfo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getAccountInfo"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInfos<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetAccountInfos.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetAccountInfos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getAccountInfos"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getInviteCodes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getSubjectStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetSubjectStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetSubjectStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getSubjectStatus"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchAccounts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminSearchAccounts.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminSearchAccounts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.searchAccounts"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  sendEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminSendEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminSendEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.sendEmail"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateAccountEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateAccountEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountEmail"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountHandle<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateAccountHandle.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateAccountHandle.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountHandle"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateAccountPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateAccountPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountPassword"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSubjectStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateSubjectStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateSubjectStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateSubjectStatus"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoIdentityNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getRecommendedDidCredentials<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentityGetRecommendedDidCredentials.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentityGetRecommendedDidCredentials.HandlerReqCtx<
        ExtractAuth<AV>
      >
    >,
  ) {
    const nsid = "com.atproto.identity.getRecommendedDidCredentials"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPlcOperationSignature<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentityRequestPlcOperationSignature.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentityRequestPlcOperationSignature.HandlerReqCtx<
        ExtractAuth<AV>
      >
    >,
  ) {
    const nsid = "com.atproto.identity.requestPlcOperationSignature"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  resolveHandle<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentityResolveHandle.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentityResolveHandle.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.resolveHandle"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  signPlcOperation<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentitySignPlcOperation.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentitySignPlcOperation.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.signPlcOperation"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  submitPlcOperation<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentitySubmitPlcOperation.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentitySubmitPlcOperation.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.submitPlcOperation"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  updateHandle<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentityUpdateHandle.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentityUpdateHandle.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.updateHandle"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoLabelNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  queryLabels<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoLabelQueryLabels.Handler<ExtractAuth<AV>>,
      ComAtprotoLabelQueryLabels.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.label.queryLabels"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  subscribeLabels<AV extends StreamAuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoLabelSubscribeLabels.Handler<ExtractAuth<AV>>,
      ComAtprotoLabelSubscribeLabels.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.label.subscribeLabels"; // @ts-ignore
    return this._server.xrpc.streamMethod(nsid, cfg);
  }
}

export class ComAtprotoLexiconNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }
}

export class ComAtprotoModerationNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  createReport<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoModerationCreateReport.Handler<ExtractAuth<AV>>,
      ComAtprotoModerationCreateReport.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.moderation.createReport"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoRepoNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  applyWrites<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoApplyWrites.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoApplyWrites.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.applyWrites"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  createRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoCreateRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoCreateRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.createRecord"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoDeleteRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoDeleteRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.deleteRecord"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  describeRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoDescribeRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoDescribeRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.describeRepo"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoGetRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoGetRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.getRecord"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  importRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoImportRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoImportRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.importRepo"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  listMissingBlobs<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoListMissingBlobs.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoListMissingBlobs.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.listMissingBlobs"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  listRecords<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoListRecords.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoListRecords.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.listRecords"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  putRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoPutRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoPutRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.putRecord"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadBlob<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoUploadBlob.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoUploadBlob.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.uploadBlob"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoServerNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  activateAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerActivateAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoServerActivateAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.activateAccount"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  checkAccountStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCheckAccountStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCheckAccountStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.checkAccountStatus"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  confirmEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerConfirmEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoServerConfirmEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.confirmEmail"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  createAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createAccount"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  createAppPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateAppPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateAppPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createAppPassword"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  createInviteCode<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateInviteCode.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateInviteCode.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createInviteCode"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  createInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createInviteCodes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  createSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createSession"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  deactivateAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDeactivateAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDeactivateAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.deactivateAccount"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDeleteAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDeleteAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.deleteAccount"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDeleteSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDeleteSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.deleteSession"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  describeServer<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDescribeServer.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDescribeServer.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.describeServer"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerGetAccountInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoServerGetAccountInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.getAccountInviteCodes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getServiceAuth<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerGetServiceAuth.Handler<ExtractAuth<AV>>,
      ComAtprotoServerGetServiceAuth.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.getServiceAuth"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerGetSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerGetSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.getSession"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  listAppPasswords<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerListAppPasswords.Handler<ExtractAuth<AV>>,
      ComAtprotoServerListAppPasswords.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.listAppPasswords"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  refreshSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRefreshSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRefreshSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.refreshSession"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  requestAccountDelete<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestAccountDelete.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestAccountDelete.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestAccountDelete"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  requestEmailConfirmation<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestEmailConfirmation.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestEmailConfirmation.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestEmailConfirmation"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  requestEmailUpdate<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestEmailUpdate.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestEmailUpdate.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestEmailUpdate"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPasswordReset<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestPasswordReset.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestPasswordReset.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestPasswordReset"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  reserveSigningKey<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerReserveSigningKey.Handler<ExtractAuth<AV>>,
      ComAtprotoServerReserveSigningKey.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.reserveSigningKey"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  resetPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerResetPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoServerResetPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.resetPassword"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  revokeAppPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRevokeAppPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRevokeAppPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.revokeAppPassword"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  updateEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerUpdateEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoServerUpdateEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.updateEmail"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoSyncNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getBlob<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetBlob.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetBlob.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getBlob"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetBlocks.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getBlocks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getCheckout<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetCheckout.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetCheckout.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getCheckout"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getHead<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetHead.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetHead.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getHead"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getLatestCommit<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetLatestCommit.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetLatestCommit.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getLatestCommit"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getRecord"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getRepo"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepoStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetRepoStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetRepoStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getRepoStatus"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  listBlobs<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncListBlobs.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncListBlobs.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.listBlobs"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  listRepos<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncListRepos.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncListRepos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.listRepos"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  listReposByCollection<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncListReposByCollection.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncListReposByCollection.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.listReposByCollection"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  notifyOfUpdate<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncNotifyOfUpdate.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncNotifyOfUpdate.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.notifyOfUpdate"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  requestCrawl<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncRequestCrawl.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncRequestCrawl.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.requestCrawl"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  subscribeRepos<AV extends StreamAuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncSubscribeRepos.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncSubscribeRepos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.subscribeRepos"; // @ts-ignore
    return this._server.xrpc.streamMethod(nsid, cfg);
  }
}

export class ComAtprotoTempNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  addReservedHandle<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoTempAddReservedHandle.Handler<ExtractAuth<AV>>,
      ComAtprotoTempAddReservedHandle.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.temp.addReservedHandle"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  checkSignupQueue<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoTempCheckSignupQueue.Handler<ExtractAuth<AV>>,
      ComAtprotoTempCheckSignupQueue.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.temp.checkSignupQueue"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  fetchLabels<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoTempFetchLabels.Handler<ExtractAuth<AV>>,
      ComAtprotoTempFetchLabels.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.temp.fetchLabels"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPhoneVerification<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoTempRequestPhoneVerification.Handler<ExtractAuth<AV>>,
      ComAtprotoTempRequestPhoneVerification.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.temp.requestPhoneVerification"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoNS<T extends Env> {
  _server: Server<T>;
  sprk: SoSprkNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.sprk = new SoSprkNS(server);
  }
}

export class SoSprkNS<T extends Env> {
  _server: Server<T>;
  actor: SoSprkActorNS<T>;
  embed: SoSprkEmbedNS<T>;
  feed: SoSprkFeedNS<T>;
  graph: SoSprkGraphNS<T>;
  labeler: SoSprkLabelerNS<T>;
  notification: SoSprkNotificationNS<T>;
  richtext: SoSprkRichtextNS<T>;
  unspecced: SoSprkUnspeccedNS<T>;
  video: SoSprkVideoNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.actor = new SoSprkActorNS(server);
    this.embed = new SoSprkEmbedNS(server);
    this.feed = new SoSprkFeedNS(server);
    this.graph = new SoSprkGraphNS(server);
    this.labeler = new SoSprkLabelerNS(server);
    this.notification = new SoSprkNotificationNS(server);
    this.richtext = new SoSprkRichtextNS(server);
    this.unspecced = new SoSprkUnspeccedNS(server);
    this.video = new SoSprkVideoNS(server);
  }
}

export class SoSprkActorNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetPreferences.Handler<ExtractAuth<AV>>,
      SoSprkActorGetPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getPreferences"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfile<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetProfile.Handler<ExtractAuth<AV>>,
      SoSprkActorGetProfile.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getProfile"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfiles<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetProfiles.Handler<ExtractAuth<AV>>,
      SoSprkActorGetProfiles.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getProfiles"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetSuggestions.Handler<ExtractAuth<AV>>,
      SoSprkActorGetSuggestions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getSuggestions"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorPutPreferences.Handler<ExtractAuth<AV>>,
      SoSprkActorPutPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.putPreferences"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActors<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorSearchActors.Handler<ExtractAuth<AV>>,
      SoSprkActorSearchActors.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.searchActors"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsTypeahead<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorSearchActorsTypeahead.Handler<ExtractAuth<AV>>,
      SoSprkActorSearchActorsTypeahead.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.searchActorsTypeahead"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkEmbedNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }
}

export class SoSprkFeedNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  describeFeedGenerator<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedDescribeFeedGenerator.Handler<ExtractAuth<AV>>,
      SoSprkFeedDescribeFeedGenerator.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.describeFeedGenerator"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorFeeds<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetActorFeeds.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetActorFeeds.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getActorFeeds"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLikes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetActorLikes.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetActorLikes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getActorLikes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLooks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetActorLooks.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetActorLooks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getActorLooks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getAuthorFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetAuthorFeed.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetAuthorFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getAuthorFeed"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeed.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeed"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerator<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeedGenerator.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeedGenerator.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedGenerator"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerators<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeedGenerators.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeedGenerators.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedGenerators"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeedSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeedSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedSkeleton"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getLikes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetLikes.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetLikes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getLikes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getListFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetListFeed.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetListFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getListFeed"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getLooks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetLooks.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetLooks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getLooks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetPostThread.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetPostThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getPostThread"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getPosts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetPosts.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetPosts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getPosts"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getQuotes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetQuotes.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetQuotes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getQuotes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepostedBy<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetRepostedBy.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetRepostedBy.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getRepostedBy"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getStories<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetStories.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetStories.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getStories"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getStoriesTimeline<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetStoriesTimeline.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetStoriesTimeline.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getStoriesTimeline"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFeeds<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetSuggestedFeeds.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetSuggestedFeeds.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getSuggestedFeeds"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getTimeline<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetTimeline.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetTimeline.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getTimeline"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPosts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedSearchPosts.Handler<ExtractAuth<AV>>,
      SoSprkFeedSearchPosts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.searchPosts"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  sendInteractions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedSendInteractions.Handler<ExtractAuth<AV>>,
      SoSprkFeedSendInteractions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.sendInteractions"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkGraphNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getActorStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetActorStarterPacks.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetActorStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getActorStarterPacks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetBlocks.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getBlocks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollowers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetFollowers.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetFollowers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getFollowers"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollows<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetFollows.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetFollows.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getFollows"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getKnownFollowers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetKnownFollowers.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetKnownFollowers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getKnownFollowers"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetList.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getList"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getListBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetListBlocks.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetListBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getListBlocks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getListMutes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetListMutes.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetListMutes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getListMutes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getLists<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetLists.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetLists.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getLists"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getMutes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetMutes.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetMutes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getMutes"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getRelationships<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetRelationships.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetRelationships.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getRelationships"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPack<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetStarterPack.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetStarterPack.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getStarterPack"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetStarterPacks.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getStarterPacks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFollowsByActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetSuggestedFollowsByActor.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetSuggestedFollowsByActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getSuggestedFollowsByActor"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphMuteActor.Handler<ExtractAuth<AV>>,
      SoSprkGraphMuteActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.muteActor"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActorList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphMuteActorList.Handler<ExtractAuth<AV>>,
      SoSprkGraphMuteActorList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.muteActorList"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  muteThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphMuteThread.Handler<ExtractAuth<AV>>,
      SoSprkGraphMuteThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.muteThread"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphSearchStarterPacks.Handler<ExtractAuth<AV>>,
      SoSprkGraphSearchStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.searchStarterPacks"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphUnmuteActor.Handler<ExtractAuth<AV>>,
      SoSprkGraphUnmuteActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteActor"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActorList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphUnmuteActorList.Handler<ExtractAuth<AV>>,
      SoSprkGraphUnmuteActorList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteActorList"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphUnmuteThread.Handler<ExtractAuth<AV>>,
      SoSprkGraphUnmuteThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteThread"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkLabelerNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getServices<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkLabelerGetServices.Handler<ExtractAuth<AV>>,
      SoSprkLabelerGetServices.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.labeler.getServices"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkNotificationNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getUnreadCount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationGetUnreadCount.Handler<ExtractAuth<AV>>,
      SoSprkNotificationGetUnreadCount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.getUnreadCount"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  listNotifications<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationListNotifications.Handler<ExtractAuth<AV>>,
      SoSprkNotificationListNotifications.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.listNotifications"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationPutPreferences.Handler<ExtractAuth<AV>>,
      SoSprkNotificationPutPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.putPreferences"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  registerPush<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationRegisterPush.Handler<ExtractAuth<AV>>,
      SoSprkNotificationRegisterPush.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.registerPush"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSeen<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationUpdateSeen.Handler<ExtractAuth<AV>>,
      SoSprkNotificationUpdateSeen.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.updateSeen"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkRichtextNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }
}

export class SoSprkUnspeccedNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getConfig<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetConfig.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetConfig.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getConfig"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getPopularFeedGenerators<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetPopularFeedGenerators.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetPopularFeedGenerators.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getPopularFeedGenerators"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestionsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetSuggestionsSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetSuggestionsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getSuggestionsSkeleton"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getTaggedSuggestions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetTaggedSuggestions.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetTaggedSuggestions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getTaggedSuggestions"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrendingTopics<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetTrendingTopics.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetTrendingTopics.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getTrendingTopics"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedSearchActorsSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedSearchActorsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchActorsSkeleton"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPostsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedSearchPostsSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedSearchPostsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchPostsSkeleton"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacksSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedSearchStarterPacksSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedSearchStarterPacksSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchStarterPacksSkeleton"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkVideoNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getJobStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkVideoGetJobStatus.Handler<ExtractAuth<AV>>,
      SoSprkVideoGetJobStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.video.getJobStatus"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  getUploadLimits<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkVideoGetUploadLimits.Handler<ExtractAuth<AV>>,
      SoSprkVideoGetUploadLimits.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.video.getUploadLimits"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadVideo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkVideoUploadVideo.Handler<ExtractAuth<AV>>,
      SoSprkVideoUploadVideo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.video.uploadVideo"; // @ts-ignore
    return this._server.xrpc.method(nsid, cfg);
  }
}

type SharedRateLimitOpts<T> = {
  name: string;
  calcKey?: (ctx: T) => string | null;
  calcPoints?: (ctx: T) => number;
};
type RouteRateLimitOpts<T> = {
  durationMs: number;
  points: number;
  calcKey?: (ctx: T) => string | null;
  calcPoints?: (ctx: T) => number;
};
type HandlerOpts = { blobLimit?: number };
type HandlerRateLimitOpts<T> = SharedRateLimitOpts<T> | RouteRateLimitOpts<T>;
type ConfigOf<Auth, Handler, ReqCtx> =
  | Handler
  | {
    auth?: Auth;
    opts?: HandlerOpts;
    rateLimit?: HandlerRateLimitOpts<ReqCtx> | HandlerRateLimitOpts<ReqCtx>[];
    handler: Handler;
  };
type ExtractAuth<AV extends AuthVerifier | StreamAuthVerifier> = Extract<
  Awaited<ReturnType<AV>>,
  { credentials: unknown }
>;
