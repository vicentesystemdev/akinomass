import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        form.post(route('clientes.store'), {
            onSuccess: () => {
                // Success feedback handled by Inertia
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Cliente" />

            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route('clientes.index')}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver a Clientes
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">Nuevo Cliente</h2>
                        <p className="text-sm text-gray-500 mt-1">Complete los datos del nuevo cliente</p>
                    </div>
                    <div className="p-6">
                        <ClienteForm
                            {...props}
                            form={form}
                            submit={submit}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}