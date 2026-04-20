import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await db.user.findUnique({
                    where: { email: credentials.email as string },
                });
                if (!user || !user.password_hash) {
                    return null;
                }
                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password_hash
                );
                if (passwordsMatch) {
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.nom + " " + user.prenom,
                        role: user.role,
                    };
                }
                return null;
            },
        }),
    ],
});
