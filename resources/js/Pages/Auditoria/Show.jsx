import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import AuditoriaDetailCard from '@/Components/Auditoria/AuditoriaDetailCard';
import AuditoriaDiffViewer from '@/Components/Auditoria/AuditoriaDiffViewer';
import { Head, Link } from '@inertiajs/react';
import { accionBadges, accionLabels } from '@/Components/Auditoria/auditUtils';

const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('es-BO', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
};

export default function Show({ log, relacionados }) {
    const rowClass = 'flex items-center justify-between py-2';

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Detalle de Auditoría"
                    subtitle={`Registro #${log.cod_auditoria}`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Auditoría', href: route('auditoria.index') },
                        { label: `#${log.cod_auditoria}` },
                    ]}
                    actions={
                        <Link href={route('auditoria.index')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                    </svg>
                                }
                            >
                                Volver
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title={`Auditoría #${log.cod_auditoria}`} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuditoriaDetailCard title="Información General">
                        <div className="space-y-1 text-sm">
                            <div className={rowClass}>
                                <span className="text-gray-500">Fecha</span>
                                <span className="font-medium text-cafe-700">{formatDate(log.fecha_aud)}</span>
                            </div>
                            <div className={rowClass}>
                                <span className="text-gray-500">Módulo</span>
                                <span className="font-medium text-cafe-700">{log.modulo_aud}</span>
                            </div>
                            {log.submodulo_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">Submódulo</span>
                                    <span className="font-medium text-cafe-700">{log.submodulo_aud}</span>
                                </div>
                            )}
                            <div className={rowClass}>
                                <span className="text-gray-500">Acción</span>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${accionBadges[log.accion_aud] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {accionLabels[log.accion_aud] ?? log.accion_aud}
                                </span>
                            </div>
                            {log.accion_funcional_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">Acción funcional</span>
                                    <span className="font-medium text-cafe-700">{log.accion_funcional_aud}</span>
                                </div>
                            )}
                            {log.tabla_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">Tabla</span>
                                    <span className="font-mono text-xs text-cafe-700">{log.tabla_aud}</span>
                                </div>
                            )}
                            {log.id_registro_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">ID Registro</span>
                                    <span className="font-mono text-xs text-cafe-700">{log.id_registro_aud}</span>
                                </div>
                            )}
                        </div>
                    </AuditoriaDetailCard>

                    <AuditoriaDetailCard title="Actor">
                        <div className="space-y-1 text-sm">
                            {log.user ? (
                                <>
                                    <div className={rowClass}>
                                        <span className="text-gray-500">Usuario interno</span>
                                        <span className="font-medium text-cafe-700">{log.user.name}</span>
                                    </div>
                                    <div className={rowClass}>
                                        <span className="text-gray-500">Email</span>
                                        <span className="text-cafe-700">{log.user.email}</span>
                                    </div>
                                </>
                            ) : log.cliente ? (
                                <>
                                    <div className={rowClass}>
                                        <span className="text-gray-500">Cliente</span>
                                        <span className="font-medium text-cafe-700">{log.cliente.nombre_cli}</span>
                                    </div>
                                    {log.cliente.telefono_cli && (
                                        <div className={rowClass}>
                                            <span className="text-gray-500">Teléfono</span>
                                            <span className="text-cafe-700">{log.cliente.telefono_cli}</span>
                                        </div>
                                    )}
                                    {log.cliente.correo_cli && (
                                        <div className={rowClass}>
                                            <span className="text-gray-500">Correo</span>
                                            <span className="text-cafe-700">{log.cliente.correo_cli}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-gray-400">Sistema / Proceso automático</p>
                            )}
                        </div>
                    </AuditoriaDetailCard>
                </div>

                {log.descripcion_aud && (
                    <AuditoriaDetailCard title="Descripción">
                        <p className="text-sm text-cafe-700 leading-relaxed">{log.descripcion_aud}</p>
                    </AuditoriaDetailCard>
                )}

                {(log.campo_aud || log.valor_anterior_aud || log.valor_nuevo_aud) && (
                    <AuditoriaDetailCard title="Cambio Realizado">
                        {log.campo_aud && (
                            <p className="text-xs text-gray-500 mb-3">
                                Campo: <span className="font-mono font-semibold text-cafe-700">{log.campo_aud}</span>
                            </p>
                        )}
                        <AuditoriaDiffViewer anterior={log.valor_anterior_aud} nuevo={log.valor_nuevo_aud} />
                    </AuditoriaDetailCard>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuditoriaDetailCard title="Contexto HTTP">
                        <div className="space-y-1 text-sm">
                            {log.metodo_http_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">Método</span>
                                    <span className="font-mono text-xs font-semibold text-oliva-700 bg-oliva-50 px-2 py-0.5 rounded">
                                        {log.metodo_http_aud}
                                    </span>
                                </div>
                            )}
                            {log.ip_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">IP</span>
                                    <span className="font-mono text-xs text-cafe-700">{log.ip_aud}</span>
                                </div>
                            )}
                            {log.navegador_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">Navegador</span>
                                    <span className="text-cafe-700">{log.navegador_aud}</span>
                                </div>
                            )}
                            {log.sistema_operativo_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">SO</span>
                                    <span className="text-cafe-700">{log.sistema_operativo_aud}</span>
                                </div>
                            )}
                            {log.dispositivo_aud && (
                                <div className={rowClass}>
                                    <span className="text-gray-500">Dispositivo</span>
                                    <span className="text-cafe-700">{log.dispositivo_aud}</span>
                                </div>
                            )}
                        </div>
                    </AuditoriaDetailCard>

                    {log.id_evento_aud && (
                        <AuditoriaDetailCard title="Evento Agrupado">
                            <div className="space-y-1 text-sm">
                                <div className={rowClass}>
                                    <span className="text-gray-500">UUID</span>
                                    <span className="font-mono text-[10px] text-cafe-700">{log.id_evento_aud}</span>
                                </div>
                                <div className={rowClass}>
                                    <span className="text-gray-500">Logs relacionados</span>
                                    <span className="font-semibold text-cafe-700">{relacionados.length}</span>
                                </div>
                            </div>
                        </AuditoriaDetailCard>
                    )}
                </div>

                {log.user_agent_aud && (
                    <AuditoriaDetailCard title="User Agent">
                        <p className="text-xs text-gray-500 font-mono break-all">{log.user_agent_aud}</p>
                    </AuditoriaDetailCard>
                )}

                {relacionados.length > 0 && (
                    <AuditoriaDetailCard title="Eventos Relacionados">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Fecha</th>
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Módulo</th>
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Acción</th>
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Descripción</th>
                                        <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {relacionados.map((r) => (
                                        <tr key={r.cod_auditoria} className="hover:bg-gray-50/50">
                                            <td className="py-2 px-3 text-xs text-gray-600">{formatDate(r.fecha_aud)}</td>
                                            <td className="py-2 px-3 text-xs text-gray-600">{r.modulo_aud}</td>
                                            <td className="py-2 px-3">
                                                <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${accionBadges[r.accion_aud] ?? ''}`}>
                                                    {accionLabels[r.accion_aud] ?? r.accion_aud}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 text-xs text-gray-600 max-w-xs truncate">{r.descripcion_aud ?? '-'}</td>
                                            <td className="py-2 px-3 text-right">
                                                <Link href={route('auditoria.show', r.cod_auditoria)} className="text-xs text-terracota-600 hover:text-terracota-700">
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AuditoriaDetailCard>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
