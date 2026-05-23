const toneStyles = {
    earth: {
        icon: 'bg-[#3C473A] text-white dark:bg-[#D77A61] dark:text-[#171512]',
        glow: 'from-[#3C473A]/10 to-transparent dark:from-[#D77A61]/10',
    },
    clay: {
        icon: 'bg-[#D77A61] text-white dark:bg-[#D77A61] dark:text-[#171512]',
        glow: 'from-[#D77A61]/14 to-transparent',
    },
    green: {
        icon: 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-[#171512]',
        glow: 'from-emerald-500/10 to-transparent',
    },
    blue: {
        icon: 'bg-sky-600 text-white dark:bg-sky-400 dark:text-[#171512]',
        glow: 'from-sky-500/10 to-transparent',
    },
    red: {
        icon: 'bg-red-600 text-white dark:bg-red-400 dark:text-[#171512]',
        glow: 'from-red-500/10 to-transparent',
    },
    neutral: {
        icon: 'bg-stone-700 text-white dark:bg-stone-300 dark:text-[#171512]',
        glow: 'from-stone-500/10 to-transparent',
    },
};

const trendStyles = {
    positive: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    negative: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    neutral: 'bg-[#FDF6F0] text-[#3C473A] dark:bg-white/5 dark:text-[#FDF6F0]/70',
    warning: 'bg-[#D77A61]/10 text-[#9d4d39] dark:bg-[#D77A61]/15 dark:text-[#F2B39F]',
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
        <article className="group relative overflow-hidden rounded-2xl border border-[#EADFD6] bg-white/95 p-5 shadow-sm shadow-[#3C473A]/5 transition hover:-translate-y-0.5 hover:border-[#D77A61]/45 hover:shadow-xl hover:shadow-[#3C473A]/10 dark:border-white/10 dark:bg-[#211E1A]/95 dark:shadow-black/20 dark:hover:border-[#D77A61]/45">
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
                <p className="text-sm font-bold text-[#2B221E]/60 dark:text-[#FDF6F0]/55">{title}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-[#2B221E] dark:text-[#FDF6F0]">{value}</p>
                {description && (
                    <p className="mt-2 min-h-10 text-sm leading-5 text-[#2B221E]/60 dark:text-[#FDF6F0]/50">
                        {description}
                    </p>
                )}
            </div>
        </article>
    );
}
