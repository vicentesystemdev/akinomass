import { useEffect, useMemo, useState } from 'react';

export function formatCountdown(seconds) {
    const safeSeconds = Math.max(0, Number(seconds || 0));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function CountdownTimer({
    seconds,
    expiredLabel = 'Expirado',
    className = '',
    style = {},
    onExpire = null,
}) {
    const initialSeconds = Math.max(0, Number(seconds || 0));
    const [remaining, setRemaining] = useState(initialSeconds);

    useEffect(() => {
        setRemaining(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (remaining <= 0) {
            onExpire?.();
            return undefined;
        }

        const timer = window.setInterval(() => {
            setRemaining((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [remaining, onExpire]);

    const label = useMemo(() => (
        remaining > 0 ? formatCountdown(remaining) : expiredLabel
    ), [remaining, expiredLabel]);

    return (
        <span className={className} style={style}>
            {label}
        </span>
    );
}
