import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { Head } from '@inertiajs/react';
import VentaRedForm from './Components/VentaRedForm';

export default function Create(props) {
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Nueva venta por redes"
                    subtitle="Registra una venta o interes manual desde canales digitales"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Ventas por Redes', href: route('ventas-redes.index') },
                        { label: 'Nueva venta' },
                    ]}
                />
            }
        >
            <Head title="Nueva venta por redes" />
            <div className="mx-auto max-w-5xl">
                <VentaRedForm {...props} />
            </div>
        </AuthenticatedLayout>
    );
}
