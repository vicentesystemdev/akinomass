import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Interacciones() {
    return (
        <DashboardLayout>
            <Head title="Interacciones Live" />
            <section className="akin-card px-6 py-12 text-center">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">LiveSales</p>
                <h1 className="mt-2 text-3xl font-black text-akin-text">Interacciones Live</h1>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-akin-muted">
                    Usa el detalle de cada sesion para registrar interacciones manuales en tiempo real.
                </p>
            </section>
        </DashboardLayout>
    );
}
