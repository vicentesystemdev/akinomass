import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ pedidos }) {
    return (
        <DashboardLayout>
            <Head title="Pedidos" />
            <div className="p-6">
                <div className="mb-4 flex justify-between">
                    <h1 className="text-xl font-bold text-akin-text">Pedidos Recientes</h1>
                    <Link
                        href={route('pedidos.create')}
                        className="rounded-xl bg-akin-accent px-4 py-2 text-sm font-bold text-white shadow-lg shadow-akin-accent/20 hover:bg-akin-primary transition-colors"
                    >
                        + Nuevo pedido
                    </Link>
                </div>
                <div className="overflow-hidden rounded-2xl border border-akin-border bg-akin-surface">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-akin-surfaceSoft">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-akin-muted">Número</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-akin-muted">Cliente</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-akin-muted text-center">Estado</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-akin-muted text-right">Total</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-akin-border">
                            {pedidos.map((p) => (
                                <tr key={p.cod_pedido} className="hover:bg-akin-bg/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-akin-primary">{p.numero_pedido_ped}</td>
                                    <td className="px-6 py-4 text-akin-text">{p.cliente?.nombre_cli}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-akin-surfaceSoft text-akin-primary">
                                            {p.estado_ped}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-akin-text">{p.total_ped}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={route('pedidos.show', p.cod_pedido)}
                                            className="text-akin-accent font-bold hover:underline"
                                        >
                                            Ver Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

