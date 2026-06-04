import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
let anonLimiter: Ratelimit | null = null;
let userLimiter: Ratelimit | null = null;
let redisInitFailed = false;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (redisInitFailed) return null;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    redis = new Redis({ url, token });
    return redis;
  } catch (err) {
    redisInitFailed = true;
    console.error("[ratelimit] failed to init Upstash Redis client", err);
    return null;
  }
}

export function getAnonLimiter(): Ratelimit | null {
  if (anonLimiter) return anonLimiter;
  const r = getRedis();
  if (!r) return null;
  anonLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "humora:anon",
  });
  return anonLimiter;
}

export function getUserLimiter(): Ratelimit | null {
  if (userLimiter) return userLimiter;
  const r = getRedis();
  if (!r) return null;
  userLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "humora:user",
  });
  return userLimiter;
}
