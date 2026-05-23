import { Link } from '@inertiajs/react';

export default function QuickActionCard({ title, description, href = '#', icon, tone = 'earth' }) {
const colors = {
        earth: 'bg-akin-primary text-white dark:text-akin-bg',
        clay: 'bg-akin-accent text-white dark:text-akin-bg',
        leaf: 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-akin-bg',
        sky: 'bg-sky-600 text-white dark:bg-sky-400 dark:text-akin-bg',
        stone: 'bg-stone-700 text-white dark:bg-stone-300 dark:text-akin-bg',
    };

    return (
        <Link
            href={href}
            className="akin-card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-akin-accent hover:shadow-lg"
        >
            <span className={['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black shadow-sm', colors[tone] || colors.earth].join(' ')}>
                {icon}
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-black text-akin-text">{title}</span>
                <span className="akin-muted mt-1 block text-xs leading-5">{description}</span>
            </span>
        </Link>
    );
}
