import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import Pagination from '@/Components/UI/Pagination';
import AuditoriaFilters from '@/Components/Auditoria/AuditoriaFilters';
import AuditoriaTable from '@/Components/Auditoria/AuditoriaTable';
import { Head } from '@inertiajs/react';

export default function Index({ logs, usuarios, modulos, acciones, filtros }) {
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Auditoría del Sistema"
                    subtitle="Registro de acciones y eventos del sistema"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Auditoría' },
                    ]}
                />
            }
        >
            <Head title="Auditoría del Sistema" />

            <div className="space-y-6">
                <SectionCard title="Filtros">
                    <AuditoriaFilters
                        usuarios={usuarios}
                        modulos={modulos}
                        acciones={acciones}
                        filtros={filtros}
                    />
                </SectionCard>

                <SectionCard noPadding>
                    <AuditoriaTable logs={logs} />
                    <div className="px-6 pb-4">
                        <Pagination links={logs.links} meta={logs.meta} />
                    </div>
                </SectionCard>

                {logs.total > 0 && (
                    <p className="text-center text-xs text-gray-400">
                        Mostrando {logs.from ?? 0}-{logs.to ?? 0} de {logs.total} registros
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
