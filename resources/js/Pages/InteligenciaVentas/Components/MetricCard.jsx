export default function MetricCard({ title, value, subtitle, icon: Icon, tone = 'oliva' }) {
    const tones = {
        oliva: 'bg-oliva-50 text-oliva-800 border-oliva-100',
        terracota: 'bg-terracota-50 text-terracota-800 border-terracota-100',
        green: 'bg-green-50 text-green-800 border-green-100',
        amber: 'bg-amber-50 text-amber-800 border-amber-100',
        red: 'bg-red-50 text-red-800 border-red-100',
        cyan: 'bg-cyan-50 text-cyan-800 border-cyan-100',
    };

    return (
        <div className={`rounded-xl border p-4 shadow-sm ${tones[tone] ?? tones.oliva}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{title}</p>
                    <p className="mt-2 truncate text-2xl font-bold">{value}</p>
                    {subtitle && <p className="mt-1 text-xs opacity-75">{subtitle}</p>}
                </div>
                {Icon && (
                    <div className="rounded-lg bg-white/70 p-2">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
