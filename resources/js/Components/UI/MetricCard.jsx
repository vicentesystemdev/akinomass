export default function MetricCard({ title, value, icon, trend, trendValue, description, color, alert = false, danger = false }) {
    const borderClass = danger
        ? 'border-red-200 dark:border-red-500/30'
        : alert
            ? 'border-orange-200 dark:border-orange-500/30'
            : 'border-akin-border';

    const labelClass = danger
        ? 'text-red-600 dark:text-red-400'
        : alert
            ? 'text-orange-600 dark:text-orange-400'
            : 'text-akin-accent';

    return (
        <div className={[
            'group rounded-3xl border bg-akin-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
            borderClass,
        ].join(' ')}>
            <div className="flex items-center justify-between mb-2">
                <p className={['text-xs font-bold uppercase tracking-[0.18em]', labelClass].join(' ')}>
                    {title}
                </p>
                {icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-akin-surfaceSoft text-akin-muted transition-colors group-hover:text-akin-accent">
                        {icon}
                    </div>
                )}
            </div>

            <p className="mt-3 text-3xl font-black text-akin-text">{value}</p>

            {description && (
                <p className="mt-1 text-sm text-akin-muted">{description}</p>
            )}

            {trend && (
                <div className="mt-3 flex items-center gap-1">
                    <span className={[
                        'text-xs font-bold',
                        trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400',
                    ].join(' ')}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </span>
                    <span className="text-[10px] text-akin-muted">vs mes anterior</span>
                </div>
            )}
        </div>
    );
}
