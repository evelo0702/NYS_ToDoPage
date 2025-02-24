import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("데이터베이스 URI를 작성해주세요");
}

let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongo) {
    globalThis._mongo = new MongoClient(MONGO_URI).connect();
  }
  connectDB = globalThis._mongo;
} else {
  connectDB = new MongoClient(MONGO_URI).connect();
}

export { connectDB };
