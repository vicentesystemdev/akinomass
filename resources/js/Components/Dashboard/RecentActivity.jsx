export default function RecentActivity({ items = [] }) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Actividad reciente</h2>
                <p className="mt-1 text-sm text-slate-500">Eventos operativos de ventas y CRM.</p>
            </div>

            <div className="mt-5 space-y-4">
                {items.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex gap-3">
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                            {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
