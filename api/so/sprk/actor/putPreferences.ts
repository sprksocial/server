import { Server } from "../../../../lex/index.ts";
import {
  ContentLabelPref,
  FeedViewPref,
  HiddenPostsPref,
  InterestsPref,
  LabelersPref,
  MutedWordsPref,
  PersonalDetailsPref,
  PostInteractionSettingsPref,
  SavedFeedsPref,
  ThreadViewPref,
} from "../../../../lex/types/so/sprk/actor/defs.ts";
import { PreferenceDocument } from "../../../../data-plane/db/models.ts";
import { AppContext } from "../../../../context.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.actor.putPreferences({
    auth: ctx.authVerifier.standard,
    handler: async ({ input, auth }) => {
      const userDid = auth.credentials.iss;
      const body = input.body;

      try {
        const now = new Date().toISOString();

        const updateData: Partial<PreferenceDocument> = {
          updatedAt: now,
        };

        // Track which preference types we've seen to collect all entries
        const contentLabelPrefs: NonNullable<
          PreferenceDocument["contentLabelPrefs"]
        > = [];
        const feedViewPrefs: NonNullable<
          PreferenceDocument["feedViewPrefs"]
        > = [];

        for (const pref of body.preferences) {
          switch (pref.$type) {
            case "so.sprk.actor.defs#contentLabelPref": {
              const p = pref as ContentLabelPref;
              contentLabelPrefs.push({
                labelerDid: p.labelerDid,
                label: p.label,
                visibility: p.visibility,
              });
              break;
            }
            case "so.sprk.actor.defs#savedFeedsPref": {
              const p = pref as SavedFeedsPref;
              updateData.savedFeeds = p.items ?? [];
              break;
            }
            case "so.sprk.actor.defs#personalDetailsPref": {
              const p = pref as PersonalDetailsPref;
              updateData.personalDetailsPref = {
                birthDate: p.birthDate,
              };
              break;
            }
            case "so.sprk.actor.defs#feedViewPref": {
              const p = pref as FeedViewPref;
              feedViewPrefs.push({
                feed: p.feed,
                hideReplies: p.hideReplies,
                hideRepliesByUnfollowed: p.hideRepliesByUnfollowed,
                hideRepliesByLikeCount: p.hideRepliesByLikeCount,
                hideRepliesByLookCount: p.hideRepliesByLookCount,
                hideReposts: p.hideReposts,
                hideQuotePosts: p.hideQuotePosts,
              });
              break;
            }
            case "so.sprk.actor.defs#threadViewPref": {
              const p = pref as ThreadViewPref;
              updateData.threadViewPref = {
                sort: p.sort,
              };
              break;
            }
            case "so.sprk.actor.defs#interestsPref": {
              const p = pref as InterestsPref;
              updateData.interestsPref = {
                tags: p.tags,
              };
              break;
            }
            case "so.sprk.actor.defs#mutedWordsPref": {
              const p = pref as MutedWordsPref;
              updateData.mutedWordsPref = {
                items: p.items ?? [],
              };
              break;
            }
            case "so.sprk.actor.defs#hiddenPostsPref": {
              const p = pref as HiddenPostsPref;
              updateData.hiddenPostsPref = {
                items: p.items ?? [],
              };
              break;
            }
            case "so.sprk.actor.defs#labelersPref": {
              const p = pref as LabelersPref;
              updateData.labelersPref = {
                labelers: p.labelers ?? [],
              };
              break;
            }
            case "so.sprk.actor.defs#postInteractionSettingsPref": {
              const p = pref as PostInteractionSettingsPref;
              updateData.postInteractionSettingsPref = {
                threadgateAllowRules: p.threadgateAllowRules as Array<{
                  $type: string;
                  [key: string]: unknown;
                }>,
              };
              break;
            }
          }
        }

        // Set array-based preferences if we found any
        if (contentLabelPrefs.length > 0) {
          updateData.contentLabelPrefs = contentLabelPrefs;
        }
        if (feedViewPrefs.length > 0) {
          updateData.feedViewPrefs = feedViewPrefs;
        }

        await ctx.dataplane.preferences.putPreferences(userDid, updateData);

        return;
      } catch (error) {
        ctx.logger.error("Failed to put preferences", { error, userDid });
        throw error;
      }
    },
  });
}
