import PageHeader from '@/Components/UI/PageHeader';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryActionButton from '@/Components/UI/SecondaryActionButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, RotateCcw, Settings, Trash2 } from 'lucide-react';
import InteligenciaVentasTabs from './InteligenciaVentasTabs';

export default function InteligenciaVentasLayout({ title, subtitle, children, showConfigAction = false }) {
    const generar = () => {
        router.post(route('inteligencia-ventas.generar'), {}, { preserveScroll: true });
    };

    const limpiar = () => {
        if (window.confirm('Esta accion limpiara solo las proyecciones generadas.')) {
            router.delete(route('inteligencia-ventas.limpiar'), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={title}
                    subtitle={subtitle}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Inteligencia de Ventas' },
                    ]}
                    actions={
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            {showConfigAction && (
                                <Link href={route('inteligencia-ventas.configuracion')}>
                                    <SecondaryActionButton icon={<Settings className="h-4 w-4" />}>
                                        Configuracion
                                    </SecondaryActionButton>
                                </Link>
                            )}
                            <PrimaryActionButton onClick={generar} icon={<BarChart3 className="h-4 w-4" />}>
                                Generar proyeccion
                            </PrimaryActionButton>
                            <SecondaryActionButton onClick={limpiar} icon={<Trash2 className="h-4 w-4" />} className="text-red-700 hover:text-red-800">
                                Limpiar proyecciones
                            </SecondaryActionButton>
                        </div>
                    }
                />
            }
        >
            <Head title={title} />
            <div className="space-y-6">
                <div className="rounded-xl border border-oliva-100 bg-white p-4 shadow-card">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <p className="max-w-3xl text-sm leading-6 text-cafe-700">
                            El sistema analiza el comportamiento historico de ventas, la rotacion del inventario, la participacion por canal y la evolucion de la demanda para proyectar ventas y sugerir abastecimiento.
                        </p>
                        <div className="flex items-center gap-2 rounded-lg bg-oliva-50 px-3 py-2 text-xs font-semibold text-oliva-800">
                            <RotateCcw className="h-4 w-4" />
                            Modelo de proyeccion comercial
                        </div>
                    </div>
                </div>

                <InteligenciaVentasTabs />
                {children}
            </div>
        </AuthenticatedLayout>
    );
}
