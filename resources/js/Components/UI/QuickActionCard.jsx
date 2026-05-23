import { Link } from '@inertiajs/react';

export default function QuickActionCard({ title, description, href = '#', icon, tone = 'earth' }) {
    const colors = {
        earth: 'bg-[#3C473A] text-white dark:bg-[#D77A61] dark:text-[#171512]',
        clay: 'bg-[#D77A61] text-white dark:bg-[#D77A61] dark:text-[#171512]',
        leaf: 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-[#171512]',
        sky: 'bg-sky-600 text-white dark:bg-sky-400 dark:text-[#171512]',
        stone: 'bg-stone-700 text-white dark:bg-stone-300 dark:text-[#171512]',
    };

    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-[#EADFD6] bg-white/90 p-4 shadow-sm shadow-[#3C473A]/5 transition hover:-translate-y-0.5 hover:border-[#D77A61]/50 hover:shadow-lg dark:border-white/10 dark:bg-[#211E1A] dark:hover:border-[#D77A61]/50"
        >
            <span className={['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black shadow-sm', colors[tone] || colors.earth].join(' ')}>
                {icon}
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-black text-[#2B221E] dark:text-[#FDF6F0]">{title}</span>
                <span className="mt-1 block text-xs leading-5 text-[#2B221E]/60 dark:text-[#FDF6F0]/55">{description}</span>
            </span>
        </Link>
    );
}
