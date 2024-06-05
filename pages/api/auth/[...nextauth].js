import NextAuth from "next-auth";
// import Providers from 'next-auth/providers';
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

export const authOptions = {
  session: {
    // jwt: true,
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log you in!");
        }

        client.close();
        return {
          email: user.email,
          gmail: "user.test@gmail.com",
        };
      },
    }),
  ],
  secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        return { ...token, email: user.email, gmail: user.gmail };
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          email: session.user.email,
          gmail: token.gmail ?? "invalid",
        },
      };
    },
  },
};

export default NextAuth(authOptions);
