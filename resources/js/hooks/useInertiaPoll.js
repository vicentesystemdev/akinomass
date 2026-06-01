import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Recarga parcial de props Inertia en intervalo (tiempo casi real sin WebSockets).
 */
export function useInertiaPoll(only = [], intervalMs = 15000, enabled = true) {
    const [lastUpdated, setLastUpdated] = useState(() => new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const onlyKey = JSON.stringify(only);
    const mountedRef = useRef(true);

    const refresh = useCallback(() => {
        if (!enabled || only.length === 0) return;

        setIsRefreshing(true);
        router.reload({
            only,
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                if (!mountedRef.current) return;
                setIsRefreshing(false);
                setLastUpdated(new Date());
            },
        });
    }, [enabled, onlyKey]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!enabled || intervalMs <= 0 || only.length === 0) return undefined;

        const id = setInterval(refresh, intervalMs);
        return () => clearInterval(id);
    }, [enabled, intervalMs, refresh, onlyKey]);

    return { lastUpdated, isRefreshing, refresh };
}
