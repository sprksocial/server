/**
 * Utility functions for normalizing embeds to ensure CID objects are converted to $link format
 * This ensures consistent storage and retrieval of embed data across the application.
 */

interface CidRef {
  $link?: string;
  code?: number;
  version?: number;
  multihash?: Uint8Array;
  bytes?: string;
  toString?: () => string;
}

interface NormalizedCidRef {
  $link: string;
}

interface VideoEmbed {
  $type: "so.sprk.embed.video";
  video?: {
    $type: "blob";
    ref: CidRef;
    mimeType?: string;
    size?: number;
  };
}

interface ImageEmbed {
  $type: "so.sprk.embed.images";
  images?: Array<{
    image: {
      $type: "blob";
      ref: CidRef;
      mimeType?: string;
      size?: number;
    };
    alt?: string;
    aspectRatio?: number;
  }>;
}

interface Profile {
  avatar?: {
    $type?: "blob";
    ref?: NormalizedCidRef | null;
  } | CidRef;
  banner?: {
    $type?: "blob";
    ref?: NormalizedCidRef | null;
  } | CidRef;
  [key: string]: unknown;
}

// Normalize embed to ensure CID objects are converted to $link format
export function normalizeEmbed(embed: unknown): unknown {
  if (!embed || typeof embed !== "object") return embed;

  const embedObj = embed as Record<string, unknown>;

  if (
    embedObj.$type === "so.sprk.media.video" && embedObj.video &&
    typeof embedObj.video === "object"
  ) {
    const video = embedObj.video as Record<string, unknown>;
    if (video.ref) {
      const ref = video.ref;
      // If ref is a CID object (has code/version/multihash), convert to $link
      if (
        typeof ref === "object" && ref && !(ref as CidRef).$link &&
        ((ref as CidRef).code || (ref as CidRef).version ||
          (ref as CidRef).multihash)
      ) {
        const toStringFn = (ref as CidRef).toString;

        if (toStringFn && typeof toStringFn === "function") {
          const cidString = toStringFn.call(ref);
          // Return cleaned up structure without 'original' field
          return {
            $type: "so.sprk.media.video",
            video: {
              $type: "blob",
              ref: { $link: cidString },
              mimeType: video.mimeType,
              size: video.size,
            },
          };
        } else {
          console.error("DEBUG: Could not convert CID object to string:", ref);
          return embed; // Return original if we can't convert
        }
      } else if ((ref as CidRef).$link) {
        // Already normalized, return cleaned up structure
        return {
          $type: "so.sprk.media.video",
          video: {
            $type: "blob",
            ref: { $link: (ref as CidRef).$link },
            mimeType: video.mimeType,
            size: video.size,
          },
        };
      }
    }
  }

  if (
    embedObj.$type === "so.sprk.media.images" && Array.isArray(embedObj.images)
  ) {
    const normalizedImages = embedObj.images.map((img: unknown) => {
      if (
        typeof img === "object" && img && (img as Record<string, unknown>).image
      ) {
        const image = (img as Record<string, unknown>).image as Record<
          string,
          unknown
        >;
        if (image.ref) {
          const ref = image.ref;
          if (
            typeof ref === "object" && ref && !(ref as CidRef).$link &&
            ((ref as CidRef).code || (ref as CidRef).version ||
              (ref as CidRef).multihash)
          ) {
            const toStringFn = (ref as CidRef).toString;

            if (toStringFn && typeof toStringFn === "function") {
              const cidString = toStringFn.call(ref);
              return {
                image: {
                  $type: "blob",
                  ref: { $link: cidString },
                  mimeType: image.mimeType,
                  size: image.size,
                },
                alt: (img as Record<string, unknown>).alt,
                aspectRatio: (img as Record<string, unknown>).aspectRatio,
              };
            } else {
              console.error(
                "DEBUG: Could not convert CID object to string:",
                ref,
              );
              return img;
            }
          } else if ((ref as CidRef).$link) {
            // Already normalized
            return {
              image: {
                $type: "blob",
                ref: { $link: (ref as CidRef).$link },
                mimeType: image.mimeType,
                size: image.size,
              },
              alt: (img as Record<string, unknown>).alt,
              aspectRatio: (img as Record<string, unknown>).aspectRatio,
            };
          }
        }
      }
      return img;
    });

    return {
      $type: "so.sprk.media.images",
      images: normalizedImages,
    };
  }

  return embed;
}

// Normalize a single CID reference to $link format
export function normalizeCidRef(
  ref: CidRef | null | undefined,
): NormalizedCidRef | null | undefined {
  if (!ref) return ref;

  // If it's already in $link format, return as-is
  if (typeof ref === "object" && ref.$link) {
    return ref as NormalizedCidRef;
  }

  // If it's a CID object (has code/version/multihash), convert to $link
  if (
    typeof ref === "object" && !ref.$link &&
    (ref.code || ref.version || ref.multihash)
  ) {
    let cidString: string;
    const toStringFn = ref.toString;

    if (toStringFn && typeof toStringFn === "function") {
      cidString = toStringFn.call(ref);
    } else {
      console.error("DEBUG: Could not convert CID object to string:", ref);
      return ref as NormalizedCidRef; // Return original if we can't convert
    }

    return { $link: cidString };
  }

  // If it's a string, wrap it in $link format
  if (typeof ref === "string") {
    return { $link: ref };
  }

  return ref as NormalizedCidRef;
}

// Normalize profile data to ensure any CID references are converted to $link format
export function normalizeProfile(profile: unknown): unknown {
  if (!profile || typeof profile !== "object") return profile;

  const normalized: Record<string, unknown> = {
    ...profile as Record<string, unknown>,
  };

  // Normalize avatar if present
  if (normalized.avatar) {
    // If avatar is a BlobRef (has ref property), normalize the ref
    if (
      typeof normalized.avatar === "object" && normalized.avatar &&
      "ref" in normalized.avatar
    ) {
      const normalizedRef = normalizeCidRef(
        (normalized.avatar as Record<string, unknown>).ref as CidRef,
      );
      if (normalizedRef) {
        // Return only the MediaRef format: { $type: "blob", ref: { $link: string } }
        normalized.avatar = {
          $type: "blob",
          ref: normalizedRef,
        };
      }
    } else {
      // If avatar is just a CID object, wrap it in the proper structure
      const normalizedRef = normalizeCidRef(normalized.avatar as CidRef);
      if (normalizedRef) {
        normalized.avatar = {
          $type: "blob",
          ref: normalizedRef,
        };
      }
    }
  }

  // Normalize banner if present
  if (normalized.banner) {
    // If banner is a BlobRef (has ref property), normalize the ref
    if (
      typeof normalized.banner === "object" && normalized.banner &&
      "ref" in normalized.banner
    ) {
      const normalizedRef = normalizeCidRef(
        (normalized.banner as Record<string, unknown>).ref as CidRef,
      );
      if (normalizedRef) {
        // Return only the MediaRef format: { $type: "blob", ref: { $link: string } }
        normalized.banner = {
          $type: "blob",
          ref: normalizedRef,
        };
      }
    } else {
      // If banner is just a CID object, wrap it in the proper structure
      const normalizedRef = normalizeCidRef(normalized.banner as CidRef);
      if (normalizedRef) {
        normalized.banner = {
          $type: "blob",
          ref: normalizedRef,
        };
      }
    }
  }

  return normalized;
}

// Normalize any object that might contain CID references
export function normalizeObject(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeObject(item));
  }

  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (
      key === "ref" && typeof value === "object" && value &&
      !(value as CidRef).$link &&
      ((value as CidRef).code || (value as CidRef).version ||
        (value as CidRef).multihash)
    ) {
      // This looks like a CID object, normalize it
      normalized[key] = normalizeCidRef(value as CidRef);
    } else if (typeof value === "object" && value !== null) {
      // Recursively normalize nested objects
      normalized[key] = normalizeObject(value);
    } else {
      // Keep primitive values as-is
      normalized[key] = value;
    }
  }

  return normalized;
}
