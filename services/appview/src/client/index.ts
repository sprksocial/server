/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { XrpcClient, FetchHandler, FetchHandlerOptions } from '@atproto/xrpc'
import { schemas } from './lexicons.js'
import { CID } from 'multiformats/cid'
import { OmitKey, Un$Typed } from './util.js'
import * as ComAtprotoAdminDefs from './types/com/atproto/admin/defs.js'
import * as ComAtprotoAdminDeleteAccount from './types/com/atproto/admin/deleteAccount.js'
import * as ComAtprotoAdminDisableAccountInvites from './types/com/atproto/admin/disableAccountInvites.js'
import * as ComAtprotoAdminDisableInviteCodes from './types/com/atproto/admin/disableInviteCodes.js'
import * as ComAtprotoAdminEnableAccountInvites from './types/com/atproto/admin/enableAccountInvites.js'
import * as ComAtprotoAdminGetAccountInfo from './types/com/atproto/admin/getAccountInfo.js'
import * as ComAtprotoAdminGetAccountInfos from './types/com/atproto/admin/getAccountInfos.js'
import * as ComAtprotoAdminGetInviteCodes from './types/com/atproto/admin/getInviteCodes.js'
import * as ComAtprotoAdminGetSubjectStatus from './types/com/atproto/admin/getSubjectStatus.js'
import * as ComAtprotoAdminSearchAccounts from './types/com/atproto/admin/searchAccounts.js'
import * as ComAtprotoAdminSendEmail from './types/com/atproto/admin/sendEmail.js'
import * as ComAtprotoAdminUpdateAccountEmail from './types/com/atproto/admin/updateAccountEmail.js'
import * as ComAtprotoAdminUpdateAccountHandle from './types/com/atproto/admin/updateAccountHandle.js'
import * as ComAtprotoAdminUpdateAccountPassword from './types/com/atproto/admin/updateAccountPassword.js'
import * as ComAtprotoAdminUpdateSubjectStatus from './types/com/atproto/admin/updateSubjectStatus.js'
import * as ComAtprotoIdentityGetRecommendedDidCredentials from './types/com/atproto/identity/getRecommendedDidCredentials.js'
import * as ComAtprotoIdentityRequestPlcOperationSignature from './types/com/atproto/identity/requestPlcOperationSignature.js'
import * as ComAtprotoIdentityResolveHandle from './types/com/atproto/identity/resolveHandle.js'
import * as ComAtprotoIdentitySignPlcOperation from './types/com/atproto/identity/signPlcOperation.js'
import * as ComAtprotoIdentitySubmitPlcOperation from './types/com/atproto/identity/submitPlcOperation.js'
import * as ComAtprotoIdentityUpdateHandle from './types/com/atproto/identity/updateHandle.js'
import * as ComAtprotoLabelDefs from './types/com/atproto/label/defs.js'
import * as ComAtprotoLabelQueryLabels from './types/com/atproto/label/queryLabels.js'
import * as ComAtprotoLabelSubscribeLabels from './types/com/atproto/label/subscribeLabels.js'
import * as ComAtprotoLexiconSchema from './types/com/atproto/lexicon/schema.js'
import * as ComAtprotoModerationCreateReport from './types/com/atproto/moderation/createReport.js'
import * as ComAtprotoModerationDefs from './types/com/atproto/moderation/defs.js'
import * as ComAtprotoRepoApplyWrites from './types/com/atproto/repo/applyWrites.js'
import * as ComAtprotoRepoCreateRecord from './types/com/atproto/repo/createRecord.js'
import * as ComAtprotoRepoDefs from './types/com/atproto/repo/defs.js'
import * as ComAtprotoRepoDeleteRecord from './types/com/atproto/repo/deleteRecord.js'
import * as ComAtprotoRepoDescribeRepo from './types/com/atproto/repo/describeRepo.js'
import * as ComAtprotoRepoGetRecord from './types/com/atproto/repo/getRecord.js'
import * as ComAtprotoRepoImportRepo from './types/com/atproto/repo/importRepo.js'
import * as ComAtprotoRepoListMissingBlobs from './types/com/atproto/repo/listMissingBlobs.js'
import * as ComAtprotoRepoListRecords from './types/com/atproto/repo/listRecords.js'
import * as ComAtprotoRepoPutRecord from './types/com/atproto/repo/putRecord.js'
import * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef.js'
import * as ComAtprotoRepoUploadBlob from './types/com/atproto/repo/uploadBlob.js'
import * as ComAtprotoServerActivateAccount from './types/com/atproto/server/activateAccount.js'
import * as ComAtprotoServerCheckAccountStatus from './types/com/atproto/server/checkAccountStatus.js'
import * as ComAtprotoServerConfirmEmail from './types/com/atproto/server/confirmEmail.js'
import * as ComAtprotoServerCreateAccount from './types/com/atproto/server/createAccount.js'
import * as ComAtprotoServerCreateAppPassword from './types/com/atproto/server/createAppPassword.js'
import * as ComAtprotoServerCreateInviteCode from './types/com/atproto/server/createInviteCode.js'
import * as ComAtprotoServerCreateInviteCodes from './types/com/atproto/server/createInviteCodes.js'
import * as ComAtprotoServerCreateSession from './types/com/atproto/server/createSession.js'
import * as ComAtprotoServerDeactivateAccount from './types/com/atproto/server/deactivateAccount.js'
import * as ComAtprotoServerDefs from './types/com/atproto/server/defs.js'
import * as ComAtprotoServerDeleteAccount from './types/com/atproto/server/deleteAccount.js'
import * as ComAtprotoServerDeleteSession from './types/com/atproto/server/deleteSession.js'
import * as ComAtprotoServerDescribeServer from './types/com/atproto/server/describeServer.js'
import * as ComAtprotoServerGetAccountInviteCodes from './types/com/atproto/server/getAccountInviteCodes.js'
import * as ComAtprotoServerGetServiceAuth from './types/com/atproto/server/getServiceAuth.js'
import * as ComAtprotoServerGetSession from './types/com/atproto/server/getSession.js'
import * as ComAtprotoServerListAppPasswords from './types/com/atproto/server/listAppPasswords.js'
import * as ComAtprotoServerRefreshSession from './types/com/atproto/server/refreshSession.js'
import * as ComAtprotoServerRequestAccountDelete from './types/com/atproto/server/requestAccountDelete.js'
import * as ComAtprotoServerRequestEmailConfirmation from './types/com/atproto/server/requestEmailConfirmation.js'
import * as ComAtprotoServerRequestEmailUpdate from './types/com/atproto/server/requestEmailUpdate.js'
import * as ComAtprotoServerRequestPasswordReset from './types/com/atproto/server/requestPasswordReset.js'
import * as ComAtprotoServerReserveSigningKey from './types/com/atproto/server/reserveSigningKey.js'
import * as ComAtprotoServerResetPassword from './types/com/atproto/server/resetPassword.js'
import * as ComAtprotoServerRevokeAppPassword from './types/com/atproto/server/revokeAppPassword.js'
import * as ComAtprotoServerUpdateEmail from './types/com/atproto/server/updateEmail.js'
import * as ComAtprotoSyncGetBlob from './types/com/atproto/sync/getBlob.js'
import * as ComAtprotoSyncGetBlocks from './types/com/atproto/sync/getBlocks.js'
import * as ComAtprotoSyncGetCheckout from './types/com/atproto/sync/getCheckout.js'
import * as ComAtprotoSyncGetHead from './types/com/atproto/sync/getHead.js'
import * as ComAtprotoSyncGetLatestCommit from './types/com/atproto/sync/getLatestCommit.js'
import * as ComAtprotoSyncGetRecord from './types/com/atproto/sync/getRecord.js'
import * as ComAtprotoSyncGetRepo from './types/com/atproto/sync/getRepo.js'
import * as ComAtprotoSyncGetRepoStatus from './types/com/atproto/sync/getRepoStatus.js'
import * as ComAtprotoSyncListBlobs from './types/com/atproto/sync/listBlobs.js'
import * as ComAtprotoSyncListReposByCollection from './types/com/atproto/sync/listReposByCollection.js'
import * as ComAtprotoSyncListRepos from './types/com/atproto/sync/listRepos.js'
import * as ComAtprotoSyncNotifyOfUpdate from './types/com/atproto/sync/notifyOfUpdate.js'
import * as ComAtprotoSyncRequestCrawl from './types/com/atproto/sync/requestCrawl.js'
import * as ComAtprotoSyncSubscribeRepos from './types/com/atproto/sync/subscribeRepos.js'
import * as ComAtprotoTempAddReservedHandle from './types/com/atproto/temp/addReservedHandle.js'
import * as ComAtprotoTempCheckSignupQueue from './types/com/atproto/temp/checkSignupQueue.js'
import * as ComAtprotoTempFetchLabels from './types/com/atproto/temp/fetchLabels.js'
import * as ComAtprotoTempRequestPhoneVerification from './types/com/atproto/temp/requestPhoneVerification.js'
import * as SoSprkActorDefs from './types/so/sprk/actor/defs.js'
import * as SoSprkActorGetPreferences from './types/so/sprk/actor/getPreferences.js'
import * as SoSprkActorGetProfile from './types/so/sprk/actor/getProfile.js'
import * as SoSprkActorGetProfiles from './types/so/sprk/actor/getProfiles.js'
import * as SoSprkActorGetSuggestions from './types/so/sprk/actor/getSuggestions.js'
import * as SoSprkActorProfile from './types/so/sprk/actor/profile.js'
import * as SoSprkActorPutPreferences from './types/so/sprk/actor/putPreferences.js'
import * as SoSprkActorSearchActors from './types/so/sprk/actor/searchActors.js'
import * as SoSprkActorSearchActorsTypeahead from './types/so/sprk/actor/searchActorsTypeahead.js'
import * as SoSprkEmbedDefs from './types/so/sprk/embed/defs.js'
import * as SoSprkEmbedImages from './types/so/sprk/embed/images.js'
import * as SoSprkEmbedVideo from './types/so/sprk/embed/video.js'
import * as SoSprkFeedDefs from './types/so/sprk/feed/defs.js'
import * as SoSprkFeedDescribeFeedGenerator from './types/so/sprk/feed/describeFeedGenerator.js'
import * as SoSprkFeedGenerator from './types/so/sprk/feed/generator.js'
import * as SoSprkFeedGetActorFeeds from './types/so/sprk/feed/getActorFeeds.js'
import * as SoSprkFeedGetActorLikes from './types/so/sprk/feed/getActorLikes.js'
import * as SoSprkFeedGetAuthorFeed from './types/so/sprk/feed/getAuthorFeed.js'
import * as SoSprkFeedGetFeedGenerator from './types/so/sprk/feed/getFeedGenerator.js'
import * as SoSprkFeedGetFeedGenerators from './types/so/sprk/feed/getFeedGenerators.js'
import * as SoSprkFeedGetFeed from './types/so/sprk/feed/getFeed.js'
import * as SoSprkFeedGetFeedSkeleton from './types/so/sprk/feed/getFeedSkeleton.js'
import * as SoSprkFeedGetLikes from './types/so/sprk/feed/getLikes.js'
import * as SoSprkFeedGetListFeed from './types/so/sprk/feed/getListFeed.js'
import * as SoSprkFeedGetPosts from './types/so/sprk/feed/getPosts.js'
import * as SoSprkFeedGetPostThread from './types/so/sprk/feed/getPostThread.js'
import * as SoSprkFeedGetQuotes from './types/so/sprk/feed/getQuotes.js'
import * as SoSprkFeedGetRepostedBy from './types/so/sprk/feed/getRepostedBy.js'
import * as SoSprkFeedGetSuggestedFeeds from './types/so/sprk/feed/getSuggestedFeeds.js'
import * as SoSprkFeedGetTimeline from './types/so/sprk/feed/getTimeline.js'
import * as SoSprkFeedLike from './types/so/sprk/feed/like.js'
import * as SoSprkFeedPostgate from './types/so/sprk/feed/postgate.js'
import * as SoSprkFeedPost from './types/so/sprk/feed/post.js'
import * as SoSprkFeedRepost from './types/so/sprk/feed/repost.js'
import * as SoSprkFeedSearchPosts from './types/so/sprk/feed/searchPosts.js'
import * as SoSprkFeedSendInteractions from './types/so/sprk/feed/sendInteractions.js'
import * as SoSprkFeedThreadgate from './types/so/sprk/feed/threadgate.js'
import * as SoSprkGraphBlock from './types/so/sprk/graph/block.js'
import * as SoSprkGraphDefs from './types/so/sprk/graph/defs.js'
import * as SoSprkGraphFollow from './types/so/sprk/graph/follow.js'
import * as SoSprkGraphGetActorStarterPacks from './types/so/sprk/graph/getActorStarterPacks.js'
import * as SoSprkGraphGetBlocks from './types/so/sprk/graph/getBlocks.js'
import * as SoSprkGraphGetFollowers from './types/so/sprk/graph/getFollowers.js'
import * as SoSprkGraphGetFollows from './types/so/sprk/graph/getFollows.js'
import * as SoSprkGraphGetKnownFollowers from './types/so/sprk/graph/getKnownFollowers.js'
import * as SoSprkGraphGetListBlocks from './types/so/sprk/graph/getListBlocks.js'
import * as SoSprkGraphGetList from './types/so/sprk/graph/getList.js'
import * as SoSprkGraphGetListMutes from './types/so/sprk/graph/getListMutes.js'
import * as SoSprkGraphGetLists from './types/so/sprk/graph/getLists.js'
import * as SoSprkGraphGetMutes from './types/so/sprk/graph/getMutes.js'
import * as SoSprkGraphGetRelationships from './types/so/sprk/graph/getRelationships.js'
import * as SoSprkGraphGetStarterPack from './types/so/sprk/graph/getStarterPack.js'
import * as SoSprkGraphGetStarterPacks from './types/so/sprk/graph/getStarterPacks.js'
import * as SoSprkGraphGetSuggestedFollowsByActor from './types/so/sprk/graph/getSuggestedFollowsByActor.js'
import * as SoSprkGraphListblock from './types/so/sprk/graph/listblock.js'
import * as SoSprkGraphListitem from './types/so/sprk/graph/listitem.js'
import * as SoSprkGraphList from './types/so/sprk/graph/list.js'
import * as SoSprkGraphMuteActor from './types/so/sprk/graph/muteActor.js'
import * as SoSprkGraphMuteActorList from './types/so/sprk/graph/muteActorList.js'
import * as SoSprkGraphMuteThread from './types/so/sprk/graph/muteThread.js'
import * as SoSprkGraphSearchStarterPacks from './types/so/sprk/graph/searchStarterPacks.js'
import * as SoSprkGraphStarterpack from './types/so/sprk/graph/starterpack.js'
import * as SoSprkGraphUnmuteActor from './types/so/sprk/graph/unmuteActor.js'
import * as SoSprkGraphUnmuteActorList from './types/so/sprk/graph/unmuteActorList.js'
import * as SoSprkGraphUnmuteThread from './types/so/sprk/graph/unmuteThread.js'
import * as SoSprkLabelerDefs from './types/so/sprk/labeler/defs.js'
import * as SoSprkLabelerGetServices from './types/so/sprk/labeler/getServices.js'
import * as SoSprkLabelerService from './types/so/sprk/labeler/service.js'
import * as SoSprkNotificationGetUnreadCount from './types/so/sprk/notification/getUnreadCount.js'
import * as SoSprkNotificationListNotifications from './types/so/sprk/notification/listNotifications.js'
import * as SoSprkNotificationPutPreferences from './types/so/sprk/notification/putPreferences.js'
import * as SoSprkNotificationRegisterPush from './types/so/sprk/notification/registerPush.js'
import * as SoSprkNotificationUpdateSeen from './types/so/sprk/notification/updateSeen.js'
import * as SoSprkRichtextFacet from './types/so/sprk/richtext/facet.js'
import * as SoSprkUnspeccedDefs from './types/so/sprk/unspecced/defs.js'
import * as SoSprkUnspeccedGetConfig from './types/so/sprk/unspecced/getConfig.js'
import * as SoSprkUnspeccedGetPopularFeedGenerators from './types/so/sprk/unspecced/getPopularFeedGenerators.js'
import * as SoSprkUnspeccedGetSuggestionsSkeleton from './types/so/sprk/unspecced/getSuggestionsSkeleton.js'
import * as SoSprkUnspeccedGetTaggedSuggestions from './types/so/sprk/unspecced/getTaggedSuggestions.js'
import * as SoSprkUnspeccedGetTrendingTopics from './types/so/sprk/unspecced/getTrendingTopics.js'
import * as SoSprkUnspeccedSearchActorsSkeleton from './types/so/sprk/unspecced/searchActorsSkeleton.js'
import * as SoSprkUnspeccedSearchPostsSkeleton from './types/so/sprk/unspecced/searchPostsSkeleton.js'
import * as SoSprkUnspeccedSearchStarterPacksSkeleton from './types/so/sprk/unspecced/searchStarterPacksSkeleton.js'
import * as SoSprkVideoDefs from './types/so/sprk/video/defs.js'
import * as SoSprkVideoGetJobStatus from './types/so/sprk/video/getJobStatus.js'
import * as SoSprkVideoGetUploadLimits from './types/so/sprk/video/getUploadLimits.js'
import * as SoSprkVideoUploadVideo from './types/so/sprk/video/uploadVideo.js'

export * as ComAtprotoAdminDefs from './types/com/atproto/admin/defs.js'
export * as ComAtprotoAdminDeleteAccount from './types/com/atproto/admin/deleteAccount.js'
export * as ComAtprotoAdminDisableAccountInvites from './types/com/atproto/admin/disableAccountInvites.js'
export * as ComAtprotoAdminDisableInviteCodes from './types/com/atproto/admin/disableInviteCodes.js'
export * as ComAtprotoAdminEnableAccountInvites from './types/com/atproto/admin/enableAccountInvites.js'
export * as ComAtprotoAdminGetAccountInfo from './types/com/atproto/admin/getAccountInfo.js'
export * as ComAtprotoAdminGetAccountInfos from './types/com/atproto/admin/getAccountInfos.js'
export * as ComAtprotoAdminGetInviteCodes from './types/com/atproto/admin/getInviteCodes.js'
export * as ComAtprotoAdminGetSubjectStatus from './types/com/atproto/admin/getSubjectStatus.js'
export * as ComAtprotoAdminSearchAccounts from './types/com/atproto/admin/searchAccounts.js'
export * as ComAtprotoAdminSendEmail from './types/com/atproto/admin/sendEmail.js'
export * as ComAtprotoAdminUpdateAccountEmail from './types/com/atproto/admin/updateAccountEmail.js'
export * as ComAtprotoAdminUpdateAccountHandle from './types/com/atproto/admin/updateAccountHandle.js'
export * as ComAtprotoAdminUpdateAccountPassword from './types/com/atproto/admin/updateAccountPassword.js'
export * as ComAtprotoAdminUpdateSubjectStatus from './types/com/atproto/admin/updateSubjectStatus.js'
export * as ComAtprotoIdentityGetRecommendedDidCredentials from './types/com/atproto/identity/getRecommendedDidCredentials.js'
export * as ComAtprotoIdentityRequestPlcOperationSignature from './types/com/atproto/identity/requestPlcOperationSignature.js'
export * as ComAtprotoIdentityResolveHandle from './types/com/atproto/identity/resolveHandle.js'
export * as ComAtprotoIdentitySignPlcOperation from './types/com/atproto/identity/signPlcOperation.js'
export * as ComAtprotoIdentitySubmitPlcOperation from './types/com/atproto/identity/submitPlcOperation.js'
export * as ComAtprotoIdentityUpdateHandle from './types/com/atproto/identity/updateHandle.js'
export * as ComAtprotoLabelDefs from './types/com/atproto/label/defs.js'
export * as ComAtprotoLabelQueryLabels from './types/com/atproto/label/queryLabels.js'
export * as ComAtprotoLabelSubscribeLabels from './types/com/atproto/label/subscribeLabels.js'
export * as ComAtprotoLexiconSchema from './types/com/atproto/lexicon/schema.js'
export * as ComAtprotoModerationCreateReport from './types/com/atproto/moderation/createReport.js'
export * as ComAtprotoModerationDefs from './types/com/atproto/moderation/defs.js'
export * as ComAtprotoRepoApplyWrites from './types/com/atproto/repo/applyWrites.js'
export * as ComAtprotoRepoCreateRecord from './types/com/atproto/repo/createRecord.js'
export * as ComAtprotoRepoDefs from './types/com/atproto/repo/defs.js'
export * as ComAtprotoRepoDeleteRecord from './types/com/atproto/repo/deleteRecord.js'
export * as ComAtprotoRepoDescribeRepo from './types/com/atproto/repo/describeRepo.js'
export * as ComAtprotoRepoGetRecord from './types/com/atproto/repo/getRecord.js'
export * as ComAtprotoRepoImportRepo from './types/com/atproto/repo/importRepo.js'
export * as ComAtprotoRepoListMissingBlobs from './types/com/atproto/repo/listMissingBlobs.js'
export * as ComAtprotoRepoListRecords from './types/com/atproto/repo/listRecords.js'
export * as ComAtprotoRepoPutRecord from './types/com/atproto/repo/putRecord.js'
export * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef.js'
export * as ComAtprotoRepoUploadBlob from './types/com/atproto/repo/uploadBlob.js'
export * as ComAtprotoServerActivateAccount from './types/com/atproto/server/activateAccount.js'
export * as ComAtprotoServerCheckAccountStatus from './types/com/atproto/server/checkAccountStatus.js'
export * as ComAtprotoServerConfirmEmail from './types/com/atproto/server/confirmEmail.js'
export * as ComAtprotoServerCreateAccount from './types/com/atproto/server/createAccount.js'
export * as ComAtprotoServerCreateAppPassword from './types/com/atproto/server/createAppPassword.js'
export * as ComAtprotoServerCreateInviteCode from './types/com/atproto/server/createInviteCode.js'
export * as ComAtprotoServerCreateInviteCodes from './types/com/atproto/server/createInviteCodes.js'
export * as ComAtprotoServerCreateSession from './types/com/atproto/server/createSession.js'
export * as ComAtprotoServerDeactivateAccount from './types/com/atproto/server/deactivateAccount.js'
export * as ComAtprotoServerDefs from './types/com/atproto/server/defs.js'
export * as ComAtprotoServerDeleteAccount from './types/com/atproto/server/deleteAccount.js'
export * as ComAtprotoServerDeleteSession from './types/com/atproto/server/deleteSession.js'
export * as ComAtprotoServerDescribeServer from './types/com/atproto/server/describeServer.js'
export * as ComAtprotoServerGetAccountInviteCodes from './types/com/atproto/server/getAccountInviteCodes.js'
export * as ComAtprotoServerGetServiceAuth from './types/com/atproto/server/getServiceAuth.js'
export * as ComAtprotoServerGetSession from './types/com/atproto/server/getSession.js'
export * as ComAtprotoServerListAppPasswords from './types/com/atproto/server/listAppPasswords.js'
export * as ComAtprotoServerRefreshSession from './types/com/atproto/server/refreshSession.js'
export * as ComAtprotoServerRequestAccountDelete from './types/com/atproto/server/requestAccountDelete.js'
export * as ComAtprotoServerRequestEmailConfirmation from './types/com/atproto/server/requestEmailConfirmation.js'
export * as ComAtprotoServerRequestEmailUpdate from './types/com/atproto/server/requestEmailUpdate.js'
export * as ComAtprotoServerRequestPasswordReset from './types/com/atproto/server/requestPasswordReset.js'
export * as ComAtprotoServerReserveSigningKey from './types/com/atproto/server/reserveSigningKey.js'
export * as ComAtprotoServerResetPassword from './types/com/atproto/server/resetPassword.js'
export * as ComAtprotoServerRevokeAppPassword from './types/com/atproto/server/revokeAppPassword.js'
export * as ComAtprotoServerUpdateEmail from './types/com/atproto/server/updateEmail.js'
export * as ComAtprotoSyncGetBlob from './types/com/atproto/sync/getBlob.js'
export * as ComAtprotoSyncGetBlocks from './types/com/atproto/sync/getBlocks.js'
export * as ComAtprotoSyncGetCheckout from './types/com/atproto/sync/getCheckout.js'
export * as ComAtprotoSyncGetHead from './types/com/atproto/sync/getHead.js'
export * as ComAtprotoSyncGetLatestCommit from './types/com/atproto/sync/getLatestCommit.js'
export * as ComAtprotoSyncGetRecord from './types/com/atproto/sync/getRecord.js'
export * as ComAtprotoSyncGetRepo from './types/com/atproto/sync/getRepo.js'
export * as ComAtprotoSyncGetRepoStatus from './types/com/atproto/sync/getRepoStatus.js'
export * as ComAtprotoSyncListBlobs from './types/com/atproto/sync/listBlobs.js'
export * as ComAtprotoSyncListReposByCollection from './types/com/atproto/sync/listReposByCollection.js'
export * as ComAtprotoSyncListRepos from './types/com/atproto/sync/listRepos.js'
export * as ComAtprotoSyncNotifyOfUpdate from './types/com/atproto/sync/notifyOfUpdate.js'
export * as ComAtprotoSyncRequestCrawl from './types/com/atproto/sync/requestCrawl.js'
export * as ComAtprotoSyncSubscribeRepos from './types/com/atproto/sync/subscribeRepos.js'
export * as ComAtprotoTempAddReservedHandle from './types/com/atproto/temp/addReservedHandle.js'
export * as ComAtprotoTempCheckSignupQueue from './types/com/atproto/temp/checkSignupQueue.js'
export * as ComAtprotoTempFetchLabels from './types/com/atproto/temp/fetchLabels.js'
export * as ComAtprotoTempRequestPhoneVerification from './types/com/atproto/temp/requestPhoneVerification.js'
export * as SoSprkActorDefs from './types/so/sprk/actor/defs.js'
export * as SoSprkActorGetPreferences from './types/so/sprk/actor/getPreferences.js'
export * as SoSprkActorGetProfile from './types/so/sprk/actor/getProfile.js'
export * as SoSprkActorGetProfiles from './types/so/sprk/actor/getProfiles.js'
export * as SoSprkActorGetSuggestions from './types/so/sprk/actor/getSuggestions.js'
export * as SoSprkActorProfile from './types/so/sprk/actor/profile.js'
export * as SoSprkActorPutPreferences from './types/so/sprk/actor/putPreferences.js'
export * as SoSprkActorSearchActors from './types/so/sprk/actor/searchActors.js'
export * as SoSprkActorSearchActorsTypeahead from './types/so/sprk/actor/searchActorsTypeahead.js'
export * as SoSprkEmbedDefs from './types/so/sprk/embed/defs.js'
export * as SoSprkEmbedImages from './types/so/sprk/embed/images.js'
export * as SoSprkEmbedVideo from './types/so/sprk/embed/video.js'
export * as SoSprkFeedDefs from './types/so/sprk/feed/defs.js'
export * as SoSprkFeedDescribeFeedGenerator from './types/so/sprk/feed/describeFeedGenerator.js'
export * as SoSprkFeedGenerator from './types/so/sprk/feed/generator.js'
export * as SoSprkFeedGetActorFeeds from './types/so/sprk/feed/getActorFeeds.js'
export * as SoSprkFeedGetActorLikes from './types/so/sprk/feed/getActorLikes.js'
export * as SoSprkFeedGetAuthorFeed from './types/so/sprk/feed/getAuthorFeed.js'
export * as SoSprkFeedGetFeedGenerator from './types/so/sprk/feed/getFeedGenerator.js'
export * as SoSprkFeedGetFeedGenerators from './types/so/sprk/feed/getFeedGenerators.js'
export * as SoSprkFeedGetFeed from './types/so/sprk/feed/getFeed.js'
export * as SoSprkFeedGetFeedSkeleton from './types/so/sprk/feed/getFeedSkeleton.js'
export * as SoSprkFeedGetLikes from './types/so/sprk/feed/getLikes.js'
export * as SoSprkFeedGetListFeed from './types/so/sprk/feed/getListFeed.js'
export * as SoSprkFeedGetPosts from './types/so/sprk/feed/getPosts.js'
export * as SoSprkFeedGetPostThread from './types/so/sprk/feed/getPostThread.js'
export * as SoSprkFeedGetQuotes from './types/so/sprk/feed/getQuotes.js'
export * as SoSprkFeedGetRepostedBy from './types/so/sprk/feed/getRepostedBy.js'
export * as SoSprkFeedGetSuggestedFeeds from './types/so/sprk/feed/getSuggestedFeeds.js'
export * as SoSprkFeedGetTimeline from './types/so/sprk/feed/getTimeline.js'
export * as SoSprkFeedLike from './types/so/sprk/feed/like.js'
export * as SoSprkFeedPostgate from './types/so/sprk/feed/postgate.js'
export * as SoSprkFeedPost from './types/so/sprk/feed/post.js'
export * as SoSprkFeedRepost from './types/so/sprk/feed/repost.js'
export * as SoSprkFeedSearchPosts from './types/so/sprk/feed/searchPosts.js'
export * as SoSprkFeedSendInteractions from './types/so/sprk/feed/sendInteractions.js'
export * as SoSprkFeedThreadgate from './types/so/sprk/feed/threadgate.js'
export * as SoSprkGraphBlock from './types/so/sprk/graph/block.js'
export * as SoSprkGraphDefs from './types/so/sprk/graph/defs.js'
export * as SoSprkGraphFollow from './types/so/sprk/graph/follow.js'
export * as SoSprkGraphGetActorStarterPacks from './types/so/sprk/graph/getActorStarterPacks.js'
export * as SoSprkGraphGetBlocks from './types/so/sprk/graph/getBlocks.js'
export * as SoSprkGraphGetFollowers from './types/so/sprk/graph/getFollowers.js'
export * as SoSprkGraphGetFollows from './types/so/sprk/graph/getFollows.js'
export * as SoSprkGraphGetKnownFollowers from './types/so/sprk/graph/getKnownFollowers.js'
export * as SoSprkGraphGetListBlocks from './types/so/sprk/graph/getListBlocks.js'
export * as SoSprkGraphGetList from './types/so/sprk/graph/getList.js'
export * as SoSprkGraphGetListMutes from './types/so/sprk/graph/getListMutes.js'
export * as SoSprkGraphGetLists from './types/so/sprk/graph/getLists.js'
export * as SoSprkGraphGetMutes from './types/so/sprk/graph/getMutes.js'
export * as SoSprkGraphGetRelationships from './types/so/sprk/graph/getRelationships.js'
export * as SoSprkGraphGetStarterPack from './types/so/sprk/graph/getStarterPack.js'
export * as SoSprkGraphGetStarterPacks from './types/so/sprk/graph/getStarterPacks.js'
export * as SoSprkGraphGetSuggestedFollowsByActor from './types/so/sprk/graph/getSuggestedFollowsByActor.js'
export * as SoSprkGraphListblock from './types/so/sprk/graph/listblock.js'
export * as SoSprkGraphListitem from './types/so/sprk/graph/listitem.js'
export * as SoSprkGraphList from './types/so/sprk/graph/list.js'
export * as SoSprkGraphMuteActor from './types/so/sprk/graph/muteActor.js'
export * as SoSprkGraphMuteActorList from './types/so/sprk/graph/muteActorList.js'
export * as SoSprkGraphMuteThread from './types/so/sprk/graph/muteThread.js'
export * as SoSprkGraphSearchStarterPacks from './types/so/sprk/graph/searchStarterPacks.js'
export * as SoSprkGraphStarterpack from './types/so/sprk/graph/starterpack.js'
export * as SoSprkGraphUnmuteActor from './types/so/sprk/graph/unmuteActor.js'
export * as SoSprkGraphUnmuteActorList from './types/so/sprk/graph/unmuteActorList.js'
export * as SoSprkGraphUnmuteThread from './types/so/sprk/graph/unmuteThread.js'
export * as SoSprkLabelerDefs from './types/so/sprk/labeler/defs.js'
export * as SoSprkLabelerGetServices from './types/so/sprk/labeler/getServices.js'
export * as SoSprkLabelerService from './types/so/sprk/labeler/service.js'
export * as SoSprkNotificationGetUnreadCount from './types/so/sprk/notification/getUnreadCount.js'
export * as SoSprkNotificationListNotifications from './types/so/sprk/notification/listNotifications.js'
export * as SoSprkNotificationPutPreferences from './types/so/sprk/notification/putPreferences.js'
export * as SoSprkNotificationRegisterPush from './types/so/sprk/notification/registerPush.js'
export * as SoSprkNotificationUpdateSeen from './types/so/sprk/notification/updateSeen.js'
export * as SoSprkRichtextFacet from './types/so/sprk/richtext/facet.js'
export * as SoSprkUnspeccedDefs from './types/so/sprk/unspecced/defs.js'
export * as SoSprkUnspeccedGetConfig from './types/so/sprk/unspecced/getConfig.js'
export * as SoSprkUnspeccedGetPopularFeedGenerators from './types/so/sprk/unspecced/getPopularFeedGenerators.js'
export * as SoSprkUnspeccedGetSuggestionsSkeleton from './types/so/sprk/unspecced/getSuggestionsSkeleton.js'
export * as SoSprkUnspeccedGetTaggedSuggestions from './types/so/sprk/unspecced/getTaggedSuggestions.js'
export * as SoSprkUnspeccedGetTrendingTopics from './types/so/sprk/unspecced/getTrendingTopics.js'
export * as SoSprkUnspeccedSearchActorsSkeleton from './types/so/sprk/unspecced/searchActorsSkeleton.js'
export * as SoSprkUnspeccedSearchPostsSkeleton from './types/so/sprk/unspecced/searchPostsSkeleton.js'
export * as SoSprkUnspeccedSearchStarterPacksSkeleton from './types/so/sprk/unspecced/searchStarterPacksSkeleton.js'
export * as SoSprkVideoDefs from './types/so/sprk/video/defs.js'
export * as SoSprkVideoGetJobStatus from './types/so/sprk/video/getJobStatus.js'
export * as SoSprkVideoGetUploadLimits from './types/so/sprk/video/getUploadLimits.js'
export * as SoSprkVideoUploadVideo from './types/so/sprk/video/uploadVideo.js'

export const COM_ATPROTO_MODERATION = {
  DefsReasonSpam: 'com.atproto.moderation.defs#reasonSpam',
  DefsReasonViolation: 'com.atproto.moderation.defs#reasonViolation',
  DefsReasonMisleading: 'com.atproto.moderation.defs#reasonMisleading',
  DefsReasonSexual: 'com.atproto.moderation.defs#reasonSexual',
  DefsReasonRude: 'com.atproto.moderation.defs#reasonRude',
  DefsReasonOther: 'com.atproto.moderation.defs#reasonOther',
  DefsReasonAppeal: 'com.atproto.moderation.defs#reasonAppeal',
}
export const SO_SPRK_FEED = {
  DefsRequestLess: 'so.sprk.feed.defs#requestLess',
  DefsRequestMore: 'so.sprk.feed.defs#requestMore',
  DefsClickthroughItem: 'so.sprk.feed.defs#clickthroughItem',
  DefsClickthroughAuthor: 'so.sprk.feed.defs#clickthroughAuthor',
  DefsClickthroughReposter: 'so.sprk.feed.defs#clickthroughReposter',
  DefsClickthroughEmbed: 'so.sprk.feed.defs#clickthroughEmbed',
  DefsContentModeUnspecified: 'so.sprk.feed.defs#contentModeUnspecified',
  DefsContentModeVideo: 'so.sprk.feed.defs#contentModeVideo',
  DefsInteractionSeen: 'so.sprk.feed.defs#interactionSeen',
  DefsInteractionLike: 'so.sprk.feed.defs#interactionLike',
  DefsInteractionRepost: 'so.sprk.feed.defs#interactionRepost',
  DefsInteractionReply: 'so.sprk.feed.defs#interactionReply',
  DefsInteractionQuote: 'so.sprk.feed.defs#interactionQuote',
  DefsInteractionShare: 'so.sprk.feed.defs#interactionShare',
}
export const SO_SPRK_GRAPH = {
  DefsModlist: 'so.sprk.graph.defs#modlist',
  DefsCuratelist: 'so.sprk.graph.defs#curatelist',
  DefsReferencelist: 'so.sprk.graph.defs#referencelist',
}

export class AtpBaseClient extends XrpcClient {
  com: ComNS
  so: SoNS

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas)
    this.com = new ComNS(this)
    this.so = new SoNS(this)
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this
  }
}

export class ComNS {
  _client: XrpcClient
  atproto: ComAtprotoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.atproto = new ComAtprotoNS(client)
  }
}

export class ComAtprotoNS {
  _client: XrpcClient
  admin: ComAtprotoAdminNS
  identity: ComAtprotoIdentityNS
  label: ComAtprotoLabelNS
  lexicon: ComAtprotoLexiconNS
  moderation: ComAtprotoModerationNS
  repo: ComAtprotoRepoNS
  server: ComAtprotoServerNS
  sync: ComAtprotoSyncNS
  temp: ComAtprotoTempNS

  constructor(client: XrpcClient) {
    this._client = client
    this.admin = new ComAtprotoAdminNS(client)
    this.identity = new ComAtprotoIdentityNS(client)
    this.label = new ComAtprotoLabelNS(client)
    this.lexicon = new ComAtprotoLexiconNS(client)
    this.moderation = new ComAtprotoModerationNS(client)
    this.repo = new ComAtprotoRepoNS(client)
    this.server = new ComAtprotoServerNS(client)
    this.sync = new ComAtprotoSyncNS(client)
    this.temp = new ComAtprotoTempNS(client)
  }
}

export class ComAtprotoAdminNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  deleteAccount(
    data?: ComAtprotoAdminDeleteAccount.InputSchema,
    opts?: ComAtprotoAdminDeleteAccount.CallOptions,
  ): Promise<ComAtprotoAdminDeleteAccount.Response> {
    return this._client.call(
      'com.atproto.admin.deleteAccount',
      opts?.qp,
      data,
      opts,
    )
  }

  disableAccountInvites(
    data?: ComAtprotoAdminDisableAccountInvites.InputSchema,
    opts?: ComAtprotoAdminDisableAccountInvites.CallOptions,
  ): Promise<ComAtprotoAdminDisableAccountInvites.Response> {
    return this._client.call(
      'com.atproto.admin.disableAccountInvites',
      opts?.qp,
      data,
      opts,
    )
  }

  disableInviteCodes(
    data?: ComAtprotoAdminDisableInviteCodes.InputSchema,
    opts?: ComAtprotoAdminDisableInviteCodes.CallOptions,
  ): Promise<ComAtprotoAdminDisableInviteCodes.Response> {
    return this._client.call(
      'com.atproto.admin.disableInviteCodes',
      opts?.qp,
      data,
      opts,
    )
  }

  enableAccountInvites(
    data?: ComAtprotoAdminEnableAccountInvites.InputSchema,
    opts?: ComAtprotoAdminEnableAccountInvites.CallOptions,
  ): Promise<ComAtprotoAdminEnableAccountInvites.Response> {
    return this._client.call(
      'com.atproto.admin.enableAccountInvites',
      opts?.qp,
      data,
      opts,
    )
  }

  getAccountInfo(
    params?: ComAtprotoAdminGetAccountInfo.QueryParams,
    opts?: ComAtprotoAdminGetAccountInfo.CallOptions,
  ): Promise<ComAtprotoAdminGetAccountInfo.Response> {
    return this._client.call(
      'com.atproto.admin.getAccountInfo',
      params,
      undefined,
      opts,
    )
  }

  getAccountInfos(
    params?: ComAtprotoAdminGetAccountInfos.QueryParams,
    opts?: ComAtprotoAdminGetAccountInfos.CallOptions,
  ): Promise<ComAtprotoAdminGetAccountInfos.Response> {
    return this._client.call(
      'com.atproto.admin.getAccountInfos',
      params,
      undefined,
      opts,
    )
  }

  getInviteCodes(
    params?: ComAtprotoAdminGetInviteCodes.QueryParams,
    opts?: ComAtprotoAdminGetInviteCodes.CallOptions,
  ): Promise<ComAtprotoAdminGetInviteCodes.Response> {
    return this._client.call(
      'com.atproto.admin.getInviteCodes',
      params,
      undefined,
      opts,
    )
  }

  getSubjectStatus(
    params?: ComAtprotoAdminGetSubjectStatus.QueryParams,
    opts?: ComAtprotoAdminGetSubjectStatus.CallOptions,
  ): Promise<ComAtprotoAdminGetSubjectStatus.Response> {
    return this._client.call(
      'com.atproto.admin.getSubjectStatus',
      params,
      undefined,
      opts,
    )
  }

  searchAccounts(
    params?: ComAtprotoAdminSearchAccounts.QueryParams,
    opts?: ComAtprotoAdminSearchAccounts.CallOptions,
  ): Promise<ComAtprotoAdminSearchAccounts.Response> {
    return this._client.call(
      'com.atproto.admin.searchAccounts',
      params,
      undefined,
      opts,
    )
  }

  sendEmail(
    data?: ComAtprotoAdminSendEmail.InputSchema,
    opts?: ComAtprotoAdminSendEmail.CallOptions,
  ): Promise<ComAtprotoAdminSendEmail.Response> {
    return this._client.call(
      'com.atproto.admin.sendEmail',
      opts?.qp,
      data,
      opts,
    )
  }

  updateAccountEmail(
    data?: ComAtprotoAdminUpdateAccountEmail.InputSchema,
    opts?: ComAtprotoAdminUpdateAccountEmail.CallOptions,
  ): Promise<ComAtprotoAdminUpdateAccountEmail.Response> {
    return this._client.call(
      'com.atproto.admin.updateAccountEmail',
      opts?.qp,
      data,
      opts,
    )
  }

  updateAccountHandle(
    data?: ComAtprotoAdminUpdateAccountHandle.InputSchema,
    opts?: ComAtprotoAdminUpdateAccountHandle.CallOptions,
  ): Promise<ComAtprotoAdminUpdateAccountHandle.Response> {
    return this._client.call(
      'com.atproto.admin.updateAccountHandle',
      opts?.qp,
      data,
      opts,
    )
  }

  updateAccountPassword(
    data?: ComAtprotoAdminUpdateAccountPassword.InputSchema,
    opts?: ComAtprotoAdminUpdateAccountPassword.CallOptions,
  ): Promise<ComAtprotoAdminUpdateAccountPassword.Response> {
    return this._client.call(
      'com.atproto.admin.updateAccountPassword',
      opts?.qp,
      data,
      opts,
    )
  }

  updateSubjectStatus(
    data?: ComAtprotoAdminUpdateSubjectStatus.InputSchema,
    opts?: ComAtprotoAdminUpdateSubjectStatus.CallOptions,
  ): Promise<ComAtprotoAdminUpdateSubjectStatus.Response> {
    return this._client.call(
      'com.atproto.admin.updateSubjectStatus',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class ComAtprotoIdentityNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  getRecommendedDidCredentials(
    params?: ComAtprotoIdentityGetRecommendedDidCredentials.QueryParams,
    opts?: ComAtprotoIdentityGetRecommendedDidCredentials.CallOptions,
  ): Promise<ComAtprotoIdentityGetRecommendedDidCredentials.Response> {
    return this._client.call(
      'com.atproto.identity.getRecommendedDidCredentials',
      params,
      undefined,
      opts,
    )
  }

  requestPlcOperationSignature(
    data?: ComAtprotoIdentityRequestPlcOperationSignature.InputSchema,
    opts?: ComAtprotoIdentityRequestPlcOperationSignature.CallOptions,
  ): Promise<ComAtprotoIdentityRequestPlcOperationSignature.Response> {
    return this._client.call(
      'com.atproto.identity.requestPlcOperationSignature',
      opts?.qp,
      data,
      opts,
    )
  }

  resolveHandle(
    params?: ComAtprotoIdentityResolveHandle.QueryParams,
    opts?: ComAtprotoIdentityResolveHandle.CallOptions,
  ): Promise<ComAtprotoIdentityResolveHandle.Response> {
    return this._client.call(
      'com.atproto.identity.resolveHandle',
      params,
      undefined,
      opts,
    )
  }

  signPlcOperation(
    data?: ComAtprotoIdentitySignPlcOperation.InputSchema,
    opts?: ComAtprotoIdentitySignPlcOperation.CallOptions,
  ): Promise<ComAtprotoIdentitySignPlcOperation.Response> {
    return this._client.call(
      'com.atproto.identity.signPlcOperation',
      opts?.qp,
      data,
      opts,
    )
  }

  submitPlcOperation(
    data?: ComAtprotoIdentitySubmitPlcOperation.InputSchema,
    opts?: ComAtprotoIdentitySubmitPlcOperation.CallOptions,
  ): Promise<ComAtprotoIdentitySubmitPlcOperation.Response> {
    return this._client.call(
      'com.atproto.identity.submitPlcOperation',
      opts?.qp,
      data,
      opts,
    )
  }

  updateHandle(
    data?: ComAtprotoIdentityUpdateHandle.InputSchema,
    opts?: ComAtprotoIdentityUpdateHandle.CallOptions,
  ): Promise<ComAtprotoIdentityUpdateHandle.Response> {
    return this._client.call(
      'com.atproto.identity.updateHandle',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class ComAtprotoLabelNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  queryLabels(
    params?: ComAtprotoLabelQueryLabels.QueryParams,
    opts?: ComAtprotoLabelQueryLabels.CallOptions,
  ): Promise<ComAtprotoLabelQueryLabels.Response> {
    return this._client.call(
      'com.atproto.label.queryLabels',
      params,
      undefined,
      opts,
    )
  }
}

export class ComAtprotoLexiconNS {
  _client: XrpcClient
  schema: SchemaRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.schema = new SchemaRecord(client)
  }
}

export class SchemaRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: ComAtprotoLexiconSchema.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'com.atproto.lexicon.schema',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: ComAtprotoLexiconSchema.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'com.atproto.lexicon.schema',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<ComAtprotoLexiconSchema.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'com.atproto.lexicon.schema'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'com.atproto.lexicon.schema', ...params },
      { headers },
    )
  }
}

export class ComAtprotoModerationNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  createReport(
    data?: ComAtprotoModerationCreateReport.InputSchema,
    opts?: ComAtprotoModerationCreateReport.CallOptions,
  ): Promise<ComAtprotoModerationCreateReport.Response> {
    return this._client.call(
      'com.atproto.moderation.createReport',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class ComAtprotoRepoNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  applyWrites(
    data?: ComAtprotoRepoApplyWrites.InputSchema,
    opts?: ComAtprotoRepoApplyWrites.CallOptions,
  ): Promise<ComAtprotoRepoApplyWrites.Response> {
    return this._client
      .call('com.atproto.repo.applyWrites', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoApplyWrites.toKnownErr(e)
      })
  }

  createRecord(
    data?: ComAtprotoRepoCreateRecord.InputSchema,
    opts?: ComAtprotoRepoCreateRecord.CallOptions,
  ): Promise<ComAtprotoRepoCreateRecord.Response> {
    return this._client
      .call('com.atproto.repo.createRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoCreateRecord.toKnownErr(e)
      })
  }

  deleteRecord(
    data?: ComAtprotoRepoDeleteRecord.InputSchema,
    opts?: ComAtprotoRepoDeleteRecord.CallOptions,
  ): Promise<ComAtprotoRepoDeleteRecord.Response> {
    return this._client
      .call('com.atproto.repo.deleteRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoDeleteRecord.toKnownErr(e)
      })
  }

  describeRepo(
    params?: ComAtprotoRepoDescribeRepo.QueryParams,
    opts?: ComAtprotoRepoDescribeRepo.CallOptions,
  ): Promise<ComAtprotoRepoDescribeRepo.Response> {
    return this._client.call(
      'com.atproto.repo.describeRepo',
      params,
      undefined,
      opts,
    )
  }

  getRecord(
    params?: ComAtprotoRepoGetRecord.QueryParams,
    opts?: ComAtprotoRepoGetRecord.CallOptions,
  ): Promise<ComAtprotoRepoGetRecord.Response> {
    return this._client
      .call('com.atproto.repo.getRecord', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoRepoGetRecord.toKnownErr(e)
      })
  }

  importRepo(
    data?: ComAtprotoRepoImportRepo.InputSchema,
    opts?: ComAtprotoRepoImportRepo.CallOptions,
  ): Promise<ComAtprotoRepoImportRepo.Response> {
    return this._client.call(
      'com.atproto.repo.importRepo',
      opts?.qp,
      data,
      opts,
    )
  }

  listMissingBlobs(
    params?: ComAtprotoRepoListMissingBlobs.QueryParams,
    opts?: ComAtprotoRepoListMissingBlobs.CallOptions,
  ): Promise<ComAtprotoRepoListMissingBlobs.Response> {
    return this._client.call(
      'com.atproto.repo.listMissingBlobs',
      params,
      undefined,
      opts,
    )
  }

  listRecords(
    params?: ComAtprotoRepoListRecords.QueryParams,
    opts?: ComAtprotoRepoListRecords.CallOptions,
  ): Promise<ComAtprotoRepoListRecords.Response> {
    return this._client.call(
      'com.atproto.repo.listRecords',
      params,
      undefined,
      opts,
    )
  }

  putRecord(
    data?: ComAtprotoRepoPutRecord.InputSchema,
    opts?: ComAtprotoRepoPutRecord.CallOptions,
  ): Promise<ComAtprotoRepoPutRecord.Response> {
    return this._client
      .call('com.atproto.repo.putRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoPutRecord.toKnownErr(e)
      })
  }

  uploadBlob(
    data?: ComAtprotoRepoUploadBlob.InputSchema,
    opts?: ComAtprotoRepoUploadBlob.CallOptions,
  ): Promise<ComAtprotoRepoUploadBlob.Response> {
    return this._client.call(
      'com.atproto.repo.uploadBlob',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class ComAtprotoServerNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  activateAccount(
    data?: ComAtprotoServerActivateAccount.InputSchema,
    opts?: ComAtprotoServerActivateAccount.CallOptions,
  ): Promise<ComAtprotoServerActivateAccount.Response> {
    return this._client.call(
      'com.atproto.server.activateAccount',
      opts?.qp,
      data,
      opts,
    )
  }

  checkAccountStatus(
    params?: ComAtprotoServerCheckAccountStatus.QueryParams,
    opts?: ComAtprotoServerCheckAccountStatus.CallOptions,
  ): Promise<ComAtprotoServerCheckAccountStatus.Response> {
    return this._client.call(
      'com.atproto.server.checkAccountStatus',
      params,
      undefined,
      opts,
    )
  }

  confirmEmail(
    data?: ComAtprotoServerConfirmEmail.InputSchema,
    opts?: ComAtprotoServerConfirmEmail.CallOptions,
  ): Promise<ComAtprotoServerConfirmEmail.Response> {
    return this._client
      .call('com.atproto.server.confirmEmail', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerConfirmEmail.toKnownErr(e)
      })
  }

  createAccount(
    data?: ComAtprotoServerCreateAccount.InputSchema,
    opts?: ComAtprotoServerCreateAccount.CallOptions,
  ): Promise<ComAtprotoServerCreateAccount.Response> {
    return this._client
      .call('com.atproto.server.createAccount', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerCreateAccount.toKnownErr(e)
      })
  }

  createAppPassword(
    data?: ComAtprotoServerCreateAppPassword.InputSchema,
    opts?: ComAtprotoServerCreateAppPassword.CallOptions,
  ): Promise<ComAtprotoServerCreateAppPassword.Response> {
    return this._client
      .call('com.atproto.server.createAppPassword', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerCreateAppPassword.toKnownErr(e)
      })
  }

  createInviteCode(
    data?: ComAtprotoServerCreateInviteCode.InputSchema,
    opts?: ComAtprotoServerCreateInviteCode.CallOptions,
  ): Promise<ComAtprotoServerCreateInviteCode.Response> {
    return this._client.call(
      'com.atproto.server.createInviteCode',
      opts?.qp,
      data,
      opts,
    )
  }

  createInviteCodes(
    data?: ComAtprotoServerCreateInviteCodes.InputSchema,
    opts?: ComAtprotoServerCreateInviteCodes.CallOptions,
  ): Promise<ComAtprotoServerCreateInviteCodes.Response> {
    return this._client.call(
      'com.atproto.server.createInviteCodes',
      opts?.qp,
      data,
      opts,
    )
  }

  createSession(
    data?: ComAtprotoServerCreateSession.InputSchema,
    opts?: ComAtprotoServerCreateSession.CallOptions,
  ): Promise<ComAtprotoServerCreateSession.Response> {
    return this._client
      .call('com.atproto.server.createSession', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerCreateSession.toKnownErr(e)
      })
  }

  deactivateAccount(
    data?: ComAtprotoServerDeactivateAccount.InputSchema,
    opts?: ComAtprotoServerDeactivateAccount.CallOptions,
  ): Promise<ComAtprotoServerDeactivateAccount.Response> {
    return this._client.call(
      'com.atproto.server.deactivateAccount',
      opts?.qp,
      data,
      opts,
    )
  }

  deleteAccount(
    data?: ComAtprotoServerDeleteAccount.InputSchema,
    opts?: ComAtprotoServerDeleteAccount.CallOptions,
  ): Promise<ComAtprotoServerDeleteAccount.Response> {
    return this._client
      .call('com.atproto.server.deleteAccount', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerDeleteAccount.toKnownErr(e)
      })
  }

  deleteSession(
    data?: ComAtprotoServerDeleteSession.InputSchema,
    opts?: ComAtprotoServerDeleteSession.CallOptions,
  ): Promise<ComAtprotoServerDeleteSession.Response> {
    return this._client.call(
      'com.atproto.server.deleteSession',
      opts?.qp,
      data,
      opts,
    )
  }

  describeServer(
    params?: ComAtprotoServerDescribeServer.QueryParams,
    opts?: ComAtprotoServerDescribeServer.CallOptions,
  ): Promise<ComAtprotoServerDescribeServer.Response> {
    return this._client.call(
      'com.atproto.server.describeServer',
      params,
      undefined,
      opts,
    )
  }

  getAccountInviteCodes(
    params?: ComAtprotoServerGetAccountInviteCodes.QueryParams,
    opts?: ComAtprotoServerGetAccountInviteCodes.CallOptions,
  ): Promise<ComAtprotoServerGetAccountInviteCodes.Response> {
    return this._client
      .call('com.atproto.server.getAccountInviteCodes', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoServerGetAccountInviteCodes.toKnownErr(e)
      })
  }

  getServiceAuth(
    params?: ComAtprotoServerGetServiceAuth.QueryParams,
    opts?: ComAtprotoServerGetServiceAuth.CallOptions,
  ): Promise<ComAtprotoServerGetServiceAuth.Response> {
    return this._client
      .call('com.atproto.server.getServiceAuth', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoServerGetServiceAuth.toKnownErr(e)
      })
  }

  getSession(
    params?: ComAtprotoServerGetSession.QueryParams,
    opts?: ComAtprotoServerGetSession.CallOptions,
  ): Promise<ComAtprotoServerGetSession.Response> {
    return this._client.call(
      'com.atproto.server.getSession',
      params,
      undefined,
      opts,
    )
  }

  listAppPasswords(
    params?: ComAtprotoServerListAppPasswords.QueryParams,
    opts?: ComAtprotoServerListAppPasswords.CallOptions,
  ): Promise<ComAtprotoServerListAppPasswords.Response> {
    return this._client
      .call('com.atproto.server.listAppPasswords', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoServerListAppPasswords.toKnownErr(e)
      })
  }

  refreshSession(
    data?: ComAtprotoServerRefreshSession.InputSchema,
    opts?: ComAtprotoServerRefreshSession.CallOptions,
  ): Promise<ComAtprotoServerRefreshSession.Response> {
    return this._client
      .call('com.atproto.server.refreshSession', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerRefreshSession.toKnownErr(e)
      })
  }

  requestAccountDelete(
    data?: ComAtprotoServerRequestAccountDelete.InputSchema,
    opts?: ComAtprotoServerRequestAccountDelete.CallOptions,
  ): Promise<ComAtprotoServerRequestAccountDelete.Response> {
    return this._client.call(
      'com.atproto.server.requestAccountDelete',
      opts?.qp,
      data,
      opts,
    )
  }

  requestEmailConfirmation(
    data?: ComAtprotoServerRequestEmailConfirmation.InputSchema,
    opts?: ComAtprotoServerRequestEmailConfirmation.CallOptions,
  ): Promise<ComAtprotoServerRequestEmailConfirmation.Response> {
    return this._client.call(
      'com.atproto.server.requestEmailConfirmation',
      opts?.qp,
      data,
      opts,
    )
  }

  requestEmailUpdate(
    data?: ComAtprotoServerRequestEmailUpdate.InputSchema,
    opts?: ComAtprotoServerRequestEmailUpdate.CallOptions,
  ): Promise<ComAtprotoServerRequestEmailUpdate.Response> {
    return this._client.call(
      'com.atproto.server.requestEmailUpdate',
      opts?.qp,
      data,
      opts,
    )
  }

  requestPasswordReset(
    data?: ComAtprotoServerRequestPasswordReset.InputSchema,
    opts?: ComAtprotoServerRequestPasswordReset.CallOptions,
  ): Promise<ComAtprotoServerRequestPasswordReset.Response> {
    return this._client.call(
      'com.atproto.server.requestPasswordReset',
      opts?.qp,
      data,
      opts,
    )
  }

  reserveSigningKey(
    data?: ComAtprotoServerReserveSigningKey.InputSchema,
    opts?: ComAtprotoServerReserveSigningKey.CallOptions,
  ): Promise<ComAtprotoServerReserveSigningKey.Response> {
    return this._client.call(
      'com.atproto.server.reserveSigningKey',
      opts?.qp,
      data,
      opts,
    )
  }

  resetPassword(
    data?: ComAtprotoServerResetPassword.InputSchema,
    opts?: ComAtprotoServerResetPassword.CallOptions,
  ): Promise<ComAtprotoServerResetPassword.Response> {
    return this._client
      .call('com.atproto.server.resetPassword', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerResetPassword.toKnownErr(e)
      })
  }

  revokeAppPassword(
    data?: ComAtprotoServerRevokeAppPassword.InputSchema,
    opts?: ComAtprotoServerRevokeAppPassword.CallOptions,
  ): Promise<ComAtprotoServerRevokeAppPassword.Response> {
    return this._client.call(
      'com.atproto.server.revokeAppPassword',
      opts?.qp,
      data,
      opts,
    )
  }

  updateEmail(
    data?: ComAtprotoServerUpdateEmail.InputSchema,
    opts?: ComAtprotoServerUpdateEmail.CallOptions,
  ): Promise<ComAtprotoServerUpdateEmail.Response> {
    return this._client
      .call('com.atproto.server.updateEmail', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerUpdateEmail.toKnownErr(e)
      })
  }
}

export class ComAtprotoSyncNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  getBlob(
    params?: ComAtprotoSyncGetBlob.QueryParams,
    opts?: ComAtprotoSyncGetBlob.CallOptions,
  ): Promise<ComAtprotoSyncGetBlob.Response> {
    return this._client
      .call('com.atproto.sync.getBlob', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetBlob.toKnownErr(e)
      })
  }

  getBlocks(
    params?: ComAtprotoSyncGetBlocks.QueryParams,
    opts?: ComAtprotoSyncGetBlocks.CallOptions,
  ): Promise<ComAtprotoSyncGetBlocks.Response> {
    return this._client
      .call('com.atproto.sync.getBlocks', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetBlocks.toKnownErr(e)
      })
  }

  getCheckout(
    params?: ComAtprotoSyncGetCheckout.QueryParams,
    opts?: ComAtprotoSyncGetCheckout.CallOptions,
  ): Promise<ComAtprotoSyncGetCheckout.Response> {
    return this._client.call(
      'com.atproto.sync.getCheckout',
      params,
      undefined,
      opts,
    )
  }

  getHead(
    params?: ComAtprotoSyncGetHead.QueryParams,
    opts?: ComAtprotoSyncGetHead.CallOptions,
  ): Promise<ComAtprotoSyncGetHead.Response> {
    return this._client
      .call('com.atproto.sync.getHead', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetHead.toKnownErr(e)
      })
  }

  getLatestCommit(
    params?: ComAtprotoSyncGetLatestCommit.QueryParams,
    opts?: ComAtprotoSyncGetLatestCommit.CallOptions,
  ): Promise<ComAtprotoSyncGetLatestCommit.Response> {
    return this._client
      .call('com.atproto.sync.getLatestCommit', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetLatestCommit.toKnownErr(e)
      })
  }

  getRecord(
    params?: ComAtprotoSyncGetRecord.QueryParams,
    opts?: ComAtprotoSyncGetRecord.CallOptions,
  ): Promise<ComAtprotoSyncGetRecord.Response> {
    return this._client
      .call('com.atproto.sync.getRecord', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetRecord.toKnownErr(e)
      })
  }

  getRepo(
    params?: ComAtprotoSyncGetRepo.QueryParams,
    opts?: ComAtprotoSyncGetRepo.CallOptions,
  ): Promise<ComAtprotoSyncGetRepo.Response> {
    return this._client
      .call('com.atproto.sync.getRepo', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetRepo.toKnownErr(e)
      })
  }

  getRepoStatus(
    params?: ComAtprotoSyncGetRepoStatus.QueryParams,
    opts?: ComAtprotoSyncGetRepoStatus.CallOptions,
  ): Promise<ComAtprotoSyncGetRepoStatus.Response> {
    return this._client
      .call('com.atproto.sync.getRepoStatus', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetRepoStatus.toKnownErr(e)
      })
  }

  listBlobs(
    params?: ComAtprotoSyncListBlobs.QueryParams,
    opts?: ComAtprotoSyncListBlobs.CallOptions,
  ): Promise<ComAtprotoSyncListBlobs.Response> {
    return this._client
      .call('com.atproto.sync.listBlobs', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncListBlobs.toKnownErr(e)
      })
  }

  listReposByCollection(
    params?: ComAtprotoSyncListReposByCollection.QueryParams,
    opts?: ComAtprotoSyncListReposByCollection.CallOptions,
  ): Promise<ComAtprotoSyncListReposByCollection.Response> {
    return this._client.call(
      'com.atproto.sync.listReposByCollection',
      params,
      undefined,
      opts,
    )
  }

  listRepos(
    params?: ComAtprotoSyncListRepos.QueryParams,
    opts?: ComAtprotoSyncListRepos.CallOptions,
  ): Promise<ComAtprotoSyncListRepos.Response> {
    return this._client.call(
      'com.atproto.sync.listRepos',
      params,
      undefined,
      opts,
    )
  }

  notifyOfUpdate(
    data?: ComAtprotoSyncNotifyOfUpdate.InputSchema,
    opts?: ComAtprotoSyncNotifyOfUpdate.CallOptions,
  ): Promise<ComAtprotoSyncNotifyOfUpdate.Response> {
    return this._client.call(
      'com.atproto.sync.notifyOfUpdate',
      opts?.qp,
      data,
      opts,
    )
  }

  requestCrawl(
    data?: ComAtprotoSyncRequestCrawl.InputSchema,
    opts?: ComAtprotoSyncRequestCrawl.CallOptions,
  ): Promise<ComAtprotoSyncRequestCrawl.Response> {
    return this._client.call(
      'com.atproto.sync.requestCrawl',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class ComAtprotoTempNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  addReservedHandle(
    data?: ComAtprotoTempAddReservedHandle.InputSchema,
    opts?: ComAtprotoTempAddReservedHandle.CallOptions,
  ): Promise<ComAtprotoTempAddReservedHandle.Response> {
    return this._client.call(
      'com.atproto.temp.addReservedHandle',
      opts?.qp,
      data,
      opts,
    )
  }

  checkSignupQueue(
    params?: ComAtprotoTempCheckSignupQueue.QueryParams,
    opts?: ComAtprotoTempCheckSignupQueue.CallOptions,
  ): Promise<ComAtprotoTempCheckSignupQueue.Response> {
    return this._client.call(
      'com.atproto.temp.checkSignupQueue',
      params,
      undefined,
      opts,
    )
  }

  fetchLabels(
    params?: ComAtprotoTempFetchLabels.QueryParams,
    opts?: ComAtprotoTempFetchLabels.CallOptions,
  ): Promise<ComAtprotoTempFetchLabels.Response> {
    return this._client.call(
      'com.atproto.temp.fetchLabels',
      params,
      undefined,
      opts,
    )
  }

  requestPhoneVerification(
    data?: ComAtprotoTempRequestPhoneVerification.InputSchema,
    opts?: ComAtprotoTempRequestPhoneVerification.CallOptions,
  ): Promise<ComAtprotoTempRequestPhoneVerification.Response> {
    return this._client.call(
      'com.atproto.temp.requestPhoneVerification',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class SoNS {
  _client: XrpcClient
  sprk: SoSprkNS

  constructor(client: XrpcClient) {
    this._client = client
    this.sprk = new SoSprkNS(client)
  }
}

export class SoSprkNS {
  _client: XrpcClient
  actor: SoSprkActorNS
  embed: SoSprkEmbedNS
  feed: SoSprkFeedNS
  graph: SoSprkGraphNS
  labeler: SoSprkLabelerNS
  notification: SoSprkNotificationNS
  richtext: SoSprkRichtextNS
  unspecced: SoSprkUnspeccedNS
  video: SoSprkVideoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.actor = new SoSprkActorNS(client)
    this.embed = new SoSprkEmbedNS(client)
    this.feed = new SoSprkFeedNS(client)
    this.graph = new SoSprkGraphNS(client)
    this.labeler = new SoSprkLabelerNS(client)
    this.notification = new SoSprkNotificationNS(client)
    this.richtext = new SoSprkRichtextNS(client)
    this.unspecced = new SoSprkUnspeccedNS(client)
    this.video = new SoSprkVideoNS(client)
  }
}

export class SoSprkActorNS {
  _client: XrpcClient
  profile: ProfileRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.profile = new ProfileRecord(client)
  }

  getPreferences(
    params?: SoSprkActorGetPreferences.QueryParams,
    opts?: SoSprkActorGetPreferences.CallOptions,
  ): Promise<SoSprkActorGetPreferences.Response> {
    return this._client.call(
      'so.sprk.actor.getPreferences',
      params,
      undefined,
      opts,
    )
  }

  getProfile(
    params?: SoSprkActorGetProfile.QueryParams,
    opts?: SoSprkActorGetProfile.CallOptions,
  ): Promise<SoSprkActorGetProfile.Response> {
    return this._client.call(
      'so.sprk.actor.getProfile',
      params,
      undefined,
      opts,
    )
  }

  getProfiles(
    params?: SoSprkActorGetProfiles.QueryParams,
    opts?: SoSprkActorGetProfiles.CallOptions,
  ): Promise<SoSprkActorGetProfiles.Response> {
    return this._client.call(
      'so.sprk.actor.getProfiles',
      params,
      undefined,
      opts,
    )
  }

  getSuggestions(
    params?: SoSprkActorGetSuggestions.QueryParams,
    opts?: SoSprkActorGetSuggestions.CallOptions,
  ): Promise<SoSprkActorGetSuggestions.Response> {
    return this._client.call(
      'so.sprk.actor.getSuggestions',
      params,
      undefined,
      opts,
    )
  }

  putPreferences(
    data?: SoSprkActorPutPreferences.InputSchema,
    opts?: SoSprkActorPutPreferences.CallOptions,
  ): Promise<SoSprkActorPutPreferences.Response> {
    return this._client.call(
      'so.sprk.actor.putPreferences',
      opts?.qp,
      data,
      opts,
    )
  }

  searchActors(
    params?: SoSprkActorSearchActors.QueryParams,
    opts?: SoSprkActorSearchActors.CallOptions,
  ): Promise<SoSprkActorSearchActors.Response> {
    return this._client.call(
      'so.sprk.actor.searchActors',
      params,
      undefined,
      opts,
    )
  }

  searchActorsTypeahead(
    params?: SoSprkActorSearchActorsTypeahead.QueryParams,
    opts?: SoSprkActorSearchActorsTypeahead.CallOptions,
  ): Promise<SoSprkActorSearchActorsTypeahead.Response> {
    return this._client.call(
      'so.sprk.actor.searchActorsTypeahead',
      params,
      undefined,
      opts,
    )
  }
}

export class ProfileRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkActorProfile.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.actor.profile',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkActorProfile.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.actor.profile',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkActorProfile.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.actor.profile'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      {
        collection,
        rkey: 'self',
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.actor.profile', ...params },
      { headers },
    )
  }
}

export class SoSprkEmbedNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }
}

export class SoSprkFeedNS {
  _client: XrpcClient
  generator: GeneratorRecord
  like: LikeRecord
  postgate: PostgateRecord
  post: PostRecord
  repost: RepostRecord
  threadgate: ThreadgateRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.generator = new GeneratorRecord(client)
    this.like = new LikeRecord(client)
    this.postgate = new PostgateRecord(client)
    this.post = new PostRecord(client)
    this.repost = new RepostRecord(client)
    this.threadgate = new ThreadgateRecord(client)
  }

  describeFeedGenerator(
    params?: SoSprkFeedDescribeFeedGenerator.QueryParams,
    opts?: SoSprkFeedDescribeFeedGenerator.CallOptions,
  ): Promise<SoSprkFeedDescribeFeedGenerator.Response> {
    return this._client.call(
      'so.sprk.feed.describeFeedGenerator',
      params,
      undefined,
      opts,
    )
  }

  getActorFeeds(
    params?: SoSprkFeedGetActorFeeds.QueryParams,
    opts?: SoSprkFeedGetActorFeeds.CallOptions,
  ): Promise<SoSprkFeedGetActorFeeds.Response> {
    return this._client.call(
      'so.sprk.feed.getActorFeeds',
      params,
      undefined,
      opts,
    )
  }

  getActorLikes(
    params?: SoSprkFeedGetActorLikes.QueryParams,
    opts?: SoSprkFeedGetActorLikes.CallOptions,
  ): Promise<SoSprkFeedGetActorLikes.Response> {
    return this._client
      .call('so.sprk.feed.getActorLikes', params, undefined, opts)
      .catch((e) => {
        throw SoSprkFeedGetActorLikes.toKnownErr(e)
      })
  }

  getAuthorFeed(
    params?: SoSprkFeedGetAuthorFeed.QueryParams,
    opts?: SoSprkFeedGetAuthorFeed.CallOptions,
  ): Promise<SoSprkFeedGetAuthorFeed.Response> {
    return this._client
      .call('so.sprk.feed.getAuthorFeed', params, undefined, opts)
      .catch((e) => {
        throw SoSprkFeedGetAuthorFeed.toKnownErr(e)
      })
  }

  getFeedGenerator(
    params?: SoSprkFeedGetFeedGenerator.QueryParams,
    opts?: SoSprkFeedGetFeedGenerator.CallOptions,
  ): Promise<SoSprkFeedGetFeedGenerator.Response> {
    return this._client.call(
      'so.sprk.feed.getFeedGenerator',
      params,
      undefined,
      opts,
    )
  }

  getFeedGenerators(
    params?: SoSprkFeedGetFeedGenerators.QueryParams,
    opts?: SoSprkFeedGetFeedGenerators.CallOptions,
  ): Promise<SoSprkFeedGetFeedGenerators.Response> {
    return this._client.call(
      'so.sprk.feed.getFeedGenerators',
      params,
      undefined,
      opts,
    )
  }

  getFeed(
    params?: SoSprkFeedGetFeed.QueryParams,
    opts?: SoSprkFeedGetFeed.CallOptions,
  ): Promise<SoSprkFeedGetFeed.Response> {
    return this._client
      .call('so.sprk.feed.getFeed', params, undefined, opts)
      .catch((e) => {
        throw SoSprkFeedGetFeed.toKnownErr(e)
      })
  }

  getFeedSkeleton(
    params?: SoSprkFeedGetFeedSkeleton.QueryParams,
    opts?: SoSprkFeedGetFeedSkeleton.CallOptions,
  ): Promise<SoSprkFeedGetFeedSkeleton.Response> {
    return this._client
      .call('so.sprk.feed.getFeedSkeleton', params, undefined, opts)
      .catch((e) => {
        throw SoSprkFeedGetFeedSkeleton.toKnownErr(e)
      })
  }

  getLikes(
    params?: SoSprkFeedGetLikes.QueryParams,
    opts?: SoSprkFeedGetLikes.CallOptions,
  ): Promise<SoSprkFeedGetLikes.Response> {
    return this._client.call('so.sprk.feed.getLikes', params, undefined, opts)
  }

  getListFeed(
    params?: SoSprkFeedGetListFeed.QueryParams,
    opts?: SoSprkFeedGetListFeed.CallOptions,
  ): Promise<SoSprkFeedGetListFeed.Response> {
    return this._client
      .call('so.sprk.feed.getListFeed', params, undefined, opts)
      .catch((e) => {
        throw SoSprkFeedGetListFeed.toKnownErr(e)
      })
  }

  getPosts(
    params?: SoSprkFeedGetPosts.QueryParams,
    opts?: SoSprkFeedGetPosts.CallOptions,
  ): Promise<SoSprkFeedGetPosts.Response> {
    return this._client.call('so.sprk.feed.getPosts', params, undefined, opts)
  }

  getPostThread(
    params?: SoSprkFeedGetPostThread.QueryParams,
    opts?: SoSprkFeedGetPostThread.CallOptions,
  ): Promise<SoSprkFeedGetPostThread.Response> {
    return this._client
      .call('so.sprk.feed.getPostThread', params, undefined, opts)
      .catch((e) => {
        throw SoSprkFeedGetPostThread.toKnownErr(e)
      })
  }

  getQuotes(
    params?: SoSprkFeedGetQuotes.QueryParams,
    opts?: SoSprkFeedGetQuotes.CallOptions,
  ): Promise<SoSprkFeedGetQuotes.Response> {
    return this._client.call('so.sprk.feed.getQuotes', params, undefined, opts)
  }

  getRepostedBy(
    params?: SoSprkFeedGetRepostedBy.QueryParams,
    opts?: SoSprkFeedGetRepostedBy.CallOptions,
  ): Promise<SoSprkFeedGetRepostedBy.Response> {
    return this._client.call(
      'so.sprk.feed.getRepostedBy',
      params,
      undefined,
      opts,
    )
  }

  getSuggestedFeeds(
    params?: SoSprkFeedGetSuggestedFeeds.QueryParams,
    opts?: SoSprkFeedGetSuggestedFeeds.CallOptions,
  ): Promise<SoSprkFeedGetSuggestedFeeds.Response> {
    return this._client.call(
      'so.sprk.feed.getSuggestedFeeds',
      params,
      undefined,
      opts,
    )
  }

  getTimeline(
    params?: SoSprkFeedGetTimeline.QueryParams,
    opts?: SoSprkFeedGetTimeline.CallOptions,
  ): Promise<SoSprkFeedGetTimeline.Response> {
    return this._client.call(
      'so.sprk.feed.getTimeline',
      params,
      undefined,
      opts,
    )
  }

  searchPosts(
    params?: SoSprkFeedSearchPosts.QueryParams,
    opts?: SoSprkFeedSearchPosts.CallOptions,
  ): Promise<SoSprkFeedSearchPosts.Response> {
    return this._client
      .call('so.sprk.feed.searchPosts', params, undefined, opts)
      .catch((e) => {
        throw SoSprkFeedSearchPosts.toKnownErr(e)
      })
  }

  sendInteractions(
    data?: SoSprkFeedSendInteractions.InputSchema,
    opts?: SoSprkFeedSendInteractions.CallOptions,
  ): Promise<SoSprkFeedSendInteractions.Response> {
    return this._client.call(
      'so.sprk.feed.sendInteractions',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class GeneratorRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkFeedGenerator.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.feed.generator',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkFeedGenerator.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.feed.generator',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkFeedGenerator.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.feed.generator'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.feed.generator', ...params },
      { headers },
    )
  }
}

export class LikeRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkFeedLike.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.feed.like',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkFeedLike.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.feed.like',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkFeedLike.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.feed.like'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.feed.like', ...params },
      { headers },
    )
  }
}

export class PostgateRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkFeedPostgate.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.feed.postgate',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkFeedPostgate.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.feed.postgate',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkFeedPostgate.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.feed.postgate'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.feed.postgate', ...params },
      { headers },
    )
  }
}

export class PostRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkFeedPost.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.feed.post',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkFeedPost.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.feed.post',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkFeedPost.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.feed.post'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.feed.post', ...params },
      { headers },
    )
  }
}

export class RepostRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkFeedRepost.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.feed.repost',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkFeedRepost.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.feed.repost',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkFeedRepost.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.feed.repost'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.feed.repost', ...params },
      { headers },
    )
  }
}

export class ThreadgateRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkFeedThreadgate.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.feed.threadgate',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkFeedThreadgate.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.feed.threadgate',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkFeedThreadgate.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.feed.threadgate'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.feed.threadgate', ...params },
      { headers },
    )
  }
}

export class SoSprkGraphNS {
  _client: XrpcClient
  block: BlockRecord
  follow: FollowRecord
  listblock: ListblockRecord
  listitem: ListitemRecord
  list: ListRecord
  starterpack: StarterpackRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.block = new BlockRecord(client)
    this.follow = new FollowRecord(client)
    this.listblock = new ListblockRecord(client)
    this.listitem = new ListitemRecord(client)
    this.list = new ListRecord(client)
    this.starterpack = new StarterpackRecord(client)
  }

  getActorStarterPacks(
    params?: SoSprkGraphGetActorStarterPacks.QueryParams,
    opts?: SoSprkGraphGetActorStarterPacks.CallOptions,
  ): Promise<SoSprkGraphGetActorStarterPacks.Response> {
    return this._client.call(
      'so.sprk.graph.getActorStarterPacks',
      params,
      undefined,
      opts,
    )
  }

  getBlocks(
    params?: SoSprkGraphGetBlocks.QueryParams,
    opts?: SoSprkGraphGetBlocks.CallOptions,
  ): Promise<SoSprkGraphGetBlocks.Response> {
    return this._client.call('so.sprk.graph.getBlocks', params, undefined, opts)
  }

  getFollowers(
    params?: SoSprkGraphGetFollowers.QueryParams,
    opts?: SoSprkGraphGetFollowers.CallOptions,
  ): Promise<SoSprkGraphGetFollowers.Response> {
    return this._client.call(
      'so.sprk.graph.getFollowers',
      params,
      undefined,
      opts,
    )
  }

  getFollows(
    params?: SoSprkGraphGetFollows.QueryParams,
    opts?: SoSprkGraphGetFollows.CallOptions,
  ): Promise<SoSprkGraphGetFollows.Response> {
    return this._client.call(
      'so.sprk.graph.getFollows',
      params,
      undefined,
      opts,
    )
  }

  getKnownFollowers(
    params?: SoSprkGraphGetKnownFollowers.QueryParams,
    opts?: SoSprkGraphGetKnownFollowers.CallOptions,
  ): Promise<SoSprkGraphGetKnownFollowers.Response> {
    return this._client.call(
      'so.sprk.graph.getKnownFollowers',
      params,
      undefined,
      opts,
    )
  }

  getListBlocks(
    params?: SoSprkGraphGetListBlocks.QueryParams,
    opts?: SoSprkGraphGetListBlocks.CallOptions,
  ): Promise<SoSprkGraphGetListBlocks.Response> {
    return this._client.call(
      'so.sprk.graph.getListBlocks',
      params,
      undefined,
      opts,
    )
  }

  getList(
    params?: SoSprkGraphGetList.QueryParams,
    opts?: SoSprkGraphGetList.CallOptions,
  ): Promise<SoSprkGraphGetList.Response> {
    return this._client.call('so.sprk.graph.getList', params, undefined, opts)
  }

  getListMutes(
    params?: SoSprkGraphGetListMutes.QueryParams,
    opts?: SoSprkGraphGetListMutes.CallOptions,
  ): Promise<SoSprkGraphGetListMutes.Response> {
    return this._client.call(
      'so.sprk.graph.getListMutes',
      params,
      undefined,
      opts,
    )
  }

  getLists(
    params?: SoSprkGraphGetLists.QueryParams,
    opts?: SoSprkGraphGetLists.CallOptions,
  ): Promise<SoSprkGraphGetLists.Response> {
    return this._client.call('so.sprk.graph.getLists', params, undefined, opts)
  }

  getMutes(
    params?: SoSprkGraphGetMutes.QueryParams,
    opts?: SoSprkGraphGetMutes.CallOptions,
  ): Promise<SoSprkGraphGetMutes.Response> {
    return this._client.call('so.sprk.graph.getMutes', params, undefined, opts)
  }

  getRelationships(
    params?: SoSprkGraphGetRelationships.QueryParams,
    opts?: SoSprkGraphGetRelationships.CallOptions,
  ): Promise<SoSprkGraphGetRelationships.Response> {
    return this._client
      .call('so.sprk.graph.getRelationships', params, undefined, opts)
      .catch((e) => {
        throw SoSprkGraphGetRelationships.toKnownErr(e)
      })
  }

  getStarterPack(
    params?: SoSprkGraphGetStarterPack.QueryParams,
    opts?: SoSprkGraphGetStarterPack.CallOptions,
  ): Promise<SoSprkGraphGetStarterPack.Response> {
    return this._client.call(
      'so.sprk.graph.getStarterPack',
      params,
      undefined,
      opts,
    )
  }

  getStarterPacks(
    params?: SoSprkGraphGetStarterPacks.QueryParams,
    opts?: SoSprkGraphGetStarterPacks.CallOptions,
  ): Promise<SoSprkGraphGetStarterPacks.Response> {
    return this._client.call(
      'so.sprk.graph.getStarterPacks',
      params,
      undefined,
      opts,
    )
  }

  getSuggestedFollowsByActor(
    params?: SoSprkGraphGetSuggestedFollowsByActor.QueryParams,
    opts?: SoSprkGraphGetSuggestedFollowsByActor.CallOptions,
  ): Promise<SoSprkGraphGetSuggestedFollowsByActor.Response> {
    return this._client.call(
      'so.sprk.graph.getSuggestedFollowsByActor',
      params,
      undefined,
      opts,
    )
  }

  muteActor(
    data?: SoSprkGraphMuteActor.InputSchema,
    opts?: SoSprkGraphMuteActor.CallOptions,
  ): Promise<SoSprkGraphMuteActor.Response> {
    return this._client.call('so.sprk.graph.muteActor', opts?.qp, data, opts)
  }

  muteActorList(
    data?: SoSprkGraphMuteActorList.InputSchema,
    opts?: SoSprkGraphMuteActorList.CallOptions,
  ): Promise<SoSprkGraphMuteActorList.Response> {
    return this._client.call(
      'so.sprk.graph.muteActorList',
      opts?.qp,
      data,
      opts,
    )
  }

  muteThread(
    data?: SoSprkGraphMuteThread.InputSchema,
    opts?: SoSprkGraphMuteThread.CallOptions,
  ): Promise<SoSprkGraphMuteThread.Response> {
    return this._client.call('so.sprk.graph.muteThread', opts?.qp, data, opts)
  }

  searchStarterPacks(
    params?: SoSprkGraphSearchStarterPacks.QueryParams,
    opts?: SoSprkGraphSearchStarterPacks.CallOptions,
  ): Promise<SoSprkGraphSearchStarterPacks.Response> {
    return this._client.call(
      'so.sprk.graph.searchStarterPacks',
      params,
      undefined,
      opts,
    )
  }

  unmuteActor(
    data?: SoSprkGraphUnmuteActor.InputSchema,
    opts?: SoSprkGraphUnmuteActor.CallOptions,
  ): Promise<SoSprkGraphUnmuteActor.Response> {
    return this._client.call('so.sprk.graph.unmuteActor', opts?.qp, data, opts)
  }

  unmuteActorList(
    data?: SoSprkGraphUnmuteActorList.InputSchema,
    opts?: SoSprkGraphUnmuteActorList.CallOptions,
  ): Promise<SoSprkGraphUnmuteActorList.Response> {
    return this._client.call(
      'so.sprk.graph.unmuteActorList',
      opts?.qp,
      data,
      opts,
    )
  }

  unmuteThread(
    data?: SoSprkGraphUnmuteThread.InputSchema,
    opts?: SoSprkGraphUnmuteThread.CallOptions,
  ): Promise<SoSprkGraphUnmuteThread.Response> {
    return this._client.call('so.sprk.graph.unmuteThread', opts?.qp, data, opts)
  }
}

export class BlockRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkGraphBlock.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.graph.block',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkGraphBlock.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.graph.block',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkGraphBlock.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.graph.block'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.graph.block', ...params },
      { headers },
    )
  }
}

export class FollowRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkGraphFollow.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.graph.follow',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkGraphFollow.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.graph.follow',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkGraphFollow.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.graph.follow'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.graph.follow', ...params },
      { headers },
    )
  }
}

export class ListblockRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkGraphListblock.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.graph.listblock',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkGraphListblock.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.graph.listblock',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkGraphListblock.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.graph.listblock'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.graph.listblock', ...params },
      { headers },
    )
  }
}

export class ListitemRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkGraphListitem.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.graph.listitem',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkGraphListitem.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.graph.listitem',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkGraphListitem.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.graph.listitem'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.graph.listitem', ...params },
      { headers },
    )
  }
}

export class ListRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkGraphList.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.graph.list',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkGraphList.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.graph.list',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkGraphList.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.graph.list'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.graph.list', ...params },
      { headers },
    )
  }
}

export class StarterpackRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkGraphStarterpack.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.graph.starterpack',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: SoSprkGraphStarterpack.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.graph.starterpack',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkGraphStarterpack.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.graph.starterpack'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.graph.starterpack', ...params },
      { headers },
    )
  }
}

export class SoSprkLabelerNS {
  _client: XrpcClient
  service: ServiceRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.service = new ServiceRecord(client)
  }

  getServices(
    params?: SoSprkLabelerGetServices.QueryParams,
    opts?: SoSprkLabelerGetServices.CallOptions,
  ): Promise<SoSprkLabelerGetServices.Response> {
    return this._client.call(
      'so.sprk.labeler.getServices',
      params,
      undefined,
      opts,
    )
  }
}

export class ServiceRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SoSprkLabelerService.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'so.sprk.labeler.service',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SoSprkLabelerService.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'so.sprk.labeler.service',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SoSprkLabelerService.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'so.sprk.labeler.service'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      {
        collection,
        rkey: 'self',
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'so.sprk.labeler.service', ...params },
      { headers },
    )
  }
}

export class SoSprkNotificationNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  getUnreadCount(
    params?: SoSprkNotificationGetUnreadCount.QueryParams,
    opts?: SoSprkNotificationGetUnreadCount.CallOptions,
  ): Promise<SoSprkNotificationGetUnreadCount.Response> {
    return this._client.call(
      'so.sprk.notification.getUnreadCount',
      params,
      undefined,
      opts,
    )
  }

  listNotifications(
    params?: SoSprkNotificationListNotifications.QueryParams,
    opts?: SoSprkNotificationListNotifications.CallOptions,
  ): Promise<SoSprkNotificationListNotifications.Response> {
    return this._client.call(
      'so.sprk.notification.listNotifications',
      params,
      undefined,
      opts,
    )
  }

  putPreferences(
    data?: SoSprkNotificationPutPreferences.InputSchema,
    opts?: SoSprkNotificationPutPreferences.CallOptions,
  ): Promise<SoSprkNotificationPutPreferences.Response> {
    return this._client.call(
      'so.sprk.notification.putPreferences',
      opts?.qp,
      data,
      opts,
    )
  }

  registerPush(
    data?: SoSprkNotificationRegisterPush.InputSchema,
    opts?: SoSprkNotificationRegisterPush.CallOptions,
  ): Promise<SoSprkNotificationRegisterPush.Response> {
    return this._client.call(
      'so.sprk.notification.registerPush',
      opts?.qp,
      data,
      opts,
    )
  }

  updateSeen(
    data?: SoSprkNotificationUpdateSeen.InputSchema,
    opts?: SoSprkNotificationUpdateSeen.CallOptions,
  ): Promise<SoSprkNotificationUpdateSeen.Response> {
    return this._client.call(
      'so.sprk.notification.updateSeen',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class SoSprkRichtextNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }
}

export class SoSprkUnspeccedNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  getConfig(
    params?: SoSprkUnspeccedGetConfig.QueryParams,
    opts?: SoSprkUnspeccedGetConfig.CallOptions,
  ): Promise<SoSprkUnspeccedGetConfig.Response> {
    return this._client.call(
      'so.sprk.unspecced.getConfig',
      params,
      undefined,
      opts,
    )
  }

  getPopularFeedGenerators(
    params?: SoSprkUnspeccedGetPopularFeedGenerators.QueryParams,
    opts?: SoSprkUnspeccedGetPopularFeedGenerators.CallOptions,
  ): Promise<SoSprkUnspeccedGetPopularFeedGenerators.Response> {
    return this._client.call(
      'so.sprk.unspecced.getPopularFeedGenerators',
      params,
      undefined,
      opts,
    )
  }

  getSuggestionsSkeleton(
    params?: SoSprkUnspeccedGetSuggestionsSkeleton.QueryParams,
    opts?: SoSprkUnspeccedGetSuggestionsSkeleton.CallOptions,
  ): Promise<SoSprkUnspeccedGetSuggestionsSkeleton.Response> {
    return this._client.call(
      'so.sprk.unspecced.getSuggestionsSkeleton',
      params,
      undefined,
      opts,
    )
  }

  getTaggedSuggestions(
    params?: SoSprkUnspeccedGetTaggedSuggestions.QueryParams,
    opts?: SoSprkUnspeccedGetTaggedSuggestions.CallOptions,
  ): Promise<SoSprkUnspeccedGetTaggedSuggestions.Response> {
    return this._client.call(
      'so.sprk.unspecced.getTaggedSuggestions',
      params,
      undefined,
      opts,
    )
  }

  getTrendingTopics(
    params?: SoSprkUnspeccedGetTrendingTopics.QueryParams,
    opts?: SoSprkUnspeccedGetTrendingTopics.CallOptions,
  ): Promise<SoSprkUnspeccedGetTrendingTopics.Response> {
    return this._client.call(
      'so.sprk.unspecced.getTrendingTopics',
      params,
      undefined,
      opts,
    )
  }

  searchActorsSkeleton(
    params?: SoSprkUnspeccedSearchActorsSkeleton.QueryParams,
    opts?: SoSprkUnspeccedSearchActorsSkeleton.CallOptions,
  ): Promise<SoSprkUnspeccedSearchActorsSkeleton.Response> {
    return this._client
      .call('so.sprk.unspecced.searchActorsSkeleton', params, undefined, opts)
      .catch((e) => {
        throw SoSprkUnspeccedSearchActorsSkeleton.toKnownErr(e)
      })
  }

  searchPostsSkeleton(
    params?: SoSprkUnspeccedSearchPostsSkeleton.QueryParams,
    opts?: SoSprkUnspeccedSearchPostsSkeleton.CallOptions,
  ): Promise<SoSprkUnspeccedSearchPostsSkeleton.Response> {
    return this._client
      .call('so.sprk.unspecced.searchPostsSkeleton', params, undefined, opts)
      .catch((e) => {
        throw SoSprkUnspeccedSearchPostsSkeleton.toKnownErr(e)
      })
  }

  searchStarterPacksSkeleton(
    params?: SoSprkUnspeccedSearchStarterPacksSkeleton.QueryParams,
    opts?: SoSprkUnspeccedSearchStarterPacksSkeleton.CallOptions,
  ): Promise<SoSprkUnspeccedSearchStarterPacksSkeleton.Response> {
    return this._client
      .call(
        'so.sprk.unspecced.searchStarterPacksSkeleton',
        params,
        undefined,
        opts,
      )
      .catch((e) => {
        throw SoSprkUnspeccedSearchStarterPacksSkeleton.toKnownErr(e)
      })
  }
}

export class SoSprkVideoNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  getJobStatus(
    params?: SoSprkVideoGetJobStatus.QueryParams,
    opts?: SoSprkVideoGetJobStatus.CallOptions,
  ): Promise<SoSprkVideoGetJobStatus.Response> {
    return this._client.call(
      'so.sprk.video.getJobStatus',
      params,
      undefined,
      opts,
    )
  }

  getUploadLimits(
    params?: SoSprkVideoGetUploadLimits.QueryParams,
    opts?: SoSprkVideoGetUploadLimits.CallOptions,
  ): Promise<SoSprkVideoGetUploadLimits.Response> {
    return this._client.call(
      'so.sprk.video.getUploadLimits',
      params,
      undefined,
      opts,
    )
  }

  uploadVideo(
    data?: SoSprkVideoUploadVideo.InputSchema,
    opts?: SoSprkVideoUploadVideo.CallOptions,
  ): Promise<SoSprkVideoUploadVideo.Response> {
    return this._client.call('so.sprk.video.uploadVideo', opts?.qp, data, opts)
  }
}
