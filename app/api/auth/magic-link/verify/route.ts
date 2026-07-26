import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
        return NextResponse.redirect(new URL("/login?error=InvalidToken", request.nextUrl.origin));
    }

    // authorize() in lib/auth.ts verifies the token's signature/expiry and
    // re-checks the allowlist; if either fails it returns null and signIn()
    // resolves to the configured error page instead of setting a session.
    const destination = await signIn("magic-link", {
        token,
        redirect: false,
        redirectTo: "/",
    });

    return NextResponse.redirect(new URL(destination, request.nextUrl.origin));
}
