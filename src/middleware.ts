import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

const protectedPaths = ["/dashboard", "/contacts", "/entreprises", "/visites", "/reporting", "/profile"];

export default middleware((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isAuthPage = nextUrl.pathname.startsWith("/login");
    const isProtectedRoute = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
    );

    if (isAuthPage) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return null;
    }

    if (isProtectedRoute && !isLoggedIn) {
        let from = nextUrl.pathname;
        if (nextUrl.search) {
            from += nextUrl.search;
        }

        return Response.redirect(
            new URL(`/login?from=${encodeURIComponent(from)}`, nextUrl)
        );
    }

    return null;
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
