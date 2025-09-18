import { Redis, type RedisOptions } from "ioredis";

import type { TCacheKey, TPubSubChannel } from "@fsplit/types/redis-keys";
import type { TServicePayload } from "@fsplit/types/services";
import { tryCatch } from "./utils";

const CACHE_TTL_SECONDS = 3600;

class RedisClient {
  private static instance: Redis | null = null;

  constructor() {
    throw new Error("Use RedisClient.getInstance() instead of new.");
  }

  // Singleton instance for caching and publishing.
  static getInstance(): Redis {
    if (!RedisClient.instance) {
      const redisOptions: RedisOptions = {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          return Math.min(times * 50, 2000);
        },
      };

      if (!redisOptions.host) {
        throw new Error("REDIS_HOST environment variable is not set");
      }

      RedisClient.instance = new Redis(redisOptions);
      RedisClient.instance.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });
      RedisClient.instance.on("connect", () => {
        console.log("Connected to Redis successfully.");
      });
    }

    return RedisClient.instance;
  }

  // New instance for every subscriber connection.
  static createSubscriber(): Redis {
    const redisOptions: RedisOptions = {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
    };

    if (!redisOptions.host) {
      throw new Error("REDIS_HOST environment variable is not set");
    }

    const subscriber = new Redis(redisOptions);

    subscriber.on("error", (error) => {
      console.error("Redis Subscriber Error: ", error);
    });
    subscriber.on("connect", () => {
      console.log("Subscriber connected to Redis successfully.");
    });

    return subscriber;
  }

  static async disconnect(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
      RedisClient.instance = null;
    }
  }
}

// Singleton Redis client for caching and publishing.
export const redis = RedisClient.getInstance();

// Fetches the cache for provided key.
export async function getCache<T>(key: TCacheKey): Promise<T | null> {
  const { data, error } = await tryCatch(
    (async () => {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    })()
  );
  if (!!error) {
    console.error(`Failed to fetch cache for key: ${key}\nError: ${error}`);
    return null;
  }
  return data;
}

// Sets cache data for the provided key.
export async function setCache<T>(
  key: TCacheKey,
  value: T,
  setExpiry: boolean = true
): Promise<void> {
  if (!value) return;
  const stringValue = JSON.stringify(value);

  const { error } = await tryCatch(
    (async () => {
      if (setExpiry) {
        await redis.setex(key, CACHE_TTL_SECONDS, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
    })()
  );
  if (!!error)
    console.error(`Failed to set cache for key: ${key}\nError: ${error}`);
}

// Deletes cache data for the provided key.
export async function deleteCache(key: TCacheKey): Promise<void> {
  const { error } = await tryCatch(
    (async () => {
      await redis.del(key);
    })()
  );
  if (!!error)
    console.error(`Failed to delete cache for key: ${key}\nError: ${error}`);
}

// Publish a message to Redis channel. Publisher uses singleton instance.
export async function publish<T extends TServicePayload>(
  channel: TPubSubChannel,
  message: T
): Promise<void> {
  const { error } = await tryCatch(
    (async () => {
      const stringMessage = JSON.stringify(message);
      await redis.publish(channel, stringMessage);
    })()
  );
  if (!!error) {
    console.error(`Failed to publish to channel ${channel}: `, error);
    throw error;
  }
}

// Subscribe to Redis channel with a handler.
// Creates a new subscriber instance for each connection.
// Returns a unsubscribe cleanup function to close connection.
export async function subscribe<T extends TServicePayload>(
  channel: TPubSubChannel,
  handler: (message: T) => void | Promise<void>
): Promise<() => void> {
  const subscriber = RedisClient.createSubscriber();

  // Create the subscription.
  subscriber.subscribe(channel, (error) => {
    if (!!error)
      console.error(`Failed to subscribe to channel ${channel}: `, error);
    else console.log(`Subscribed to channel ${channel}`);
  });

  // Handle the message.
  subscriber.on("message", (subChannel, message) => {
    if (subChannel === channel) {
      try {
        const parsedMessage = JSON.parse(message) as T;
        handler(parsedMessage);
      } catch (error) {
        console.error(
          `Failed to parse message from channel ${channel}: `,
          error
        );
      }
    }
  });

  // Return the unsubscribe cleanup function.
  return () => {
    subscriber.unsubscribe(channel, (error) => {
      if (!!error)
        console.error(`Failed to unsubscribe from channel ${channel}: `, error);
      else console.log(`Unsubscribed from channel ${channel}`);
    });

    subscriber.quit((error) => {
      if (!!error)
        console.error(
          `Failed to close subscriber for channel ${channel}: `,
          error
        );
      else console.log(`Closed subscriber for channel ${channel}`);
    });
  };
}
