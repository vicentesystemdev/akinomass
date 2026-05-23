import SectionCard from '@/Components/UI/SectionCard';

const toneStyles = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
    warning: 'bg-[#D77A61]/10 text-[#9d4d39] ring-[#D77A61]/20 dark:bg-[#D77A61]/15 dark:text-[#F2B39F] dark:ring-[#D77A61]/30',
    info: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/25',
    danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/25',
    neutral: 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-white/5 dark:text-stone-300 dark:ring-white/10',
};

export default function RecentActivity({ items = [] }) {
    return (
        <SectionCard
            title="Actividad reciente"
            description="Timeline comercial de CRM, pedidos, inventario y pagos."
        >
            <div className="p-5">
                <div className="relative space-y-5 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[#EADFD6] dark:before:bg-white/10">
                    {items.map((item, index) => (
                        <div key={`${item.title}-${index}`} className="relative flex gap-4">
                            <span className={['z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ring-1 ring-inset', toneStyles[item.tone] || toneStyles.neutral].join(' ')}>
                                {item.icon || index + 1}
                            </span>
                            <div className="min-w-0 flex-1 rounded-2xl bg-[#FDF6F0]/60 p-3 dark:bg-white/[0.03]">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-black text-[#2B221E] dark:text-[#FDF6F0]">{item.title}</p>
                                    <span className="shrink-0 text-[11px] font-bold text-[#2B221E]/45 dark:text-[#FDF6F0]/40">{item.time}</span>
                                </div>
                                <p className="mt-1 text-xs leading-5 text-[#2B221E]/60 dark:text-[#FDF6F0]/50">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}
