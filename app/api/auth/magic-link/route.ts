import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { isApprovedTeacher } from "@/lib/data/teacherAllowlist";
import { createMagicLinkToken } from "@/lib/magicLinkToken";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "invalid-request" }, { status: 400 });
    }

    const email = typeof (body as { email?: unknown })?.email === "string"
        ? (body as { email: string }).email.toLowerCase().trim()
        : "";

    if (!EMAIL_PATTERN.test(email)) {
        return NextResponse.json({ error: "invalid-email" }, { status: 400 });
    }

    if (!isApprovedTeacher(email)) {
        // Deliberately explicit: this is a small, manually-managed allowlist of
        // known teachers, not a public sign-up flow, so there's no meaningful
        // enumeration risk in confirming an email isn't registered.
        return NextResponse.json({ error: "not-approved" }, { status: 403 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.AUTH_RESEND_FROM;
    if (!resendApiKey || !from) {
        console.error("Magic link email not sent: RESEND_API_KEY or AUTH_RESEND_FROM is not configured");
        return NextResponse.json({ error: "send-failed" }, { status: 500 });
    }

    const token = await createMagicLinkToken(email);
    const verifyUrl = new URL("/api/auth/magic-link/verify", request.nextUrl.origin);
    verifyUrl.searchParams.set("token", token);

    try {
        const resend = new Resend(resendApiKey);
        const { error } = await resend.emails.send({
            from,
            to: email,
            subject: "Your Attendance Checker sign-in link",
            html: `<p>Click the link below to sign in to Attendance Checker:</p><p><a href="${verifyUrl.toString()}">Sign in</a></p><p>This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>`,
            text: `Sign in to Attendance Checker: ${verifyUrl.toString()}\n\nThis link expires in 15 minutes. If you didn't request this, you can ignore this email.`,
        });

        if (error) {
            console.error("Resend API returned an error:", error);
            return NextResponse.json({ error: "send-failed" }, { status: 502 });
        }
    } catch (err) {
        console.error("Failed to send magic link email:", err);
        return NextResponse.json({ error: "send-failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}
