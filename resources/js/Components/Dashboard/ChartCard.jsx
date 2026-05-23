import SectionCard from '@/Components/UI/SectionCard';

const channelColors = {
    'TikTok LIVE': 'bg-[#2B221E] dark:bg-[#FDF6F0]',
    WhatsApp: 'bg-emerald-500',
    Instagram: 'bg-[#D77A61]',
    Facebook: 'bg-sky-500',
    Manual: 'bg-[#3C473A] dark:bg-[#8D9A86]',
};

export default function ChartCard({ title = 'Ventas por canal', data = [] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return (
        <SectionCard
            title={title}
            description="Distribucion simulada de ingresos por canal comercial."
            action={
                <span className="rounded-full bg-[#D77A61]/10 px-3 py-1 text-xs font-black text-[#9d4d39] dark:bg-[#D77A61]/15 dark:text-[#F2B39F]">
                    Placeholder listo para datos reales
                </span>
            }
        >
            <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                    {data.map((item) => {
                        const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                        const width = `${Math.max((item.value / maxValue) * 100, 8)}%`;

                        return (
                            <div key={item.label}>
                                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={['h-3 w-3 rounded-full', channelColors[item.label] || 'bg-stone-400'].join(' ')} />
                                        <span className="font-bold text-[#2B221E]/70 dark:text-[#FDF6F0]/70">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-[#2B221E] dark:text-[#FDF6F0]">Bs {item.value.toLocaleString('es-BO')}</span>
                                        <span className="w-10 text-right text-xs font-black text-[#2B221E]/45 dark:text-[#FDF6F0]/40">{percentage}%</span>
                                    </div>
                                </div>
                                <div className="h-3 rounded-full bg-[#FDF6F0] ring-1 ring-[#EADFD6]/80 dark:bg-white/5 dark:ring-white/10">
                                    <div
                                        className={['h-3 rounded-full shadow-sm', channelColors[item.label] || 'bg-stone-400'].join(' ')}
                                        style={{ width }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-2xl bg-[#FDF6F0] p-5 ring-1 ring-[#EADFD6]/80 dark:bg-white/[0.03] dark:ring-white/10">
                    <p className="text-sm font-bold text-[#2B221E]/60 dark:text-[#FDF6F0]/55">Total simulado</p>
                    <p className="mt-2 text-3xl font-black text-[#2B221E] dark:text-[#FDF6F0]">
                        Bs {total.toLocaleString('es-BO')}
                    </p>
                    <div className="mt-6 grid grid-cols-5 items-end gap-2">
                        {data.map((item) => {
                            const height = `${Math.max((item.value / maxValue) * 150, 28)}px`;

                            return (
                                <div key={`${item.label}-bar`} className="flex flex-col items-center gap-2">
                                    <div className="flex h-40 items-end">
                                        <div
                                            className={['w-8 rounded-t-xl shadow-sm sm:w-10', channelColors[item.label] || 'bg-stone-400'].join(' ')}
                                            style={{ height }}
                                            title={item.label}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-[#2B221E]/45 dark:text-[#FDF6F0]/40">
                                        {item.shortLabel || item.label.slice(0, 2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
