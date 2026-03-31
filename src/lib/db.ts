import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (process.env.NODE_ENV === "production" && !MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside Vercel Dashboard");
}

const CONNECTION_URI = MONGODB_URI || "mongodb://localhost:27017/atrioslabs";

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: GlobalMongoose | undefined;
}

const cached: GlobalMongoose = global._mongoose ?? { conn: null, promise: null };

if (!global._mongoose) {
  global._mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(CONNECTION_URI, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB connected");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
