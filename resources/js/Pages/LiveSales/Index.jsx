import StatusBadge from '@/Components/UI/StatusBadge';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ sesiones = [] }) {
    return (
        <DashboardLayout>
            <Head title="LiveSales" />

            <div className="space-y-6">
                <section className="akin-card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Venta en vivo</p>
                            <h1 className="mt-2 text-3xl font-black text-akin-text">LiveSales</h1>
                            <p className="mt-2 text-sm leading-6 text-akin-muted">Sesiones manuales para registrar interacciones rapidas y productos ofrecidos.</p>
                        </div>
                        <Link href={route('live-sales.create')} className="akin-btn-primary px-5 py-3 text-sm">
                            Nueva sesion
                        </Link>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sesiones.length > 0 ? sesiones.map((sesion) => (
                        <Link key={sesion.cod_sesion_live} href={route('live-sales.show', sesion.cod_sesion_live)} className="akin-card group p-5 transition hover:-translate-y-0.5 hover:border-akin-accent hover:shadow-lg">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-akin-muted">Sesion</p>
                                    <h2 className="mt-2 text-xl font-black text-akin-text">{sesion.titulo_ses}</h2>
                                </div>
                                <StatusBadge>{formatStatus(sesion.estado_ses)}</StatusBadge>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-akin-muted">Abrir tablero para agregar productos e interacciones.</p>
                        </Link>
                    )) : (
                        <div className="akin-card col-span-full px-6 py-12 text-center">
                            <p className="font-black text-akin-text">No hay sesiones LiveSales</p>
                            <p className="mt-1 text-sm text-akin-muted">Crea una sesion para comenzar el registro en vivo.</p>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}

function formatStatus(value) {
    if (!value) return 'Borrador';
    return String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
