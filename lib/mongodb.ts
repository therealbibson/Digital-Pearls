import { MongoClient, type Db } from "mongodb";

/**
 * Singleton MongoClient using the standard Next.js pattern:
 * in development we cache the client on the global object so that
 * hot-reload doesn't open a new connection on every change.
 */
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "digitalpearls";

// Note: MONGODB_URI is validated lazily inside getClientPromise() rather than
// at import time, so a missing env var doesn't crash unrelated build steps.

let clientPromise: Promise<MongoClient> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var _dpMongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local.");
  }
  if (process.env.NODE_ENV === "development") {
    if (!global._dpMongoClientPromise) {
      global._dpMongoClientPromise = new MongoClient(uri).connect();
    }
    return global._dpMongoClientPromise;
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
