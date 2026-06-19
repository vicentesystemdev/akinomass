import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Database, Download, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const estadoConfig = {
    en_proceso: { label: 'En proceso', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    exitoso: { label: 'Exitoso', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    fallido: { label: 'Fallido', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

const tipoConfig = {
    base: { label: 'Base', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
    incremental: { label: 'Incremental', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
};

function formatFecha(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Index({ backups = { data: [] } }) {
    const { flash } = usePage().props;
    const [generando, setGenerando] = useState(false);

    const backupsData = backups.data || [];

    const handleGenerar = () => {
        if (generando) return;
        setGenerando(true);
        router.post(route('backups.create'), {}, {
            onFinish: () => setGenerando(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Backups de Base de Datos"
                    subtitle="Generar y descargar respaldos incrementales del sistema"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Backups BD' },
                    ]}
                    actions={
                        <button
                            onClick={handleGenerar}
                            disabled={generando}
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: generando
                                    ? '#9CA3AF'
                                    : 'linear-gradient(135deg, #3C473A, #4e5849)',
                            }}
                        >
                            {generando ? (
                                <>
                                    <RefreshCw size={16} className="animate-spin" />
                                    Generando...
                                </>
                            ) : (
                                <>
                                    <Database size={16} />
                                    Generar backup
                                </>
                            )}
                        </button>
                    }
                />
            }
        >
            <Head title="Backups BD" />

            <div className="space-y-6">
                {flash?.success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                <SectionCard noPadding>
                    {backupsData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Archivo
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Generado por
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {backupsData.map((backup) => {
                                        const estado = estadoConfig[backup.bck_estado] || estadoConfig.en_proceso;
                                        const tipo = tipoConfig[backup.bck_tipo] || tipoConfig.incremental;
                                        const EstadoIcon = estado.icon;

                                        return (
                                            <tr key={backup.bck_id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-oliva-50 flex items-center justify-center">
                                                            <Database size={14} className="text-oliva-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-cafe-900 truncate max-w-xs" title={backup.bck_archivo}>
                                                                {backup.bck_archivo}
                                                            </p>
                                                            {backup.bck_error && (
                                                                <p className="text-xs text-red-500 mt-0.5 truncate max-w-xs" title={backup.bck_error}>
                                                                    <AlertTriangle size={10} className="inline mr-1" />
                                                                    {backup.bck_error}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tipo.color} ${tipo.bg} ${tipo.border}`}>
                                                        {tipo.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {formatFecha(backup.bck_fecha)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {backup.usuario?.name || '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${estado.color} ${estado.bg} ${estado.border}`}>
                                                        <EstadoIcon size={12} />
                                                        {estado.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {backup.bck_estado === 'exitoso' ? (
                                                        <a
                                                            href={route('backups.download', backup.bck_id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-oliva-700 bg-oliva-50 border border-oliva-200 hover:bg-oliva-100 transition-colors"
                                                        >
                                                            <Download size={12} />
                                                            Descargar
                                                        </a>
                                                    ) : backup.bck_estado === 'en_proceso' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200">
                                                            <RefreshCw size={12} className="animate-spin" />
                                                            Procesando
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed">
                                                            No disponible
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState
                            title="No hay backups registrados"
                            description="Genera tu primer backup para comenzar a respaldar la base de datos del sistema."
                        />
                    )}
                </SectionCard>

                {backupsData.length > 0 && (
                    <Pagination links={backups.links} meta={backups.meta || backups} />
                )}

                {backups.total > 0 && (
                    <p className="text-center text-xs text-gray-400">
                        Mostrando {backups.from ?? 0}-{backups.to ?? 0} de {backups.total} backups
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
