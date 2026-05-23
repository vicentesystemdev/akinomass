import EmptyState from '@/Components/UI/EmptyState';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import { Link } from '@inertiajs/react';

const channelStyles = {
    'TikTok LIVE': 'bg-[#2B221E] text-white dark:bg-white dark:text-[#171512]',
    WhatsApp: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
    Instagram: 'bg-[#D77A61]/10 text-[#9d4d39] ring-[#D77A61]/20 dark:bg-[#D77A61]/15 dark:text-[#F2B39F] dark:ring-[#D77A61]/30',
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
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-[#EADFD6] bg-white px-4 text-sm font-black text-[#3C473A] shadow-sm transition hover:border-[#D77A61]/40 hover:text-[#D77A61] dark:border-white/10 dark:bg-[#24211D] dark:text-[#FDF6F0] dark:hover:text-[#F2B39F]"
                >
                    Ver todos
                </Link>
            }
        >
            {orders.length === 0 ? (
                <EmptyState title="Sin pedidos recientes" description="Cuando Laravel envie pedidos, apareceran en esta tabla." />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#FDF6F0]/70 text-[11px] font-black uppercase tracking-wide text-[#2B221E]/55 dark:bg-white/[0.03] dark:text-[#FDF6F0]/45">
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
                        <tbody className="divide-y divide-[#EADFD6]/70 dark:divide-white/10">
                            {orders.map((order) => (
                                <tr key={order.code} className="transition hover:bg-[#FDF6F0]/60 dark:hover:bg-white/[0.03]">
                                    <td className="whitespace-nowrap px-5 py-4 font-black text-[#2B221E] dark:text-[#FDF6F0]">{order.code}</td>
                                    <td className="whitespace-nowrap px-5 py-4 text-[#2B221E]/70 dark:text-[#FDF6F0]/70">{order.customer}</td>
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
                                    <td className="whitespace-nowrap px-5 py-4 text-right font-black text-[#2B221E] dark:text-[#FDF6F0]">{order.total}</td>
                                    <td className="whitespace-nowrap px-5 py-4 text-[#2B221E]/50 dark:text-[#FDF6F0]/45">{order.date}</td>
                                    <td className="whitespace-nowrap px-5 py-4 text-right">
                                        <Link
                                            href={order.href || '#'}
                                            className="rounded-xl px-3 py-2 text-xs font-black text-[#D77A61] transition hover:bg-[#D77A61]/10 dark:text-[#F2B39F] dark:hover:bg-[#D77A61]/10"
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
