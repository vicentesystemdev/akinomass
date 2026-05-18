import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import { Head, useForm } from '@inertiajs/react';
import LeadForm from './Partials';

export default function Edit(props) {
    const lead = props.lead;

    const form = useForm({
        nombre_lea: lead?.nombre_lea ?? '',
        alias_lea: lead?.alias_lea ?? '',
        telefono_lea: lead?.telefono_lea ?? '',
        correo_lea: lead?.correo_lea ?? '',
        producto_interes_lea: lead?.producto_interes_lea ?? '',
        observacion_lea: lead?.observacion_lea ?? '',
        estado_lea: lead?.estado_lea ?? 'nuevo',
        fecha_seguimiento_lea: lead?.fecha_seguimiento_lea ?? '',
        cod_canal_venta: lead?.cod_canal_venta ?? '',
        cod_tipo_flujo_comercial: lead?.cod_tipo_flujo_comercial ?? '',
        cod_usuario_responsable: lead?.cod_usuario_responsable ?? '',
    });

    const submit = () => {
        form.put(route('leads.update', lead.cod_lead));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Editar Lead"
                    subtitle={`Modifique los datos de ${lead.nombre_lea}`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Leads', href: route('leads.index') },
                        { label: lead.nombre_lea },
                    ]}
                />
            }
        >
            <Head title="Editar Lead" />

            <div className="max-w-3xl mx-auto">
                <LeadForm {...props} form={form} submit={submit} isEdit={true} />
            </div>
        </AuthenticatedLayout>
    );
}
