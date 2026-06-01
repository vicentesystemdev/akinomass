export default function DashboardStatCard({ title, value, subtitle, icon, variant = 'oliva', highlight = false }) {
    const variants = {
        oliva: 'from-oliva-600/10 to-oliva-50 border-oliva-200/60 text-oliva-700',
        terracota: 'from-terracota-500/10 to-terracota-50 border-terracota-200/60 text-terracota-700',
        green: 'from-green-500/10 to-green-50 border-green-200/60 text-green-700',
        amber: 'from-amber-500/10 to-amber-50 border-amber-200/60 text-amber-700',
        red: 'from-red-500/10 to-red-50 border-red-200/60 text-red-700',
        cyan: 'from-cyan-500/10 to-cyan-50 border-cyan-200/60 text-cyan-700',
    };

    const style = variants[variant] || variants.oliva;

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${style} ${
                highlight ? 'ring-2 ring-terracota-400 ring-offset-2 animate-dashboard-pulse' : ''
            }`}
        >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/40 blur-2xl transition-transform group-hover:scale-110" />
            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
                    <p className="mt-2 text-2xl font-extrabold text-cafe-950 sm:text-3xl truncate">{value}</p>
                    {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
                </div>
                {icon && (
                    <div className="shrink-0 rounded-xl bg-white/70 p-3 shadow-sm backdrop-blur-sm">{icon}</div>
                )}
            </div>
        </div>
    );
}
