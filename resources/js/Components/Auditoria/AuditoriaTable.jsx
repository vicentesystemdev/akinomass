import { Link } from '@inertiajs/react';
import { accionBadges, accionLabels } from './auditUtils';

const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('es-BO', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
};

export default function AuditoriaTable({ logs }) {
    if (!logs?.data?.length) {
        return (
            <div className="py-12 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-500">No se encontraron registros de auditoría.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Módulo</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {logs.data.map((log) => (
                        <tr key={log.cod_auditoria} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-2.5 px-4 whitespace-nowrap">
                                <span className="text-xs text-gray-600">{formatDate(log.fecha_aud)}</span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="text-xs font-medium text-cafe-700">
                                    {log.user?.name ?? (log.cliente?.nombre_cli ?? 'Sistema')}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="text-xs text-gray-600">{log.modulo_aud}</span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${accionBadges[log.accion_aud] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {accionLabels[log.accion_aud] ?? log.accion_aud}
                                </span>
                            </td>
                            <td className="py-2.5 px-4 max-w-xs">
                                <p className="text-xs text-gray-600 truncate">{log.descripcion_aud ?? '-'}</p>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="text-[10px] font-mono text-gray-400">{log.ip_aud ?? '-'}</span>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                                <Link
                                    href={route('auditoria.show', log.cod_auditoria)}
                                    className="text-xs font-medium text-terracota-600 hover:text-terracota-700 transition-colors"
                                >
                                    Ver
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
