/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type Auth,
  createServer as createXrpcServer,
  type MethodConfigOrHandler,
  type Options as XrpcOptions,
  Server as XrpcServer,
  type StreamConfigOrHandler,
} from "@sprk/xrpc-server";
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
import * as SoSprkFeedSendInteractions from "./types/so/sprk/feed/sendInteractions.ts";
import * as SoSprkFeedGetActorLooks from "./types/so/sprk/feed/getActorLooks.ts";
import * as SoSprkFeedGetLooks from "./types/so/sprk/feed/getLooks.ts";
import * as SoSprkFeedGetStories from "./types/so/sprk/feed/getStories.ts";
import * as SoSprkFeedGetStoriesTimeline from "./types/so/sprk/feed/getStoriesTimeline.ts";
import * as SoSprkFeedSearchPosts from "./types/so/sprk/feed/searchPosts.ts";
import * as SoSprkFeedGetActorAudios from "./types/so/sprk/feed/getActorAudios.ts";
import * as SoSprkFeedGetAudios from "./types/so/sprk/feed/getAudios.ts";
import * as SoSprkFeedGetPostsByAudio from "./types/so/sprk/feed/getPostsByAudio.ts";
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

export function createServer(options?: XrpcOptions): Server {
  return new Server(options);
}

export class Server {
  xrpc: XrpcServer;
  com: ComNS;
  so: SoNS;
  app: AppNS;
  tools: ToolsNS;
  chat: ChatNS;

  constructor(options?: XrpcOptions) {
    this.xrpc = createXrpcServer(schemas, options);
    this.com = new ComNS(this);
    this.so = new SoNS(this);
    this.app = new AppNS(this);
    this.tools = new ToolsNS(this);
    this.chat = new ChatNS(this);
  }
}

export class ComNS {
  _server: Server;
  atproto: ComAtprotoNS;

  constructor(server: Server) {
    this._server = server;
    this.atproto = new ComAtprotoNS(server);
  }
}

export class ComAtprotoNS {
  _server: Server;
  admin: ComAtprotoAdminNS;
  identity: ComAtprotoIdentityNS;
  label: ComAtprotoLabelNS;
  lexicon: ComAtprotoLexiconNS;
  moderation: ComAtprotoModerationNS;
  repo: ComAtprotoRepoNS;
  server: ComAtprotoServerNS;
  sync: ComAtprotoSyncNS;
  temp: ComAtprotoTempNS;

  constructor(server: Server) {
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

export class ComAtprotoAdminNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  deleteAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminDeleteAccount.QueryParams,
      ComAtprotoAdminDeleteAccount.HandlerInput,
      ComAtprotoAdminDeleteAccount.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.deleteAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  disableAccountInvites<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminDisableAccountInvites.QueryParams,
      ComAtprotoAdminDisableAccountInvites.HandlerInput,
      ComAtprotoAdminDisableAccountInvites.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.disableAccountInvites"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  disableInviteCodes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminDisableInviteCodes.QueryParams,
      ComAtprotoAdminDisableInviteCodes.HandlerInput,
      ComAtprotoAdminDisableInviteCodes.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.disableInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  enableAccountInvites<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminEnableAccountInvites.QueryParams,
      ComAtprotoAdminEnableAccountInvites.HandlerInput,
      ComAtprotoAdminEnableAccountInvites.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.enableAccountInvites"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInfo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminGetAccountInfo.QueryParams,
      ComAtprotoAdminGetAccountInfo.HandlerInput,
      ComAtprotoAdminGetAccountInfo.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.getAccountInfo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInfos<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminGetAccountInfos.QueryParams,
      ComAtprotoAdminGetAccountInfos.HandlerInput,
      ComAtprotoAdminGetAccountInfos.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.getAccountInfos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getInviteCodes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminGetInviteCodes.QueryParams,
      ComAtprotoAdminGetInviteCodes.HandlerInput,
      ComAtprotoAdminGetInviteCodes.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.getInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSubjectStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminGetSubjectStatus.QueryParams,
      ComAtprotoAdminGetSubjectStatus.HandlerInput,
      ComAtprotoAdminGetSubjectStatus.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.getSubjectStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchAccounts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminSearchAccounts.QueryParams,
      ComAtprotoAdminSearchAccounts.HandlerInput,
      ComAtprotoAdminSearchAccounts.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.searchAccounts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendEmail<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminSendEmail.QueryParams,
      ComAtprotoAdminSendEmail.HandlerInput,
      ComAtprotoAdminSendEmail.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.sendEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountEmail<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminUpdateAccountEmail.QueryParams,
      ComAtprotoAdminUpdateAccountEmail.HandlerInput,
      ComAtprotoAdminUpdateAccountEmail.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountHandle<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminUpdateAccountHandle.QueryParams,
      ComAtprotoAdminUpdateAccountHandle.HandlerInput,
      ComAtprotoAdminUpdateAccountHandle.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountPassword<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminUpdateAccountPassword.QueryParams,
      ComAtprotoAdminUpdateAccountPassword.HandlerInput,
      ComAtprotoAdminUpdateAccountPassword.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSubjectStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminUpdateSubjectStatus.QueryParams,
      ComAtprotoAdminUpdateSubjectStatus.HandlerInput,
      ComAtprotoAdminUpdateSubjectStatus.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.updateSubjectStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoIdentityNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getRecommendedDidCredentials<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityGetRecommendedDidCredentials.QueryParams,
      ComAtprotoIdentityGetRecommendedDidCredentials.HandlerInput,
      ComAtprotoIdentityGetRecommendedDidCredentials.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.getRecommendedDidCredentials"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPlcOperationSignature<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityRequestPlcOperationSignature.QueryParams,
      ComAtprotoIdentityRequestPlcOperationSignature.HandlerInput,
      ComAtprotoIdentityRequestPlcOperationSignature.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.requestPlcOperationSignature"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  resolveHandle<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityResolveHandle.QueryParams,
      ComAtprotoIdentityResolveHandle.HandlerInput,
      ComAtprotoIdentityResolveHandle.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.resolveHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  signPlcOperation<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentitySignPlcOperation.QueryParams,
      ComAtprotoIdentitySignPlcOperation.HandlerInput,
      ComAtprotoIdentitySignPlcOperation.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.signPlcOperation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  submitPlcOperation<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentitySubmitPlcOperation.QueryParams,
      ComAtprotoIdentitySubmitPlcOperation.HandlerInput,
      ComAtprotoIdentitySubmitPlcOperation.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.submitPlcOperation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateHandle<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityUpdateHandle.QueryParams,
      ComAtprotoIdentityUpdateHandle.HandlerInput,
      ComAtprotoIdentityUpdateHandle.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.updateHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoLabelNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  queryLabels<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoLabelQueryLabels.QueryParams,
      ComAtprotoLabelQueryLabels.HandlerInput,
      ComAtprotoLabelQueryLabels.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.label.queryLabels"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  subscribeLabels<A extends Auth = void>(
    cfg: StreamConfigOrHandler<
      A,
      ComAtprotoLabelSubscribeLabels.QueryParams,
      ComAtprotoLabelSubscribeLabels.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.label.subscribeLabels"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.streamMethod(nsid, cfg);
  }
}

export class ComAtprotoLexiconNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class ComAtprotoModerationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  createReport<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoModerationCreateReport.QueryParams,
      ComAtprotoModerationCreateReport.HandlerInput,
      ComAtprotoModerationCreateReport.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.moderation.createReport"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoRepoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  applyWrites<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoApplyWrites.QueryParams,
      ComAtprotoRepoApplyWrites.HandlerInput,
      ComAtprotoRepoApplyWrites.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.applyWrites"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createRecord<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoCreateRecord.QueryParams,
      ComAtprotoRepoCreateRecord.HandlerInput,
      ComAtprotoRepoCreateRecord.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.createRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteRecord<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoDeleteRecord.QueryParams,
      ComAtprotoRepoDeleteRecord.HandlerInput,
      ComAtprotoRepoDeleteRecord.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.deleteRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  describeRepo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoDescribeRepo.QueryParams,
      ComAtprotoRepoDescribeRepo.HandlerInput,
      ComAtprotoRepoDescribeRepo.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.describeRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoGetRecord.QueryParams,
      ComAtprotoRepoGetRecord.HandlerInput,
      ComAtprotoRepoGetRecord.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.getRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  importRepo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoImportRepo.QueryParams,
      ComAtprotoRepoImportRepo.HandlerInput,
      ComAtprotoRepoImportRepo.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.importRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listMissingBlobs<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoListMissingBlobs.QueryParams,
      ComAtprotoRepoListMissingBlobs.HandlerInput,
      ComAtprotoRepoListMissingBlobs.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.listMissingBlobs"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listRecords<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoListRecords.QueryParams,
      ComAtprotoRepoListRecords.HandlerInput,
      ComAtprotoRepoListRecords.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.listRecords"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putRecord<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoPutRecord.QueryParams,
      ComAtprotoRepoPutRecord.HandlerInput,
      ComAtprotoRepoPutRecord.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.putRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadBlob<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoUploadBlob.QueryParams,
      ComAtprotoRepoUploadBlob.HandlerInput,
      ComAtprotoRepoUploadBlob.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.uploadBlob"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoServerNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  activateAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerActivateAccount.QueryParams,
      ComAtprotoServerActivateAccount.HandlerInput,
      ComAtprotoServerActivateAccount.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.activateAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  checkAccountStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerCheckAccountStatus.QueryParams,
      ComAtprotoServerCheckAccountStatus.HandlerInput,
      ComAtprotoServerCheckAccountStatus.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.checkAccountStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  confirmEmail<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerConfirmEmail.QueryParams,
      ComAtprotoServerConfirmEmail.HandlerInput,
      ComAtprotoServerConfirmEmail.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.confirmEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerCreateAccount.QueryParams,
      ComAtprotoServerCreateAccount.HandlerInput,
      ComAtprotoServerCreateAccount.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.createAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createAppPassword<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerCreateAppPassword.QueryParams,
      ComAtprotoServerCreateAppPassword.HandlerInput,
      ComAtprotoServerCreateAppPassword.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.createAppPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createInviteCode<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerCreateInviteCode.QueryParams,
      ComAtprotoServerCreateInviteCode.HandlerInput,
      ComAtprotoServerCreateInviteCode.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.createInviteCode"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createInviteCodes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerCreateInviteCodes.QueryParams,
      ComAtprotoServerCreateInviteCodes.HandlerInput,
      ComAtprotoServerCreateInviteCodes.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.createInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  createSession<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerCreateSession.QueryParams,
      ComAtprotoServerCreateSession.HandlerInput,
      ComAtprotoServerCreateSession.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.createSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deactivateAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerDeactivateAccount.QueryParams,
      ComAtprotoServerDeactivateAccount.HandlerInput,
      ComAtprotoServerDeactivateAccount.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.deactivateAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerDeleteAccount.QueryParams,
      ComAtprotoServerDeleteAccount.HandlerInput,
      ComAtprotoServerDeleteAccount.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.deleteAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteSession<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerDeleteSession.QueryParams,
      ComAtprotoServerDeleteSession.HandlerInput,
      ComAtprotoServerDeleteSession.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.deleteSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  describeServer<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerDescribeServer.QueryParams,
      ComAtprotoServerDescribeServer.HandlerInput,
      ComAtprotoServerDescribeServer.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.describeServer"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountInviteCodes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerGetAccountInviteCodes.QueryParams,
      ComAtprotoServerGetAccountInviteCodes.HandlerInput,
      ComAtprotoServerGetAccountInviteCodes.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.getAccountInviteCodes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getServiceAuth<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerGetServiceAuth.QueryParams,
      ComAtprotoServerGetServiceAuth.HandlerInput,
      ComAtprotoServerGetServiceAuth.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.getServiceAuth"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSession<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerGetSession.QueryParams,
      ComAtprotoServerGetSession.HandlerInput,
      ComAtprotoServerGetSession.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.getSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listAppPasswords<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerListAppPasswords.QueryParams,
      ComAtprotoServerListAppPasswords.HandlerInput,
      ComAtprotoServerListAppPasswords.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.listAppPasswords"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  refreshSession<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerRefreshSession.QueryParams,
      ComAtprotoServerRefreshSession.HandlerInput,
      ComAtprotoServerRefreshSession.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.refreshSession"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestAccountDelete<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerRequestAccountDelete.QueryParams,
      ComAtprotoServerRequestAccountDelete.HandlerInput,
      ComAtprotoServerRequestAccountDelete.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.requestAccountDelete"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestEmailConfirmation<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerRequestEmailConfirmation.QueryParams,
      ComAtprotoServerRequestEmailConfirmation.HandlerInput,
      ComAtprotoServerRequestEmailConfirmation.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.requestEmailConfirmation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestEmailUpdate<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerRequestEmailUpdate.QueryParams,
      ComAtprotoServerRequestEmailUpdate.HandlerInput,
      ComAtprotoServerRequestEmailUpdate.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.requestEmailUpdate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPasswordReset<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerRequestPasswordReset.QueryParams,
      ComAtprotoServerRequestPasswordReset.HandlerInput,
      ComAtprotoServerRequestPasswordReset.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.requestPasswordReset"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  reserveSigningKey<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerReserveSigningKey.QueryParams,
      ComAtprotoServerReserveSigningKey.HandlerInput,
      ComAtprotoServerReserveSigningKey.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.reserveSigningKey"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  resetPassword<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerResetPassword.QueryParams,
      ComAtprotoServerResetPassword.HandlerInput,
      ComAtprotoServerResetPassword.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.resetPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  revokeAppPassword<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerRevokeAppPassword.QueryParams,
      ComAtprotoServerRevokeAppPassword.HandlerInput,
      ComAtprotoServerRevokeAppPassword.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.revokeAppPassword"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateEmail<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerUpdateEmail.QueryParams,
      ComAtprotoServerUpdateEmail.HandlerInput,
      ComAtprotoServerUpdateEmail.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.updateEmail"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoSyncNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getBlob<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetBlob.QueryParams,
      ComAtprotoSyncGetBlob.HandlerInput,
      ComAtprotoSyncGetBlob.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getBlob"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetBlocks.QueryParams,
      ComAtprotoSyncGetBlocks.HandlerInput,
      ComAtprotoSyncGetBlocks.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getCheckout<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetCheckout.QueryParams,
      ComAtprotoSyncGetCheckout.HandlerInput,
      ComAtprotoSyncGetCheckout.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getCheckout"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getHead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetHead.QueryParams,
      ComAtprotoSyncGetHead.HandlerInput,
      ComAtprotoSyncGetHead.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getHead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLatestCommit<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetLatestCommit.QueryParams,
      ComAtprotoSyncGetLatestCommit.HandlerInput,
      ComAtprotoSyncGetLatestCommit.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getLatestCommit"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetRecord.QueryParams,
      ComAtprotoSyncGetRecord.HandlerInput,
      ComAtprotoSyncGetRecord.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetRepo.QueryParams,
      ComAtprotoSyncGetRepo.HandlerInput,
      ComAtprotoSyncGetRepo.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepoStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetRepoStatus.QueryParams,
      ComAtprotoSyncGetRepoStatus.HandlerInput,
      ComAtprotoSyncGetRepoStatus.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getRepoStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listBlobs<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncListBlobs.QueryParams,
      ComAtprotoSyncListBlobs.HandlerInput,
      ComAtprotoSyncListBlobs.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.listBlobs"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listRepos<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncListRepos.QueryParams,
      ComAtprotoSyncListRepos.HandlerInput,
      ComAtprotoSyncListRepos.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.listRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listReposByCollection<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncListReposByCollection.QueryParams,
      ComAtprotoSyncListReposByCollection.HandlerInput,
      ComAtprotoSyncListReposByCollection.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.listReposByCollection"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  notifyOfUpdate<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncNotifyOfUpdate.QueryParams,
      ComAtprotoSyncNotifyOfUpdate.HandlerInput,
      ComAtprotoSyncNotifyOfUpdate.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.notifyOfUpdate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestCrawl<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncRequestCrawl.QueryParams,
      ComAtprotoSyncRequestCrawl.HandlerInput,
      ComAtprotoSyncRequestCrawl.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.requestCrawl"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  subscribeRepos<A extends Auth = void>(
    cfg: StreamConfigOrHandler<
      A,
      ComAtprotoSyncSubscribeRepos.QueryParams,
      ComAtprotoSyncSubscribeRepos.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.subscribeRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.streamMethod(nsid, cfg);
  }
}

export class ComAtprotoTempNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  addReservedHandle<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempAddReservedHandle.QueryParams,
      ComAtprotoTempAddReservedHandle.HandlerInput,
      ComAtprotoTempAddReservedHandle.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.addReservedHandle"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  checkSignupQueue<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempCheckSignupQueue.QueryParams,
      ComAtprotoTempCheckSignupQueue.HandlerInput,
      ComAtprotoTempCheckSignupQueue.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.checkSignupQueue"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  fetchLabels<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempFetchLabels.QueryParams,
      ComAtprotoTempFetchLabels.HandlerInput,
      ComAtprotoTempFetchLabels.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.fetchLabels"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  requestPhoneVerification<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempRequestPhoneVerification.QueryParams,
      ComAtprotoTempRequestPhoneVerification.HandlerInput,
      ComAtprotoTempRequestPhoneVerification.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.requestPhoneVerification"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoNS {
  _server: Server;
  sprk: SoSprkNS;

  constructor(server: Server) {
    this._server = server;
    this.sprk = new SoSprkNS(server);
  }
}

export class SoSprkNS {
  _server: Server;
  actor: SoSprkActorNS;
  embed: SoSprkEmbedNS;
  feed: SoSprkFeedNS;
  graph: SoSprkGraphNS;
  labeler: SoSprkLabelerNS;
  notification: SoSprkNotificationNS;
  richtext: SoSprkRichtextNS;
  unspecced: SoSprkUnspeccedNS;
  video: SoSprkVideoNS;

  constructor(server: Server) {
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

export class SoSprkActorNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getProfile<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorGetProfile.QueryParams,
      SoSprkActorGetProfile.HandlerInput,
      SoSprkActorGetProfile.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.getProfile"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfiles<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorGetProfiles.QueryParams,
      SoSprkActorGetProfiles.HandlerInput,
      SoSprkActorGetProfiles.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.getProfiles"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorGetSuggestions.QueryParams,
      SoSprkActorGetSuggestions.HandlerInput,
      SoSprkActorGetSuggestions.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.getSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActors<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorSearchActors.QueryParams,
      SoSprkActorSearchActors.HandlerInput,
      SoSprkActorSearchActors.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.searchActors"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsTypeahead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorSearchActorsTypeahead.QueryParams,
      SoSprkActorSearchActorsTypeahead.HandlerInput,
      SoSprkActorSearchActorsTypeahead.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.searchActorsTypeahead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorGetPreferences.QueryParams,
      SoSprkActorGetPreferences.HandlerInput,
      SoSprkActorGetPreferences.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.getPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorPutPreferences.QueryParams,
      SoSprkActorPutPreferences.HandlerInput,
      SoSprkActorPutPreferences.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkEmbedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class SoSprkFeedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  describeFeedGenerator<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedDescribeFeedGenerator.QueryParams,
      SoSprkFeedDescribeFeedGenerator.HandlerInput,
      SoSprkFeedDescribeFeedGenerator.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.describeFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorFeeds<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetActorFeeds.QueryParams,
      SoSprkFeedGetActorFeeds.HandlerInput,
      SoSprkFeedGetActorFeeds.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getActorFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLikes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetActorLikes.QueryParams,
      SoSprkFeedGetActorLikes.HandlerInput,
      SoSprkFeedGetActorLikes.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getActorLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAuthorFeed<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetAuthorFeed.QueryParams,
      SoSprkFeedGetAuthorFeed.HandlerInput,
      SoSprkFeedGetAuthorFeed.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getAuthorFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeed<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetFeed.QueryParams,
      SoSprkFeedGetFeed.HandlerInput,
      SoSprkFeedGetFeed.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerator<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetFeedGenerator.QueryParams,
      SoSprkFeedGetFeedGenerator.HandlerInput,
      SoSprkFeedGetFeedGenerator.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerators<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetFeedGenerators.QueryParams,
      SoSprkFeedGetFeedGenerators.HandlerInput,
      SoSprkFeedGetFeedGenerators.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetFeedSkeleton.QueryParams,
      SoSprkFeedGetFeedSkeleton.HandlerInput,
      SoSprkFeedGetFeedSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getFeedSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLikes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetLikes.QueryParams,
      SoSprkFeedGetLikes.HandlerInput,
      SoSprkFeedGetLikes.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListFeed<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetListFeed.QueryParams,
      SoSprkFeedGetListFeed.HandlerInput,
      SoSprkFeedGetListFeed.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getListFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostThread<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetPostThread.QueryParams,
      SoSprkFeedGetPostThread.HandlerInput,
      SoSprkFeedGetPostThread.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getPostThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPosts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetPosts.QueryParams,
      SoSprkFeedGetPosts.HandlerInput,
      SoSprkFeedGetPosts.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getQuotes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetQuotes.QueryParams,
      SoSprkFeedGetQuotes.HandlerInput,
      SoSprkFeedGetQuotes.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getQuotes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepostedBy<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetRepostedBy.QueryParams,
      SoSprkFeedGetRepostedBy.HandlerInput,
      SoSprkFeedGetRepostedBy.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getRepostedBy"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFeeds<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetSuggestedFeeds.QueryParams,
      SoSprkFeedGetSuggestedFeeds.HandlerInput,
      SoSprkFeedGetSuggestedFeeds.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getSuggestedFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTimeline<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetTimeline.QueryParams,
      SoSprkFeedGetTimeline.HandlerInput,
      SoSprkFeedGetTimeline.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getTimeline"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendInteractions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedSendInteractions.QueryParams,
      SoSprkFeedSendInteractions.HandlerInput,
      SoSprkFeedSendInteractions.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.sendInteractions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLooks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetActorLooks.QueryParams,
      SoSprkFeedGetActorLooks.HandlerInput,
      SoSprkFeedGetActorLooks.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getActorLooks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLooks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetLooks.QueryParams,
      SoSprkFeedGetLooks.HandlerInput,
      SoSprkFeedGetLooks.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getLooks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStories<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetStories.QueryParams,
      SoSprkFeedGetStories.HandlerInput,
      SoSprkFeedGetStories.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getStories"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStoriesTimeline<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetStoriesTimeline.QueryParams,
      SoSprkFeedGetStoriesTimeline.HandlerInput,
      SoSprkFeedGetStoriesTimeline.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getStoriesTimeline"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPosts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedSearchPosts.QueryParams,
      SoSprkFeedSearchPosts.HandlerInput,
      SoSprkFeedSearchPosts.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.searchPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorAudios<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetActorAudios.QueryParams,
      SoSprkFeedGetActorAudios.HandlerInput,
      SoSprkFeedGetActorAudios.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getActorAudios"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAudios<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetAudios.QueryParams,
      SoSprkFeedGetAudios.HandlerInput,
      SoSprkFeedGetAudios.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getAudios"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostsByAudio<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetPostsByAudio.QueryParams,
      SoSprkFeedGetPostsByAudio.HandlerInput,
      SoSprkFeedGetPostsByAudio.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getPostsByAudio"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkGraphNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getActorStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetActorStarterPacks.QueryParams,
      SoSprkGraphGetActorStarterPacks.HandlerInput,
      SoSprkGraphGetActorStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getActorStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetBlocks.QueryParams,
      SoSprkGraphGetBlocks.HandlerInput,
      SoSprkGraphGetBlocks.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollowers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetFollowers.QueryParams,
      SoSprkGraphGetFollowers.HandlerInput,
      SoSprkGraphGetFollowers.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollows<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetFollows.QueryParams,
      SoSprkGraphGetFollows.HandlerInput,
      SoSprkGraphGetFollows.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getFollows"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getKnownFollowers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetKnownFollowers.QueryParams,
      SoSprkGraphGetKnownFollowers.HandlerInput,
      SoSprkGraphGetKnownFollowers.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getKnownFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getList<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetList.QueryParams,
      SoSprkGraphGetList.HandlerInput,
      SoSprkGraphGetList.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListBlocks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetListBlocks.QueryParams,
      SoSprkGraphGetListBlocks.HandlerInput,
      SoSprkGraphGetListBlocks.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getListBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListMutes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetListMutes.QueryParams,
      SoSprkGraphGetListMutes.HandlerInput,
      SoSprkGraphGetListMutes.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getListMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLists<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetLists.QueryParams,
      SoSprkGraphGetLists.HandlerInput,
      SoSprkGraphGetLists.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getLists"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMutes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetMutes.QueryParams,
      SoSprkGraphGetMutes.HandlerInput,
      SoSprkGraphGetMutes.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRelationships<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetRelationships.QueryParams,
      SoSprkGraphGetRelationships.HandlerInput,
      SoSprkGraphGetRelationships.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getRelationships"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPack<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetStarterPack.QueryParams,
      SoSprkGraphGetStarterPack.HandlerInput,
      SoSprkGraphGetStarterPack.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getStarterPack"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetStarterPacks.QueryParams,
      SoSprkGraphGetStarterPacks.HandlerInput,
      SoSprkGraphGetStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFollowsByActor<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetSuggestedFollowsByActor.QueryParams,
      SoSprkGraphGetSuggestedFollowsByActor.HandlerInput,
      SoSprkGraphGetSuggestedFollowsByActor.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getSuggestedFollowsByActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActor<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphMuteActor.QueryParams,
      SoSprkGraphMuteActor.HandlerInput,
      SoSprkGraphMuteActor.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.muteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActorList<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphMuteActorList.QueryParams,
      SoSprkGraphMuteActorList.HandlerInput,
      SoSprkGraphMuteActorList.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.muteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteThread<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphMuteThread.QueryParams,
      SoSprkGraphMuteThread.HandlerInput,
      SoSprkGraphMuteThread.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.muteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphSearchStarterPacks.QueryParams,
      SoSprkGraphSearchStarterPacks.HandlerInput,
      SoSprkGraphSearchStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.searchStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActor<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphUnmuteActor.QueryParams,
      SoSprkGraphUnmuteActor.HandlerInput,
      SoSprkGraphUnmuteActor.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActorList<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphUnmuteActorList.QueryParams,
      SoSprkGraphUnmuteActorList.HandlerInput,
      SoSprkGraphUnmuteActorList.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteThread<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphUnmuteThread.QueryParams,
      SoSprkGraphUnmuteThread.HandlerInput,
      SoSprkGraphUnmuteThread.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.unmuteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkLabelerNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getServices<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkLabelerGetServices.QueryParams,
      SoSprkLabelerGetServices.HandlerInput,
      SoSprkLabelerGetServices.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.labeler.getServices"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkNotificationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getUnreadCount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationGetUnreadCount.QueryParams,
      SoSprkNotificationGetUnreadCount.HandlerInput,
      SoSprkNotificationGetUnreadCount.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.getUnreadCount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listNotifications<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationListNotifications.QueryParams,
      SoSprkNotificationListNotifications.HandlerInput,
      SoSprkNotificationListNotifications.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.listNotifications"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationPutPreferences.QueryParams,
      SoSprkNotificationPutPreferences.HandlerInput,
      SoSprkNotificationPutPreferences.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  registerPush<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationRegisterPush.QueryParams,
      SoSprkNotificationRegisterPush.HandlerInput,
      SoSprkNotificationRegisterPush.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.registerPush"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSeen<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationUpdateSeen.QueryParams,
      SoSprkNotificationUpdateSeen.HandlerInput,
      SoSprkNotificationUpdateSeen.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.updateSeen"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkRichtextNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class SoSprkUnspeccedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getConfig<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedGetConfig.QueryParams,
      SoSprkUnspeccedGetConfig.HandlerInput,
      SoSprkUnspeccedGetConfig.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.getConfig"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPopularFeedGenerators<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedGetPopularFeedGenerators.QueryParams,
      SoSprkUnspeccedGetPopularFeedGenerators.HandlerInput,
      SoSprkUnspeccedGetPopularFeedGenerators.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.getPopularFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestionsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedGetSuggestionsSkeleton.QueryParams,
      SoSprkUnspeccedGetSuggestionsSkeleton.HandlerInput,
      SoSprkUnspeccedGetSuggestionsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.getSuggestionsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTaggedSuggestions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedGetTaggedSuggestions.QueryParams,
      SoSprkUnspeccedGetTaggedSuggestions.HandlerInput,
      SoSprkUnspeccedGetTaggedSuggestions.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.getTaggedSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrendingTopics<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedGetTrendingTopics.QueryParams,
      SoSprkUnspeccedGetTrendingTopics.HandlerInput,
      SoSprkUnspeccedGetTrendingTopics.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.getTrendingTopics"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedSearchActorsSkeleton.QueryParams,
      SoSprkUnspeccedSearchActorsSkeleton.HandlerInput,
      SoSprkUnspeccedSearchActorsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchActorsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPostsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedSearchPostsSkeleton.QueryParams,
      SoSprkUnspeccedSearchPostsSkeleton.HandlerInput,
      SoSprkUnspeccedSearchPostsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchPostsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacksSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkUnspeccedSearchStarterPacksSkeleton.QueryParams,
      SoSprkUnspeccedSearchStarterPacksSkeleton.HandlerInput,
      SoSprkUnspeccedSearchStarterPacksSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.unspecced.searchStarterPacksSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkVideoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getJobStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkVideoGetJobStatus.QueryParams,
      SoSprkVideoGetJobStatus.HandlerInput,
      SoSprkVideoGetJobStatus.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.video.getJobStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getUploadLimits<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkVideoGetUploadLimits.QueryParams,
      SoSprkVideoGetUploadLimits.HandlerInput,
      SoSprkVideoGetUploadLimits.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.video.getUploadLimits"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadVideo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkVideoUploadVideo.QueryParams,
      SoSprkVideoUploadVideo.HandlerInput,
      SoSprkVideoUploadVideo.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.video.uploadVideo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppNS {
  _server: Server;
  bsky: AppBskyNS;

  constructor(server: Server) {
    this._server = server;
    this.bsky = new AppBskyNS(server);
  }
}

export class AppBskyNS {
  _server: Server;
  actor: AppBskyActorNS;
  embed: AppBskyEmbedNS;
  feed: AppBskyFeedNS;
  graph: AppBskyGraphNS;
  labeler: AppBskyLabelerNS;
  notification: AppBskyNotificationNS;
  richtext: AppBskyRichtextNS;
  unspecced: AppBskyUnspeccedNS;
  video: AppBskyVideoNS;

  constructor(server: Server) {
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

export class AppBskyActorNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorGetPreferences.QueryParams,
      AppBskyActorGetPreferences.HandlerInput,
      AppBskyActorGetPreferences.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.getPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfile<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorGetProfile.QueryParams,
      AppBskyActorGetProfile.HandlerInput,
      AppBskyActorGetProfile.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.getProfile"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfiles<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorGetProfiles.QueryParams,
      AppBskyActorGetProfiles.HandlerInput,
      AppBskyActorGetProfiles.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.getProfiles"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorGetSuggestions.QueryParams,
      AppBskyActorGetSuggestions.HandlerInput,
      AppBskyActorGetSuggestions.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.getSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorPutPreferences.QueryParams,
      AppBskyActorPutPreferences.HandlerInput,
      AppBskyActorPutPreferences.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActors<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorSearchActors.QueryParams,
      AppBskyActorSearchActors.HandlerInput,
      AppBskyActorSearchActors.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.searchActors"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsTypeahead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorSearchActorsTypeahead.QueryParams,
      AppBskyActorSearchActorsTypeahead.HandlerInput,
      AppBskyActorSearchActorsTypeahead.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.searchActorsTypeahead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyEmbedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class AppBskyFeedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  describeFeedGenerator<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedDescribeFeedGenerator.QueryParams,
      AppBskyFeedDescribeFeedGenerator.HandlerInput,
      AppBskyFeedDescribeFeedGenerator.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.describeFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorFeeds<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetActorFeeds.QueryParams,
      AppBskyFeedGetActorFeeds.HandlerInput,
      AppBskyFeedGetActorFeeds.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getActorFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorLikes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetActorLikes.QueryParams,
      AppBskyFeedGetActorLikes.HandlerInput,
      AppBskyFeedGetActorLikes.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getActorLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getAuthorFeed<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetAuthorFeed.QueryParams,
      AppBskyFeedGetAuthorFeed.HandlerInput,
      AppBskyFeedGetAuthorFeed.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getAuthorFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeed<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetFeed.QueryParams,
      AppBskyFeedGetFeed.HandlerInput,
      AppBskyFeedGetFeed.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerator<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetFeedGenerator.QueryParams,
      AppBskyFeedGetFeedGenerator.HandlerInput,
      AppBskyFeedGetFeedGenerator.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getFeedGenerator"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedGenerators<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetFeedGenerators.QueryParams,
      AppBskyFeedGetFeedGenerators.HandlerInput,
      AppBskyFeedGetFeedGenerators.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFeedSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetFeedSkeleton.QueryParams,
      AppBskyFeedGetFeedSkeleton.HandlerInput,
      AppBskyFeedGetFeedSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getFeedSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLikes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetLikes.QueryParams,
      AppBskyFeedGetLikes.HandlerInput,
      AppBskyFeedGetLikes.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getLikes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListFeed<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetListFeed.QueryParams,
      AppBskyFeedGetListFeed.HandlerInput,
      AppBskyFeedGetListFeed.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getListFeed"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostThread<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetPostThread.QueryParams,
      AppBskyFeedGetPostThread.HandlerInput,
      AppBskyFeedGetPostThread.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getPostThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPosts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetPosts.QueryParams,
      AppBskyFeedGetPosts.HandlerInput,
      AppBskyFeedGetPosts.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getQuotes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetQuotes.QueryParams,
      AppBskyFeedGetQuotes.HandlerInput,
      AppBskyFeedGetQuotes.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getQuotes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepostedBy<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetRepostedBy.QueryParams,
      AppBskyFeedGetRepostedBy.HandlerInput,
      AppBskyFeedGetRepostedBy.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getRepostedBy"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFeeds<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetSuggestedFeeds.QueryParams,
      AppBskyFeedGetSuggestedFeeds.HandlerInput,
      AppBskyFeedGetSuggestedFeeds.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getSuggestedFeeds"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTimeline<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedGetTimeline.QueryParams,
      AppBskyFeedGetTimeline.HandlerInput,
      AppBskyFeedGetTimeline.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.getTimeline"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPosts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedSearchPosts.QueryParams,
      AppBskyFeedSearchPosts.HandlerInput,
      AppBskyFeedSearchPosts.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.searchPosts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendInteractions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedSendInteractions.QueryParams,
      AppBskyFeedSendInteractions.HandlerInput,
      AppBskyFeedSendInteractions.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.sendInteractions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyGraphNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getActorStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetActorStarterPacks.QueryParams,
      AppBskyGraphGetActorStarterPacks.HandlerInput,
      AppBskyGraphGetActorStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getActorStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlocks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetBlocks.QueryParams,
      AppBskyGraphGetBlocks.HandlerInput,
      AppBskyGraphGetBlocks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollowers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetFollowers.QueryParams,
      AppBskyGraphGetFollowers.HandlerInput,
      AppBskyGraphGetFollowers.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getFollows<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetFollows.QueryParams,
      AppBskyGraphGetFollows.HandlerInput,
      AppBskyGraphGetFollows.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getFollows"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getKnownFollowers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetKnownFollowers.QueryParams,
      AppBskyGraphGetKnownFollowers.HandlerInput,
      AppBskyGraphGetKnownFollowers.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getKnownFollowers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getList<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetList.QueryParams,
      AppBskyGraphGetList.HandlerInput,
      AppBskyGraphGetList.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListBlocks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetListBlocks.QueryParams,
      AppBskyGraphGetListBlocks.HandlerInput,
      AppBskyGraphGetListBlocks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getListBlocks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getListMutes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetListMutes.QueryParams,
      AppBskyGraphGetListMutes.HandlerInput,
      AppBskyGraphGetListMutes.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getListMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLists<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetLists.QueryParams,
      AppBskyGraphGetLists.HandlerInput,
      AppBskyGraphGetLists.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getLists"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMutes<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetMutes.QueryParams,
      AppBskyGraphGetMutes.HandlerInput,
      AppBskyGraphGetMutes.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getMutes"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRelationships<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetRelationships.QueryParams,
      AppBskyGraphGetRelationships.HandlerInput,
      AppBskyGraphGetRelationships.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getRelationships"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPack<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetStarterPack.QueryParams,
      AppBskyGraphGetStarterPack.HandlerInput,
      AppBskyGraphGetStarterPack.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getStarterPack"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetStarterPacks.QueryParams,
      AppBskyGraphGetStarterPacks.HandlerInput,
      AppBskyGraphGetStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFollowsByActor<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetSuggestedFollowsByActor.QueryParams,
      AppBskyGraphGetSuggestedFollowsByActor.HandlerInput,
      AppBskyGraphGetSuggestedFollowsByActor.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getSuggestedFollowsByActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActor<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphMuteActor.QueryParams,
      AppBskyGraphMuteActor.HandlerInput,
      AppBskyGraphMuteActor.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.muteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteActorList<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphMuteActorList.QueryParams,
      AppBskyGraphMuteActorList.HandlerInput,
      AppBskyGraphMuteActorList.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.muteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteThread<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphMuteThread.QueryParams,
      AppBskyGraphMuteThread.HandlerInput,
      AppBskyGraphMuteThread.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.muteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphSearchStarterPacks.QueryParams,
      AppBskyGraphSearchStarterPacks.HandlerInput,
      AppBskyGraphSearchStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.searchStarterPacks"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActor<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphUnmuteActor.QueryParams,
      AppBskyGraphUnmuteActor.HandlerInput,
      AppBskyGraphUnmuteActor.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.unmuteActor"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteActorList<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphUnmuteActorList.QueryParams,
      AppBskyGraphUnmuteActorList.HandlerInput,
      AppBskyGraphUnmuteActorList.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.unmuteActorList"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteThread<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphUnmuteThread.QueryParams,
      AppBskyGraphUnmuteThread.HandlerInput,
      AppBskyGraphUnmuteThread.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.unmuteThread"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyLabelerNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getServices<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyLabelerGetServices.QueryParams,
      AppBskyLabelerGetServices.HandlerInput,
      AppBskyLabelerGetServices.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.labeler.getServices"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyNotificationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getUnreadCount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationGetUnreadCount.QueryParams,
      AppBskyNotificationGetUnreadCount.HandlerInput,
      AppBskyNotificationGetUnreadCount.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.getUnreadCount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listNotifications<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationListNotifications.QueryParams,
      AppBskyNotificationListNotifications.HandlerInput,
      AppBskyNotificationListNotifications.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.listNotifications"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationPutPreferences.QueryParams,
      AppBskyNotificationPutPreferences.HandlerInput,
      AppBskyNotificationPutPreferences.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.putPreferences"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  registerPush<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationRegisterPush.QueryParams,
      AppBskyNotificationRegisterPush.HandlerInput,
      AppBskyNotificationRegisterPush.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.registerPush"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateSeen<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationUpdateSeen.QueryParams,
      AppBskyNotificationUpdateSeen.HandlerInput,
      AppBskyNotificationUpdateSeen.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.updateSeen"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyRichtextNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class AppBskyUnspeccedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getConfig<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetConfig.QueryParams,
      AppBskyUnspeccedGetConfig.HandlerInput,
      AppBskyUnspeccedGetConfig.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getConfig"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getPopularFeedGenerators<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetPopularFeedGenerators.QueryParams,
      AppBskyUnspeccedGetPopularFeedGenerators.HandlerInput,
      AppBskyUnspeccedGetPopularFeedGenerators.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getPopularFeedGenerators"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestionsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestionsSkeleton.QueryParams,
      AppBskyUnspeccedGetSuggestionsSkeleton.HandlerInput,
      AppBskyUnspeccedGetSuggestionsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestionsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTaggedSuggestions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetTaggedSuggestions.QueryParams,
      AppBskyUnspeccedGetTaggedSuggestions.HandlerInput,
      AppBskyUnspeccedGetTaggedSuggestions.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getTaggedSuggestions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrendingTopics<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetTrendingTopics.QueryParams,
      AppBskyUnspeccedGetTrendingTopics.HandlerInput,
      AppBskyUnspeccedGetTrendingTopics.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getTrendingTopics"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchActorsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedSearchActorsSkeleton.QueryParams,
      AppBskyUnspeccedSearchActorsSkeleton.HandlerInput,
      AppBskyUnspeccedSearchActorsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.searchActorsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchPostsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedSearchPostsSkeleton.QueryParams,
      AppBskyUnspeccedSearchPostsSkeleton.HandlerInput,
      AppBskyUnspeccedSearchPostsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.searchPostsSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchStarterPacksSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedSearchStarterPacksSkeleton.QueryParams,
      AppBskyUnspeccedSearchStarterPacksSkeleton.HandlerInput,
      AppBskyUnspeccedSearchStarterPacksSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.searchStarterPacksSkeleton"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyVideoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getJobStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyVideoGetJobStatus.QueryParams,
      AppBskyVideoGetJobStatus.HandlerInput,
      AppBskyVideoGetJobStatus.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.video.getJobStatus"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getUploadLimits<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyVideoGetUploadLimits.QueryParams,
      AppBskyVideoGetUploadLimits.HandlerInput,
      AppBskyVideoGetUploadLimits.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.video.getUploadLimits"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  uploadVideo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyVideoUploadVideo.QueryParams,
      AppBskyVideoUploadVideo.HandlerInput,
      AppBskyVideoUploadVideo.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.video.uploadVideo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsNS {
  _server: Server;
  ozone: ToolsOzoneNS;

  constructor(server: Server) {
    this._server = server;
    this.ozone = new ToolsOzoneNS(server);
  }
}

export class ToolsOzoneNS {
  _server: Server;
  communication: ToolsOzoneCommunicationNS;
  moderation: ToolsOzoneModerationNS;
  server: ToolsOzoneServerNS;
  set: ToolsOzoneSetNS;
  setting: ToolsOzoneSettingNS;
  signature: ToolsOzoneSignatureNS;
  team: ToolsOzoneTeamNS;

  constructor(server: Server) {
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

export class ToolsOzoneCommunicationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  createTemplate<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneCommunicationCreateTemplate.QueryParams,
      ToolsOzoneCommunicationCreateTemplate.HandlerInput,
      ToolsOzoneCommunicationCreateTemplate.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.communication.createTemplate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteTemplate<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneCommunicationDeleteTemplate.QueryParams,
      ToolsOzoneCommunicationDeleteTemplate.HandlerInput,
      ToolsOzoneCommunicationDeleteTemplate.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.communication.deleteTemplate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listTemplates<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneCommunicationListTemplates.QueryParams,
      ToolsOzoneCommunicationListTemplates.HandlerInput,
      ToolsOzoneCommunicationListTemplates.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.communication.listTemplates"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateTemplate<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneCommunicationUpdateTemplate.QueryParams,
      ToolsOzoneCommunicationUpdateTemplate.HandlerInput,
      ToolsOzoneCommunicationUpdateTemplate.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.communication.updateTemplate"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneModerationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  emitEvent<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationEmitEvent.QueryParams,
      ToolsOzoneModerationEmitEvent.HandlerInput,
      ToolsOzoneModerationEmitEvent.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.emitEvent"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getEvent<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetEvent.QueryParams,
      ToolsOzoneModerationGetEvent.HandlerInput,
      ToolsOzoneModerationGetEvent.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getEvent"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecord<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetRecord.QueryParams,
      ToolsOzoneModerationGetRecord.HandlerInput,
      ToolsOzoneModerationGetRecord.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRecord"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecords<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetRecords.QueryParams,
      ToolsOzoneModerationGetRecords.HandlerInput,
      ToolsOzoneModerationGetRecords.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRecords"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetRepo.QueryParams,
      ToolsOzoneModerationGetRepo.HandlerInput,
      ToolsOzoneModerationGetRepo.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRepo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getReporterStats<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetReporterStats.QueryParams,
      ToolsOzoneModerationGetReporterStats.HandlerInput,
      ToolsOzoneModerationGetReporterStats.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getReporterStats"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getRepos<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetRepos.QueryParams,
      ToolsOzoneModerationGetRepos.HandlerInput,
      ToolsOzoneModerationGetRepos.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  queryEvents<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationQueryEvents.QueryParams,
      ToolsOzoneModerationQueryEvents.HandlerInput,
      ToolsOzoneModerationQueryEvents.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.queryEvents"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  queryStatuses<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationQueryStatuses.QueryParams,
      ToolsOzoneModerationQueryStatuses.HandlerInput,
      ToolsOzoneModerationQueryStatuses.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.queryStatuses"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchRepos<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationSearchRepos.QueryParams,
      ToolsOzoneModerationSearchRepos.HandlerInput,
      ToolsOzoneModerationSearchRepos.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.searchRepos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneServerNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getConfig<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneServerGetConfig.QueryParams,
      ToolsOzoneServerGetConfig.HandlerInput,
      ToolsOzoneServerGetConfig.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.server.getConfig"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneSetNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  addValues<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSetAddValues.QueryParams,
      ToolsOzoneSetAddValues.HandlerInput,
      ToolsOzoneSetAddValues.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.set.addValues"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteSet<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSetDeleteSet.QueryParams,
      ToolsOzoneSetDeleteSet.HandlerInput,
      ToolsOzoneSetDeleteSet.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.set.deleteSet"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteValues<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSetDeleteValues.QueryParams,
      ToolsOzoneSetDeleteValues.HandlerInput,
      ToolsOzoneSetDeleteValues.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.set.deleteValues"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getValues<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSetGetValues.QueryParams,
      ToolsOzoneSetGetValues.HandlerInput,
      ToolsOzoneSetGetValues.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.set.getValues"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  querySets<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSetQuerySets.QueryParams,
      ToolsOzoneSetQuerySets.HandlerInput,
      ToolsOzoneSetQuerySets.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.set.querySets"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  upsertSet<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSetUpsertSet.QueryParams,
      ToolsOzoneSetUpsertSet.HandlerInput,
      ToolsOzoneSetUpsertSet.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.set.upsertSet"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneSettingNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  listOptions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSettingListOptions.QueryParams,
      ToolsOzoneSettingListOptions.HandlerInput,
      ToolsOzoneSettingListOptions.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.setting.listOptions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  removeOptions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSettingRemoveOptions.QueryParams,
      ToolsOzoneSettingRemoveOptions.HandlerInput,
      ToolsOzoneSettingRemoveOptions.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.setting.removeOptions"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  upsertOption<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSettingUpsertOption.QueryParams,
      ToolsOzoneSettingUpsertOption.HandlerInput,
      ToolsOzoneSettingUpsertOption.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.setting.upsertOption"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneSignatureNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  findCorrelation<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSignatureFindCorrelation.QueryParams,
      ToolsOzoneSignatureFindCorrelation.HandlerInput,
      ToolsOzoneSignatureFindCorrelation.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.signature.findCorrelation"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  findRelatedAccounts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSignatureFindRelatedAccounts.QueryParams,
      ToolsOzoneSignatureFindRelatedAccounts.HandlerInput,
      ToolsOzoneSignatureFindRelatedAccounts.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.signature.findRelatedAccounts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  searchAccounts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSignatureSearchAccounts.QueryParams,
      ToolsOzoneSignatureSearchAccounts.HandlerInput,
      ToolsOzoneSignatureSearchAccounts.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.signature.searchAccounts"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneTeamNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  addMember<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneTeamAddMember.QueryParams,
      ToolsOzoneTeamAddMember.HandlerInput,
      ToolsOzoneTeamAddMember.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.team.addMember"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteMember<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneTeamDeleteMember.QueryParams,
      ToolsOzoneTeamDeleteMember.HandlerInput,
      ToolsOzoneTeamDeleteMember.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.team.deleteMember"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listMembers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneTeamListMembers.QueryParams,
      ToolsOzoneTeamListMembers.HandlerInput,
      ToolsOzoneTeamListMembers.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.team.listMembers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateMember<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneTeamUpdateMember.QueryParams,
      ToolsOzoneTeamUpdateMember.HandlerInput,
      ToolsOzoneTeamUpdateMember.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.team.updateMember"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ChatNS {
  _server: Server;
  bsky: ChatBskyNS;

  constructor(server: Server) {
    this._server = server;
    this.bsky = new ChatBskyNS(server);
  }
}

export class ChatBskyNS {
  _server: Server;
  actor: ChatBskyActorNS;
  convo: ChatBskyConvoNS;
  moderation: ChatBskyModerationNS;

  constructor(server: Server) {
    this._server = server;
    this.actor = new ChatBskyActorNS(server);
    this.convo = new ChatBskyConvoNS(server);
    this.moderation = new ChatBskyModerationNS(server);
  }
}

export class ChatBskyActorNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  deleteAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyActorDeleteAccount.QueryParams,
      ChatBskyActorDeleteAccount.HandlerInput,
      ChatBskyActorDeleteAccount.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.actor.deleteAccount"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  exportAccountData<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyActorExportAccountData.QueryParams,
      ChatBskyActorExportAccountData.HandlerInput,
      ChatBskyActorExportAccountData.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.actor.exportAccountData"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ChatBskyConvoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  acceptConvo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoAcceptConvo.QueryParams,
      ChatBskyConvoAcceptConvo.HandlerInput,
      ChatBskyConvoAcceptConvo.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.acceptConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteMessageForSelf<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoDeleteMessageForSelf.QueryParams,
      ChatBskyConvoDeleteMessageForSelf.HandlerInput,
      ChatBskyConvoDeleteMessageForSelf.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.deleteMessageForSelf"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getConvo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoGetConvo.QueryParams,
      ChatBskyConvoGetConvo.HandlerInput,
      ChatBskyConvoGetConvo.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.getConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getConvoAvailability<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoGetConvoAvailability.QueryParams,
      ChatBskyConvoGetConvoAvailability.HandlerInput,
      ChatBskyConvoGetConvoAvailability.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.getConvoAvailability"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getConvoForMembers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoGetConvoForMembers.QueryParams,
      ChatBskyConvoGetConvoForMembers.HandlerInput,
      ChatBskyConvoGetConvoForMembers.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.getConvoForMembers"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getLog<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoGetLog.QueryParams,
      ChatBskyConvoGetLog.HandlerInput,
      ChatBskyConvoGetLog.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.getLog"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMessages<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoGetMessages.QueryParams,
      ChatBskyConvoGetMessages.HandlerInput,
      ChatBskyConvoGetMessages.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.getMessages"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  leaveConvo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoLeaveConvo.QueryParams,
      ChatBskyConvoLeaveConvo.HandlerInput,
      ChatBskyConvoLeaveConvo.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.leaveConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  listConvos<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoListConvos.QueryParams,
      ChatBskyConvoListConvos.HandlerInput,
      ChatBskyConvoListConvos.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.listConvos"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  muteConvo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoMuteConvo.QueryParams,
      ChatBskyConvoMuteConvo.HandlerInput,
      ChatBskyConvoMuteConvo.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.muteConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendMessage<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoSendMessage.QueryParams,
      ChatBskyConvoSendMessage.HandlerInput,
      ChatBskyConvoSendMessage.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.sendMessage"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  sendMessageBatch<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoSendMessageBatch.QueryParams,
      ChatBskyConvoSendMessageBatch.HandlerInput,
      ChatBskyConvoSendMessageBatch.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.sendMessageBatch"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  unmuteConvo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoUnmuteConvo.QueryParams,
      ChatBskyConvoUnmuteConvo.HandlerInput,
      ChatBskyConvoUnmuteConvo.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.unmuteConvo"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAllRead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoUpdateAllRead.QueryParams,
      ChatBskyConvoUpdateAllRead.HandlerInput,
      ChatBskyConvoUpdateAllRead.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.updateAllRead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateRead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoUpdateRead.QueryParams,
      ChatBskyConvoUpdateRead.HandlerInput,
      ChatBskyConvoUpdateRead.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.updateRead"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ChatBskyModerationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getActorMetadata<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyModerationGetActorMetadata.QueryParams,
      ChatBskyModerationGetActorMetadata.HandlerInput,
      ChatBskyModerationGetActorMetadata.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.moderation.getActorMetadata"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  getMessageContext<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyModerationGetMessageContext.QueryParams,
      ChatBskyModerationGetMessageContext.HandlerInput,
      ChatBskyModerationGetMessageContext.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.moderation.getMessageContext"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }

  updateActorAccess<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyModerationUpdateActorAccess.QueryParams,
      ChatBskyModerationUpdateActorAccess.HandlerInput,
      ChatBskyModerationUpdateActorAccess.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.moderation.updateActorAccess"; // @ts-ignore - userType.nsid is dynamically generated and TypeScript can't infer its type
    return this._server.xrpc.method(nsid, cfg);
  }
}
