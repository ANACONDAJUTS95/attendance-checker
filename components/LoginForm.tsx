'use client';

import { useState, FormEvent } from 'react';

interface LoginFormProps {
    initialErrorCode?: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const ACCESS_DENIED_MESSAGE =
    "This email isn't registered as a teacher account. Contact [ADMIN CONTACT PLACEHOLDER] if this is a mistake.";

function messageForErrorCode(code?: string): string | null {
    switch (code) {
        case 'CredentialsSignin':
        case 'AccessDenied':
            return `This link is invalid, expired, or the email isn't registered as a teacher account. ${ACCESS_DENIED_MESSAGE}`;
        case 'InvalidToken':
            return "This sign-in link is missing or malformed. Please request a new one below.";
        case undefined:
            return null;
        default:
            return "Something went wrong signing you in. Please try again.";
    }
}

function messageForApiError(code: string): string {
    switch (code) {
        case 'not-approved':
            return ACCESS_DENIED_MESSAGE;
        case 'invalid-email':
            return "Please enter a valid email address.";
        case 'send-failed':
            return "We couldn't send the sign-in email right now. Please try again in a moment.";
        default:
            return "Something went wrong. Please check your connection and try again.";
    }
}

export function LoginForm({ initialErrorCode }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState<string | null>(messageForErrorCode(initialErrorCode));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setMessage(null);

        try {
            const res = await fetch('/api/auth/magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('sent');
                return;
            }

            const data = await res.json().catch(() => ({}));
            setStatus('error');
            setMessage(messageForApiError(data?.error ?? 'unknown'));
        } catch {
            setStatus('error');
            setMessage("Something went wrong. Please check your connection and try again.");
        }
    };

    if (status === 'sent') {
        return (
            <div className="w-full max-w-sm text-center">
                <p className="text-lg font-semibold text-[#111111]">Check your email for a sign-in link</p>
                <p className="text-sm text-black/60 mt-2">
                    We sent a link to <span className="font-medium">{email}</span>. It expires in 15 minutes.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
            <label htmlFor="email" className="text-lg font-semibold text-[#111111]">
                Teacher sign-in
            </label>
            <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === 'sending'}
                className="w-full rounded border-1 border-black/10 bg-white px-3 py-2 text-[#111111] disabled:opacity-60"
            />
            <button
                type="submit"
                disabled={status === 'sending'}
                className="text-white font-semibold bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {status === 'sending' ? 'Sending…' : 'Send magic link'}
            </button>
            {message && (
                <p className="text-sm text-red-600 mt-1">{message}</p>
            )}
        </form>
    );
}
