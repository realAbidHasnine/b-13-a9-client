import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/IdeaVault");
const db = client.db("IdeaVault");

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: mongodbAdapter(db),
  plugins: [jwt()],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "temp_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "temp_client_secret",
    },
  },
  
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60 
    }
  }
});