const barColors = ['bg-blue-600', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500', 'bg-slate-500'];

export default function ChartCard({ title = 'Ventas por canal', data = [] }) {
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">Placeholder visual listo para conectar a datos reales.</p>
                </div>
                <span className="rounded bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Hoy
                </span>
            </div>

            <div className="mt-6 space-y-4">
                {data.map((item, index) => {
                    const width = `${Math.max((item.value / maxValue) * 100, 8)}%`;

                    return (
                        <div key={item.label}>
                            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                <span className="font-medium text-slate-600">{item.label}</span>
                                <span className="font-semibold text-slate-900">{item.value}</span>
                            </div>
                            <div className="h-3 rounded bg-slate-100">
                                <div
                                    className={['h-3 rounded', barColors[index % barColors.length]].join(' ')}
                                    style={{ width }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
