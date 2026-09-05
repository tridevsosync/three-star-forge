import mongoose, { Mongoose } from "mongoose";
import dns from "node:dns";

// Fix for Node.js querySrv ECONNREFUSED on Windows / ISP DNS resolvers
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore in environments where custom DNS servers cannot be set
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
  uri: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null, uri: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
  const currentUri = process.env.MONGODB_URI;
  if (!currentUri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  // If URI changed, reset the cached connection
  if (cached.conn && cached.uri !== currentUri) {
    await mongoose.disconnect().catch(() => {});
    cached.conn = null;
    cached.promise = null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.uri = currentUri;
    cached.promise = mongoose.connect(currentUri, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.uri = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
