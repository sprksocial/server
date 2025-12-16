import { assertEquals, assertThrows } from "@std/assert";
import {
  CreatedAtDidKeyset,
  IndexedAtDidKeyset,
  IsoTimeKey,
  LikeCountCidKeyset,
  RkeyKey,
  TimeCidKeyset,
} from "../data-plane/db/pagination.ts";
import { InvalidRequestError } from "@atp/xrpc-server";

// GenericKeyset (tested via TimeCidKeyset)

Deno.test("GenericKeyset", async (t) => {
  const keyset = new TimeCidKeyset();

  await t.step("packCursor uses colon separator", () => {
    const cursor = { primary: "abc123", secondary: "def456" };
    const packed = keyset.packCursor(cursor);
    assertEquals(packed, "abc123:def456");
  });

  await t.step("unpackCursor splits on first colon", () => {
    const unpacked = keyset.unpackCursor("abc123:def456");
    assertEquals(unpacked?.primary, "abc123");
    assertEquals(unpacked?.secondary, "def456");
  });

  await t.step("unpackCursor handles colons in secondary", () => {
    const unpacked = keyset.unpackCursor("abc123:def:456:789");
    assertEquals(unpacked?.primary, "abc123");
    assertEquals(unpacked?.secondary, "def:456:789");
  });

  await t.step("unpackCursor throws on missing separator", () => {
    assertThrows(
      () => keyset.unpackCursor("noseparatorhere"),
      InvalidRequestError,
      "Malformed cursor: missing separator",
    );
  });

  await t.step("unpackCursor throws on empty primary", () => {
    assertThrows(
      () => keyset.unpackCursor(":secondary"),
      InvalidRequestError,
      "Malformed cursor: missing primary or secondary",
    );
  });

  await t.step("unpackCursor throws on empty secondary", () => {
    assertThrows(
      () => keyset.unpackCursor("primary:"),
      InvalidRequestError,
      "Malformed cursor: missing primary or secondary",
    );
  });

  await t.step("getFilter returns descending filter by default", () => {
    const labeled = {
      primary: "2024-01-15T12:00:00.000Z",
      secondary: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
    };
    const filter = keyset.getFilter(labeled);
    assertEquals(filter, {
      $or: [
        { indexedAt: { $lt: "2024-01-15T12:00:00.000Z" } },
        {
          indexedAt: "2024-01-15T12:00:00.000Z",
          cid: { $lt: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq" },
        },
      ],
    });
  });

  await t.step("getFilter returns ascending filter when specified", () => {
    const labeled = {
      primary: "2024-01-15T12:00:00.000Z",
      secondary: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
    };
    const filter = keyset.getFilter(labeled, "asc");
    assertEquals(filter, {
      $or: [
        { indexedAt: { $gt: "2024-01-15T12:00:00.000Z" } },
        {
          indexedAt: "2024-01-15T12:00:00.000Z",
          cid: { $gt: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq" },
        },
      ],
    });
  });

  await t.step("pack and unpack roundtrip", () => {
    const original = {
      primary: "2024-01-15T12:00:00.000Z",
      secondary: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
    };

    const packed = keyset.pack(original);
    const unpacked = keyset.unpack(packed);

    assertEquals(unpacked?.primary, original.primary);
    assertEquals(unpacked?.secondary, original.secondary);
  });

  await t.step("packFromResult with array uses last result", () => {
    const results = [
      { indexedAt: "2024-01-15T12:00:00.000Z", cid: "first" },
      { indexedAt: "2024-01-15T13:00:00.000Z", cid: "second" },
      { indexedAt: "2024-01-15T14:00:00.000Z", cid: "last" },
    ];

    const packed = keyset.packFromResult(results);
    const unpacked = keyset.unpack(packed);

    assertEquals(unpacked?.secondary, "last");
  });
});

// TimeCidKeyset (extends GenericKeyset)

Deno.test("TimeCidKeyset", async (t) => {
  const keyset = new TimeCidKeyset();

  await t.step(
    "labelResult uses current time when indexedAt is missing",
    () => {
      const result = {
        cid: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
      };

      const before = new Date();
      const labeled = keyset.labelResult(result);
      const after = new Date();

      const labeledDate = new Date(labeled.primary);
      assertEquals(labeledDate >= before, true);
      assertEquals(labeledDate <= after, true);
    },
  );

  await t.step("labeledResultToCursor converts to base36 seconds", () => {
    const labeled = {
      primary: "2024-01-15T12:00:00.000Z",
      secondary: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
    };

    const cursor = keyset.labeledResultToCursor(labeled);

    const expectedBase36 = Math.floor(
      new Date("2024-01-15T12:00:00.000Z").getTime() / 1000,
    ).toString(36);
    assertEquals(cursor.primary, expectedBase36);
  });

  await t.step("labeledResultToCursor throws on invalid date", () => {
    const labeled = {
      primary: "not-a-valid-date",
      secondary: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
    };

    assertThrows(
      () => keyset.labeledResultToCursor(labeled),
      InvalidRequestError,
      "Invalid date for cursor",
    );
  });

  await t.step("cursorToLabeledResult converts from base36", () => {
    const base36Seconds = (1705320000).toString(36);
    const cursor = {
      primary: base36Seconds,
      secondary: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
    };

    const labeled = keyset.cursorToLabeledResult(cursor);

    assertEquals(labeled.primary, "2024-01-15T12:00:00.000Z");
  });
});

Deno.test("TimeCidKeyset subclasses", async (t) => {
  await t.step("CreatedAtDidKeyset works with createdAt field", () => {
    const keyset = new CreatedAtDidKeyset();
    const packed = keyset.packFromResult({
      createdAt: "2024-01-15T12:00:00.000Z",
      authorDid: "did:plc:testuser123",
    });
    assertEquals(typeof packed, "string");
  });

  await t.step("IndexedAtDidKeyset works with indexedAt field", () => {
    const keyset = new IndexedAtDidKeyset();
    const packed = keyset.packFromResult({
      indexedAt: "2024-01-15T12:00:00.000Z",
      authorDid: "did:plc:testuser123",
    });
    assertEquals(typeof packed, "string");
  });
});

// LikeCountCidKeyset (extends GenericKeyset)

Deno.test("LikeCountCidKeyset", async (t) => {
  await t.step("cursorToLabeledResult throws on invalid like count", () => {
    const keyset = new LikeCountCidKeyset();
    const cursor = {
      primary: "not-a-number",
      secondary: "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq",
    };

    assertThrows(
      () => keyset.cursorToLabeledResult(cursor),
      InvalidRequestError,
      "Malformed cursor: invalid like count",
    );
  });
});

// GenericSingleKey (tested via RkeyKey)

Deno.test("GenericSingleKey", async (t) => {
  const keyset = new RkeyKey();

  await t.step("getFilter returns descending filter by default", () => {
    const labeled = { primary: "3jui7kd2zcysk" };
    const filter = keyset.getFilter(labeled);
    assertEquals(filter, {
      key: { $lt: "3jui7kd2zcysk" },
    });
  });

  await t.step("getFilter returns ascending filter when specified", () => {
    const labeled = { primary: "3jui7kd2zcysk" };
    const filter = keyset.getFilter(labeled, "asc");
    assertEquals(filter, {
      key: { $gt: "3jui7kd2zcysk" },
    });
  });

  await t.step("unpackCursor throws on colon separator", () => {
    assertThrows(
      () => keyset.unpackCursor("has:colon"),
      InvalidRequestError,
      "Malformed cursor: unexpected separator",
    );
  });

  await t.step("unpackCursor throws on double underscore separator", () => {
    assertThrows(
      () => keyset.unpackCursor("has__underscore"),
      InvalidRequestError,
      "Malformed cursor: unexpected separator",
    );
  });
});

// IsoTimeKey (extends GenericSingleKey)

Deno.test("IsoTimeKey", async (t) => {
  const keyset = new IsoTimeKey();

  await t.step("labeledResultToCursor throws on invalid date", () => {
    const labeled = { primary: "not-a-valid-date" };
    assertThrows(
      () => keyset.labeledResultToCursor(labeled),
      InvalidRequestError,
      "Invalid date for cursor",
    );
  });

  await t.step("cursorToLabeledResult throws on invalid date", () => {
    const cursor = { primary: "invalid-date" };
    assertThrows(
      () => keyset.cursorToLabeledResult(cursor),
      InvalidRequestError,
      "Malformed cursor: invalid date",
    );
  });

  await t.step("pack produces ISO date but unpack fails due to colons", () => {
    // IsoTimeKey produces ISO dates with colons, but GenericSingleKey.unpackCursor
    // rejects strings with colons. This is a known limitation.
    const result = { indexedAt: "2024-01-15T12:00:00.000Z" };
    const packed = keyset.packFromResult(result);

    assertEquals(packed, "2024-01-15T12:00:00.000Z");

    assertThrows(
      () => keyset.unpack(packed),
      InvalidRequestError,
      "Malformed cursor: unexpected separator",
    );
  });
});

// RkeyKey (extends GenericSingleKey)

Deno.test("RkeyKey", async (t) => {
  await t.step("cursorToLabeledResult throws on invalid record key", () => {
    const keyset = new RkeyKey();
    const cursor = { primary: "invalid/key" };
    assertThrows(
      () => keyset.cursorToLabeledResult(cursor),
      InvalidRequestError,
      "Malformed cursor",
    );
  });
});
