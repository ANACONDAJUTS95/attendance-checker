import { SignJWT, jwtVerify } from "jose";

const MAGIC_LINK_TTL = "15m";

function getSecretKey(): Uint8Array {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        throw new Error("AUTH_SECRET is not set");
    }
    return new TextEncoder().encode(secret);
}

export async function createMagicLinkToken(email: string): Promise<string> {
    return new SignJWT({ email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(MAGIC_LINK_TTL)
        .sign(getSecretKey());
}

export async function verifyMagicLinkToken(token: string): Promise<string> {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.email !== "string") {
        throw new Error("Malformed magic link token");
    }
    return payload.email;
}
