const toneStyles = {
    earth: {
        icon: 'bg-akin-primary text-white dark:text-akin-bg',
        glow: 'from-stone-100 to-transparent dark:from-white/5',
    },
    clay: {
        icon: 'bg-akin-accent text-white dark:text-akin-bg',
        glow: 'from-stone-100 to-transparent dark:from-white/5',
    },
    green: {
        icon: 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-akin-bg',
        glow: 'from-emerald-500/10 to-transparent',
    },
    blue: {
        icon: 'bg-sky-600 text-white dark:bg-sky-400 dark:text-akin-bg',
        glow: 'from-sky-500/10 to-transparent',
    },
    red: {
        icon: 'bg-red-600 text-white dark:bg-red-400 dark:text-akin-bg',
        glow: 'from-red-500/10 to-transparent',
    },
    neutral: {
        icon: 'bg-stone-700 text-white dark:bg-stone-300 dark:text-akin-bg',
        glow: 'from-stone-500/10 to-transparent',
    },
};

const trendStyles = {
    positive: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    negative: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    neutral: 'bg-akin-surface-soft text-akin-primary dark:bg-white/5',
    warning: 'bg-akin-surface-soft text-akin-accent dark:bg-white/5',
};

export default function StatCard({
    title,
    value,
    description,
    trend,
    trendType = 'neutral',
    tone = 'earth',
    icon,
}) {
    const styles = toneStyles[tone] || toneStyles.earth;

    return (
        <article className="akin-card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-akin-accent hover:shadow-xl dark:shadow-black/20">
            <div className={['pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b', styles.glow].join(' ')} />

            <div className="relative flex items-start justify-between gap-4">
                <div className={['flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black shadow-sm', styles.icon].join(' ')}>
                    {icon}
                </div>

                {trend && (
                    <span className={['rounded-full px-2.5 py-1 text-xs font-black', trendStyles[trendType] || trendStyles.neutral].join(' ')}>
                        {trend}
                    </span>
                )}
            </div>

            <div className="relative mt-5">
                <p className="akin-muted text-sm font-bold">{title}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-akin-text">{value}</p>
                {description && (
                    <p className="akin-muted mt-2 min-h-10 text-sm leading-5">
                        {description}
                    </p>
                )}
            </div>
        </article>
    );
}
