/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type Auth,
  createServer as createXrpcServer,
  type MethodConfigOrHandler,
  type Options as XrpcOptions,
  type Server as XrpcServer,
  type StreamConfigOrHandler,
} from "@atp/xrpc-server";
import { schemas } from "./lexicons.ts";
import type * as ToolsOzoneSignatureFindCorrelation from "./types/tools/ozone/signature/findCorrelation.ts";
import type * as ToolsOzoneSignatureSearchAccounts from "./types/tools/ozone/signature/searchAccounts.ts";
import type * as ToolsOzoneSignatureFindRelatedAccounts from "./types/tools/ozone/signature/findRelatedAccounts.ts";
import type * as ToolsOzoneServerGetConfig from "./types/tools/ozone/server/getConfig.ts";
import type * as ToolsOzoneVerificationRevokeVerifications from "./types/tools/ozone/verification/revokeVerifications.ts";
import type * as ToolsOzoneVerificationGrantVerifications from "./types/tools/ozone/verification/grantVerifications.ts";
import type * as ToolsOzoneVerificationListVerifications from "./types/tools/ozone/verification/listVerifications.ts";
import type * as ToolsOzoneSafelinkAddRule from "./types/tools/ozone/safelink/addRule.ts";
import type * as ToolsOzoneSafelinkRemoveRule from "./types/tools/ozone/safelink/removeRule.ts";
import type * as ToolsOzoneSafelinkUpdateRule from "./types/tools/ozone/safelink/updateRule.ts";
import type * as ToolsOzoneSafelinkQueryEvents from "./types/tools/ozone/safelink/queryEvents.ts";
import type * as ToolsOzoneSafelinkQueryRules from "./types/tools/ozone/safelink/queryRules.ts";
import type * as ToolsOzoneTeamListMembers from "./types/tools/ozone/team/listMembers.ts";
import type * as ToolsOzoneTeamDeleteMember from "./types/tools/ozone/team/deleteMember.ts";
import type * as ToolsOzoneTeamUpdateMember from "./types/tools/ozone/team/updateMember.ts";
import type * as ToolsOzoneTeamAddMember from "./types/tools/ozone/team/addMember.ts";
import type * as ToolsOzoneHostingGetAccountHistory from "./types/tools/ozone/hosting/getAccountHistory.ts";
import type * as ToolsOzoneCommunicationUpdateTemplate from "./types/tools/ozone/communication/updateTemplate.ts";
import type * as ToolsOzoneCommunicationCreateTemplate from "./types/tools/ozone/communication/createTemplate.ts";
import type * as ToolsOzoneCommunicationListTemplates from "./types/tools/ozone/communication/listTemplates.ts";
import type * as ToolsOzoneCommunicationDeleteTemplate from "./types/tools/ozone/communication/deleteTemplate.ts";
import type * as ToolsOzoneSetAddValues from "./types/tools/ozone/set/addValues.ts";
import type * as ToolsOzoneSetGetValues from "./types/tools/ozone/set/getValues.ts";
import type * as ToolsOzoneSetDeleteSet from "./types/tools/ozone/set/deleteSet.ts";
import type * as ToolsOzoneSetUpsertSet from "./types/tools/ozone/set/upsertSet.ts";
import type * as ToolsOzoneSetDeleteValues from "./types/tools/ozone/set/deleteValues.ts";
import type * as ToolsOzoneSetQuerySets from "./types/tools/ozone/set/querySets.ts";
import type * as ToolsOzoneSettingListOptions from "./types/tools/ozone/setting/listOptions.ts";
import type * as ToolsOzoneSettingRemoveOptions from "./types/tools/ozone/setting/removeOptions.ts";
import type * as ToolsOzoneSettingUpsertOption from "./types/tools/ozone/setting/upsertOption.ts";
import type * as ToolsOzoneModerationGetReporterStats from "./types/tools/ozone/moderation/getReporterStats.ts";
import type * as ToolsOzoneModerationCancelScheduledActions from "./types/tools/ozone/moderation/cancelScheduledActions.ts";
import type * as ToolsOzoneModerationListScheduledActions from "./types/tools/ozone/moderation/listScheduledActions.ts";
import type * as ToolsOzoneModerationQueryStatuses from "./types/tools/ozone/moderation/queryStatuses.ts";
import type * as ToolsOzoneModerationGetRepo from "./types/tools/ozone/moderation/getRepo.ts";
import type * as ToolsOzoneModerationGetSubjects from "./types/tools/ozone/moderation/getSubjects.ts";
import type * as ToolsOzoneModerationGetRecords from "./types/tools/ozone/moderation/getRecords.ts";
import type * as ToolsOzoneModerationScheduleAction from "./types/tools/ozone/moderation/scheduleAction.ts";
import type * as ToolsOzoneModerationGetEvent from "./types/tools/ozone/moderation/getEvent.ts";
import type * as ToolsOzoneModerationQueryEvents from "./types/tools/ozone/moderation/queryEvents.ts";
import type * as ToolsOzoneModerationGetRecord from "./types/tools/ozone/moderation/getRecord.ts";
import type * as ToolsOzoneModerationEmitEvent from "./types/tools/ozone/moderation/emitEvent.ts";
import type * as ToolsOzoneModerationSearchRepos from "./types/tools/ozone/moderation/searchRepos.ts";
import type * as ToolsOzoneModerationGetAccountTimeline from "./types/tools/ozone/moderation/getAccountTimeline.ts";
import type * as ToolsOzoneModerationGetRepos from "./types/tools/ozone/moderation/getRepos.ts";
import type * as AppBskyDraftCreateDraft from "./types/app/bsky/draft/createDraft.ts";
import type * as AppBskyDraftUpdateDraft from "./types/app/bsky/draft/updateDraft.ts";
import type * as AppBskyDraftGetDrafts from "./types/app/bsky/draft/getDrafts.ts";
import type * as AppBskyDraftDeleteDraft from "./types/app/bsky/draft/deleteDraft.ts";
import type * as AppBskyVideoUploadVideo from "./types/app/bsky/video/uploadVideo.ts";
import type * as AppBskyVideoGetJobStatus from "./types/app/bsky/video/getJobStatus.ts";
import type * as AppBskyVideoGetUploadLimits from "./types/app/bsky/video/getUploadLimits.ts";
import type * as AppBskyContactSendNotification from "./types/app/bsky/contact/sendNotification.ts";
import type * as AppBskyContactGetSyncStatus from "./types/app/bsky/contact/getSyncStatus.ts";
import type * as AppBskyContactStartPhoneVerification from "./types/app/bsky/contact/startPhoneVerification.ts";
import type * as AppBskyContactGetMatches from "./types/app/bsky/contact/getMatches.ts";
import type * as AppBskyContactImportContacts from "./types/app/bsky/contact/importContacts.ts";
import type * as AppBskyContactDismissMatch from "./types/app/bsky/contact/dismissMatch.ts";
import type * as AppBskyContactRemoveData from "./types/app/bsky/contact/removeData.ts";
import type * as AppBskyContactVerifyPhone from "./types/app/bsky/contact/verifyPhone.ts";
import type * as AppBskyBookmarkDeleteBookmark from "./types/app/bsky/bookmark/deleteBookmark.ts";
import type * as AppBskyBookmarkGetBookmarks from "./types/app/bsky/bookmark/getBookmarks.ts";
import type * as AppBskyBookmarkCreateBookmark from "./types/app/bsky/bookmark/createBookmark.ts";
import type * as AppBskyNotificationRegisterPush from "./types/app/bsky/notification/registerPush.ts";
import type * as AppBskyNotificationPutPreferences from "./types/app/bsky/notification/putPreferences.ts";
import type * as AppBskyNotificationPutActivitySubscription from "./types/app/bsky/notification/putActivitySubscription.ts";
import type * as AppBskyNotificationPutPreferencesV2 from "./types/app/bsky/notification/putPreferencesV2.ts";
import type * as AppBskyNotificationUpdateSeen from "./types/app/bsky/notification/updateSeen.ts";
import type * as AppBskyNotificationListActivitySubscriptions from "./types/app/bsky/notification/listActivitySubscriptions.ts";
import type * as AppBskyNotificationUnregisterPush from "./types/app/bsky/notification/unregisterPush.ts";
import type * as AppBskyNotificationGetPreferences from "./types/app/bsky/notification/getPreferences.ts";
import type * as AppBskyNotificationListNotifications from "./types/app/bsky/notification/listNotifications.ts";
import type * as AppBskyNotificationGetUnreadCount from "./types/app/bsky/notification/getUnreadCount.ts";
import type * as AppBskyUnspeccedGetSuggestedFeedsSkeleton from "./types/app/bsky/unspecced/getSuggestedFeedsSkeleton.ts";
import type * as AppBskyUnspeccedSearchStarterPacksSkeleton from "./types/app/bsky/unspecced/searchStarterPacksSkeleton.ts";
import type * as AppBskyUnspeccedGetSuggestedUsersForExplore from "./types/app/bsky/unspecced/getSuggestedUsersForExplore.ts";
import type * as AppBskyUnspeccedGetOnboardingSuggestedStarterPacksSkeleton from "./types/app/bsky/unspecced/getOnboardingSuggestedStarterPacksSkeleton.ts";
import type * as AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton from "./types/app/bsky/unspecced/getSuggestedUsersForExploreSkeleton.ts";
import type * as AppBskyUnspeccedGetSuggestedUsers from "./types/app/bsky/unspecced/getSuggestedUsers.ts";
import type * as AppBskyUnspeccedGetPostThreadOtherV2 from "./types/app/bsky/unspecced/getPostThreadOtherV2.ts";
import type * as AppBskyUnspeccedGetSuggestedStarterPacks from "./types/app/bsky/unspecced/getSuggestedStarterPacks.ts";
import type * as AppBskyUnspeccedGetSuggestedStarterPacksSkeleton from "./types/app/bsky/unspecced/getSuggestedStarterPacksSkeleton.ts";
import type * as AppBskyUnspeccedGetOnboardingSuggestedStarterPacks from "./types/app/bsky/unspecced/getOnboardingSuggestedStarterPacks.ts";
import type * as AppBskyUnspeccedGetSuggestedUsersSkeleton from "./types/app/bsky/unspecced/getSuggestedUsersSkeleton.ts";
import type * as AppBskyUnspeccedGetPostThreadV2 from "./types/app/bsky/unspecced/getPostThreadV2.ts";
import type * as AppBskyUnspeccedGetTrends from "./types/app/bsky/unspecced/getTrends.ts";
import type * as AppBskyUnspeccedSearchActorsSkeleton from "./types/app/bsky/unspecced/searchActorsSkeleton.ts";
import type * as AppBskyUnspeccedGetSuggestionsSkeleton from "./types/app/bsky/unspecced/getSuggestionsSkeleton.ts";
import type * as AppBskyUnspeccedSearchPostsSkeleton from "./types/app/bsky/unspecced/searchPostsSkeleton.ts";
import type * as AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton from "./types/app/bsky/unspecced/getOnboardingSuggestedUsersSkeleton.ts";
import type * as AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton from "./types/app/bsky/unspecced/getSuggestedUsersForDiscoverSkeleton.ts";
import type * as AppBskyUnspeccedGetSuggestedUsersForDiscover from "./types/app/bsky/unspecced/getSuggestedUsersForDiscover.ts";
import type * as AppBskyUnspeccedGetAgeAssuranceState from "./types/app/bsky/unspecced/getAgeAssuranceState.ts";
import type * as AppBskyUnspeccedGetPopularFeedGenerators from "./types/app/bsky/unspecced/getPopularFeedGenerators.ts";
import type * as AppBskyUnspeccedGetSuggestedOnboardingUsers from "./types/app/bsky/unspecced/getSuggestedOnboardingUsers.ts";
import type * as AppBskyUnspeccedGetSuggestedUsersForSeeMore from "./types/app/bsky/unspecced/getSuggestedUsersForSeeMore.ts";
import type * as AppBskyUnspeccedInitAgeAssurance from "./types/app/bsky/unspecced/initAgeAssurance.ts";
import type * as AppBskyUnspeccedGetTrendingTopics from "./types/app/bsky/unspecced/getTrendingTopics.ts";
import type * as AppBskyUnspeccedGetTaggedSuggestions from "./types/app/bsky/unspecced/getTaggedSuggestions.ts";
import type * as AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton from "./types/app/bsky/unspecced/getSuggestedUsersForSeeMoreSkeleton.ts";
import type * as AppBskyUnspeccedGetSuggestedFeeds from "./types/app/bsky/unspecced/getSuggestedFeeds.ts";
import type * as AppBskyUnspeccedGetTrendsSkeleton from "./types/app/bsky/unspecced/getTrendsSkeleton.ts";
import type * as AppBskyUnspeccedGetConfig from "./types/app/bsky/unspecced/getConfig.ts";
import type * as AppBskyGraphGetStarterPacks from "./types/app/bsky/graph/getStarterPacks.ts";
import type * as AppBskyGraphGetSuggestedFollowsByActor from "./types/app/bsky/graph/getSuggestedFollowsByActor.ts";
import type * as AppBskyGraphGetStarterPacksWithMembership from "./types/app/bsky/graph/getStarterPacksWithMembership.ts";
import type * as AppBskyGraphGetListsWithMembership from "./types/app/bsky/graph/getListsWithMembership.ts";
import type * as AppBskyGraphUnmuteActorList from "./types/app/bsky/graph/unmuteActorList.ts";
import type * as AppBskyGraphGetListBlocks from "./types/app/bsky/graph/getListBlocks.ts";
import type * as AppBskyGraphGetStarterPack from "./types/app/bsky/graph/getStarterPack.ts";
import type * as AppBskyGraphMuteActorList from "./types/app/bsky/graph/muteActorList.ts";
import type * as AppBskyGraphMuteThread from "./types/app/bsky/graph/muteThread.ts";
import type * as AppBskyGraphSearchStarterPacks from "./types/app/bsky/graph/searchStarterPacks.ts";
import type * as AppBskyGraphGetActorStarterPacks from "./types/app/bsky/graph/getActorStarterPacks.ts";
import type * as AppBskyGraphGetLists from "./types/app/bsky/graph/getLists.ts";
import type * as AppBskyGraphGetFollowers from "./types/app/bsky/graph/getFollowers.ts";
import type * as AppBskyGraphUnmuteThread from "./types/app/bsky/graph/unmuteThread.ts";
import type * as AppBskyGraphMuteActor from "./types/app/bsky/graph/muteActor.ts";
import type * as AppBskyGraphGetMutes from "./types/app/bsky/graph/getMutes.ts";
import type * as AppBskyGraphGetKnownFollowers from "./types/app/bsky/graph/getKnownFollowers.ts";
import type * as AppBskyGraphGetListMutes from "./types/app/bsky/graph/getListMutes.ts";
import type * as AppBskyGraphGetFollows from "./types/app/bsky/graph/getFollows.ts";
import type * as AppBskyGraphGetBlocks from "./types/app/bsky/graph/getBlocks.ts";
import type * as AppBskyGraphGetRelationships from "./types/app/bsky/graph/getRelationships.ts";
import type * as AppBskyGraphUnmuteActor from "./types/app/bsky/graph/unmuteActor.ts";
import type * as AppBskyGraphGetList from "./types/app/bsky/graph/getList.ts";
import type * as AppBskyFeedSendInteractions from "./types/app/bsky/feed/sendInteractions.ts";
import type * as AppBskyFeedGetFeedGenerators from "./types/app/bsky/feed/getFeedGenerators.ts";
import type * as AppBskyFeedGetTimeline from "./types/app/bsky/feed/getTimeline.ts";
import type * as AppBskyFeedGetFeedGenerator from "./types/app/bsky/feed/getFeedGenerator.ts";
import type * as AppBskyFeedGetAuthorFeed from "./types/app/bsky/feed/getAuthorFeed.ts";
import type * as AppBskyFeedGetLikes from "./types/app/bsky/feed/getLikes.ts";
import type * as AppBskyFeedGetPostThread from "./types/app/bsky/feed/getPostThread.ts";
import type * as AppBskyFeedGetActorLikes from "./types/app/bsky/feed/getActorLikes.ts";
import type * as AppBskyFeedGetRepostedBy from "./types/app/bsky/feed/getRepostedBy.ts";
import type * as AppBskyFeedDescribeFeedGenerator from "./types/app/bsky/feed/describeFeedGenerator.ts";
import type * as AppBskyFeedSearchPosts from "./types/app/bsky/feed/searchPosts.ts";
import type * as AppBskyFeedGetPosts from "./types/app/bsky/feed/getPosts.ts";
import type * as AppBskyFeedGetFeed from "./types/app/bsky/feed/getFeed.ts";
import type * as AppBskyFeedGetQuotes from "./types/app/bsky/feed/getQuotes.ts";
import type * as AppBskyFeedGetFeedSkeleton from "./types/app/bsky/feed/getFeedSkeleton.ts";
import type * as AppBskyFeedGetListFeed from "./types/app/bsky/feed/getListFeed.ts";
import type * as AppBskyFeedGetSuggestedFeeds from "./types/app/bsky/feed/getSuggestedFeeds.ts";
import type * as AppBskyFeedGetActorFeeds from "./types/app/bsky/feed/getActorFeeds.ts";
import type * as AppBskyAgeassuranceBegin from "./types/app/bsky/ageassurance/begin.ts";
import type * as AppBskyAgeassuranceGetState from "./types/app/bsky/ageassurance/getState.ts";
import type * as AppBskyAgeassuranceGetConfig from "./types/app/bsky/ageassurance/getConfig.ts";
import type * as AppBskyActorSearchActorsTypeahead from "./types/app/bsky/actor/searchActorsTypeahead.ts";
import type * as AppBskyActorPutPreferences from "./types/app/bsky/actor/putPreferences.ts";
import type * as AppBskyActorGetProfile from "./types/app/bsky/actor/getProfile.ts";
import type * as AppBskyActorGetSuggestions from "./types/app/bsky/actor/getSuggestions.ts";
import type * as AppBskyActorSearchActors from "./types/app/bsky/actor/searchActors.ts";
import type * as AppBskyActorGetProfiles from "./types/app/bsky/actor/getProfiles.ts";
import type * as AppBskyActorGetPreferences from "./types/app/bsky/actor/getPreferences.ts";
import type * as AppBskyLabelerGetServices from "./types/app/bsky/labeler/getServices.ts";
import type * as ChatBskyConvoListConvos from "./types/chat/bsky/convo/listConvos.ts";
import type * as ChatBskyConvoUnmuteConvo from "./types/chat/bsky/convo/unmuteConvo.ts";
import type * as ChatBskyConvoGetConvoAvailability from "./types/chat/bsky/convo/getConvoAvailability.ts";
import type * as ChatBskyConvoGetLog from "./types/chat/bsky/convo/getLog.ts";
import type * as ChatBskyConvoSendMessage from "./types/chat/bsky/convo/sendMessage.ts";
import type * as ChatBskyConvoLeaveConvo from "./types/chat/bsky/convo/leaveConvo.ts";
import type * as ChatBskyConvoAddReaction from "./types/chat/bsky/convo/addReaction.ts";
import type * as ChatBskyConvoAcceptConvo from "./types/chat/bsky/convo/acceptConvo.ts";
import type * as ChatBskyConvoMuteConvo from "./types/chat/bsky/convo/muteConvo.ts";
import type * as ChatBskyConvoDeleteMessageForSelf from "./types/chat/bsky/convo/deleteMessageForSelf.ts";
import type * as ChatBskyConvoRemoveReaction from "./types/chat/bsky/convo/removeReaction.ts";
import type * as ChatBskyConvoUpdateRead from "./types/chat/bsky/convo/updateRead.ts";
import type * as ChatBskyConvoUpdateAllRead from "./types/chat/bsky/convo/updateAllRead.ts";
import type * as ChatBskyConvoGetConvo from "./types/chat/bsky/convo/getConvo.ts";
import type * as ChatBskyConvoGetMessages from "./types/chat/bsky/convo/getMessages.ts";
import type * as ChatBskyConvoGetConvoForMembers from "./types/chat/bsky/convo/getConvoForMembers.ts";
import type * as ChatBskyConvoSendMessageBatch from "./types/chat/bsky/convo/sendMessageBatch.ts";
import type * as ChatBskyActorExportAccountData from "./types/chat/bsky/actor/exportAccountData.ts";
import type * as ChatBskyActorDeleteAccount from "./types/chat/bsky/actor/deleteAccount.ts";
import type * as ChatBskyModerationGetActorMetadata from "./types/chat/bsky/moderation/getActorMetadata.ts";
import type * as ChatBskyModerationGetMessageContext from "./types/chat/bsky/moderation/getMessageContext.ts";
import type * as ChatBskyModerationUpdateActorAccess from "./types/chat/bsky/moderation/updateActorAccess.ts";
import type * as SoSprkVideoUploadVideo from "./types/so/sprk/video/uploadVideo.ts";
import type * as SoSprkVideoGetJobStatus from "./types/so/sprk/video/getJobStatus.ts";
import type * as SoSprkVideoGetUploadLimits from "./types/so/sprk/video/getUploadLimits.ts";
import type * as SoSprkNotificationRegisterPush from "./types/so/sprk/notification/registerPush.ts";
import type * as SoSprkNotificationPutPreferences from "./types/so/sprk/notification/putPreferences.ts";
import type * as SoSprkNotificationUpdateSeen from "./types/so/sprk/notification/updateSeen.ts";
import type * as SoSprkNotificationUnregisterPush from "./types/so/sprk/notification/unregisterPush.ts";
import type * as SoSprkNotificationListNotifications from "./types/so/sprk/notification/listNotifications.ts";
import type * as SoSprkNotificationGetUnreadCount from "./types/so/sprk/notification/getUnreadCount.ts";
import type * as SoSprkGraphGetSuggestedFollowsByActor from "./types/so/sprk/graph/getSuggestedFollowsByActor.ts";
import type * as SoSprkGraphMuteThread from "./types/so/sprk/graph/muteThread.ts";
import type * as SoSprkGraphGetFollowers from "./types/so/sprk/graph/getFollowers.ts";
import type * as SoSprkGraphUnmuteThread from "./types/so/sprk/graph/unmuteThread.ts";
import type * as SoSprkGraphMuteActor from "./types/so/sprk/graph/muteActor.ts";
import type * as SoSprkGraphGetMutes from "./types/so/sprk/graph/getMutes.ts";
import type * as SoSprkGraphGetKnownFollowers from "./types/so/sprk/graph/getKnownFollowers.ts";
import type * as SoSprkGraphGetFollows from "./types/so/sprk/graph/getFollows.ts";
import type * as SoSprkGraphGetBlocks from "./types/so/sprk/graph/getBlocks.ts";
import type * as SoSprkGraphGetRelationships from "./types/so/sprk/graph/getRelationships.ts";
import type * as SoSprkGraphUnmuteActor from "./types/so/sprk/graph/unmuteActor.ts";
import type * as SoSprkFeedSendInteractions from "./types/so/sprk/feed/sendInteractions.ts";
import type * as SoSprkFeedGetFeedGenerators from "./types/so/sprk/feed/getFeedGenerators.ts";
import type * as SoSprkFeedGetTimeline from "./types/so/sprk/feed/getTimeline.ts";
import type * as SoSprkFeedGetFeedGenerator from "./types/so/sprk/feed/getFeedGenerator.ts";
import type * as SoSprkFeedGetAuthorFeed from "./types/so/sprk/feed/getAuthorFeed.ts";
import type * as SoSprkFeedGetLikes from "./types/so/sprk/feed/getLikes.ts";
import type * as SoSprkFeedGetPostThread from "./types/so/sprk/feed/getPostThread.ts";
import type * as SoSprkFeedGetActorLikes from "./types/so/sprk/feed/getActorLikes.ts";
import type * as SoSprkFeedGetRepostedBy from "./types/so/sprk/feed/getRepostedBy.ts";
import type * as SoSprkFeedDescribeFeedGenerator from "./types/so/sprk/feed/describeFeedGenerator.ts";
import type * as SoSprkFeedSearchPosts from "./types/so/sprk/feed/searchPosts.ts";
import type * as SoSprkFeedGetPosts from "./types/so/sprk/feed/getPosts.ts";
import type * as SoSprkFeedGetCrosspostThread from "./types/so/sprk/feed/getCrosspostThread.ts";
import type * as SoSprkFeedGetFeed from "./types/so/sprk/feed/getFeed.ts";
import type * as SoSprkFeedGetFeedSkeleton from "./types/so/sprk/feed/getFeedSkeleton.ts";
import type * as SoSprkFeedGetSuggestedFeeds from "./types/so/sprk/feed/getSuggestedFeeds.ts";
import type * as SoSprkFeedGetActorFeeds from "./types/so/sprk/feed/getActorFeeds.ts";
import type * as SoSprkFeedGetActorReposts from "./types/so/sprk/feed/getActorReposts.ts";
import type * as SoSprkSoundGetActorAudios from "./types/so/sprk/sound/getActorAudios.ts";
import type * as SoSprkSoundGetAudioPosts from "./types/so/sprk/sound/getAudioPosts.ts";
import type * as SoSprkSoundGetAudios from "./types/so/sprk/sound/getAudios.ts";
import type * as SoSprkSoundGetTrendingAudios from "./types/so/sprk/sound/getTrendingAudios.ts";
import type * as SoSprkActorSearchActorsTypeahead from "./types/so/sprk/actor/searchActorsTypeahead.ts";
import type * as SoSprkActorPutPreferences from "./types/so/sprk/actor/putPreferences.ts";
import type * as SoSprkActorGetProfile from "./types/so/sprk/actor/getProfile.ts";
import type * as SoSprkActorGetSuggestions from "./types/so/sprk/actor/getSuggestions.ts";
import type * as SoSprkActorSearchActors from "./types/so/sprk/actor/searchActors.ts";
import type * as SoSprkActorGetProfiles from "./types/so/sprk/actor/getProfiles.ts";
import type * as SoSprkActorGetPreferences from "./types/so/sprk/actor/getPreferences.ts";
import type * as SoSprkStoryGetTimeline from "./types/so/sprk/story/getTimeline.ts";
import type * as SoSprkStoryGetStories from "./types/so/sprk/story/getStories.ts";
import type * as SoSprkLabelerGetServices from "./types/so/sprk/labeler/getServices.ts";
import type * as ComAtprotoTempDereferenceScope from "./types/com/atproto/temp/dereferenceScope.ts";
import type * as ComAtprotoTempAddReservedHandle from "./types/com/atproto/temp/addReservedHandle.ts";
import type * as ComAtprotoTempCheckSignupQueue from "./types/com/atproto/temp/checkSignupQueue.ts";
import type * as ComAtprotoTempCheckHandleAvailability from "./types/com/atproto/temp/checkHandleAvailability.ts";
import type * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";
import type * as ComAtprotoTempRevokeAccountCredentials from "./types/com/atproto/temp/revokeAccountCredentials.ts";
import type * as ComAtprotoTempFetchLabels from "./types/com/atproto/temp/fetchLabels.ts";
import type * as ComAtprotoIdentityUpdateHandle from "./types/com/atproto/identity/updateHandle.ts";
import type * as ComAtprotoIdentitySignPlcOperation from "./types/com/atproto/identity/signPlcOperation.ts";
import type * as ComAtprotoIdentitySubmitPlcOperation from "./types/com/atproto/identity/submitPlcOperation.ts";
import type * as ComAtprotoIdentityResolveIdentity from "./types/com/atproto/identity/resolveIdentity.ts";
import type * as ComAtprotoIdentityRefreshIdentity from "./types/com/atproto/identity/refreshIdentity.ts";
import type * as ComAtprotoIdentityResolveHandle from "./types/com/atproto/identity/resolveHandle.ts";
import type * as ComAtprotoIdentityRequestPlcOperationSignature from "./types/com/atproto/identity/requestPlcOperationSignature.ts";
import type * as ComAtprotoIdentityGetRecommendedDidCredentials from "./types/com/atproto/identity/getRecommendedDidCredentials.ts";
import type * as ComAtprotoIdentityResolveDid from "./types/com/atproto/identity/resolveDid.ts";
import type * as ComAtprotoAdminUpdateAccountEmail from "./types/com/atproto/admin/updateAccountEmail.ts";
import type * as ComAtprotoAdminGetAccountInfo from "./types/com/atproto/admin/getAccountInfo.ts";
import type * as ComAtprotoAdminGetSubjectStatus from "./types/com/atproto/admin/getSubjectStatus.ts";
import type * as ComAtprotoAdminSearchAccounts from "./types/com/atproto/admin/searchAccounts.ts";
import type * as ComAtprotoAdminUpdateAccountPassword from "./types/com/atproto/admin/updateAccountPassword.ts";
import type * as ComAtprotoAdminUpdateAccountHandle from "./types/com/atproto/admin/updateAccountHandle.ts";
import type * as ComAtprotoAdminGetInviteCodes from "./types/com/atproto/admin/getInviteCodes.ts";
import type * as ComAtprotoAdminUpdateAccountSigningKey from "./types/com/atproto/admin/updateAccountSigningKey.ts";
import type * as ComAtprotoAdminEnableAccountInvites from "./types/com/atproto/admin/enableAccountInvites.ts";
import type * as ComAtprotoAdminDisableAccountInvites from "./types/com/atproto/admin/disableAccountInvites.ts";
import type * as ComAtprotoAdminDisableInviteCodes from "./types/com/atproto/admin/disableInviteCodes.ts";
import type * as ComAtprotoAdminUpdateSubjectStatus from "./types/com/atproto/admin/updateSubjectStatus.ts";
import type * as ComAtprotoAdminSendEmail from "./types/com/atproto/admin/sendEmail.ts";
import type * as ComAtprotoAdminGetAccountInfos from "./types/com/atproto/admin/getAccountInfos.ts";
import type * as ComAtprotoAdminDeleteAccount from "./types/com/atproto/admin/deleteAccount.ts";
import type * as ComAtprotoLabelSubscribeLabels from "./types/com/atproto/label/subscribeLabels.ts";
import type * as ComAtprotoLabelQueryLabels from "./types/com/atproto/label/queryLabels.ts";
import type * as ComAtprotoServerRequestEmailConfirmation from "./types/com/atproto/server/requestEmailConfirmation.ts";
import type * as ComAtprotoServerReserveSigningKey from "./types/com/atproto/server/reserveSigningKey.ts";
import type * as ComAtprotoServerGetServiceAuth from "./types/com/atproto/server/getServiceAuth.ts";
import type * as ComAtprotoServerGetAccountInviteCodes from "./types/com/atproto/server/getAccountInviteCodes.ts";
import type * as ComAtprotoServerCreateSession from "./types/com/atproto/server/createSession.ts";
import type * as ComAtprotoServerListAppPasswords from "./types/com/atproto/server/listAppPasswords.ts";
import type * as ComAtprotoServerCreateInviteCodes from "./types/com/atproto/server/createInviteCodes.ts";
import type * as ComAtprotoServerDeleteSession from "./types/com/atproto/server/deleteSession.ts";
import type * as ComAtprotoServerRevokeAppPassword from "./types/com/atproto/server/revokeAppPassword.ts";
import type * as ComAtprotoServerCreateAppPassword from "./types/com/atproto/server/createAppPassword.ts";
import type * as ComAtprotoServerActivateAccount from "./types/com/atproto/server/activateAccount.ts";
import type * as ComAtprotoServerDescribeServer from "./types/com/atproto/server/describeServer.ts";
import type * as ComAtprotoServerConfirmEmail from "./types/com/atproto/server/confirmEmail.ts";
import type * as ComAtprotoServerGetSession from "./types/com/atproto/server/getSession.ts";
import type * as ComAtprotoServerRefreshSession from "./types/com/atproto/server/refreshSession.ts";
import type * as ComAtprotoServerDeactivateAccount from "./types/com/atproto/server/deactivateAccount.ts";
import type * as ComAtprotoServerUpdateEmail from "./types/com/atproto/server/updateEmail.ts";
import type * as ComAtprotoServerResetPassword from "./types/com/atproto/server/resetPassword.ts";
import type * as ComAtprotoServerCheckAccountStatus from "./types/com/atproto/server/checkAccountStatus.ts";
import type * as ComAtprotoServerRequestEmailUpdate from "./types/com/atproto/server/requestEmailUpdate.ts";
import type * as ComAtprotoServerRequestPasswordReset from "./types/com/atproto/server/requestPasswordReset.ts";
import type * as ComAtprotoServerRequestAccountDelete from "./types/com/atproto/server/requestAccountDelete.ts";
import type * as ComAtprotoServerCreateAccount from "./types/com/atproto/server/createAccount.ts";
import type * as ComAtprotoServerDeleteAccount from "./types/com/atproto/server/deleteAccount.ts";
import type * as ComAtprotoServerCreateInviteCode from "./types/com/atproto/server/createInviteCode.ts";
import type * as ComAtprotoLexiconResolveLexicon from "./types/com/atproto/lexicon/resolveLexicon.ts";
import type * as ComAtprotoSyncGetHead from "./types/com/atproto/sync/getHead.ts";
import type * as ComAtprotoSyncGetBlob from "./types/com/atproto/sync/getBlob.ts";
import type * as ComAtprotoSyncGetRepo from "./types/com/atproto/sync/getRepo.ts";
import type * as ComAtprotoSyncNotifyOfUpdate from "./types/com/atproto/sync/notifyOfUpdate.ts";
import type * as ComAtprotoSyncRequestCrawl from "./types/com/atproto/sync/requestCrawl.ts";
import type * as ComAtprotoSyncListBlobs from "./types/com/atproto/sync/listBlobs.ts";
import type * as ComAtprotoSyncGetLatestCommit from "./types/com/atproto/sync/getLatestCommit.ts";
import type * as ComAtprotoSyncSubscribeRepos from "./types/com/atproto/sync/subscribeRepos.ts";
import type * as ComAtprotoSyncGetRepoStatus from "./types/com/atproto/sync/getRepoStatus.ts";
import type * as ComAtprotoSyncGetRecord from "./types/com/atproto/sync/getRecord.ts";
import type * as ComAtprotoSyncListHosts from "./types/com/atproto/sync/listHosts.ts";
import type * as ComAtprotoSyncListRepos from "./types/com/atproto/sync/listRepos.ts";
import type * as ComAtprotoSyncGetHostStatus from "./types/com/atproto/sync/getHostStatus.ts";
import type * as ComAtprotoSyncGetBlocks from "./types/com/atproto/sync/getBlocks.ts";
import type * as ComAtprotoSyncListReposByCollection from "./types/com/atproto/sync/listReposByCollection.ts";
import type * as ComAtprotoSyncGetCheckout from "./types/com/atproto/sync/getCheckout.ts";
import type * as ComAtprotoRepoListMissingBlobs from "./types/com/atproto/repo/listMissingBlobs.ts";
import type * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.ts";
import type * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.ts";
import type * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.ts";
import type * as ComAtprotoRepoUploadBlob from "./types/com/atproto/repo/uploadBlob.ts";
import type * as ComAtprotoRepoImportRepo from "./types/com/atproto/repo/importRepo.ts";
import type * as ComAtprotoRepoDescribeRepo from "./types/com/atproto/repo/describeRepo.ts";
import type * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.ts";
import type * as ComAtprotoRepoApplyWrites from "./types/com/atproto/repo/applyWrites.ts";
import type * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.ts";
import type * as ComAtprotoModerationCreateReport from "./types/com/atproto/moderation/createReport.ts";

export const TOOLS_OZONE_TEAM = {
  DefsRoleAdmin: "tools.ozone.team.defs#roleAdmin",
  DefsRoleModerator: "tools.ozone.team.defs#roleModerator",
  DefsRoleTriage: "tools.ozone.team.defs#roleTriage",
  DefsRoleVerifier: "tools.ozone.team.defs#roleVerifier",
};
export const TOOLS_OZONE_REPORT = {
  DefsReasonAppeal: "tools.ozone.report.defs#reasonAppeal",
  DefsReasonOther: "tools.ozone.report.defs#reasonOther",
  DefsReasonViolenceAnimal: "tools.ozone.report.defs#reasonViolenceAnimal",
  DefsReasonViolenceThreats: "tools.ozone.report.defs#reasonViolenceThreats",
  DefsReasonViolenceGraphicContent:
    "tools.ozone.report.defs#reasonViolenceGraphicContent",
  DefsReasonViolenceGlorification:
    "tools.ozone.report.defs#reasonViolenceGlorification",
  DefsReasonViolenceExtremistContent:
    "tools.ozone.report.defs#reasonViolenceExtremistContent",
  DefsReasonViolenceTrafficking:
    "tools.ozone.report.defs#reasonViolenceTrafficking",
  DefsReasonViolenceOther: "tools.ozone.report.defs#reasonViolenceOther",
  DefsReasonSexualAbuseContent:
    "tools.ozone.report.defs#reasonSexualAbuseContent",
  DefsReasonSexualNCII: "tools.ozone.report.defs#reasonSexualNCII",
  DefsReasonSexualDeepfake: "tools.ozone.report.defs#reasonSexualDeepfake",
  DefsReasonSexualAnimal: "tools.ozone.report.defs#reasonSexualAnimal",
  DefsReasonSexualUnlabeled: "tools.ozone.report.defs#reasonSexualUnlabeled",
  DefsReasonSexualOther: "tools.ozone.report.defs#reasonSexualOther",
  DefsReasonChildSafetyCSAM: "tools.ozone.report.defs#reasonChildSafetyCSAM",
  DefsReasonChildSafetyGroom: "tools.ozone.report.defs#reasonChildSafetyGroom",
  DefsReasonChildSafetyPrivacy:
    "tools.ozone.report.defs#reasonChildSafetyPrivacy",
  DefsReasonChildSafetyHarassment:
    "tools.ozone.report.defs#reasonChildSafetyHarassment",
  DefsReasonChildSafetyOther: "tools.ozone.report.defs#reasonChildSafetyOther",
  DefsReasonHarassmentTroll: "tools.ozone.report.defs#reasonHarassmentTroll",
  DefsReasonHarassmentTargeted:
    "tools.ozone.report.defs#reasonHarassmentTargeted",
  DefsReasonHarassmentHateSpeech:
    "tools.ozone.report.defs#reasonHarassmentHateSpeech",
  DefsReasonHarassmentDoxxing:
    "tools.ozone.report.defs#reasonHarassmentDoxxing",
  DefsReasonHarassmentOther: "tools.ozone.report.defs#reasonHarassmentOther",
  DefsReasonMisleadingBot: "tools.ozone.report.defs#reasonMisleadingBot",
  DefsReasonMisleadingImpersonation:
    "tools.ozone.report.defs#reasonMisleadingImpersonation",
  DefsReasonMisleadingSpam: "tools.ozone.report.defs#reasonMisleadingSpam",
  DefsReasonMisleadingScam: "tools.ozone.report.defs#reasonMisleadingScam",
  DefsReasonMisleadingElections:
    "tools.ozone.report.defs#reasonMisleadingElections",
  DefsReasonMisleadingOther: "tools.ozone.report.defs#reasonMisleadingOther",
  DefsReasonRuleSiteSecurity: "tools.ozone.report.defs#reasonRuleSiteSecurity",
  DefsReasonRuleProhibitedSales:
    "tools.ozone.report.defs#reasonRuleProhibitedSales",
  DefsReasonRuleBanEvasion: "tools.ozone.report.defs#reasonRuleBanEvasion",
  DefsReasonRuleOther: "tools.ozone.report.defs#reasonRuleOther",
  DefsReasonSelfHarmContent: "tools.ozone.report.defs#reasonSelfHarmContent",
  DefsReasonSelfHarmED: "tools.ozone.report.defs#reasonSelfHarmED",
  DefsReasonSelfHarmStunts: "tools.ozone.report.defs#reasonSelfHarmStunts",
  DefsReasonSelfHarmSubstances:
    "tools.ozone.report.defs#reasonSelfHarmSubstances",
  DefsReasonSelfHarmOther: "tools.ozone.report.defs#reasonSelfHarmOther",
};
export const TOOLS_OZONE_MODERATION = {
  DefsReviewOpen: "tools.ozone.moderation.defs#reviewOpen",
  DefsReviewEscalated: "tools.ozone.moderation.defs#reviewEscalated",
  DefsReviewClosed: "tools.ozone.moderation.defs#reviewClosed",
  DefsReviewNone: "tools.ozone.moderation.defs#reviewNone",
  DefsTimelineEventPlcCreate:
    "tools.ozone.moderation.defs#timelineEventPlcCreate",
  DefsTimelineEventPlcOperation:
    "tools.ozone.moderation.defs#timelineEventPlcOperation",
  DefsTimelineEventPlcTombstone:
    "tools.ozone.moderation.defs#timelineEventPlcTombstone",
};
export const APP_BSKY_GRAPH = {
  DefsModlist: "app.bsky.graph.defs#modlist",
  DefsCuratelist: "app.bsky.graph.defs#curatelist",
  DefsReferencelist: "app.bsky.graph.defs#referencelist",
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
export const APP_BSKY_ACTOR = {
  StatusLive: "app.bsky.actor.status#live",
};
export const SO_SPRK_FEED = {
  DefsRequestLess: "so.sprk.feed.defs#requestLess",
  DefsRequestMore: "so.sprk.feed.defs#requestMore",
  DefsClickthroughItem: "so.sprk.feed.defs#clickthroughItem",
  DefsClickthroughAuthor: "so.sprk.feed.defs#clickthroughAuthor",
  DefsClickthroughReposter: "so.sprk.feed.defs#clickthroughReposter",
  DefsClickthroughEmbed: "so.sprk.feed.defs#clickthroughEmbed",
  DefsInteractionSeen: "so.sprk.feed.defs#interactionSeen",
  DefsInteractionLike: "so.sprk.feed.defs#interactionLike",
  DefsInteractionRepost: "so.sprk.feed.defs#interactionRepost",
  DefsInteractionReply: "so.sprk.feed.defs#interactionReply",
  DefsInteractionShare: "so.sprk.feed.defs#interactionShare",
};
export const COM_ATPROTO_MODERATION = {
  DefsReasonSpam: "com.atproto.moderation.defs#reasonSpam",
  DefsReasonViolation: "com.atproto.moderation.defs#reasonViolation",
  DefsReasonMisleading: "com.atproto.moderation.defs#reasonMisleading",
  DefsReasonSexual: "com.atproto.moderation.defs#reasonSexual",
  DefsReasonRude: "com.atproto.moderation.defs#reasonRude",
  DefsReasonOther: "com.atproto.moderation.defs#reasonOther",
  DefsReasonAppeal: "com.atproto.moderation.defs#reasonAppeal",
};

export function createServer(options?: XrpcOptions): Server {
  return new Server(options);
}

export class Server {
  xrpc: XrpcServer;
  tools: ToolsNS;
  app: AppNS;
  chat: ChatNS;
  so: SoNS;
  com: ComNS;

  constructor(options?: XrpcOptions) {
    this.xrpc = createXrpcServer(schemas, options);
    this.tools = new ToolsNS(this);
    this.app = new AppNS(this);
    this.chat = new ChatNS(this);
    this.so = new SoNS(this);
    this.com = new ComNS(this);
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
  signature: ToolsOzoneSignatureNS;
  server: ToolsOzoneServerNS;
  verification: ToolsOzoneVerificationNS;
  safelink: ToolsOzoneSafelinkNS;
  team: ToolsOzoneTeamNS;
  hosting: ToolsOzoneHostingNS;
  communication: ToolsOzoneCommunicationNS;
  set: ToolsOzoneSetNS;
  setting: ToolsOzoneSettingNS;
  moderation: ToolsOzoneModerationNS;

  constructor(server: Server) {
    this._server = server;
    this.signature = new ToolsOzoneSignatureNS(server);
    this.server = new ToolsOzoneServerNS(server);
    this.verification = new ToolsOzoneVerificationNS(server);
    this.safelink = new ToolsOzoneSafelinkNS(server);
    this.team = new ToolsOzoneTeamNS(server);
    this.hosting = new ToolsOzoneHostingNS(server);
    this.communication = new ToolsOzoneCommunicationNS(server);
    this.set = new ToolsOzoneSetNS(server);
    this.setting = new ToolsOzoneSettingNS(server);
    this.moderation = new ToolsOzoneModerationNS(server);
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
    const nsid = "tools.ozone.signature.findCorrelation"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.signature.searchAccounts"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.signature.findRelatedAccounts"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.server.getConfig"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneVerificationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  revokeVerifications<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneVerificationRevokeVerifications.QueryParams,
      ToolsOzoneVerificationRevokeVerifications.HandlerInput,
      ToolsOzoneVerificationRevokeVerifications.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.verification.revokeVerifications"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  grantVerifications<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneVerificationGrantVerifications.QueryParams,
      ToolsOzoneVerificationGrantVerifications.HandlerInput,
      ToolsOzoneVerificationGrantVerifications.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.verification.grantVerifications"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  listVerifications<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneVerificationListVerifications.QueryParams,
      ToolsOzoneVerificationListVerifications.HandlerInput,
      ToolsOzoneVerificationListVerifications.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.verification.listVerifications"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneSafelinkNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  addRule<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSafelinkAddRule.QueryParams,
      ToolsOzoneSafelinkAddRule.HandlerInput,
      ToolsOzoneSafelinkAddRule.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.safelink.addRule"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  removeRule<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSafelinkRemoveRule.QueryParams,
      ToolsOzoneSafelinkRemoveRule.HandlerInput,
      ToolsOzoneSafelinkRemoveRule.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.safelink.removeRule"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  updateRule<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSafelinkUpdateRule.QueryParams,
      ToolsOzoneSafelinkUpdateRule.HandlerInput,
      ToolsOzoneSafelinkUpdateRule.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.safelink.updateRule"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  queryEvents<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSafelinkQueryEvents.QueryParams,
      ToolsOzoneSafelinkQueryEvents.HandlerInput,
      ToolsOzoneSafelinkQueryEvents.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.safelink.queryEvents"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  queryRules<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneSafelinkQueryRules.QueryParams,
      ToolsOzoneSafelinkQueryRules.HandlerInput,
      ToolsOzoneSafelinkQueryRules.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.safelink.queryRules"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneTeamNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  listMembers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneTeamListMembers.QueryParams,
      ToolsOzoneTeamListMembers.HandlerInput,
      ToolsOzoneTeamListMembers.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.team.listMembers"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.team.deleteMember"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.team.updateMember"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  addMember<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneTeamAddMember.QueryParams,
      ToolsOzoneTeamAddMember.HandlerInput,
      ToolsOzoneTeamAddMember.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.team.addMember"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneHostingNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getAccountHistory<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneHostingGetAccountHistory.QueryParams,
      ToolsOzoneHostingGetAccountHistory.HandlerInput,
      ToolsOzoneHostingGetAccountHistory.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.hosting.getAccountHistory"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneCommunicationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  updateTemplate<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneCommunicationUpdateTemplate.QueryParams,
      ToolsOzoneCommunicationUpdateTemplate.HandlerInput,
      ToolsOzoneCommunicationUpdateTemplate.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.communication.updateTemplate"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  createTemplate<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneCommunicationCreateTemplate.QueryParams,
      ToolsOzoneCommunicationCreateTemplate.HandlerInput,
      ToolsOzoneCommunicationCreateTemplate.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.communication.createTemplate"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.communication.listTemplates"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.communication.deleteTemplate"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.set.addValues"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.set.getValues"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.set.deleteSet"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.set.upsertSet"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.set.deleteValues"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.set.querySets"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.setting.listOptions"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.setting.removeOptions"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.setting.upsertOption"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ToolsOzoneModerationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getReporterStats<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetReporterStats.QueryParams,
      ToolsOzoneModerationGetReporterStats.HandlerInput,
      ToolsOzoneModerationGetReporterStats.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getReporterStats"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  cancelScheduledActions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationCancelScheduledActions.QueryParams,
      ToolsOzoneModerationCancelScheduledActions.HandlerInput,
      ToolsOzoneModerationCancelScheduledActions.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.cancelScheduledActions"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  listScheduledActions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationListScheduledActions.QueryParams,
      ToolsOzoneModerationListScheduledActions.HandlerInput,
      ToolsOzoneModerationListScheduledActions.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.listScheduledActions"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.queryStatuses"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.getRepo"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSubjects<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetSubjects.QueryParams,
      ToolsOzoneModerationGetSubjects.HandlerInput,
      ToolsOzoneModerationGetSubjects.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getSubjects"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.getRecords"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  scheduleAction<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationScheduleAction.QueryParams,
      ToolsOzoneModerationScheduleAction.HandlerInput,
      ToolsOzoneModerationScheduleAction.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.scheduleAction"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.getEvent"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.queryEvents"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.getRecord"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  emitEvent<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationEmitEvent.QueryParams,
      ToolsOzoneModerationEmitEvent.HandlerInput,
      ToolsOzoneModerationEmitEvent.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.emitEvent"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.searchRepos"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getAccountTimeline<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ToolsOzoneModerationGetAccountTimeline.QueryParams,
      ToolsOzoneModerationGetAccountTimeline.HandlerInput,
      ToolsOzoneModerationGetAccountTimeline.HandlerOutput
    >,
  ) {
    const nsid = "tools.ozone.moderation.getAccountTimeline"; // @ts-ignore - dynamically generated
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
    const nsid = "tools.ozone.moderation.getRepos"; // @ts-ignore - dynamically generated
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
  draft: AppBskyDraftNS;
  video: AppBskyVideoNS;
  contact: AppBskyContactNS;
  bookmark: AppBskyBookmarkNS;
  embed: AppBskyEmbedNS;
  notification: AppBskyNotificationNS;
  unspecced: AppBskyUnspeccedNS;
  graph: AppBskyGraphNS;
  feed: AppBskyFeedNS;
  richtext: AppBskyRichtextNS;
  ageassurance: AppBskyAgeassuranceNS;
  actor: AppBskyActorNS;
  labeler: AppBskyLabelerNS;

  constructor(server: Server) {
    this._server = server;
    this.draft = new AppBskyDraftNS(server);
    this.video = new AppBskyVideoNS(server);
    this.contact = new AppBskyContactNS(server);
    this.bookmark = new AppBskyBookmarkNS(server);
    this.embed = new AppBskyEmbedNS(server);
    this.notification = new AppBskyNotificationNS(server);
    this.unspecced = new AppBskyUnspeccedNS(server);
    this.graph = new AppBskyGraphNS(server);
    this.feed = new AppBskyFeedNS(server);
    this.richtext = new AppBskyRichtextNS(server);
    this.ageassurance = new AppBskyAgeassuranceNS(server);
    this.actor = new AppBskyActorNS(server);
    this.labeler = new AppBskyLabelerNS(server);
  }
}

export class AppBskyDraftNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  createDraft<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyDraftCreateDraft.QueryParams,
      AppBskyDraftCreateDraft.HandlerInput,
      AppBskyDraftCreateDraft.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.draft.createDraft"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  updateDraft<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyDraftUpdateDraft.QueryParams,
      AppBskyDraftUpdateDraft.HandlerInput,
      AppBskyDraftUpdateDraft.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.draft.updateDraft"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getDrafts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyDraftGetDrafts.QueryParams,
      AppBskyDraftGetDrafts.HandlerInput,
      AppBskyDraftGetDrafts.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.draft.getDrafts"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteDraft<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyDraftDeleteDraft.QueryParams,
      AppBskyDraftDeleteDraft.HandlerInput,
      AppBskyDraftDeleteDraft.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.draft.deleteDraft"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyVideoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  uploadVideo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyVideoUploadVideo.QueryParams,
      AppBskyVideoUploadVideo.HandlerInput,
      AppBskyVideoUploadVideo.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.video.uploadVideo"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getJobStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyVideoGetJobStatus.QueryParams,
      AppBskyVideoGetJobStatus.HandlerInput,
      AppBskyVideoGetJobStatus.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.video.getJobStatus"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.video.getUploadLimits"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyContactNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  sendNotification<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactSendNotification.QueryParams,
      AppBskyContactSendNotification.HandlerInput,
      AppBskyContactSendNotification.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.sendNotification"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSyncStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactGetSyncStatus.QueryParams,
      AppBskyContactGetSyncStatus.HandlerInput,
      AppBskyContactGetSyncStatus.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.getSyncStatus"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  startPhoneVerification<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactStartPhoneVerification.QueryParams,
      AppBskyContactStartPhoneVerification.HandlerInput,
      AppBskyContactStartPhoneVerification.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.startPhoneVerification"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getMatches<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactGetMatches.QueryParams,
      AppBskyContactGetMatches.HandlerInput,
      AppBskyContactGetMatches.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.getMatches"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  importContacts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactImportContacts.QueryParams,
      AppBskyContactImportContacts.HandlerInput,
      AppBskyContactImportContacts.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.importContacts"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  dismissMatch<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactDismissMatch.QueryParams,
      AppBskyContactDismissMatch.HandlerInput,
      AppBskyContactDismissMatch.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.dismissMatch"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  removeData<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactRemoveData.QueryParams,
      AppBskyContactRemoveData.HandlerInput,
      AppBskyContactRemoveData.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.removeData"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  verifyPhone<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyContactVerifyPhone.QueryParams,
      AppBskyContactVerifyPhone.HandlerInput,
      AppBskyContactVerifyPhone.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.contact.verifyPhone"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyBookmarkNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  deleteBookmark<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyBookmarkDeleteBookmark.QueryParams,
      AppBskyBookmarkDeleteBookmark.HandlerInput,
      AppBskyBookmarkDeleteBookmark.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.bookmark.deleteBookmark"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getBookmarks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyBookmarkGetBookmarks.QueryParams,
      AppBskyBookmarkGetBookmarks.HandlerInput,
      AppBskyBookmarkGetBookmarks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.bookmark.getBookmarks"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  createBookmark<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyBookmarkCreateBookmark.QueryParams,
      AppBskyBookmarkCreateBookmark.HandlerInput,
      AppBskyBookmarkCreateBookmark.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.bookmark.createBookmark"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyEmbedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class AppBskyNotificationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  registerPush<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationRegisterPush.QueryParams,
      AppBskyNotificationRegisterPush.HandlerInput,
      AppBskyNotificationRegisterPush.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.registerPush"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.notification.putPreferences"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  putActivitySubscription<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationPutActivitySubscription.QueryParams,
      AppBskyNotificationPutActivitySubscription.HandlerInput,
      AppBskyNotificationPutActivitySubscription.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.putActivitySubscription"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  putPreferencesV2<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationPutPreferencesV2.QueryParams,
      AppBskyNotificationPutPreferencesV2.HandlerInput,
      AppBskyNotificationPutPreferencesV2.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.putPreferencesV2"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.notification.updateSeen"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  listActivitySubscriptions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationListActivitySubscriptions.QueryParams,
      AppBskyNotificationListActivitySubscriptions.HandlerInput,
      AppBskyNotificationListActivitySubscriptions.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.listActivitySubscriptions"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  unregisterPush<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationUnregisterPush.QueryParams,
      AppBskyNotificationUnregisterPush.HandlerInput,
      AppBskyNotificationUnregisterPush.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.unregisterPush"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationGetPreferences.QueryParams,
      AppBskyNotificationGetPreferences.HandlerInput,
      AppBskyNotificationGetPreferences.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.getPreferences"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.notification.listNotifications"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getUnreadCount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyNotificationGetUnreadCount.QueryParams,
      AppBskyNotificationGetUnreadCount.HandlerInput,
      AppBskyNotificationGetUnreadCount.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.notification.getUnreadCount"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyUnspeccedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getSuggestedFeedsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedFeedsSkeleton.QueryParams,
      AppBskyUnspeccedGetSuggestedFeedsSkeleton.HandlerInput,
      AppBskyUnspeccedGetSuggestedFeedsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedFeedsSkeleton"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.unspecced.searchStarterPacksSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsersForExplore<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsersForExplore.QueryParams,
      AppBskyUnspeccedGetSuggestedUsersForExplore.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsersForExplore.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsersForExplore"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getOnboardingSuggestedStarterPacksSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetOnboardingSuggestedStarterPacksSkeleton.QueryParams,
      AppBskyUnspeccedGetOnboardingSuggestedStarterPacksSkeleton.HandlerInput,
      AppBskyUnspeccedGetOnboardingSuggestedStarterPacksSkeleton.HandlerOutput
    >,
  ) {
    const nsid =
      "app.bsky.unspecced.getOnboardingSuggestedStarterPacksSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsersForExploreSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton.QueryParams,
      AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsersForExploreSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsers.QueryParams,
      AppBskyUnspeccedGetSuggestedUsers.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsers.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsers"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostThreadOtherV2<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetPostThreadOtherV2.QueryParams,
      AppBskyUnspeccedGetPostThreadOtherV2.HandlerInput,
      AppBskyUnspeccedGetPostThreadOtherV2.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getPostThreadOtherV2"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedStarterPacks.QueryParams,
      AppBskyUnspeccedGetSuggestedStarterPacks.HandlerInput,
      AppBskyUnspeccedGetSuggestedStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedStarterPacks"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedStarterPacksSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedStarterPacksSkeleton.QueryParams,
      AppBskyUnspeccedGetSuggestedStarterPacksSkeleton.HandlerInput,
      AppBskyUnspeccedGetSuggestedStarterPacksSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedStarterPacksSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getOnboardingSuggestedStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetOnboardingSuggestedStarterPacks.QueryParams,
      AppBskyUnspeccedGetOnboardingSuggestedStarterPacks.HandlerInput,
      AppBskyUnspeccedGetOnboardingSuggestedStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getOnboardingSuggestedStarterPacks"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsersSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsersSkeleton.QueryParams,
      AppBskyUnspeccedGetSuggestedUsersSkeleton.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsersSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsersSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getPostThreadV2<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetPostThreadV2.QueryParams,
      AppBskyUnspeccedGetPostThreadV2.HandlerInput,
      AppBskyUnspeccedGetPostThreadV2.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getPostThreadV2"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrends<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetTrends.QueryParams,
      AppBskyUnspeccedGetTrends.HandlerInput,
      AppBskyUnspeccedGetTrends.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getTrends"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.unspecced.searchActorsSkeleton"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.unspecced.getSuggestionsSkeleton"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.unspecced.searchPostsSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getOnboardingSuggestedUsersSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton.QueryParams,
      AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton.HandlerInput,
      AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getOnboardingSuggestedUsersSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsersForDiscoverSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton.QueryParams,
      AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsersForDiscoverSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsersForDiscover<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsersForDiscover.QueryParams,
      AppBskyUnspeccedGetSuggestedUsersForDiscover.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsersForDiscover.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsersForDiscover"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getAgeAssuranceState<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetAgeAssuranceState.QueryParams,
      AppBskyUnspeccedGetAgeAssuranceState.HandlerInput,
      AppBskyUnspeccedGetAgeAssuranceState.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getAgeAssuranceState"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.unspecced.getPopularFeedGenerators"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedOnboardingUsers<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedOnboardingUsers.QueryParams,
      AppBskyUnspeccedGetSuggestedOnboardingUsers.HandlerInput,
      AppBskyUnspeccedGetSuggestedOnboardingUsers.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedOnboardingUsers"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsersForSeeMore<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsersForSeeMore.QueryParams,
      AppBskyUnspeccedGetSuggestedUsersForSeeMore.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsersForSeeMore.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsersForSeeMore"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  initAgeAssurance<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedInitAgeAssurance.QueryParams,
      AppBskyUnspeccedInitAgeAssurance.HandlerInput,
      AppBskyUnspeccedInitAgeAssurance.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.initAgeAssurance"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.unspecced.getTrendingTopics"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.unspecced.getTaggedSuggestions"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedUsersForSeeMoreSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton.QueryParams,
      AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton.HandlerInput,
      AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedUsersForSeeMoreSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getSuggestedFeeds<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetSuggestedFeeds.QueryParams,
      AppBskyUnspeccedGetSuggestedFeeds.HandlerInput,
      AppBskyUnspeccedGetSuggestedFeeds.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getSuggestedFeeds"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrendsSkeleton<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetTrendsSkeleton.QueryParams,
      AppBskyUnspeccedGetTrendsSkeleton.HandlerInput,
      AppBskyUnspeccedGetTrendsSkeleton.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getTrendsSkeleton"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getConfig<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyUnspeccedGetConfig.QueryParams,
      AppBskyUnspeccedGetConfig.HandlerInput,
      AppBskyUnspeccedGetConfig.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.unspecced.getConfig"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyGraphNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetStarterPacks.QueryParams,
      AppBskyGraphGetStarterPacks.HandlerInput,
      AppBskyGraphGetStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getStarterPacks"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getSuggestedFollowsByActor"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getStarterPacksWithMembership<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetStarterPacksWithMembership.QueryParams,
      AppBskyGraphGetStarterPacksWithMembership.HandlerInput,
      AppBskyGraphGetStarterPacksWithMembership.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getStarterPacksWithMembership"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getListsWithMembership<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetListsWithMembership.QueryParams,
      AppBskyGraphGetListsWithMembership.HandlerInput,
      AppBskyGraphGetListsWithMembership.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getListsWithMembership"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.unmuteActorList"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getListBlocks"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getStarterPack"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.muteActorList"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.muteThread"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.searchStarterPacks"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorStarterPacks<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyGraphGetActorStarterPacks.QueryParams,
      AppBskyGraphGetActorStarterPacks.HandlerInput,
      AppBskyGraphGetActorStarterPacks.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.graph.getActorStarterPacks"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getLists"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getFollowers"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.unmuteThread"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.muteActor"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getMutes"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getKnownFollowers"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getListMutes"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getFollows"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getBlocks"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getRelationships"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.unmuteActor"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.graph.getList"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyFeedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  sendInteractions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedSendInteractions.QueryParams,
      AppBskyFeedSendInteractions.HandlerInput,
      AppBskyFeedSendInteractions.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.sendInteractions"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getFeedGenerators"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getTimeline"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getFeedGenerator"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getAuthorFeed"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getLikes"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getPostThread"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getActorLikes"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getRepostedBy"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  describeFeedGenerator<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyFeedDescribeFeedGenerator.QueryParams,
      AppBskyFeedDescribeFeedGenerator.HandlerInput,
      AppBskyFeedDescribeFeedGenerator.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.feed.describeFeedGenerator"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.searchPosts"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getPosts"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getFeed"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getQuotes"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getFeedSkeleton"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getListFeed"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getSuggestedFeeds"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.feed.getActorFeeds"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyRichtextNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class AppBskyAgeassuranceNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  begin<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyAgeassuranceBegin.QueryParams,
      AppBskyAgeassuranceBegin.HandlerInput,
      AppBskyAgeassuranceBegin.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.ageassurance.begin"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getState<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyAgeassuranceGetState.QueryParams,
      AppBskyAgeassuranceGetState.HandlerInput,
      AppBskyAgeassuranceGetState.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.ageassurance.getState"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getConfig<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyAgeassuranceGetConfig.QueryParams,
      AppBskyAgeassuranceGetConfig.HandlerInput,
      AppBskyAgeassuranceGetConfig.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.ageassurance.getConfig"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class AppBskyActorNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  searchActorsTypeahead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorSearchActorsTypeahead.QueryParams,
      AppBskyActorSearchActorsTypeahead.HandlerInput,
      AppBskyActorSearchActorsTypeahead.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.searchActorsTypeahead"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.actor.putPreferences"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.actor.getProfile"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.actor.getSuggestions"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.actor.searchActors"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.actor.getProfiles"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getPreferences<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      AppBskyActorGetPreferences.QueryParams,
      AppBskyActorGetPreferences.HandlerInput,
      AppBskyActorGetPreferences.HandlerOutput
    >,
  ) {
    const nsid = "app.bsky.actor.getPreferences"; // @ts-ignore - dynamically generated
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
    const nsid = "app.bsky.labeler.getServices"; // @ts-ignore - dynamically generated
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
  convo: ChatBskyConvoNS;
  actor: ChatBskyActorNS;
  moderation: ChatBskyModerationNS;

  constructor(server: Server) {
    this._server = server;
    this.convo = new ChatBskyConvoNS(server);
    this.actor = new ChatBskyActorNS(server);
    this.moderation = new ChatBskyModerationNS(server);
  }
}

export class ChatBskyConvoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  listConvos<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoListConvos.QueryParams,
      ChatBskyConvoListConvos.HandlerInput,
      ChatBskyConvoListConvos.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.listConvos"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.unmuteConvo"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.getConvoAvailability"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.getLog"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.sendMessage"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.leaveConvo"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  addReaction<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoAddReaction.QueryParams,
      ChatBskyConvoAddReaction.HandlerInput,
      ChatBskyConvoAddReaction.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.addReaction"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  acceptConvo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoAcceptConvo.QueryParams,
      ChatBskyConvoAcceptConvo.HandlerInput,
      ChatBskyConvoAcceptConvo.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.acceptConvo"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.muteConvo"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.deleteMessageForSelf"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  removeReaction<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyConvoRemoveReaction.QueryParams,
      ChatBskyConvoRemoveReaction.HandlerInput,
      ChatBskyConvoRemoveReaction.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.convo.removeReaction"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.updateRead"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.updateAllRead"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.getConvo"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.getMessages"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.getConvoForMembers"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.convo.sendMessageBatch"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ChatBskyActorNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  exportAccountData<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyActorExportAccountData.QueryParams,
      ChatBskyActorExportAccountData.HandlerInput,
      ChatBskyActorExportAccountData.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.actor.exportAccountData"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ChatBskyActorDeleteAccount.QueryParams,
      ChatBskyActorDeleteAccount.HandlerInput,
      ChatBskyActorDeleteAccount.HandlerOutput
    >,
  ) {
    const nsid = "chat.bsky.actor.deleteAccount"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.moderation.getActorMetadata"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.moderation.getMessageContext"; // @ts-ignore - dynamically generated
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
    const nsid = "chat.bsky.moderation.updateActorAccess"; // @ts-ignore - dynamically generated
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
  video: SoSprkVideoNS;
  embed: SoSprkEmbedNS;
  notification: SoSprkNotificationNS;
  graph: SoSprkGraphNS;
  feed: SoSprkFeedNS;
  richtext: SoSprkRichtextNS;
  sound: SoSprkSoundNS;
  actor: SoSprkActorNS;
  story: SoSprkStoryNS;
  labeler: SoSprkLabelerNS;
  media: SoSprkMediaNS;

  constructor(server: Server) {
    this._server = server;
    this.video = new SoSprkVideoNS(server);
    this.embed = new SoSprkEmbedNS(server);
    this.notification = new SoSprkNotificationNS(server);
    this.graph = new SoSprkGraphNS(server);
    this.feed = new SoSprkFeedNS(server);
    this.richtext = new SoSprkRichtextNS(server);
    this.sound = new SoSprkSoundNS(server);
    this.actor = new SoSprkActorNS(server);
    this.story = new SoSprkStoryNS(server);
    this.labeler = new SoSprkLabelerNS(server);
    this.media = new SoSprkMediaNS(server);
  }
}

export class SoSprkVideoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  uploadVideo<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkVideoUploadVideo.QueryParams,
      SoSprkVideoUploadVideo.HandlerInput,
      SoSprkVideoUploadVideo.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.video.uploadVideo"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getJobStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkVideoGetJobStatus.QueryParams,
      SoSprkVideoGetJobStatus.HandlerInput,
      SoSprkVideoGetJobStatus.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.video.getJobStatus"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.video.getUploadLimits"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkEmbedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class SoSprkNotificationNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  registerPush<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationRegisterPush.QueryParams,
      SoSprkNotificationRegisterPush.HandlerInput,
      SoSprkNotificationRegisterPush.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.registerPush"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.notification.putPreferences"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.notification.updateSeen"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  unregisterPush<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationUnregisterPush.QueryParams,
      SoSprkNotificationUnregisterPush.HandlerInput,
      SoSprkNotificationUnregisterPush.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.unregisterPush"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.notification.listNotifications"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getUnreadCount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkNotificationGetUnreadCount.QueryParams,
      SoSprkNotificationGetUnreadCount.HandlerInput,
      SoSprkNotificationGetUnreadCount.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.notification.getUnreadCount"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkGraphNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getSuggestedFollowsByActor<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkGraphGetSuggestedFollowsByActor.QueryParams,
      SoSprkGraphGetSuggestedFollowsByActor.HandlerInput,
      SoSprkGraphGetSuggestedFollowsByActor.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.graph.getSuggestedFollowsByActor"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.muteThread"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.getFollowers"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.unmuteThread"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.muteActor"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.getMutes"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.getKnownFollowers"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.getFollows"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.getBlocks"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.getRelationships"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.graph.unmuteActor"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkFeedNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  sendInteractions<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedSendInteractions.QueryParams,
      SoSprkFeedSendInteractions.HandlerInput,
      SoSprkFeedSendInteractions.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.sendInteractions"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getFeedGenerators"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getTimeline"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getFeedGenerator"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getAuthorFeed"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getLikes"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getPostThread"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getActorLikes"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getRepostedBy"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  describeFeedGenerator<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedDescribeFeedGenerator.QueryParams,
      SoSprkFeedDescribeFeedGenerator.HandlerInput,
      SoSprkFeedDescribeFeedGenerator.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.describeFeedGenerator"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.searchPosts"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getPosts"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getCrosspostThread<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetCrosspostThread.QueryParams,
      SoSprkFeedGetCrosspostThread.HandlerInput,
      SoSprkFeedGetCrosspostThread.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getCrosspostThread"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getFeed"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getFeedSkeleton"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getSuggestedFeeds"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.feed.getActorFeeds"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getActorReposts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkFeedGetActorReposts.QueryParams,
      SoSprkFeedGetActorReposts.HandlerInput,
      SoSprkFeedGetActorReposts.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.feed.getActorReposts"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkRichtextNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }
}

export class SoSprkSoundNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getActorAudios<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkSoundGetActorAudios.QueryParams,
      SoSprkSoundGetActorAudios.HandlerInput,
      SoSprkSoundGetActorAudios.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.sound.getActorAudios"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getAudioPosts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkSoundGetAudioPosts.QueryParams,
      SoSprkSoundGetAudioPosts.HandlerInput,
      SoSprkSoundGetAudioPosts.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.sound.getAudioPosts"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getAudios<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkSoundGetAudios.QueryParams,
      SoSprkSoundGetAudios.HandlerInput,
      SoSprkSoundGetAudios.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.sound.getAudios"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getTrendingAudios<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkSoundGetTrendingAudios.QueryParams,
      SoSprkSoundGetTrendingAudios.HandlerInput,
      SoSprkSoundGetTrendingAudios.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.sound.getTrendingAudios"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkActorNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  searchActorsTypeahead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorSearchActorsTypeahead.QueryParams,
      SoSprkActorSearchActorsTypeahead.HandlerInput,
      SoSprkActorSearchActorsTypeahead.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.searchActorsTypeahead"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.actor.putPreferences"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getProfile<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkActorGetProfile.QueryParams,
      SoSprkActorGetProfile.HandlerInput,
      SoSprkActorGetProfile.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.actor.getProfile"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.actor.getSuggestions"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.actor.searchActors"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.actor.getProfiles"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.actor.getPreferences"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkStoryNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getTimeline<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkStoryGetTimeline.QueryParams,
      SoSprkStoryGetTimeline.HandlerInput,
      SoSprkStoryGetTimeline.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.story.getTimeline"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getStories<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      SoSprkStoryGetStories.QueryParams,
      SoSprkStoryGetStories.HandlerInput,
      SoSprkStoryGetStories.HandlerOutput
    >,
  ) {
    const nsid = "so.sprk.story.getStories"; // @ts-ignore - dynamically generated
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
    const nsid = "so.sprk.labeler.getServices"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class SoSprkMediaNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
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
  temp: ComAtprotoTempNS;
  identity: ComAtprotoIdentityNS;
  admin: ComAtprotoAdminNS;
  label: ComAtprotoLabelNS;
  server: ComAtprotoServerNS;
  lexicon: ComAtprotoLexiconNS;
  sync: ComAtprotoSyncNS;
  repo: ComAtprotoRepoNS;
  moderation: ComAtprotoModerationNS;

  constructor(server: Server) {
    this._server = server;
    this.temp = new ComAtprotoTempNS(server);
    this.identity = new ComAtprotoIdentityNS(server);
    this.admin = new ComAtprotoAdminNS(server);
    this.label = new ComAtprotoLabelNS(server);
    this.server = new ComAtprotoServerNS(server);
    this.lexicon = new ComAtprotoLexiconNS(server);
    this.sync = new ComAtprotoSyncNS(server);
    this.repo = new ComAtprotoRepoNS(server);
    this.moderation = new ComAtprotoModerationNS(server);
  }
}

export class ComAtprotoTempNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  dereferenceScope<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempDereferenceScope.QueryParams,
      ComAtprotoTempDereferenceScope.HandlerInput,
      ComAtprotoTempDereferenceScope.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.dereferenceScope"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  addReservedHandle<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempAddReservedHandle.QueryParams,
      ComAtprotoTempAddReservedHandle.HandlerInput,
      ComAtprotoTempAddReservedHandle.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.addReservedHandle"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.temp.checkSignupQueue"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  checkHandleAvailability<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempCheckHandleAvailability.QueryParams,
      ComAtprotoTempCheckHandleAvailability.HandlerInput,
      ComAtprotoTempCheckHandleAvailability.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.checkHandleAvailability"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.temp.requestPhoneVerification"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  revokeAccountCredentials<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoTempRevokeAccountCredentials.QueryParams,
      ComAtprotoTempRevokeAccountCredentials.HandlerInput,
      ComAtprotoTempRevokeAccountCredentials.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.temp.revokeAccountCredentials"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.temp.fetchLabels"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoIdentityNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  updateHandle<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityUpdateHandle.QueryParams,
      ComAtprotoIdentityUpdateHandle.HandlerInput,
      ComAtprotoIdentityUpdateHandle.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.updateHandle"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.identity.signPlcOperation"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.identity.submitPlcOperation"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  resolveIdentity<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityResolveIdentity.QueryParams,
      ComAtprotoIdentityResolveIdentity.HandlerInput,
      ComAtprotoIdentityResolveIdentity.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.resolveIdentity"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  refreshIdentity<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityRefreshIdentity.QueryParams,
      ComAtprotoIdentityRefreshIdentity.HandlerInput,
      ComAtprotoIdentityRefreshIdentity.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.refreshIdentity"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.identity.resolveHandle"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.identity.requestPlcOperationSignature"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getRecommendedDidCredentials<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityGetRecommendedDidCredentials.QueryParams,
      ComAtprotoIdentityGetRecommendedDidCredentials.HandlerInput,
      ComAtprotoIdentityGetRecommendedDidCredentials.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.getRecommendedDidCredentials"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  resolveDid<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoIdentityResolveDid.QueryParams,
      ComAtprotoIdentityResolveDid.HandlerInput,
      ComAtprotoIdentityResolveDid.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.identity.resolveDid"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoAdminNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  updateAccountEmail<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminUpdateAccountEmail.QueryParams,
      ComAtprotoAdminUpdateAccountEmail.HandlerInput,
      ComAtprotoAdminUpdateAccountEmail.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountEmail"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.getAccountInfo"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.getSubjectStatus"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.searchAccounts"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.updateAccountPassword"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.updateAccountHandle"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.getInviteCodes"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  updateAccountSigningKey<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminUpdateAccountSigningKey.QueryParams,
      ComAtprotoAdminUpdateAccountSigningKey.HandlerInput,
      ComAtprotoAdminUpdateAccountSigningKey.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.updateAccountSigningKey"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.enableAccountInvites"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.disableAccountInvites"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.disableInviteCodes"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.updateSubjectStatus"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.sendEmail"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.admin.getAccountInfos"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  deleteAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoAdminDeleteAccount.QueryParams,
      ComAtprotoAdminDeleteAccount.HandlerInput,
      ComAtprotoAdminDeleteAccount.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.admin.deleteAccount"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoLabelNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  subscribeLabels<A extends Auth = void>(
    cfg: StreamConfigOrHandler<
      A,
      ComAtprotoLabelSubscribeLabels.QueryParams,
      ComAtprotoLabelSubscribeLabels.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.label.subscribeLabels"; // @ts-ignore - dynamically generated
    return this._server.xrpc.streamMethod(nsid, cfg);
  }

  queryLabels<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoLabelQueryLabels.QueryParams,
      ComAtprotoLabelQueryLabels.HandlerInput,
      ComAtprotoLabelQueryLabels.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.label.queryLabels"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoServerNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  requestEmailConfirmation<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerRequestEmailConfirmation.QueryParams,
      ComAtprotoServerRequestEmailConfirmation.HandlerInput,
      ComAtprotoServerRequestEmailConfirmation.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.requestEmailConfirmation"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.reserveSigningKey"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.getServiceAuth"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.getAccountInviteCodes"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.createSession"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.listAppPasswords"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.createInviteCodes"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.deleteSession"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.revokeAppPassword"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.createAppPassword"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  activateAccount<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoServerActivateAccount.QueryParams,
      ComAtprotoServerActivateAccount.HandlerInput,
      ComAtprotoServerActivateAccount.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.server.activateAccount"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.describeServer"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.confirmEmail"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.getSession"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.refreshSession"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.deactivateAccount"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.updateEmail"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.resetPassword"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.checkAccountStatus"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.requestEmailUpdate"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.requestPasswordReset"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.requestAccountDelete"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.createAccount"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.deleteAccount"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.server.createInviteCode"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoLexiconNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  resolveLexicon<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoLexiconResolveLexicon.QueryParams,
      ComAtprotoLexiconResolveLexicon.HandlerInput,
      ComAtprotoLexiconResolveLexicon.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.lexicon.resolveLexicon"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoSyncNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  getHead<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetHead.QueryParams,
      ComAtprotoSyncGetHead.HandlerInput,
      ComAtprotoSyncGetHead.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getHead"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getBlob<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetBlob.QueryParams,
      ComAtprotoSyncGetBlob.HandlerInput,
      ComAtprotoSyncGetBlob.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getBlob"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.getRepo"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.notifyOfUpdate"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.requestCrawl"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.listBlobs"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.getLatestCommit"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  subscribeRepos<A extends Auth = void>(
    cfg: StreamConfigOrHandler<
      A,
      ComAtprotoSyncSubscribeRepos.QueryParams,
      ComAtprotoSyncSubscribeRepos.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.subscribeRepos"; // @ts-ignore - dynamically generated
    return this._server.xrpc.streamMethod(nsid, cfg);
  }

  getRepoStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetRepoStatus.QueryParams,
      ComAtprotoSyncGetRepoStatus.HandlerInput,
      ComAtprotoSyncGetRepoStatus.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getRepoStatus"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.getRecord"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  listHosts<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncListHosts.QueryParams,
      ComAtprotoSyncListHosts.HandlerInput,
      ComAtprotoSyncListHosts.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.listHosts"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.listRepos"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  getHostStatus<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoSyncGetHostStatus.QueryParams,
      ComAtprotoSyncGetHostStatus.HandlerInput,
      ComAtprotoSyncGetHostStatus.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.sync.getHostStatus"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.getBlocks"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.listReposByCollection"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.sync.getCheckout"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}

export class ComAtprotoRepoNS {
  _server: Server;

  constructor(server: Server) {
    this._server = server;
  }

  listMissingBlobs<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoListMissingBlobs.QueryParams,
      ComAtprotoRepoListMissingBlobs.HandlerInput,
      ComAtprotoRepoListMissingBlobs.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.listMissingBlobs"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.createRecord"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.deleteRecord"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.putRecord"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.uploadBlob"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.importRepo"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.describeRepo"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.getRecord"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }

  applyWrites<A extends Auth = void>(
    cfg: MethodConfigOrHandler<
      A,
      ComAtprotoRepoApplyWrites.QueryParams,
      ComAtprotoRepoApplyWrites.HandlerInput,
      ComAtprotoRepoApplyWrites.HandlerOutput
    >,
  ) {
    const nsid = "com.atproto.repo.applyWrites"; // @ts-ignore - dynamically generated
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
    const nsid = "com.atproto.repo.listRecords"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
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
    const nsid = "com.atproto.moderation.createReport"; // @ts-ignore - dynamically generated
    return this._server.xrpc.method(nsid, cfg);
  }
}
