// Cache keys.
type CacheKeyPatterns = {
  // EXAMPLE PATTERN: Avatar: `avatar:${string}`;
  // Add new keys here, e.g., TaskCache: `task_${string}`
};

// EXAMPLE KEY EXPORT: export type AvatarKey = CacheKeyPatterns["Avatar"];

// Pub/Sub channel keys.
type PubSubChannelKeyPatterns = {};

// Union types for cache keys and pub/sub channel keys.
export type TCacheKey = CacheKeyPatterns[keyof CacheKeyPatterns];
export type TPubSubChannel = "MESSAGES";
