import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, useForm, Link } from '@inertiajs/react';
import ClienteForm from './Partials';

export default function Create(props) {
    const form = useForm({
        nombre_cli: '',
        telefono_cli: '',
        correo_cli: '',
        documento_cli: '',
        direccion_cli: '',
        observacion_cli: '',
        estado_cli: props.estados?.[0] || 'activo',
        cod_canal_venta: '',
        cod_tipo_flujo_comercial: '',
    });

    const submit = () => {
        form.post(route('clientes.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Nuevo Cliente"
                    subtitle="Complete los datos del nuevo cliente"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Clientes', href: route('clientes.index') },
                        { label: 'Nuevo Cliente' },
                    ]}
                />
            }
        >
            <Head title="Crear Cliente" />

            <div className="max-w-3xl mx-auto">
                <ClienteForm {...props} form={form} submit={submit} />
            </div>
        </AuthenticatedLayout>
    );
}
