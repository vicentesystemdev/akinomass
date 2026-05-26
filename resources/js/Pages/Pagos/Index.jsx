import StatusBadge from '@/Components/UI/StatusBadge';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ pagos = [] }) {
    return (
        <DashboardLayout>
            <Head title="Pagos" />

            <div className="space-y-6">
                <section className="akin-card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Control financiero</p>
                            <h1 className="mt-2 text-3xl font-black text-akin-text">Pagos</h1>
                            <p className="mt-2 text-sm leading-6 text-akin-muted">Registra, observa y confirma pagos asociados a pedidos.</p>
                        </div>
                        <Link href={route('pagos.create')} className="akin-btn-primary px-5 py-3 text-sm">
                            Registrar pago
                        </Link>
                    </div>
                </section>

                <section className="akin-card overflow-hidden">
                    <div className="border-b border-akin-border px-6 py-5">
                        <h2 className="text-lg font-black text-akin-text">Pagos registrados</h2>
                        <p className="mt-1 text-sm text-akin-muted">{pagos.length} movimientos encontrados</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-akin-border">
                            <thead className="bg-akin-surfaceSoft">
                                <tr>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Pedido</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead align="right">Monto</TableHead>
                                    <TableHead align="right">Accion</TableHead>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-akin-border bg-akin-surface">
                                {pagos.length > 0 ? pagos.map((pago) => (
                                    <tr key={pago.cod_pago} className="transition hover:bg-akin-bg/70">
                                        <td className="px-6 py-4 text-sm font-black text-akin-text">#{pago.cod_pago}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-akin-muted">{pago.cod_pedido}</td>
                                        <td className="px-6 py-4"><StatusBadge>{formatStatus(pago.estado_pago_pag)}</StatusBadge></td>
                                        <td className="px-6 py-4 text-right text-sm font-black text-akin-text">{pago.monto_pag}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={route('pagos.show', pago.cod_pago)} className="font-bold text-akin-accent hover:underline">
                                                Ver detalle
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <p className="font-black text-akin-text">No hay pagos registrados</p>
                                            <p className="mt-1 text-sm text-akin-muted">Cuando registres pagos apareceran en esta tabla.</p>
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

function TableHead({ children, align = 'left' }) {
    return <th className={`px-6 py-4 text-${align} text-xs font-black uppercase tracking-[0.16em] text-akin-muted`}>{children}</th>;
}

function formatStatus(value) {
    if (!value) return 'Borrador';
    return String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
