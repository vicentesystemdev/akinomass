import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
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
        form.put(route('clientes.update', cliente.cod_cliente), {
            onSuccess: () => {
                // Success feedback handled by Inertia
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Cliente" />

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
                        <h2 className="text-xl font-semibold text-gray-900">Editar Cliente</h2>
                        <p className="text-sm text-gray-500 mt-1">Modifique los datos del cliente</p>
                    </div>
                    <div className="p-6">
                        <ClienteForm
                            {...props}
                            form={form}
                            submit={submit}
                            isEdit={true}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}