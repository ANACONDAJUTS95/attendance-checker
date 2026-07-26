'use client';

import { useEffect, useState } from 'react';

interface SessionExpiryWatcherProps {
    expires: string;
    hasUnsavedAttendance: boolean;
}

const WARNING_WINDOW_MS = 5 * 60 * 1000;
const CHECK_INTERVAL_MS = 15 * 1000;

export function SessionExpiryWatcher({ expires, hasUnsavedAttendance }: SessionExpiryWatcherProps) {
    const [remainingMs, setRemainingMs] = useState<number | null>(null);

    useEffect(() => {
        const expiresAt = new Date(expires).getTime();

        const check = () => {
            const remaining = expiresAt - Date.now();
            if (remaining <= 0) {
                // Session cookie has expired. Force a full reload of the login
                // page so the server re-checks auth state from scratch rather
                // than relying on client-side navigation.
                window.location.href = '/login';
                return;
            }
            setRemainingMs(remaining);
        };

        check();
        const interval = setInterval(check, CHECK_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [expires]);

    if (remainingMs === null || remainingMs > WARNING_WINDOW_MS) return null;

    const minutesLeft = Math.max(1, Math.ceil(remainingMs / 60000));

    return (
        <div className="w-full bg-yellow-100 text-yellow-900 text-sm text-center py-2 px-4">
            Your session expires in about {minutesLeft} minute{minutesLeft === 1 ? '' : 's'}.
            {hasUnsavedAttendance
                ? ' Export your attendance sheet now to avoid losing today\'s scans.'
                : ' You\'ll need to sign in again to keep scanning.'}
        </div>
    );
}
