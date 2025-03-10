import mongoose from "mongoose";

interface GlobalMongoose {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongoose: GlobalMongoose;
}

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, opts);
    global.mongoose.promise = Promise.resolve(conn.connection);
  }

  try {
    const conn = await global.mongoose.promise;
    global.mongoose.conn = conn;
  } catch (e) {
    global.mongoose.promise = null;
    throw e;
  }

  return global.mongoose.conn;
}

export default dbConnect;
