import type { NextAuthConfig } from "next-auth";

export default {
    providers: [],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                if (token.role) session.user.role = token.role as string;
                if (token.id) session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;
