import NextAuth, { Account, NextAuthOptions, Profile, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export const nextAuth: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: `${process.env.GITHUB_CLIENT_ID}`,
      clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  secret: `${process.env.NEXT_AUTH_SECRET}`,

  callbacks: {
    async session({ session }) {
      try {
        const userAtiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user?.email as string)
                    )
                  )
                )
              ),
              q.Match("subscription_by_status"),
              "active",
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userAtiveSubscription,
        };
      } catch (error) {
        console.log("ERR", error);
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },

    async signIn({ user }) {
      const { email } = user;
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index("user_by_email"),
                  q.Casefold(user.email as string)
                )
              )
            ),
            q.Create(q.Collection("users"), {
              data: {
                email,
              },
            }),
            q.Get(
              q.Match(
                q.Index("user_by_email"),
                q.Casefold(user.email as string)
              )
            )
          )
        );
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

export default NextAuth(nextAuth);
