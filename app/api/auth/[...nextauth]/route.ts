import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "~/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
    FacebookProvider({
      clientId: String(process.env.FACEBOOK_CLIENT_ID),
      clientSecret: String(process.env.FACEBOOK_CLIENT_SECRET),
    }),
    GithubProvider({
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials)
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        // If user password doesn't exist it's either it doesn't exist OR wrong strategy was selected (google / github / facebook obviously don't provider passwords, so it will be `null` and throw an error)
        if (!user?.password) {
          throw new Error("User not found")
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordCorrect) {
          throw new Error("Invalid password")
        }

        return user
      },
    }),
  ],
  callbacks: {
    async session({ token, user, session }) {
      session.user.id = user?.id
      session.user.name = token?.name ?? ""
      session.user.image = token?.picture ?? ""

      return session
    },
    async signIn({ user, account }) {
      // If provider is credentials but user doesn't exist we return `false`
      if (account?.provider === "credentials" && user.email) {
        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (!userExists) return false
      }

      // If user.email doesn't exist we return `false` regardless the provider
      return Boolean(user.email)
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
