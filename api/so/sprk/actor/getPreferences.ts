import type { AtUriString, DatetimeString, DidString } from "@atp/lex";
import { Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import * as so from "../../../../lex/so.ts";
import {
  ContentLabelPref,
  MutedWord,
  Preferences,
  SavedFeed,
  ThreadViewPref,
} from "../../../../lex/so/sprk/actor/defs.ts";

export default function (server: Server, ctx: AppContext) {
  server.add(so.sprk.actor.getPreferences, {
    auth: ctx.authVerifier.standard,
    handler: async ({ auth }) => {
      const userDid = auth.credentials.iss;

      try {
        const userPref = await ctx.dataplane.preferences.getPreferences(
          userDid,
        );

        const preferences: Preferences = [];

        if (!userPref) {
          return {
            encoding: "application/json",
            body: { preferences },
          };
        }

        if (userPref.contentLabelPrefs?.length) {
          for (const pref of userPref.contentLabelPrefs) {
            preferences.push({
              $type: "so.sprk.actor.defs#contentLabelPref",
              labelerDid: pref.labelerDid as DidString | undefined,
              label: pref.label,
              visibility: pref.visibility as ContentLabelPref["visibility"],
            });
          }
        }

        if (userPref.savedFeeds?.length) {
          preferences.push({
            $type: "so.sprk.actor.defs#savedFeedsPref",
            items: userPref.savedFeeds.map((item) => ({
              ...item,
              type: item.type as SavedFeed["type"],
            })),
          });
        }

        if (userPref.personalDetailsPref) {
          preferences.push({
            $type: "so.sprk.actor.defs#personalDetailsPref",
            birthDate: userPref.personalDetailsPref.birthDate as
              | DatetimeString
              | undefined,
          });
        }

        if (userPref.feedViewPrefs?.length) {
          for (const pref of userPref.feedViewPrefs) {
            preferences.push({
              $type: "so.sprk.actor.defs#feedViewPref",
              feed: pref.feed,
              hideReplies: pref.hideReplies,
              hideRepliesByUnfollowed: pref.hideRepliesByUnfollowed,
              hideRepliesByLikeCount: pref.hideRepliesByLikeCount,
              hideReposts: pref.hideReposts,
              hideQuotePosts: pref.hideQuotePosts,
            });
          }
        }

        if (userPref.threadViewPref) {
          preferences.push({
            $type: "so.sprk.actor.defs#threadViewPref",
            sort: userPref.threadViewPref.sort as ThreadViewPref["sort"],
          });
        }

        if (userPref.interestsPref) {
          preferences.push({
            $type: "so.sprk.actor.defs#interestsPref",
            tags: userPref.interestsPref.tags,
          });
        }

        if (userPref.mutedWordsPref) {
          preferences.push({
            $type: "so.sprk.actor.defs#mutedWordsPref",
            items: userPref.mutedWordsPref.items.map((item) => ({
              ...item,
              targets: item.targets as MutedWord["targets"],
              actorTarget: item.actorTarget as MutedWord["actorTarget"],
              expiresAt: item.expiresAt as DatetimeString | undefined,
            })),
          });
        }

        if (userPref.hiddenPostsPref) {
          preferences.push({
            $type: "so.sprk.actor.defs#hiddenPostsPref",
            items: userPref.hiddenPostsPref.items as AtUriString[],
          });
        }

        if (userPref.labelersPref) {
          preferences.push({
            $type: "so.sprk.actor.defs#labelersPref",
            labelers: userPref.labelersPref.labelers.map((item) => ({
              ...item,
              did: item.did as DidString,
            })),
          });
        }

        return {
          encoding: "application/json",
          body: {
            preferences,
          },
        };
      } catch (error) {
        console.error("Failed to get preferences", { error, userDid });
        throw error;
      }
    },
  });
}
