import type { NextAuthConfig } from "next-auth";

export default {
    providers: [],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.role) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;
