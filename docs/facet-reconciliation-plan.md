# Spark facet failure reconciliation plan

This proposal repairs downstream effects skipped by the detached facet matcher
failure. The accompanying patch fixes future post and reply indexing. It does
not implement or execute historical repair. Production writes, deployment,
cursor changes, and historical delivery are outside this review's executed
scope.

The retained October 13–14 logs establish at least 276 distinct affected post
URIs through 01:31:36 UTC, across 282 failed events. This is a lower bound for
that log window, not a complete incident inventory. Later failures and
preexisting native post/reply failures may exist. Neither all Bridgy records nor
all records created after the announcement are a safe repair selection.

## Current code constraints

- Raw records and post rows are stored before the facet failure. Rewriting their
  content, replaying the whole handler, or rewinding the relay cursor is
  unnecessary for the confirmed failure and risks overwriting newer data or
  duplicating effects.
- `RecordProcessor.handleNotifs` deletes all notifications for an updated URI
  and recreates them with `insertMany`. It cannot preserve notification `_id`
  values and provides no semantic uniqueness constraint. Do not use it for
  repair.
- Notifications have `sortAt` and MongoDB `_id`; read state is derived from
  `Actor.lastSeenNotifs`. There is no per-notification read/dismissal field or
  server dismissal endpoint in the inspected code. Missing rows cannot
  universally be distinguished from deliberate removal, and client-side
  dismissal was not audited.
- Normal notification handling queues pushes through `BackgroundQueue` and
  `PushService.sendPush`. `updateSeen` also sends a silent badge-reset push. No
  outbox or change-stream delivery consumer appears in this repository; external
  database triggers or consumers have not been ruled out.
- Live indexing and its background aggregate writes do not use a shared repair
  fence or transaction protocol. Reading a source CID and then writing a
  different document is not an atomic revision guard. Snapshot transactions
  alone do not prevent a concurrent live writer that never touches the same
  fencing document.

These constraints prevent promising race-free online repair or preservation of
unrecorded dismissal history with the present code. Notification writes must
remain blocked until those prerequisites below are satisfied; a dry-run report
can proceed without claiming those guarantees.

## Freeze an explicit candidate manifest

1. Parse retained failures matching this exact stack and cause into an immutable
   local manifest: URI, collection, failed record CID, repository
   revision/commit when available, relay sequence, operation, event time, error
   time, and evidence source. Deduplicate events by sequence and revisions by
   URI plus CID. Keep all observed revisions, not just the latest failure.
   Missing revision evidence means quarantine. Do not put post text or secrets
   in the review report.
2. Bound the incident window by verified failure evidence and a separately
   verified fixed deployment cutoff. The first observed bridged post arrived at
   23:00:13 UTC October 13; this does not bound older occurrences of the general
   bug. Broaden the allowlist only through reviewed, bounded evidence, including
   unmarked posts and replies if found. The 276-URI set is a starting allowlist,
   not permission for a collection-wide scan.
3. Resolve each URI against current raw storage, its materialized post/reply,
   and authoritative repository state through existing permitted reads. Record
   current CID/revision, availability, deletion/takedown state, and
   dependencies. If upstream access is unavailable, state cannot be established,
   or versions disagree, skip and quarantine; do not invent current content from
   an old log.
4. Never resurrect a deleted source, upsert missing post/profile content, or
   replace a newer revision. A URI advanced beyond the reviewed revision needs a
   new plan computed from its current state and a refreshed approval manifest.
   Already-correct effects produce an explicit no-op. Deleted-source
   notification cleanup, if needed, requires its own reviewed deletion evidence
   and allowlist entry.

## Plan downstream differences only

**Counts.** Build unique sets of affected authors and reply parents. Recompute
`Profile.postsCount` with the current implementation's
`Post.countDocuments({
authorDid })`; set the exact result on existing profiles
only. Do not increment by the number of errors. For replies, recompute native
`Reply` rows with the same `reply.parent.uri`, and update the existing parent
selected by the normal Post, Reply, then CrosspostReply precedence. The current
count queries do not add a takedown or validity filter; do not silently
introduce different inclusion rules. Flag this behavior for review rather than
changing it during repair. Missing or ambiguous parents are skips.

**Notifications.** Implement a separate pure planner that derives expected
recipients from the current validated record and necessary
ancestors/descendants, using the same self-notification exclusion, recipient
deduplication, reply-depth, and hidden reply rules as normal indexing. Audit
moderation and user-preference handling before applying;
`filterNotifsForThreadMutes` is currently a pass-through placeholder, not
evidence that mute preferences have been enforced.

Compare expected and existing rows by the semantic key
`(recordUri, did, reason,
reasonSubject-or-null)`. Keep a matching row's `_id`,
`sortAt`, and unrelated fields. Only revision-dependent fields such as
`recordCid` may change, through an approved conditional update. Quarantine
duplicate existing semantic keys rather than arbitrarily deleting one. For an
obsolete UPDATE notification, propose deletion of its exact reviewed `_id` with
a full relevant-field guard and before-image; never call
`deleteMany({recordUri})`. Quarantine cases that might reflect a later user
action or newer live event.

For a proven missing row, retain the source's original notification timestamp
(`createdAt` under the current policy), not repair time. Preserve every existing
actor watermark; never call `updateSeen` or mark an account's notifications
read. Do not insert where missing-row provenance or dismissal history is
ambiguous.

**Unread decision.** The default repair must not add historical unread
notifications. Only propose insertion when a recipient has a known watermark and
the original `sortAt <= lastSeenNotifs`, with the same classification confirmed
by the notification list and unread-count logic. Quarantine missing watermarks,
fallback behavior, and notifications newer than the watermark. With this schema
it is impossible to insert those newer rows while preserving timestamps and
guaranteeing no unread increase without a separate product/schema change.
Obsolete-row removal may reduce unread counts: show exact per-recipient
before/after deltas for approval. Send no badge push; future legitimate requests
may reflect the corrected count.

## Suppress delivery and coordinate writes

Build the repair runner as a dedicated database-only process with a narrow
allowlist. It must not instantiate the live subscription, `RecordProcessor`,
`BackgroundQueue`, or a delivery service, nor call notification/seen APIs. Use a
verified read-only database role for dry run; permit no production writes,
audit-ledger writes, or outbox/queue insertion in that mode. Local report files
are its only output.

For any future apply run, independently inventory synchronous sends, in-memory
queues, persistent queues/outboxes, change-stream consumers, and
database/provider triggers in the deployed environment. Prove repair writes
cannot cause any of them to deliver. Lack of such a consumer in this repository
is insufficient. External delivery egress should be denied for the runner, and
trigger paths must be verified absent or given an explicitly approved
suppression mechanism. Do not disable live user notifications globally. If
suppression cannot be demonstrated, do not apply notification repair. Sent
pushes cannot be recalled.

Apply requires a separately reviewed shared mutation guard honored by live
indexing and background tasks for the affected URIs/authors/parents, or an
explicitly authorized short quiescent window covering those writers with their
queues drained. This patch implements neither and does not authorize a pause.
Without coordination, read-only planning remains available but strong apply
guarantees do not.

Once coordinated, re-read source CID/revision, raw/materialized agreement,
dependency revisions, actor watermark, and notification before-images
immediately before each small unit of work. Abort and re-plan on any mismatch.
Use conditional writes and a short transaction where supported; verify actual
database support before relying on it. Preserve the source and actor documents.
Counter recomputation must occur under the same coordination so a concurrent
create/delete cannot invalidate the count between read and write.

## Dry run and acceptance checks

Produce a deterministic report with manifest hash, code revision,
source/dependency revisions, and one action per object: unchanged, count
correction, notification field correction, missing notification, obsolete
notification, or quarantine with reason. Include before/after values, source
evidence, and unread-count deltas. Do not hide truncation, unavailable
revisions, duplicate notifications, or skipped users. Use indexed
URI/author/parent lookups, explicit limits, timeouts, and small batches; never
scan the JSON collection for a bridge marker without a bounded indexed prefix.

Before any production apply, test the proposed runner on isolated fixtures
covering:

- CREATE and UPDATE failures; mixed facets; missing, duplicate, and obsolete
  notifications; correct existing notification IDs and timestamps; deleted and
  taken-down sources; later revisions; absent profiles/parents; ambiguous state.
- Read/dismissal ambiguity, missing and changing watermarks, no unread
  increases, preserved actor state, and explicitly reported decreases from
  obsolete rows.
- A CID or dependency change between planning and apply aborts all writes for
  that unit. Concurrent aggregate and notification writers obey the chosen
  guard.
- First apply produces only the approved differences; a second run with
  unchanged source state produces zero data changes and zero delivery.
- Crash before commit, after commit but before acknowledgement, and between
  batches; recovery neither repeats insertion nor deletes newly created live
  rows.
- Dry-run database credentials reject writes, and delivery/queue/outbox/trigger
  instrumentation records zero calls or events.

The accompanying 12 facet regressions validate the indexing fix only. These
repair runner acceptance checks have not been implemented or executed.

## Apply audit and recovery proposal

After separate approval, begin with at most five reviewed URIs at concurrency
one. Capture protected before-images and a deterministic operation key derived
from manifest, URI/revision, and target object. Journal planned/applied/verified
states atomically with each unit where supported. Verify committed state after
an uncertain acknowledgement rather than blindly replaying. Persist checkpoints
between small batches, verify counts/notifications and zero delivery, and stop
on revision changes, unexpected fan-out, timeouts, new errors, or any attempted
push.

Rollback is conditional, not a blanket restore. Restore a notification
before-image only if current source/dependency versions and the target still
match the exact repair after-image. Delete a repair-created row only by its
recorded ID and guarded after-image. If a subsequent user/live change exists,
quarantine and re-plan from current state instead. Recompute counters from
current rows rather than restoring a stale numeric before-image after live
activity. Never restore source posts, actor watermarks, or unknown
read/dismissal state. Delivery is irreversible, which is why zero-delivery
validation is an apply prerequisite.

## Review deliverables and remaining gates

Review the matcher patch and its tests independently from this plan. A future
repair requires the explicit revision allowlist, dry-run differences, a
demonstrated live writer coordination mechanism, verified delivery suppression
including external consumers, and resolution of notification
provenance/unread-policy quarantines. No production reconciliation tool or
ready-to-run mutation command is included.
