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
import { schemas } from "./lexicons.ts";
import * as ComAtprotoAdminDeleteAccount from "./types/com/atproto/admin/deleteAccount.ts";
import * as ComAtprotoAdminDisableAccountInvites from "./types/com/atproto/admin/disableAccountInvites.ts";
import * as ComAtprotoAdminDisableInviteCodes from "./types/com/atproto/admin/disableInviteCodes.ts";
import * as ComAtprotoAdminEnableAccountInvites from "./types/com/atproto/admin/enableAccountInvites.ts";
import * as ComAtprotoAdminGetAccountInfo from "./types/com/atproto/admin/getAccountInfo.ts";
import * as ComAtprotoAdminGetAccountInfos from "./types/com/atproto/admin/getAccountInfos.ts";
import * as ComAtprotoAdminGetInviteCodes from "./types/com/atproto/admin/getInviteCodes.ts";
import * as ComAtprotoAdminGetSubjectStatus from "./types/com/atproto/admin/getSubjectStatus.ts";
import * as ComAtprotoAdminSearchAccounts from "./types/com/atproto/admin/searchAccounts.ts";
import * as ComAtprotoAdminSendEmail from "./types/com/atproto/admin/sendEmail.ts";
import * as ComAtprotoAdminUpdateAccountEmail from "./types/com/atproto/admin/updateAccountEmail.ts";
import * as ComAtprotoAdminUpdateAccountHandle from "./types/com/atproto/admin/updateAccountHandle.ts";
import * as ComAtprotoAdminUpdateAccountPassword from "./types/com/atproto/admin/updateAccountPassword.ts";
import * as ComAtprotoAdminUpdateSubjectStatus from "./types/com/atproto/admin/updateSubjectStatus.ts";
import * as ComAtprotoIdentityGetRecommendedDidCredentials from "./types/com/atproto/identity/getRecommendedDidCredentials.ts";
import * as ComAtprotoIdentityRequestPlcOperationSignature from "./types/com/atproto/identity/requestPlcOperationSignature.ts";
import * as ComAtprotoIdentityResolveHandle from "./types/com/atproto/identity/resolveHandle.ts";
import * as ComAtprotoIdentitySignPlcOperation from "./types/com/atproto/identity/signPlcOperation.ts";
import * as ComAtprotoIdentitySubmitPlcOperation from "./types/com/atproto/identity/submitPlcOperation.ts";
import * as ComAtprotoIdentityUpdateHandle from "./types/com/atproto/identity/updateHandle.ts";
import * as ComAtprotoLabelQueryLabels from "./types/com/atproto/label/queryLabels.ts";
import * as ComAtprotoLabelSubscribeLabels from "./types/com/atproto/label/subscribeLabels.ts";
import * as ComAtprotoModerationCreateReport from "./types/com/atproto/moderation/createReport.ts";
import * as ComAtprotoRepoApplyWrites from "./types/com/atproto/repo/applyWrites.ts";
import * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.ts";
import * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.ts";
import * as ComAtprotoRepoDescribeRepo from "./types/com/atproto/repo/describeRepo.ts";
import * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.ts";
import * as ComAtprotoRepoImportRepo from "./types/com/atproto/repo/importRepo.ts";
import * as ComAtprotoRepoListMissingBlobs from "./types/com/atproto/repo/listMissingBlobs.ts";
import * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.ts";
import * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.ts";
import * as ComAtprotoRepoUploadBlob from "./types/com/atproto/repo/uploadBlob.ts";
import * as ComAtprotoServerActivateAccount from "./types/com/atproto/server/activateAccount.ts";
import * as ComAtprotoServerCheckAccountStatus from "./types/com/atproto/server/checkAccountStatus.ts";
import * as ComAtprotoServerConfirmEmail from "./types/com/atproto/server/confirmEmail.ts";
import * as ComAtprotoServerCreateAccount from "./types/com/atproto/server/createAccount.ts";
import * as ComAtprotoServerCreateAppPassword from "./types/com/atproto/server/createAppPassword.ts";
import * as ComAtprotoServerCreateInviteCode from "./types/com/atproto/server/createInviteCode.ts";
import * as ComAtprotoServerCreateInviteCodes from "./types/com/atproto/server/createInviteCodes.ts";
import * as ComAtprotoServerCreateSession from "./types/com/atproto/server/createSession.ts";
import * as ComAtprotoServerDeactivateAccount from "./types/com/atproto/server/deactivateAccount.ts";
import * as ComAtprotoServerDeleteAccount from "./types/com/atproto/server/deleteAccount.ts";
import * as ComAtprotoServerDeleteSession from "./types/com/atproto/server/deleteSession.ts";
import * as ComAtprotoServerDescribeServer from "./types/com/atproto/server/describeServer.ts";
import * as ComAtprotoServerGetAccountInviteCodes from "./types/com/atproto/server/getAccountInviteCodes.ts";
import * as ComAtprotoServerGetServiceAuth from "./types/com/atproto/server/getServiceAuth.ts";
import * as ComAtprotoServerGetSession from "./types/com/atproto/server/getSession.ts";
import * as ComAtprotoServerListAppPasswords from "./types/com/atproto/server/listAppPasswords.ts";
import * as ComAtprotoServerRefreshSession from "./types/com/atproto/server/refreshSession.ts";
import * as ComAtprotoServerRequestAccountDelete from "./types/com/atproto/server/requestAccountDelete.ts";
import * as ComAtprotoServerRequestEmailConfirmation from "./types/com/atproto/server/requestEmailConfirmation.ts";
import * as ComAtprotoServerRequestEmailUpdate from "./types/com/atproto/server/requestEmailUpdate.ts";
import * as ComAtprotoServerRequestPasswordReset from "./types/com/atproto/server/requestPasswordReset.ts";
import * as ComAtprotoServerReserveSigningKey from "./types/com/atproto/server/reserveSigningKey.ts";
import * as ComAtprotoServerResetPassword from "./types/com/atproto/server/resetPassword.ts";
import * as ComAtprotoServerRevokeAppPassword from "./types/com/atproto/server/revokeAppPassword.ts";
import * as ComAtprotoServerUpdateEmail from "./types/com/atproto/server/updateEmail.ts";
import * as ComAtprotoSyncGetBlob from "./types/com/atproto/sync/getBlob.ts";
import * as ComAtprotoSyncGetBlocks from "./types/com/atproto/sync/getBlocks.ts";
import * as ComAtprotoSyncGetCheckout from "./types/com/atproto/sync/getCheckout.ts";
import * as ComAtprotoSyncGetHead from "./types/com/atproto/sync/getHead.ts";
import * as ComAtprotoSyncGetLatestCommit from "./types/com/atproto/sync/getLatestCommit.ts";
import * as ComAtprotoSyncGetRecord from "./types/com/atproto/sync/getRecord.ts";
import * as ComAtprotoSyncGetRepo from "./types/com/atproto/sync/getRepo.ts";
import * as ComAtprotoSyncGetRepoStatus from "./types/com/atproto/sync/getRepoStatus.ts";
import * as ComAtprotoSyncListBlobs from "./types/com/atproto/sync/listBlobs.ts";
import * as ComAtprotoSyncListRepos from "./types/com/atproto/sync/listRepos.ts";
import * as ComAtprotoSyncListReposByCollection from "./types/com/atproto/sync/listReposByCollection.ts";
import * as ComAtprotoSyncNotifyOfUpdate from "./types/com/atproto/sync/notifyOfUpdate.ts";
import * as ComAtprotoSyncRequestCrawl from "./types/com/atproto/sync/requestCrawl.ts";
import * as ComAtprotoSyncSubscribeRepos from "./types/com/atproto/sync/subscribeRepos.ts";
import * as ComAtprotoTempAddReservedHandle from "./types/com/atproto/temp/addReservedHandle.ts";
import * as ComAtprotoTempCheckSignupQueue from "./types/com/atproto/temp/checkSignupQueue.ts";
import * as ComAtprotoTempFetchLabels from "./types/com/atproto/temp/fetchLabels.ts";
import * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";
import * as SoSprkActorGetProfile from "./types/so/sprk/actor/getProfile.ts";
import * as SoSprkActorGetProfiles from "./types/so/sprk/actor/getProfiles.ts";
import * as SoSprkActorGetSuggestions from "./types/so/sprk/actor/getSuggestions.ts";
import * as SoSprkActorSearchActors from "./types/so/sprk/actor/searchActors.ts";
import * as SoSprkActorSearchActorsTypeahead from "./types/so/sprk/actor/searchActorsTypeahead.ts";
import * as SoSprkActorGetPreferences from "./types/so/sprk/actor/getPreferences.ts";
import * as SoSprkActorPutPreferences from "./types/so/sprk/actor/putPreferences.ts";
import * as SoSprkFeedDescribeFeedGenerator from "./types/so/sprk/feed/describeFeedGenerator.ts";
import * as SoSprkFeedGetActorFeeds from "./types/so/sprk/feed/getActorFeeds.ts";
import * as SoSprkFeedGetActorLikes from "./types/so/sprk/feed/getActorLikes.ts";
import * as SoSprkFeedGetAuthorFeed from "./types/so/sprk/feed/getAuthorFeed.ts";
import * as SoSprkFeedGetFeed from "./types/so/sprk/feed/getFeed.ts";
import * as SoSprkFeedGetFeedGenerator from "./types/so/sprk/feed/getFeedGenerator.ts";
import * as SoSprkFeedGetFeedGenerators from "./types/so/sprk/feed/getFeedGenerators.ts";
import * as SoSprkFeedGetFeedSkeleton from "./types/so/sprk/feed/getFeedSkeleton.ts";
import * as SoSprkFeedGetLikes from "./types/so/sprk/feed/getLikes.ts";
import * as SoSprkFeedGetListFeed from "./types/so/sprk/feed/getListFeed.ts";
import * as SoSprkFeedGetPostThread from "./types/so/sprk/feed/getPostThread.ts";
import * as SoSprkFeedGetPosts from "./types/so/sprk/feed/getPosts.ts";
import * as SoSprkFeedGetQuotes from "./types/so/sprk/feed/getQuotes.ts";
import * as SoSprkFeedGetRepostedBy from "./types/so/sprk/feed/getRepostedBy.ts";
import * as SoSprkFeedGetSuggestedFeeds from "./types/so/sprk/feed/getSuggestedFeeds.ts";
import * as SoSprkFeedGetTimeline from "./types/so/sprk/feed/getTimeline.ts";
import * as SoSprkFeedSearchPosts from "./types/so/sprk/feed/searchPosts.ts";
import * as SoSprkFeedSendInteractions from "./types/so/sprk/feed/sendInteractions.ts";
import * as SoSprkFeedGetActorLooks from "./types/so/sprk/feed/getActorLooks.ts";
import * as SoSprkFeedGetLooks from "./types/so/sprk/feed/getLooks.ts";
import * as SoSprkFeedGetStories from "./types/so/sprk/feed/getStories.ts";
import * as SoSprkFeedGetStoriesTimeline from "./types/so/sprk/feed/getStoriesTimeline.ts";
import * as SoSprkGraphGetActorStarterPacks from "./types/so/sprk/graph/getActorStarterPacks.ts";
import * as SoSprkGraphGetBlocks from "./types/so/sprk/graph/getBlocks.ts";
import * as SoSprkGraphGetFollowers from "./types/so/sprk/graph/getFollowers.ts";
import * as SoSprkGraphGetFollows from "./types/so/sprk/graph/getFollows.ts";
import * as SoSprkGraphGetKnownFollowers from "./types/so/sprk/graph/getKnownFollowers.ts";
import * as SoSprkGraphGetList from "./types/so/sprk/graph/getList.ts";
import * as SoSprkGraphGetListBlocks from "./types/so/sprk/graph/getListBlocks.ts";
import * as SoSprkGraphGetListMutes from "./types/so/sprk/graph/getListMutes.ts";
import * as SoSprkGraphGetLists from "./types/so/sprk/graph/getLists.ts";
import * as SoSprkGraphGetMutes from "./types/so/sprk/graph/getMutes.ts";
import * as SoSprkGraphGetRelationships from "./types/so/sprk/graph/getRelationships.ts";
import * as SoSprkGraphGetStarterPack from "./types/so/sprk/graph/getStarterPack.ts";
import * as SoSprkGraphGetStarterPacks from "./types/so/sprk/graph/getStarterPacks.ts";
import * as SoSprkGraphGetSuggestedFollowsByActor from "./types/so/sprk/graph/getSuggestedFollowsByActor.ts";
import * as SoSprkGraphMuteActor from "./types/so/sprk/graph/muteActor.ts";
import * as SoSprkGraphMuteActorList from "./types/so/sprk/graph/muteActorList.ts";
import * as SoSprkGraphMuteThread from "./types/so/sprk/graph/muteThread.ts";
import * as SoSprkGraphSearchStarterPacks from "./types/so/sprk/graph/searchStarterPacks.ts";
import * as SoSprkGraphUnmuteActor from "./types/so/sprk/graph/unmuteActor.ts";
import * as SoSprkGraphUnmuteActorList from "./types/so/sprk/graph/unmuteActorList.ts";
import * as SoSprkGraphUnmuteThread from "./types/so/sprk/graph/unmuteThread.ts";
import * as SoSprkLabelerGetServices from "./types/so/sprk/labeler/getServices.ts";
import * as SoSprkNotificationGetUnreadCount from "./types/so/sprk/notification/getUnreadCount.ts";
import * as SoSprkNotificationListNotifications from "./types/so/sprk/notification/listNotifications.ts";
import * as SoSprkNotificationPutPreferences from "./types/so/sprk/notification/putPreferences.ts";
import * as SoSprkNotificationRegisterPush from "./types/so/sprk/notification/registerPush.ts";
import * as SoSprkNotificationUpdateSeen from "./types/so/sprk/notification/updateSeen.ts";
import * as SoSprkUnspeccedGetConfig from "./types/so/sprk/unspecced/getConfig.ts";
import * as SoSprkUnspeccedGetPopularFeedGenerators from "./types/so/sprk/unspecced/getPopularFeedGenerators.ts";
import * as SoSprkUnspeccedGetSuggestionsSkeleton from "./types/so/sprk/unspecced/getSuggestionsSkeleton.ts";
import * as SoSprkUnspeccedGetTaggedSuggestions from "./types/so/sprk/unspecced/getTaggedSuggestions.ts";
import * as SoSprkUnspeccedGetTrendingTopics from "./types/so/sprk/unspecced/getTrendingTopics.ts";
import * as SoSprkUnspeccedSearchActorsSkeleton from "./types/so/sprk/unspecced/searchActorsSkeleton.ts";
import * as SoSprkUnspeccedSearchPostsSkeleton from "./types/so/sprk/unspecced/searchPostsSkeleton.ts";
import * as SoSprkUnspeccedSearchStarterPacksSkeleton from "./types/so/sprk/unspecced/searchStarterPacksSkeleton.ts";
import * as SoSprkVideoGetJobStatus from "./types/so/sprk/video/getJobStatus.ts";
import * as SoSprkVideoGetUploadLimits from "./types/so/sprk/video/getUploadLimits.ts";
import * as SoSprkVideoUploadVideo from "./types/so/sprk/video/uploadVideo.ts";
import * as AppBskyActorGetPreferences from "./types/app/bsky/actor/getPreferences.ts";
import * as AppBskyActorGetProfile from "./types/app/bsky/actor/getProfile.ts";
import * as AppBskyActorGetProfiles from "./types/app/bsky/actor/getProfiles.ts";
import * as AppBskyActorGetSuggestions from "./types/app/bsky/actor/getSuggestions.ts";
import * as AppBskyActorPutPreferences from "./types/app/bsky/actor/putPreferences.ts";
import * as AppBskyActorSearchActors from "./types/app/bsky/actor/searchActors.ts";
import * as AppBskyActorSearchActorsTypeahead from "./types/app/bsky/actor/searchActorsTypeahead.ts";
import * as AppBskyFeedDescribeFeedGenerator from "./types/app/bsky/feed/describeFeedGenerator.ts";
import * as AppBskyFeedGetActorFeeds from "./types/app/bsky/feed/getActorFeeds.ts";
import * as AppBskyFeedGetActorLikes from "./types/app/bsky/feed/getActorLikes.ts";
import * as AppBskyFeedGetAuthorFeed from "./types/app/bsky/feed/getAuthorFeed.ts";
import * as AppBskyFeedGetFeed from "./types/app/bsky/feed/getFeed.ts";
import * as AppBskyFeedGetFeedGenerator from "./types/app/bsky/feed/getFeedGenerator.ts";
import * as AppBskyFeedGetFeedGenerators from "./types/app/bsky/feed/getFeedGenerators.ts";
import * as AppBskyFeedGetFeedSkeleton from "./types/app/bsky/feed/getFeedSkeleton.ts";
import * as AppBskyFeedGetLikes from "./types/app/bsky/feed/getLikes.ts";
import * as AppBskyFeedGetListFeed from "./types/app/bsky/feed/getListFeed.ts";
import * as AppBskyFeedGetPostThread from "./types/app/bsky/feed/getPostThread.ts";
import * as AppBskyFeedGetPosts from "./types/app/bsky/feed/getPosts.ts";
import * as AppBskyFeedGetQuotes from "./types/app/bsky/feed/getQuotes.ts";
import * as AppBskyFeedGetRepostedBy from "./types/app/bsky/feed/getRepostedBy.ts";
import * as AppBskyFeedGetSuggestedFeeds from "./types/app/bsky/feed/getSuggestedFeeds.ts";
import * as AppBskyFeedGetTimeline from "./types/app/bsky/feed/getTimeline.ts";
import * as AppBskyFeedSearchPosts from "./types/app/bsky/feed/searchPosts.ts";
import * as AppBskyFeedSendInteractions from "./types/app/bsky/feed/sendInteractions.ts";
import * as AppBskyGraphGetActorStarterPacks from "./types/app/bsky/graph/getActorStarterPacks.ts";
import * as AppBskyGraphGetBlocks from "./types/app/bsky/graph/getBlocks.ts";
import * as AppBskyGraphGetFollowers from "./types/app/bsky/graph/getFollowers.ts";
import * as AppBskyGraphGetFollows from "./types/app/bsky/graph/getFollows.ts";
import * as AppBskyGraphGetKnownFollowers from "./types/app/bsky/graph/getKnownFollowers.ts";
import * as AppBskyGraphGetList from "./types/app/bsky/graph/getList.ts";
import * as AppBskyGraphGetListBlocks from "./types/app/bsky/graph/getListBlocks.ts";
import * as AppBskyGraphGetListMutes from "./types/app/bsky/graph/getListMutes.ts";
import * as AppBskyGraphGetLists from "./types/app/bsky/graph/getLists.ts";
import * as AppBskyGraphGetMutes from "./types/app/bsky/graph/getMutes.ts";
import * as AppBskyGraphGetRelationships from "./types/app/bsky/graph/getRelationships.ts";
import * as AppBskyGraphGetStarterPack from "./types/app/bsky/graph/getStarterPack.ts";
import * as AppBskyGraphGetStarterPacks from "./types/app/bsky/graph/getStarterPacks.ts";
import * as AppBskyGraphGetSuggestedFollowsByActor from "./types/app/bsky/graph/getSuggestedFollowsByActor.ts";
import * as AppBskyGraphMuteActor from "./types/app/bsky/graph/muteActor.ts";
import * as AppBskyGraphMuteActorList from "./types/app/bsky/graph/muteActorList.ts";
import * as AppBskyGraphMuteThread from "./types/app/bsky/graph/muteThread.ts";
import * as AppBskyGraphSearchStarterPacks from "./types/app/bsky/graph/searchStarterPacks.ts";
import * as AppBskyGraphUnmuteActor from "./types/app/bsky/graph/unmuteActor.ts";
import * as AppBskyGraphUnmuteActorList from "./types/app/bsky/graph/unmuteActorList.ts";
import * as AppBskyGraphUnmuteThread from "./types/app/bsky/graph/unmuteThread.ts";
import * as AppBskyLabelerGetServices from "./types/app/bsky/labeler/getServices.ts";
import * as AppBskyNotificationGetUnreadCount from "./types/app/bsky/notification/getUnreadCount.ts";
import * as AppBskyNotificationListNotifications from "./types/app/bsky/notification/listNotifications.ts";
import * as AppBskyNotificationPutPreferences from "./types/app/bsky/notification/putPreferences.ts";
import * as AppBskyNotificationRegisterPush from "./types/app/bsky/notification/registerPush.ts";
import * as AppBskyNotificationUpdateSeen from "./types/app/bsky/notification/updateSeen.ts";
import * as AppBskyUnspeccedGetConfig from "./types/app/bsky/unspecced/getConfig.ts";
import * as AppBskyUnspeccedGetPopularFeedGenerators from "./types/app/bsky/unspecced/getPopularFeedGenerators.ts";
import * as AppBskyUnspeccedGetSuggestionsSkeleton from "./types/app/bsky/unspecced/getSuggestionsSkeleton.ts";
import * as AppBskyUnspeccedGetTaggedSuggestions from "./types/app/bsky/unspecced/getTaggedSuggestions.ts";
import * as AppBskyUnspeccedGetTrendingTopics from "./types/app/bsky/unspecced/getTrendingTopics.ts";
import * as AppBskyUnspeccedSearchActorsSkeleton from "./types/app/bsky/unspecced/searchActorsSkeleton.ts";
import * as AppBskyUnspeccedSearchPostsSkeleton from "./types/app/bsky/unspecced/searchPostsSkeleton.ts";
import * as AppBskyUnspeccedSearchStarterPacksSkeleton from "./types/app/bsky/unspecced/searchStarterPacksSkeleton.ts";
import * as AppBskyVideoGetJobStatus from "./types/app/bsky/video/getJobStatus.ts";
import * as AppBskyVideoGetUploadLimits from "./types/app/bsky/video/getUploadLimits.ts";
import * as AppBskyVideoUploadVideo from "./types/app/bsky/video/uploadVideo.ts";
import * as ToolsOzoneCommunicationCreateTemplate from "./types/tools/ozone/communication/createTemplate.ts";
import * as ToolsOzoneCommunicationDeleteTemplate from "./types/tools/ozone/communication/deleteTemplate.ts";
import * as ToolsOzoneCommunicationListTemplates from "./types/tools/ozone/communication/listTemplates.ts";
import * as ToolsOzoneCommunicationUpdateTemplate from "./types/tools/ozone/communication/updateTemplate.ts";
import * as ToolsOzoneModerationEmitEvent from "./types/tools/ozone/moderation/emitEvent.ts";
import * as ToolsOzoneModerationGetEvent from "./types/tools/ozone/moderation/getEvent.ts";
import * as ToolsOzoneModerationGetRecord from "./types/tools/ozone/moderation/getRecord.ts";
import * as ToolsOzoneModerationGetRecords from "./types/tools/ozone/moderation/getRecords.ts";
import * as ToolsOzoneModerationGetRepo from "./types/tools/ozone/moderation/getRepo.ts";
import * as ToolsOzoneModerationGetReporterStats from "./types/tools/ozone/moderation/getReporterStats.ts";
import * as ToolsOzoneModerationGetRepos from "./types/tools/ozone/moderation/getRepos.ts";
import * as ToolsOzoneModerationQueryEvents from "./types/tools/ozone/moderation/queryEvents.ts";
import * as ToolsOzoneModerationQueryStatuses from "./types/tools/ozone/moderation/queryStatuses.ts";
import * as ToolsOzoneModerationSearchRepos from "./types/tools/ozone/moderation/searchRepos.ts";
import * as ToolsOzoneServerGetConfig from "./types/tools/ozone/server/getConfig.ts";
import * as ToolsOzoneSetAddValues from "./types/tools/ozone/set/addValues.ts";
import * as ToolsOzoneSetDeleteSet from "./types/tools/ozone/set/deleteSet.ts";
import * as ToolsOzoneSetDeleteValues from "./types/tools/ozone/set/deleteValues.ts";
import * as ToolsOzoneSetGetValues from "./types/tools/ozone/set/getValues.ts";
import * as ToolsOzoneSetQuerySets from "./types/tools/ozone/set/querySets.ts";
import * as ToolsOzoneSetUpsertSet from "./types/tools/ozone/set/upsertSet.ts";
import * as ToolsOzoneSettingListOptions from "./types/tools/ozone/setting/listOptions.ts";
import * as ToolsOzoneSettingRemoveOptions from "./types/tools/ozone/setting/removeOptions.ts";
import * as ToolsOzoneSettingUpsertOption from "./types/tools/ozone/setting/upsertOption.ts";
import * as ToolsOzoneSignatureFindCorrelation from "./types/tools/ozone/signature/findCorrelation.ts";
import * as ToolsOzoneSignatureFindRelatedAccounts from "./types/tools/ozone/signature/findRelatedAccounts.ts";
import * as ToolsOzoneSignatureSearchAccounts from "./types/tools/ozone/signature/searchAccounts.ts";
import * as ToolsOzoneTeamAddMember from "./types/tools/ozone/team/addMember.ts";
import * as ToolsOzoneTeamDeleteMember from "./types/tools/ozone/team/deleteMember.ts";
import * as ToolsOzoneTeamListMembers from "./types/tools/ozone/team/listMembers.ts";
import * as ToolsOzoneTeamUpdateMember from "./types/tools/ozone/team/updateMember.ts";
import * as ChatBskyActorDeleteAccount from "./types/chat/bsky/actor/deleteAccount.ts";
import * as ChatBskyActorExportAccountData from "./types/chat/bsky/actor/exportAccountData.ts";
import * as ChatBskyConvoAcceptConvo from "./types/chat/bsky/convo/acceptConvo.ts";
import * as ChatBskyConvoDeleteMessageForSelf from "./types/chat/bsky/convo/deleteMessageForSelf.ts";
import * as ChatBskyConvoGetConvo from "./types/chat/bsky/convo/getConvo.ts";
import * as ChatBskyConvoGetConvoAvailability from "./types/chat/bsky/convo/getConvoAvailability.ts";
import * as ChatBskyConvoGetConvoForMembers from "./types/chat/bsky/convo/getConvoForMembers.ts";
import * as ChatBskyConvoGetLog from "./types/chat/bsky/convo/getLog.ts";
import * as ChatBskyConvoGetMessages from "./types/chat/bsky/convo/getMessages.ts";
import * as ChatBskyConvoLeaveConvo from "./types/chat/bsky/convo/leaveConvo.ts";
import * as ChatBskyConvoListConvos from "./types/chat/bsky/convo/listConvos.ts";
import * as ChatBskyConvoMuteConvo from "./types/chat/bsky/convo/muteConvo.ts";
import * as ChatBskyConvoSendMessage from "./types/chat/bsky/convo/sendMessage.ts";
import * as ChatBskyConvoSendMessageBatch from "./types/chat/bsky/convo/sendMessageBatch.ts";
import * as ChatBskyConvoUnmuteConvo from "./types/chat/bsky/convo/unmuteConvo.ts";
import * as ChatBskyConvoUpdateAllRead from "./types/chat/bsky/convo/updateAllRead.ts";
import * as ChatBskyConvoUpdateRead from "./types/chat/bsky/convo/updateRead.ts";
import * as ChatBskyModerationGetActorMetadata from "./types/chat/bsky/moderation/getActorMetadata.ts";
import * as ChatBskyModerationGetMessageContext from "./types/chat/bsky/moderation/getMessageContext.ts";
import * as ChatBskyModerationUpdateActorAccess from "./types/chat/bsky/moderation/updateActorAccess.ts";

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
export const APP_BSKY_FEED = {
  DefsRequestLess: "app.bsky.feed.defs#requestLess",
  DefsRequestMore: "app.bsky.feed.defs#requestMore",
  DefsClickthroughItem: "app.bsky.feed.defs#clickthroughItem",
  DefsClickthroughAuthor: "app.bsky.feed.defs#clickthroughAuthor",
  DefsClickthroughReposter: "app.bsky.feed.defs#clickthroughReposter",
  DefsClickthroughEmbed: "app.bsky.feed.defs#clickthroughEmbed",
  DefsContentModeUnspecified: "app.bsky.feed.defs#contentModeUnspecified",
  DefsContentModeVideo: "app.bsky.feed.defs#contentModeVideo",
  DefsInteractionSeen: "app.bsky.feed.defs#interactionSeen",
  DefsInteractionLike: "app.bsky.feed.defs#interactionLike",
  DefsInteractionRepost: "app.bsky.feed.defs#interactionRepost",
  DefsInteractionReply: "app.bsky.feed.defs#interactionReply",
  DefsInteractionQuote: "app.bsky.feed.defs#interactionQuote",
  DefsInteractionShare: "app.bsky.feed.defs#interactionShare",
};
export const APP_BSKY_GRAPH = {
  DefsModlist: "app.bsky.graph.defs#modlist",
  DefsCuratelist: "app.bsky.graph.defs#curatelist",
  DefsReferencelist: "app.bsky.graph.defs#referencelist",
};
export const TOOLS_OZONE_MODERATION = {
  DefsReviewOpen: "tools.ozone.moderation.defs#reviewOpen",
  DefsReviewEscalated: "tools.ozone.moderation.defs#reviewEscalated",
  DefsReviewClosed: "tools.ozone.moderation.defs#reviewClosed",
  DefsReviewNone: "tools.ozone.moderation.defs#reviewNone",
};
export const TOOLS_OZONE_TEAM = {
  DefsRoleAdmin: "tools.ozone.team.defs#roleAdmin",
  DefsRoleModerator: "tools.ozone.team.defs#roleModerator",
  DefsRoleTriage: "tools.ozone.team.defs#roleTriage",
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
  app: AppNS<T>;
  tools: ToolsNS<T>;
  chat: ChatNS<T>;

  constructor(options?: XrpcOptions) {
    this.xrpc = createXrpcServer<T>(schemas, options);
    this.com = new ComNS(this);
    this.so = new SoNS(this);
    this.app = new AppNS(this);
    this.tools = new ToolsNS(this);
    this.chat = new ChatNS(this);
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
    const nsid = "com.atproto.admin.deleteAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  disableAccountInvites<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminDisableAccountInvites.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminDisableAccountInvites.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.disableAccountInvites"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  disableInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminDisableInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminDisableInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.disableInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  enableAccountInvites<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminEnableAccountInvites.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminEnableAccountInvites.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.enableAccountInvites"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInfo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetAccountInfo.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetAccountInfo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getAccountInfo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInfos<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetAccountInfos.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetAccountInfos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getAccountInfos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSubjectStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminGetSubjectStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminGetSubjectStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.getSubjectStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchAccounts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminSearchAccounts.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminSearchAccounts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.searchAccounts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminSendEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminSendEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.sendEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateAccountEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateAccountEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountHandle<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateAccountHandle.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateAccountHandle.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateAccountPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateAccountPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSubjectStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoAdminUpdateSubjectStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoAdminUpdateSubjectStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.admin.updateSubjectStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.identity.getRecommendedDidCredentials"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.identity.requestPlcOperationSignature"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  resolveHandle<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentityResolveHandle.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentityResolveHandle.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.resolveHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  signPlcOperation<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentitySignPlcOperation.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentitySignPlcOperation.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.signPlcOperation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  submitPlcOperation<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentitySubmitPlcOperation.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentitySubmitPlcOperation.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.submitPlcOperation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateHandle<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoIdentityUpdateHandle.Handler<ExtractAuth<AV>>,
      ComAtprotoIdentityUpdateHandle.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.identity.updateHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.label.queryLabels"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  subscribeLabels<AV extends StreamAuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoLabelSubscribeLabels.Handler<ExtractAuth<AV>>,
      ComAtprotoLabelSubscribeLabels.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.label.subscribeLabels"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.moderation.createReport"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.repo.applyWrites"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoCreateRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoCreateRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.createRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoDeleteRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoDeleteRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.deleteRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  describeRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoDescribeRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoDescribeRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.describeRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoGetRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoGetRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.getRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  importRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoImportRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoImportRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.importRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listMissingBlobs<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoListMissingBlobs.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoListMissingBlobs.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.listMissingBlobs"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listRecords<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoListRecords.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoListRecords.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.listRecords"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoPutRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoPutRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.putRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadBlob<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoUploadBlob.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoUploadBlob.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.repo.uploadBlob"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.server.activateAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  checkAccountStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCheckAccountStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCheckAccountStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.checkAccountStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  confirmEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerConfirmEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoServerConfirmEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.confirmEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createAppPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateAppPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateAppPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createAppPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createInviteCode<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateInviteCode.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateInviteCode.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createInviteCode"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerCreateSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerCreateSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.createSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deactivateAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDeactivateAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDeactivateAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.deactivateAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDeleteAccount.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDeleteAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.deleteAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDeleteSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDeleteSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.deleteSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  describeServer<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerDescribeServer.Handler<ExtractAuth<AV>>,
      ComAtprotoServerDescribeServer.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.describeServer"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInviteCodes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerGetAccountInviteCodes.Handler<ExtractAuth<AV>>,
      ComAtprotoServerGetAccountInviteCodes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.getAccountInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getServiceAuth<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerGetServiceAuth.Handler<ExtractAuth<AV>>,
      ComAtprotoServerGetServiceAuth.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.getServiceAuth"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerGetSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerGetSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.getSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listAppPasswords<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerListAppPasswords.Handler<ExtractAuth<AV>>,
      ComAtprotoServerListAppPasswords.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.listAppPasswords"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  refreshSession<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRefreshSession.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRefreshSession.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.refreshSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestAccountDelete<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestAccountDelete.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestAccountDelete.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestAccountDelete"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestEmailConfirmation<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestEmailConfirmation.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestEmailConfirmation.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestEmailConfirmation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestEmailUpdate<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestEmailUpdate.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestEmailUpdate.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestEmailUpdate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPasswordReset<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRequestPasswordReset.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRequestPasswordReset.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.requestPasswordReset"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  reserveSigningKey<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerReserveSigningKey.Handler<ExtractAuth<AV>>,
      ComAtprotoServerReserveSigningKey.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.reserveSigningKey"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  resetPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerResetPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoServerResetPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.resetPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  revokeAppPassword<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerRevokeAppPassword.Handler<ExtractAuth<AV>>,
      ComAtprotoServerRevokeAppPassword.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.revokeAppPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateEmail<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoServerUpdateEmail.Handler<ExtractAuth<AV>>,
      ComAtprotoServerUpdateEmail.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.server.updateEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.sync.getBlob"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetBlocks.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getCheckout<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetCheckout.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetCheckout.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getCheckout"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getHead<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetHead.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetHead.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getHead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLatestCommit<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetLatestCommit.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetLatestCommit.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getLatestCommit"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepoStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncGetRepoStatus.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncGetRepoStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.getRepoStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listBlobs<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncListBlobs.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncListBlobs.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.listBlobs"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listRepos<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncListRepos.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncListRepos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.listRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listReposByCollection<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncListReposByCollection.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncListReposByCollection.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.listReposByCollection"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  notifyOfUpdate<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncNotifyOfUpdate.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncNotifyOfUpdate.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.notifyOfUpdate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestCrawl<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncRequestCrawl.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncRequestCrawl.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.requestCrawl"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  subscribeRepos<AV extends StreamAuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoSyncSubscribeRepos.Handler<ExtractAuth<AV>>,
      ComAtprotoSyncSubscribeRepos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.sync.subscribeRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "com.atproto.temp.addReservedHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  checkSignupQueue<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoTempCheckSignupQueue.Handler<ExtractAuth<AV>>,
      ComAtprotoTempCheckSignupQueue.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.temp.checkSignupQueue"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  fetchLabels<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoTempFetchLabels.Handler<ExtractAuth<AV>>,
      ComAtprotoTempFetchLabels.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.temp.fetchLabels"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPhoneVerification<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoTempRequestPhoneVerification.Handler<ExtractAuth<AV>>,
      ComAtprotoTempRequestPhoneVerification.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "com.atproto.temp.requestPhoneVerification"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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

  getProfile<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetProfile.Handler<ExtractAuth<AV>>,
      SoSprkActorGetProfile.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getProfile"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfiles<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetProfiles.Handler<ExtractAuth<AV>>,
      SoSprkActorGetProfiles.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getProfiles"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetSuggestions.Handler<ExtractAuth<AV>>,
      SoSprkActorGetSuggestions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActors<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorSearchActors.Handler<ExtractAuth<AV>>,
      SoSprkActorSearchActors.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.searchActors"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsTypeahead<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorSearchActorsTypeahead.Handler<ExtractAuth<AV>>,
      SoSprkActorSearchActorsTypeahead.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.searchActorsTypeahead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorGetPreferences.Handler<ExtractAuth<AV>>,
      SoSprkActorGetPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.getPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkActorPutPreferences.Handler<ExtractAuth<AV>>,
      SoSprkActorPutPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.actor.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "so.sprk.feed.describeFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorFeeds<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetActorFeeds.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetActorFeeds.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getActorFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLikes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetActorLikes.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetActorLikes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getActorLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAuthorFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetAuthorFeed.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetAuthorFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getAuthorFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeed.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerator<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeedGenerator.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeedGenerator.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerators<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeedGenerators.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeedGenerators.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetFeedSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetFeedSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLikes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetLikes.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetLikes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetListFeed.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetListFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getListFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetPostThread.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetPostThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getPostThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPosts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetPosts.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetPosts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getQuotes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetQuotes.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetQuotes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getQuotes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepostedBy<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetRepostedBy.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetRepostedBy.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getRepostedBy"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFeeds<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetSuggestedFeeds.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetSuggestedFeeds.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getSuggestedFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTimeline<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetTimeline.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetTimeline.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getTimeline"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPosts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedSearchPosts.Handler<ExtractAuth<AV>>,
      SoSprkFeedSearchPosts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.searchPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendInteractions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedSendInteractions.Handler<ExtractAuth<AV>>,
      SoSprkFeedSendInteractions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.sendInteractions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLooks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetActorLooks.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetActorLooks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getActorLooks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLooks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetLooks.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetLooks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getLooks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStories<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetStories.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetStories.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getStories"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStoriesTimeline<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkFeedGetStoriesTimeline.Handler<ExtractAuth<AV>>,
      SoSprkFeedGetStoriesTimeline.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.feed.getStoriesTimeline"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "so.sprk.graph.getActorStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetBlocks.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollowers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetFollowers.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetFollowers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollows<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetFollows.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetFollows.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getFollows"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getKnownFollowers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetKnownFollowers.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetKnownFollowers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getKnownFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetList.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetListBlocks.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetListBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getListBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListMutes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetListMutes.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetListMutes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getListMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLists<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetLists.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetLists.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getLists"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMutes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetMutes.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetMutes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRelationships<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetRelationships.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetRelationships.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getRelationships"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPack<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetStarterPack.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetStarterPack.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getStarterPack"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetStarterPacks.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFollowsByActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphGetSuggestedFollowsByActor.Handler<ExtractAuth<AV>>,
      SoSprkGraphGetSuggestedFollowsByActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.getSuggestedFollowsByActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphMuteActor.Handler<ExtractAuth<AV>>,
      SoSprkGraphMuteActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.muteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActorList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphMuteActorList.Handler<ExtractAuth<AV>>,
      SoSprkGraphMuteActorList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.muteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphMuteThread.Handler<ExtractAuth<AV>>,
      SoSprkGraphMuteThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.muteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphSearchStarterPacks.Handler<ExtractAuth<AV>>,
      SoSprkGraphSearchStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.searchStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphUnmuteActor.Handler<ExtractAuth<AV>>,
      SoSprkGraphUnmuteActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActorList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphUnmuteActorList.Handler<ExtractAuth<AV>>,
      SoSprkGraphUnmuteActorList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkGraphUnmuteThread.Handler<ExtractAuth<AV>>,
      SoSprkGraphUnmuteThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "so.sprk.labeler.getServices"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "so.sprk.notification.getUnreadCount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listNotifications<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationListNotifications.Handler<ExtractAuth<AV>>,
      SoSprkNotificationListNotifications.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.listNotifications"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationPutPreferences.Handler<ExtractAuth<AV>>,
      SoSprkNotificationPutPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  registerPush<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationRegisterPush.Handler<ExtractAuth<AV>>,
      SoSprkNotificationRegisterPush.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.registerPush"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSeen<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkNotificationUpdateSeen.Handler<ExtractAuth<AV>>,
      SoSprkNotificationUpdateSeen.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.notification.updateSeen"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "so.sprk.unspecced.getConfig"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPopularFeedGenerators<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetPopularFeedGenerators.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetPopularFeedGenerators.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getPopularFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestionsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetSuggestionsSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetSuggestionsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getSuggestionsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTaggedSuggestions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetTaggedSuggestions.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetTaggedSuggestions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getTaggedSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrendingTopics<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedGetTrendingTopics.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedGetTrendingTopics.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.getTrendingTopics"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedSearchActorsSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedSearchActorsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchActorsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPostsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedSearchPostsSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedSearchPostsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchPostsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacksSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkUnspeccedSearchStarterPacksSkeleton.Handler<ExtractAuth<AV>>,
      SoSprkUnspeccedSearchStarterPacksSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchStarterPacksSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
    const nsid = "so.sprk.video.getJobStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getUploadLimits<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkVideoGetUploadLimits.Handler<ExtractAuth<AV>>,
      SoSprkVideoGetUploadLimits.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.video.getUploadLimits"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadVideo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SoSprkVideoUploadVideo.Handler<ExtractAuth<AV>>,
      SoSprkVideoUploadVideo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "so.sprk.video.uploadVideo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppNS<T extends Env> {
  _server: Server<T>;
  bsky: AppBskyNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.bsky = new AppBskyNS(server);
  }
}

export class AppBskyNS<T extends Env> {
  _server: Server<T>;
  actor: AppBskyActorNS<T>;
  embed: AppBskyEmbedNS<T>;
  feed: AppBskyFeedNS<T>;
  graph: AppBskyGraphNS<T>;
  labeler: AppBskyLabelerNS<T>;
  notification: AppBskyNotificationNS<T>;
  richtext: AppBskyRichtextNS<T>;
  unspecced: AppBskyUnspeccedNS<T>;
  video: AppBskyVideoNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.actor = new AppBskyActorNS(server);
    this.embed = new AppBskyEmbedNS(server);
    this.feed = new AppBskyFeedNS(server);
    this.graph = new AppBskyGraphNS(server);
    this.labeler = new AppBskyLabelerNS(server);
    this.notification = new AppBskyNotificationNS(server);
    this.richtext = new AppBskyRichtextNS(server);
    this.unspecced = new AppBskyUnspeccedNS(server);
    this.video = new AppBskyVideoNS(server);
  }
}

export class AppBskyActorNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyActorGetPreferences.Handler<ExtractAuth<AV>>,
      AppBskyActorGetPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.actor.getPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfile<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyActorGetProfile.Handler<ExtractAuth<AV>>,
      AppBskyActorGetProfile.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.actor.getProfile"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfiles<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyActorGetProfiles.Handler<ExtractAuth<AV>>,
      AppBskyActorGetProfiles.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.actor.getProfiles"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyActorGetSuggestions.Handler<ExtractAuth<AV>>,
      AppBskyActorGetSuggestions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.actor.getSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyActorPutPreferences.Handler<ExtractAuth<AV>>,
      AppBskyActorPutPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.actor.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActors<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyActorSearchActors.Handler<ExtractAuth<AV>>,
      AppBskyActorSearchActors.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.actor.searchActors"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsTypeahead<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyActorSearchActorsTypeahead.Handler<ExtractAuth<AV>>,
      AppBskyActorSearchActorsTypeahead.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.actor.searchActorsTypeahead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyEmbedNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }
}

export class AppBskyFeedNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  describeFeedGenerator<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedDescribeFeedGenerator.Handler<ExtractAuth<AV>>,
      AppBskyFeedDescribeFeedGenerator.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.describeFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorFeeds<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetActorFeeds.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetActorFeeds.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getActorFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLikes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetActorLikes.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetActorLikes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getActorLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAuthorFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetAuthorFeed.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetAuthorFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getAuthorFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetFeed.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerator<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetFeedGenerator.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetFeedGenerator.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerators<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetFeedGenerators.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetFeedGenerators.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetFeedSkeleton.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetFeedSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getFeedSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLikes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetLikes.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetLikes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListFeed<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetListFeed.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetListFeed.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getListFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetPostThread.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetPostThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getPostThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPosts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetPosts.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetPosts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getQuotes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetQuotes.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetQuotes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getQuotes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepostedBy<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetRepostedBy.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetRepostedBy.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getRepostedBy"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFeeds<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetSuggestedFeeds.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetSuggestedFeeds.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getSuggestedFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTimeline<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedGetTimeline.Handler<ExtractAuth<AV>>,
      AppBskyFeedGetTimeline.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.getTimeline"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPosts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedSearchPosts.Handler<ExtractAuth<AV>>,
      AppBskyFeedSearchPosts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.searchPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendInteractions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyFeedSendInteractions.Handler<ExtractAuth<AV>>,
      AppBskyFeedSendInteractions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.feed.sendInteractions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyGraphNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getActorStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetActorStarterPacks.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetActorStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getActorStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetBlocks.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollowers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetFollowers.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetFollowers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollows<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetFollows.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetFollows.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getFollows"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getKnownFollowers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetKnownFollowers.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetKnownFollowers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getKnownFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetList.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListBlocks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetListBlocks.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetListBlocks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getListBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListMutes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetListMutes.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetListMutes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getListMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLists<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetLists.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetLists.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getLists"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMutes<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetMutes.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetMutes.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRelationships<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetRelationships.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetRelationships.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getRelationships"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPack<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetStarterPack.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetStarterPack.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getStarterPack"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetStarterPacks.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFollowsByActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphGetSuggestedFollowsByActor.Handler<ExtractAuth<AV>>,
      AppBskyGraphGetSuggestedFollowsByActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.getSuggestedFollowsByActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphMuteActor.Handler<ExtractAuth<AV>>,
      AppBskyGraphMuteActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.muteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActorList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphMuteActorList.Handler<ExtractAuth<AV>>,
      AppBskyGraphMuteActorList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.muteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphMuteThread.Handler<ExtractAuth<AV>>,
      AppBskyGraphMuteThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.muteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacks<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphSearchStarterPacks.Handler<ExtractAuth<AV>>,
      AppBskyGraphSearchStarterPacks.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.searchStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActor<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphUnmuteActor.Handler<ExtractAuth<AV>>,
      AppBskyGraphUnmuteActor.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.unmuteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActorList<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphUnmuteActorList.Handler<ExtractAuth<AV>>,
      AppBskyGraphUnmuteActorList.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.unmuteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteThread<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyGraphUnmuteThread.Handler<ExtractAuth<AV>>,
      AppBskyGraphUnmuteThread.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.graph.unmuteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyLabelerNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getServices<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyLabelerGetServices.Handler<ExtractAuth<AV>>,
      AppBskyLabelerGetServices.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.labeler.getServices"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyNotificationNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getUnreadCount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyNotificationGetUnreadCount.Handler<ExtractAuth<AV>>,
      AppBskyNotificationGetUnreadCount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.notification.getUnreadCount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listNotifications<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyNotificationListNotifications.Handler<ExtractAuth<AV>>,
      AppBskyNotificationListNotifications.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.notification.listNotifications"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyNotificationPutPreferences.Handler<ExtractAuth<AV>>,
      AppBskyNotificationPutPreferences.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.notification.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  registerPush<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyNotificationRegisterPush.Handler<ExtractAuth<AV>>,
      AppBskyNotificationRegisterPush.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.notification.registerPush"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSeen<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyNotificationUpdateSeen.Handler<ExtractAuth<AV>>,
      AppBskyNotificationUpdateSeen.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.notification.updateSeen"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyRichtextNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }
}

export class AppBskyUnspeccedNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getConfig<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedGetConfig.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedGetConfig.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.getConfig"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPopularFeedGenerators<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedGetPopularFeedGenerators.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedGetPopularFeedGenerators.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.getPopularFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestionsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedGetSuggestionsSkeleton.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedGetSuggestionsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestionsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTaggedSuggestions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedGetTaggedSuggestions.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedGetTaggedSuggestions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.getTaggedSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrendingTopics<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedGetTrendingTopics.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedGetTrendingTopics.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.getTrendingTopics"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedSearchActorsSkeleton.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedSearchActorsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.searchActorsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPostsSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedSearchPostsSkeleton.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedSearchPostsSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.searchPostsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacksSkeleton<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyUnspeccedSearchStarterPacksSkeleton.Handler<ExtractAuth<AV>>,
      AppBskyUnspeccedSearchStarterPacksSkeleton.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.unspecced.searchStarterPacksSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyVideoNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getJobStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyVideoGetJobStatus.Handler<ExtractAuth<AV>>,
      AppBskyVideoGetJobStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.video.getJobStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getUploadLimits<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyVideoGetUploadLimits.Handler<ExtractAuth<AV>>,
      AppBskyVideoGetUploadLimits.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.video.getUploadLimits"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadVideo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      AppBskyVideoUploadVideo.Handler<ExtractAuth<AV>>,
      AppBskyVideoUploadVideo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "app.bsky.video.uploadVideo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsNS<T extends Env> {
  _server: Server<T>;
  ozone: ToolsOzoneNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.ozone = new ToolsOzoneNS(server);
  }
}

export class ToolsOzoneNS<T extends Env> {
  _server: Server<T>;
  communication: ToolsOzoneCommunicationNS<T>;
  moderation: ToolsOzoneModerationNS<T>;
  server: ToolsOzoneServerNS<T>;
  set: ToolsOzoneSetNS<T>;
  setting: ToolsOzoneSettingNS<T>;
  signature: ToolsOzoneSignatureNS<T>;
  team: ToolsOzoneTeamNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.communication = new ToolsOzoneCommunicationNS(server);
    this.moderation = new ToolsOzoneModerationNS(server);
    this.server = new ToolsOzoneServerNS(server);
    this.set = new ToolsOzoneSetNS(server);
    this.setting = new ToolsOzoneSettingNS(server);
    this.signature = new ToolsOzoneSignatureNS(server);
    this.team = new ToolsOzoneTeamNS(server);
  }
}

export class ToolsOzoneCommunicationNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  createTemplate<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneCommunicationCreateTemplate.Handler<ExtractAuth<AV>>,
      ToolsOzoneCommunicationCreateTemplate.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.communication.createTemplate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteTemplate<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneCommunicationDeleteTemplate.Handler<ExtractAuth<AV>>,
      ToolsOzoneCommunicationDeleteTemplate.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.communication.deleteTemplate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listTemplates<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneCommunicationListTemplates.Handler<ExtractAuth<AV>>,
      ToolsOzoneCommunicationListTemplates.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.communication.listTemplates"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateTemplate<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneCommunicationUpdateTemplate.Handler<ExtractAuth<AV>>,
      ToolsOzoneCommunicationUpdateTemplate.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.communication.updateTemplate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneModerationNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  emitEvent<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationEmitEvent.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationEmitEvent.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.emitEvent"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getEvent<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationGetEvent.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationGetEvent.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.getEvent"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationGetRecord.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationGetRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecords<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationGetRecords.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationGetRecords.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRecords"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationGetRepo.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationGetRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getReporterStats<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationGetReporterStats.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationGetReporterStats.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.getReporterStats"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepos<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationGetRepos.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationGetRepos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  queryEvents<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationQueryEvents.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationQueryEvents.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.queryEvents"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  queryStatuses<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationQueryStatuses.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationQueryStatuses.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.queryStatuses"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchRepos<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneModerationSearchRepos.Handler<ExtractAuth<AV>>,
      ToolsOzoneModerationSearchRepos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.moderation.searchRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneServerNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getConfig<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneServerGetConfig.Handler<ExtractAuth<AV>>,
      ToolsOzoneServerGetConfig.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.server.getConfig"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneSetNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  addValues<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSetAddValues.Handler<ExtractAuth<AV>>,
      ToolsOzoneSetAddValues.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.set.addValues"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteSet<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSetDeleteSet.Handler<ExtractAuth<AV>>,
      ToolsOzoneSetDeleteSet.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.set.deleteSet"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteValues<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSetDeleteValues.Handler<ExtractAuth<AV>>,
      ToolsOzoneSetDeleteValues.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.set.deleteValues"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getValues<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSetGetValues.Handler<ExtractAuth<AV>>,
      ToolsOzoneSetGetValues.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.set.getValues"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  querySets<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSetQuerySets.Handler<ExtractAuth<AV>>,
      ToolsOzoneSetQuerySets.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.set.querySets"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  upsertSet<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSetUpsertSet.Handler<ExtractAuth<AV>>,
      ToolsOzoneSetUpsertSet.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.set.upsertSet"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneSettingNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  listOptions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSettingListOptions.Handler<ExtractAuth<AV>>,
      ToolsOzoneSettingListOptions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.setting.listOptions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  removeOptions<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSettingRemoveOptions.Handler<ExtractAuth<AV>>,
      ToolsOzoneSettingRemoveOptions.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.setting.removeOptions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  upsertOption<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSettingUpsertOption.Handler<ExtractAuth<AV>>,
      ToolsOzoneSettingUpsertOption.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.setting.upsertOption"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneSignatureNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  findCorrelation<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSignatureFindCorrelation.Handler<ExtractAuth<AV>>,
      ToolsOzoneSignatureFindCorrelation.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.signature.findCorrelation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  findRelatedAccounts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSignatureFindRelatedAccounts.Handler<ExtractAuth<AV>>,
      ToolsOzoneSignatureFindRelatedAccounts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.signature.findRelatedAccounts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchAccounts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneSignatureSearchAccounts.Handler<ExtractAuth<AV>>,
      ToolsOzoneSignatureSearchAccounts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.signature.searchAccounts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneTeamNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  addMember<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneTeamAddMember.Handler<ExtractAuth<AV>>,
      ToolsOzoneTeamAddMember.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.team.addMember"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteMember<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneTeamDeleteMember.Handler<ExtractAuth<AV>>,
      ToolsOzoneTeamDeleteMember.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.team.deleteMember"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listMembers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneTeamListMembers.Handler<ExtractAuth<AV>>,
      ToolsOzoneTeamListMembers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.team.listMembers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateMember<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ToolsOzoneTeamUpdateMember.Handler<ExtractAuth<AV>>,
      ToolsOzoneTeamUpdateMember.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "tools.ozone.team.updateMember"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ChatNS<T extends Env> {
  _server: Server<T>;
  bsky: ChatBskyNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.bsky = new ChatBskyNS(server);
  }
}

export class ChatBskyNS<T extends Env> {
  _server: Server<T>;
  actor: ChatBskyActorNS<T>;
  convo: ChatBskyConvoNS<T>;
  moderation: ChatBskyModerationNS<T>;

  constructor(server: Server<T>) {
    this._server = server;
    this.actor = new ChatBskyActorNS(server);
    this.convo = new ChatBskyConvoNS(server);
    this.moderation = new ChatBskyModerationNS(server);
  }
}

export class ChatBskyActorNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  deleteAccount<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyActorDeleteAccount.Handler<ExtractAuth<AV>>,
      ChatBskyActorDeleteAccount.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.actor.deleteAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  exportAccountData<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyActorExportAccountData.Handler<ExtractAuth<AV>>,
      ChatBskyActorExportAccountData.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.actor.exportAccountData"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ChatBskyConvoNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  acceptConvo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoAcceptConvo.Handler<ExtractAuth<AV>>,
      ChatBskyConvoAcceptConvo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.acceptConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteMessageForSelf<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoDeleteMessageForSelf.Handler<ExtractAuth<AV>>,
      ChatBskyConvoDeleteMessageForSelf.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.deleteMessageForSelf"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getConvo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoGetConvo.Handler<ExtractAuth<AV>>,
      ChatBskyConvoGetConvo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.getConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getConvoAvailability<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoGetConvoAvailability.Handler<ExtractAuth<AV>>,
      ChatBskyConvoGetConvoAvailability.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.getConvoAvailability"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getConvoForMembers<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoGetConvoForMembers.Handler<ExtractAuth<AV>>,
      ChatBskyConvoGetConvoForMembers.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.getConvoForMembers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLog<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoGetLog.Handler<ExtractAuth<AV>>,
      ChatBskyConvoGetLog.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.getLog"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMessages<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoGetMessages.Handler<ExtractAuth<AV>>,
      ChatBskyConvoGetMessages.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.getMessages"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  leaveConvo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoLeaveConvo.Handler<ExtractAuth<AV>>,
      ChatBskyConvoLeaveConvo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.leaveConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listConvos<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoListConvos.Handler<ExtractAuth<AV>>,
      ChatBskyConvoListConvos.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.listConvos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteConvo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoMuteConvo.Handler<ExtractAuth<AV>>,
      ChatBskyConvoMuteConvo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.muteConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendMessage<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoSendMessage.Handler<ExtractAuth<AV>>,
      ChatBskyConvoSendMessage.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.sendMessage"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendMessageBatch<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoSendMessageBatch.Handler<ExtractAuth<AV>>,
      ChatBskyConvoSendMessageBatch.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.sendMessageBatch"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteConvo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoUnmuteConvo.Handler<ExtractAuth<AV>>,
      ChatBskyConvoUnmuteConvo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.unmuteConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAllRead<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoUpdateAllRead.Handler<ExtractAuth<AV>>,
      ChatBskyConvoUpdateAllRead.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.updateAllRead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateRead<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyConvoUpdateRead.Handler<ExtractAuth<AV>>,
      ChatBskyConvoUpdateRead.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.convo.updateRead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ChatBskyModerationNS<T extends Env> {
  _server: Server<T>;

  constructor(server: Server<T>) {
    this._server = server;
  }

  getActorMetadata<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyModerationGetActorMetadata.Handler<ExtractAuth<AV>>,
      ChatBskyModerationGetActorMetadata.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.moderation.getActorMetadata"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMessageContext<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyModerationGetMessageContext.Handler<ExtractAuth<AV>>,
      ChatBskyModerationGetMessageContext.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.moderation.getMessageContext"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateActorAccess<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ChatBskyModerationUpdateActorAccess.Handler<ExtractAuth<AV>>,
      ChatBskyModerationUpdateActorAccess.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = "chat.bsky.moderation.updateActorAccess"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
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
