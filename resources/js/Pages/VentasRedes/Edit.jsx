import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { Head } from '@inertiajs/react';
import VentaRedForm from './Components/VentaRedForm';

export default function Edit(props) {
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={`Editar ${props.venta.codigo_venta_red}`}
                    subtitle="Ajusta datos de origen, contacto y productos"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Ventas por Redes', href: route('ventas-redes.index') },
                        { label: props.venta.codigo_venta_red, href: route('ventas-redes.show', props.venta.cod_venta_red) },
                        { label: 'Editar' },
                    ]}
                />
            }
        >
            <Head title={`Editar ${props.venta.codigo_venta_red}`} />
            <div className="mx-auto max-w-5xl">
                <VentaRedForm {...props} />
            </div>
        </AuthenticatedLayout>
    );
}
