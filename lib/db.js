import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://nextjsuser:nextjsuser@cluster0.hrhhxnq.mongodb.net/auth-demo?retryWrites=true&w=majority"
  );

  return client;
}
