export default function AuditoriaDiffViewer({ anterior, nuevo }) {
    if (anterior === null && nuevo === null) return <span className="text-xs text-gray-400">-</span>;

    return (
        <div className="flex items-center gap-3 text-xs">
            <div className="flex-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <span className="text-red-400 block text-[10px] uppercase font-semibold mb-0.5">Anterior</span>
                <span className="text-red-700 font-medium font-mono break-all">{anterior ?? '-'}</span>
            </div>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex-1 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                <span className="text-green-400 block text-[10px] uppercase font-semibold mb-0.5">Nuevo</span>
                <span className="text-green-700 font-medium font-mono break-all">{nuevo ?? '-'}</span>
            </div>
        </div>
    );
}
