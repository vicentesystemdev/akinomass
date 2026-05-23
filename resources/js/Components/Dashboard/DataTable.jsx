const statusStyles = {
    Pendiente: 'bg-amber-50 text-amber-700 ring-amber-200',
    Confirmado: 'bg-blue-50 text-blue-700 ring-blue-200',
    'En preparacion': 'bg-violet-50 text-violet-700 ring-violet-200',
    'En preparación': 'bg-violet-50 text-violet-700 ring-violet-200',
    Entregado: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Cancelado: 'bg-red-50 text-red-700 ring-red-200',
};

export default function DataTable({ title = 'Ultimos pedidos', orders = [] }) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">Seguimiento rapido de ventas recientes.</p>
                </div>
                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                    Ver todos
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                        <tr>
                            <th className="px-5 py-3">Codigo</th>
                            <th className="px-5 py-3">Cliente</th>
                            <th className="px-5 py-3">Canal</th>
                            <th className="px-5 py-3">Estado</th>
                            <th className="px-5 py-3">Total</th>
                            <th className="px-5 py-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {orders.map((order) => (
                            <tr key={order.code} className="hover:bg-slate-50">
                                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{order.code}</td>
                                <td className="whitespace-nowrap px-5 py-4 text-slate-600">{order.customer}</td>
                                <td className="whitespace-nowrap px-5 py-4 text-slate-600">{order.channel}</td>
                                <td className="whitespace-nowrap px-5 py-4">
                                    <span className={['inline-flex rounded px-2 py-1 text-xs font-semibold ring-1 ring-inset', statusStyles[order.status] || 'bg-slate-50 text-slate-600 ring-slate-200'].join(' ')}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{order.total}</td>
                                <td className="whitespace-nowrap px-5 py-4 text-slate-500">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
