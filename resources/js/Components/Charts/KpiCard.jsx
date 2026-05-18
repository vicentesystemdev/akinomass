export default function KpiCard({ title, value, subtitle, icon, variant = 'oliva', trend, trendValue }) {
    const variants = {
        oliva: {
            bg: 'bg-oliva-50',
            iconBg: 'bg-oliva-100',
            iconColor: 'text-oliva-600',
            valueColor: 'text-oliva-800',
        },
        terracota: {
            bg: 'bg-terracota-50',
            iconBg: 'bg-terracota-100',
            iconColor: 'text-terracota-600',
            valueColor: 'text-terracota-800',
        },
        green: {
            bg: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            valueColor: 'text-green-800',
        },
        cyan: {
            bg: 'bg-cyan-50',
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-600',
            valueColor: 'text-cyan-800',
        },
        amber: {
            bg: 'bg-amber-50',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            valueColor: 'text-amber-800',
        },
        red: {
            bg: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            valueColor: 'text-red-800',
        },
    };

    const style = variants[variant] || variants.oliva;

    return (
        <div className={`relative overflow-hidden rounded-xl ${style.bg} p-5 border border-gray-100`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`mt-2 text-2xl font-bold ${style.valueColor}`}>{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`mt-2 flex items-center gap-1 text-xs ${
                            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                            {trend === 'up' && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            )}
                            {trend === 'down' && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            {trendValue}
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-lg ${style.iconBg}`}>
                        <span className={`w-6 h-6 block ${style.iconColor}`}>{icon}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
