import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/UI/StatusBadge';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ pago }) {
    return (
        <DashboardLayout>
            <Head title={`Pago #${pago.cod_pago}`} />

            <div className="mx-auto max-w-5xl space-y-6">
                <section className="akin-card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Detalle de pago</p>
                            <h1 className="mt-2 text-3xl font-black text-akin-text">Pago #{pago.cod_pago}</h1>
                            <p className="mt-2 text-sm text-akin-muted">Pedido asociado: {pago.cod_pedido}</p>
                        </div>
                        <StatusBadge>{formatStatus(pago.estado_pago_pag)}</StatusBadge>
                    </div>
                </section>

                <section className="akin-card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail label="Monto" value={pago.monto_pag} />
                    <Detail label="Metodo" value={pago.metodo_pago_pag || 'Sin metodo'} />
                    <Detail label="Referencia" value={pago.referencia_pag || 'Sin referencia'} />
                    <Detail label="Fecha" value={pago.fecha_pago_pag || 'Sin fecha'} />
                </section>

                <section className="akin-card p-6">
                    <h2 className="text-lg font-black text-akin-text">Acciones</h2>
                    <p className="mt-1 text-sm text-akin-muted">Estas acciones conservan el flujo backend existente.</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link href={route('pagos.edit', pago.cod_pago)}><SecondaryButton>Editar</SecondaryButton></Link>
                        <PrimaryButton type="button" onClick={() => router.post(route('pagos.confirmar', pago.cod_pago))}>Confirmar</PrimaryButton>
                        <SecondaryButton type="button" onClick={() => router.post(route('pagos.observar', pago.cod_pago))}>Observar</SecondaryButton>
                        <DangerButton onClick={() => router.post(route('pagos.rechazar', pago.cod_pago))}>Rechazar</DangerButton>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

function Detail({ label, value }) {
    return (
        <div className="rounded-2xl bg-akin-surfaceSoft p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-akin-muted">{label}</p>
            <p className="mt-2 text-lg font-black text-akin-text">{value}</p>
        </div>
    );
}

function formatStatus(value) {
    if (!value) return 'Borrador';
    return String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
