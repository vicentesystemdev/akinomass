import { useEffect, useRef, useState } from 'react';

/**
 * Resalta filas nuevas cuando la lista se actualiza (p. ej. por polling).
 */
export function useListHighlight(items, idKey, enabled = true) {
    const prevIdsRef = useRef(new Set());
    const [highlightIds, setHighlightIds] = useState(() => new Set());
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const ids = new Set((items || []).map((item) => item[idKey]));
        const nuevos = [...ids].filter((id) => !prevIdsRef.current.has(id));

        if (prevIdsRef.current.size > 0 && nuevos.length > 0) {
            setHighlightIds(new Set(nuevos));
            setPulse(true);
            const timer = setTimeout(() => {
                setHighlightIds(new Set());
                setPulse(false);
            }, 6000);
            prevIdsRef.current = ids;
            return () => clearTimeout(timer);
        }

        prevIdsRef.current = ids;
        return undefined;
    }, [items, idKey, enabled]);

    const isHighlighted = (id) => highlightIds.has(id);

    return { isHighlighted, hasNewItems: pulse, newCount: highlightIds.size };
}
