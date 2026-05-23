import EmptyState from '@/Components/UI/EmptyState';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import { Link } from '@inertiajs/react';

const channelStyles = {
    'TikTok LIVE': 'bg-akin-text text-akin-bg dark:bg-akin-text dark:text-akin-bg',
    WhatsApp: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
    Instagram: 'bg-akin-surface-soft text-akin-accent ring-akin-border',
    Facebook: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/25',
    Manual: 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-white/5 dark:text-stone-300 dark:ring-white/10',
};

export default function DataTable({ title = 'Ultimos pedidos', orders = [] }) {
    return (
        <SectionCard
            title={title}
            description="Seguimiento operativo de pedidos, pagos y canales de origen."
            action={
                <Link
                    href="#"
                    className="akin-btn-secondary h-10 px-4 text-sm shadow-sm"
                >
                    Ver todos
                </Link>
            }
        >
            {orders.length === 0 ? (
                <EmptyState title="Sin pedidos recientes" description="Cuando Laravel envie pedidos, apareceran en esta tabla." />
            ) : (
                <div className="overflow-x-auto">
                    <table className="akin-table min-w-full text-left text-sm">
                        <thead className="bg-akin-surface-soft text-[11px] font-black uppercase tracking-wide text-akin-muted">
                            <tr>
                                <th className="px-5 py-3">Codigo</th>
                                <th className="px-5 py-3">Cliente</th>
                                <th className="px-5 py-3">Canal</th>
                                <th className="px-5 py-3">Estado</th>
                                <th className="px-5 py-3">Pago</th>
                                <th className="px-5 py-3 text-right">Total</th>
                                <th className="px-5 py-3">Fecha</th>
                                <th className="px-5 py-3 text-right">Accion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-akin-border">
                            {orders.map((order) => (
                                <tr key={order.code} className="transition hover:bg-akin-surface-soft">
                                    <td className="whitespace-nowrap px-5 py-4 font-black text-akin-text">{order.code}</td>
                                    <td className="whitespace-nowrap px-5 py-4 text-akin-muted">{order.customer}</td>
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <span className={['inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ring-inset', channelStyles[order.channel] || channelStyles.Manual].join(' ')}>
                                            {order.channel}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <StatusBadge>{order.status}</StatusBadge>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <StatusBadge>{order.paymentStatus}</StatusBadge>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-right font-black text-akin-text">{order.total}</td>
                                    <td className="whitespace-nowrap px-5 py-4 text-akin-muted">{order.date}</td>
                                    <td className="whitespace-nowrap px-5 py-4 text-right">
                                        <Link
                                            href={order.href || '#'}
                                            className="rounded-xl px-3 py-2 text-xs font-black text-akin-accent transition hover:bg-akin-surface-soft"
                                        >
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </SectionCard>
    );
}
