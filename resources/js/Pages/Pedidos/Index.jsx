import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ pedidos }) {
    return (
        <AuthenticatedLayout header="Gestión de Pedidos">
            <Head title="Pedidos" />
            <div className="p-6">
                <div className="mb-4 flex justify-between">
                    <h1 className="text-xl font-bold text-[#2B221E]">Pedidos Recientes</h1>
                    <Link
                        href={route('pedidos.create')}
                        className="rounded-xl bg-[#D77A61] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-terracotta/20 hover:bg-olive transition-colors"
                    >
                        + Nuevo pedido
                    </Link>
                </div>
                <div className="overflow-hidden rounded-2xl border border-olive/5 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-olive/5">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/60">Número</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/60">Cliente</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/60 text-center">Estado</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/60 text-right">Total</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-olive/5">
                            {pedidos.map((p) => (
                                <tr key={p.cod_pedido} className="hover:bg-cream/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-olive">{p.numero_pedido_ped}</td>
                                    <td className="px-6 py-4 text-coffee">{p.cliente?.nombre_cli}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-olive/5 text-olive">
                                            {p.estado_ped}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-coffee">{p.total_ped}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={route('pedidos.show', p.cod_pedido)}
                                            className="text-terracotta font-bold hover:underline"
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
        </AuthenticatedLayout>
    );
}

