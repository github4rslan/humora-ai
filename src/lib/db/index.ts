import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as { mongoose?: MongooseCache };
const cached: MongooseCache =
  globalForMongoose.mongoose ?? { conn: null, promise: null };
if (!globalForMongoose.mongoose) globalForMongoose.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: "humora",
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
