/**
 * GENERATED CODE - DO NOT MODIFY
 */
const id = "tools.ozone.report.defs";

export type ReasonType =
  | "tools.ozone.report.defs#reasonAppeal"
  | "tools.ozone.report.defs#reasonOther"
  | "tools.ozone.report.defs#reasonViolenceAnimal"
  | "tools.ozone.report.defs#reasonViolenceThreats"
  | "tools.ozone.report.defs#reasonViolenceGraphicContent"
  | "tools.ozone.report.defs#reasonViolenceGlorification"
  | "tools.ozone.report.defs#reasonViolenceExtremistContent"
  | "tools.ozone.report.defs#reasonViolenceTrafficking"
  | "tools.ozone.report.defs#reasonViolenceOther"
  | "tools.ozone.report.defs#reasonSexualAbuseContent"
  | "tools.ozone.report.defs#reasonSexualNCII"
  | "tools.ozone.report.defs#reasonSexualDeepfake"
  | "tools.ozone.report.defs#reasonSexualAnimal"
  | "tools.ozone.report.defs#reasonSexualUnlabeled"
  | "tools.ozone.report.defs#reasonSexualOther"
  | "tools.ozone.report.defs#reasonChildSafetyCSAM"
  | "tools.ozone.report.defs#reasonChildSafetyGroom"
  | "tools.ozone.report.defs#reasonChildSafetyPrivacy"
  | "tools.ozone.report.defs#reasonChildSafetyHarassment"
  | "tools.ozone.report.defs#reasonChildSafetyOther"
  | "tools.ozone.report.defs#reasonHarassmentTroll"
  | "tools.ozone.report.defs#reasonHarassmentTargeted"
  | "tools.ozone.report.defs#reasonHarassmentHateSpeech"
  | "tools.ozone.report.defs#reasonHarassmentDoxxing"
  | "tools.ozone.report.defs#reasonHarassmentOther"
  | "tools.ozone.report.defs#reasonMisleadingBot"
  | "tools.ozone.report.defs#reasonMisleadingImpersonation"
  | "tools.ozone.report.defs#reasonMisleadingSpam"
  | "tools.ozone.report.defs#reasonMisleadingScam"
  | "tools.ozone.report.defs#reasonMisleadingElections"
  | "tools.ozone.report.defs#reasonMisleadingOther"
  | "tools.ozone.report.defs#reasonRuleSiteSecurity"
  | "tools.ozone.report.defs#reasonRuleProhibitedSales"
  | "tools.ozone.report.defs#reasonRuleBanEvasion"
  | "tools.ozone.report.defs#reasonRuleOther"
  | "tools.ozone.report.defs#reasonSelfHarmContent"
  | "tools.ozone.report.defs#reasonSelfHarmED"
  | "tools.ozone.report.defs#reasonSelfHarmStunts"
  | "tools.ozone.report.defs#reasonSelfHarmSubstances"
  | "tools.ozone.report.defs#reasonSelfHarmOther"
  | (string & globalThis.Record<PropertyKey, never>);

/** Appeal a previously taken moderation action */
export const REASONAPPEAL: string = `${id}#reasonAppeal`;
/** An issue not included in these options */
export const REASONOTHER: string = `${id}#reasonOther`;
/** Animal welfare violations */
export const REASONVIOLENCEANIMAL: string = `${id}#reasonViolenceAnimal`;
/** Threats or incitement */
export const REASONVIOLENCETHREATS: string = `${id}#reasonViolenceThreats`;
/** Graphic violent content */
export const REASONVIOLENCEGRAPHICCONTENT: string =
  `${id}#reasonViolenceGraphicContent`;
/** Glorification of violence */
export const REASONVIOLENCEGLORIFICATION: string =
  `${id}#reasonViolenceGlorification`;
/** Extremist content. These reports will be sent only be sent to the application's Moderation Authority. */
export const REASONVIOLENCEEXTREMISTCONTENT: string =
  `${id}#reasonViolenceExtremistContent`;
/** Human trafficking */
export const REASONVIOLENCETRAFFICKING: string =
  `${id}#reasonViolenceTrafficking`;
/** Other violent content */
export const REASONVIOLENCEOTHER: string = `${id}#reasonViolenceOther`;
/** Adult sexual abuse content */
export const REASONSEXUALABUSECONTENT: string =
  `${id}#reasonSexualAbuseContent`;
/** Non-consensual intimate imagery */
export const REASONSEXUALNCII: string = `${id}#reasonSexualNCII`;
/** Deepfake adult content */
export const REASONSEXUALDEEPFAKE: string = `${id}#reasonSexualDeepfake`;
/** Animal sexual abuse */
export const REASONSEXUALANIMAL: string = `${id}#reasonSexualAnimal`;
/** Unlabelled adult content */
export const REASONSEXUALUNLABELED: string = `${id}#reasonSexualUnlabeled`;
/** Other sexual violence content */
export const REASONSEXUALOTHER: string = `${id}#reasonSexualOther`;
/** Child sexual abuse material (CSAM). These reports will be sent only be sent to the application's Moderation Authority. */
export const REASONCHILDSAFETYCSAM: string = `${id}#reasonChildSafetyCSAM`;
/** Grooming or predatory behavior. These reports will be sent only be sent to the application's Moderation Authority. */
export const REASONCHILDSAFETYGROOM: string = `${id}#reasonChildSafetyGroom`;
/** Privacy violation involving a minor */
export const REASONCHILDSAFETYPRIVACY: string =
  `${id}#reasonChildSafetyPrivacy`;
/** Harassment or bullying of minors */
export const REASONCHILDSAFETYHARASSMENT: string =
  `${id}#reasonChildSafetyHarassment`;
/** Other child safety. These reports will be sent only be sent to the application's Moderation Authority. */
export const REASONCHILDSAFETYOTHER: string = `${id}#reasonChildSafetyOther`;
/** Trolling */
export const REASONHARASSMENTTROLL: string = `${id}#reasonHarassmentTroll`;
/** Targeted harassment */
export const REASONHARASSMENTTARGETED: string =
  `${id}#reasonHarassmentTargeted`;
/** Hate speech */
export const REASONHARASSMENTHATESPEECH: string =
  `${id}#reasonHarassmentHateSpeech`;
/** Doxxing */
export const REASONHARASSMENTDOXXING: string = `${id}#reasonHarassmentDoxxing`;
/** Other harassing or hateful content */
export const REASONHARASSMENTOTHER: string = `${id}#reasonHarassmentOther`;
/** Fake account or bot */
export const REASONMISLEADINGBOT: string = `${id}#reasonMisleadingBot`;
/** Impersonation */
export const REASONMISLEADINGIMPERSONATION: string =
  `${id}#reasonMisleadingImpersonation`;
/** Spam */
export const REASONMISLEADINGSPAM: string = `${id}#reasonMisleadingSpam`;
/** Scam */
export const REASONMISLEADINGSCAM: string = `${id}#reasonMisleadingScam`;
/** False information about elections */
export const REASONMISLEADINGELECTIONS: string =
  `${id}#reasonMisleadingElections`;
/** Other misleading content */
export const REASONMISLEADINGOTHER: string = `${id}#reasonMisleadingOther`;
/** Hacking or system attacks */
export const REASONRULESITESECURITY: string = `${id}#reasonRuleSiteSecurity`;
/** Promoting or selling prohibited items or services */
export const REASONRULEPROHIBITEDSALES: string =
  `${id}#reasonRuleProhibitedSales`;
/** Banned user returning */
export const REASONRULEBANEVASION: string = `${id}#reasonRuleBanEvasion`;
/** Other */
export const REASONRULEOTHER: string = `${id}#reasonRuleOther`;
/** Content promoting or depicting self-harm */
export const REASONSELFHARMCONTENT: string = `${id}#reasonSelfHarmContent`;
/** Eating disorders */
export const REASONSELFHARMED: string = `${id}#reasonSelfHarmED`;
/** Dangerous challenges or activities */
export const REASONSELFHARMSTUNTS: string = `${id}#reasonSelfHarmStunts`;
/** Dangerous substances or drug abuse */
export const REASONSELFHARMSUBSTANCES: string =
  `${id}#reasonSelfHarmSubstances`;
/** Other dangerous content */
export const REASONSELFHARMOTHER: string = `${id}#reasonSelfHarmOther`;
