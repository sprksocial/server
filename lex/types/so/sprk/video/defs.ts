/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type { BlobRef } from "@atp/lexicon";
import { validate as _validate } from "../../../../lexicons.ts";
import type { ValidationResult } from "@atp/lexicon";
import { is$typed as _is$typed } from "../../../../util.ts";
import type * as SoSprkSoundDefs from "../sound/defs.ts";

const is$typed = _is$typed, validate = _validate;
const id = "so.sprk.video.defs";

export interface JobStatus {
  $type?: "so.sprk.video.defs#jobStatus";
  jobId: string;
  did: string;
  /** The state of the video processing job. All values not listed as a known value indicate that the job is in process. */
  state:
    | "JOB_STATE_COMPLETED"
    | "JOB_STATE_FAILED"
    | "JOB_STATE_QUEUED"
    | "JOB_STATE_PROCESSING"
    | (string & globalThis.Record<PropertyKey, never>);
  /** Progress within the current processing state. */
  progress?: number;
  blob?: BlobRef;
  audio?: ExtractedAudio;
  error?: string;
  message?: string;
}

const hashJobStatus = "jobStatus";

export function isJobStatus<V>(v: V): v is JobStatus & V {
  return is$typed(v, id, hashJobStatus);
}

export function validateJobStatus<V>(v: V): ValidationResult<JobStatus & V> {
  return validate<JobStatus & V>(v, id, hashJobStatus);
}

/** Audio extracted from the uploaded video for client-side record creation. */
export interface ExtractedAudio {
  $type?: "so.sprk.video.defs#extractedAudio";
  details?: SoSprkSoundDefs.AudioDetails;
  blob: BlobRef;
}

const hashExtractedAudio = "extractedAudio";

export function isExtractedAudio<V>(v: V): v is ExtractedAudio & V {
  return is$typed(v, id, hashExtractedAudio);
}

export function validateExtractedAudio<V>(
  v: V,
): ValidationResult<ExtractedAudio & V> {
  return validate<ExtractedAudio & V>(v, id, hashExtractedAudio);
}
