import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { Head, useForm } from '@inertiajs/react';
import ClienteForm from './Partials';

export default function Edit(props) {
    const cliente = props.cliente;

    const form = useForm({
        nombre_cli: cliente?.nombre_cli ?? '',
        telefono_cli: cliente?.telefono_cli ?? '',
        correo_cli: cliente?.correo_cli ?? '',
        documento_cli: cliente?.documento_cli ?? '',
        direccion_cli: cliente?.direccion_cli ?? '',
        observacion_cli: cliente?.observacion_cli ?? '',
        estado_cli: cliente?.estado_cli ?? 'activo',
        cod_canal_venta: cliente?.cod_canal_venta ?? '',
        cod_tipo_flujo_comercial: cliente?.cod_tipo_flujo_comercial ?? '',
    });

    const submit = () => {
        form.put(route('clientes.update', cliente.cod_cliente));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Editar Cliente"
                    subtitle={`Modifique los datos de ${cliente.nombre_cli}`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Clientes', href: route('clientes.index') },
                        { label: cliente.nombre_cli },
                    ]}
                />
            }
        >
            <Head title="Editar Cliente" />

            <div className="max-w-3xl mx-auto">
                <ClienteForm {...props} form={form} submit={submit} isEdit={true} />
            </div>
        </AuthenticatedLayout>
    );
}
