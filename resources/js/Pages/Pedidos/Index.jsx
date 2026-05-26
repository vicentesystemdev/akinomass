import StatusBadge from '@/Components/UI/StatusBadge';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ pedidos = [] }) {
    return (
        <DashboardLayout>
            <Head title="Pedidos" />

            <div className="space-y-6">
                <section className="akin-card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Operacion comercial</p>
                            <h1 className="mt-2 text-3xl font-black text-akin-text">Pedidos</h1>
                            <p className="mt-2 text-sm leading-6 text-akin-muted">Seguimiento de pedidos, estados y totales comerciales.</p>
                        </div>
                        <Link href={route('pedidos.create')} className="akin-btn-primary px-5 py-3 text-sm">
                            Nuevo pedido
                        </Link>
                    </div>
                </section>

                <section className="akin-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-akin-border">
                            <thead className="bg-akin-surfaceSoft">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-akin-muted">Numero</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-akin-muted">Cliente</th>
                                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-akin-muted">Estado</th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-akin-muted">Total</th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-akin-muted">Accion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-akin-border bg-akin-surface">
                                {pedidos.length > 0 ? pedidos.map((pedido) => (
                                    <tr key={pedido.cod_pedido} className="transition hover:bg-akin-bg/70">
                                        <td className="px-6 py-4 font-black text-akin-primary">{pedido.numero_pedido_ped}</td>
                                        <td className="px-6 py-4 text-sm text-akin-text">{pedido.cliente?.nombre_cli || 'Cliente no asignado'}</td>
                                        <td className="px-6 py-4 text-center"><StatusBadge>{formatStatus(pedido.estado_ped)}</StatusBadge></td>
                                        <td className="px-6 py-4 text-right font-black text-akin-text">{pedido.total_ped}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={route('pedidos.show', pedido.cod_pedido)} className="font-bold text-akin-accent hover:underline">
                                                Ver detalle
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <p className="font-black text-akin-text">No hay pedidos registrados</p>
                                            <p className="mt-1 text-sm text-akin-muted">Crea un pedido para iniciar el flujo comercial.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

function formatStatus(value) {
    if (!value) return 'Borrador';
    return String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
