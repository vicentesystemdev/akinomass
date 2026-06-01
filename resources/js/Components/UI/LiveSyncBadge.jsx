import { formatDateTimeBO } from '@/lib/formatters';

export default function LiveSyncBadge({ isRefreshing, lastUpdated, onRefresh, className = '' }) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border border-oliva-200 bg-oliva-50/80 px-3 py-1.5 text-xs ${className}`}
        >
            <span className="relative flex h-2 w-2">
                <span
                    className={`absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 ${isRefreshing ? 'animate-ping' : ''}`}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
            </span>
            <span className="text-oliva-800 font-medium">
                {isRefreshing ? 'Actualizando…' : 'En vivo'}
            </span>
            {lastUpdated && (
                <span className="text-gray-500 hidden sm:inline border-l border-oliva-200 pl-2">
                    {formatDateTimeBO(lastUpdated)}
                </span>
            )}
            {onRefresh && (
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="ml-1 rounded-md p-0.5 text-oliva-700 hover:bg-oliva-100 disabled:opacity-50"
                    title="Actualizar ahora"
                >
                    <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
