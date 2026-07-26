import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isApprovedTeacher } from "@/lib/data/teacherAllowlist";
import { verifyMagicLinkToken } from "@/lib/magicLinkToken";

// NOTE: next-auth's built-in "Email"/"Resend" provider (type: "email")
// requires a database adapter to store verification tokens — there is no
// way to use it with JWT-only, database-less sessions. Since this project
// has a hard "no database" constraint, magic links are implemented as a
// self-contained, signed JWT (see lib/magicLinkToken.ts) that is emailed via
// the Resend API directly (app/api/auth/magic-link/route.ts), then redeemed
// here through a one-off Credentials provider. This keeps everything
// stateless: the token itself is the only "record" of the sign-in request.
export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours — roughly one school day
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        Credentials({
            id: "magic-link",
            name: "Magic Link",
            credentials: {
                token: { label: "Token", type: "text" },
            },
            async authorize(credentials) {
                const token = credentials?.token;
                if (typeof token !== "string") return null;

                let email: string;
                try {
                    email = await verifyMagicLinkToken(token);
                } catch {
                    return null;
                }

                if (!isApprovedTeacher(email)) return null;

                return { id: email, email };
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;
            return isApprovedTeacher(user.email);
        },
        async jwt({ token, user }) {
            if (user?.email) token.email = user.email;
            return token;
        },
        async session({ session, token }) {
            if (typeof token.email === "string") {
                session.user.email = token.email;
            }
            return session;
        },
    },
});
