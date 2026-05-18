import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { Head, useForm } from '@inertiajs/react';
import LeadForm from './Partials';

export default function Create(props) {
    const form = useForm({
        nombre_lea: '',
        alias_lea: '',
        telefono_lea: '',
        correo_lea: '',
        producto_interes_lea: '',
        observacion_lea: '',
        estado_lea: props.estados?.[0] || 'nuevo',
        fecha_seguimiento_lea: '',
        cod_canal_venta: '',
        cod_tipo_flujo_comercial: '',
        cod_usuario_responsable: '',
    });

    const submit = () => {
        form.post(route('leads.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Nuevo Lead"
                    subtitle="Registra un nuevo prospecto comercial"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Leads', href: route('leads.index') },
                        { label: 'Nuevo Lead' },
                    ]}
                />
            }
        >
            <Head title="Crear Lead" />

            <div className="max-w-3xl mx-auto">
                <LeadForm {...props} form={form} submit={submit} />
            </div>
        </AuthenticatedLayout>
    );
}
