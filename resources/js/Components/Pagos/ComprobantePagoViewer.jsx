import { FileText, Download, ExternalLink, ImageIcon, AlertTriangle } from 'lucide-react';
import { formatDateTimeBO } from '@/lib/formatters';

export default function ComprobantePagoViewer({ comprobante, className = '' }) {
    if (!comprobante) return null;

    if (!comprobante.tiene) {
        return (
            <div
                className={`rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3 ${className}`}
            >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-amber-900">Sin comprobante adjunto</p>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        {comprobante.origen_tienda
                            ? 'El cliente aún no subió comprobante desde la tienda. No apruebes el pago hasta verificar el depósito o transferencia.'
                            : 'Este pago fue registrado manualmente en el panel y no incluye comprobante digital.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {comprobante.es_imagen ? (
                        <ImageIcon className="w-5 h-5 text-oliva-600" />
                    ) : (
                        <FileText className="w-5 h-5 text-oliva-600" />
                    )}
                    <div>
                        <p className="text-sm font-semibold text-cafe-900">Comprobante de pago</p>
                        {comprobante.fecha_subida && (
                            <p className="text-xs text-gray-500">
                                Subido {formatDateTimeBO(comprobante.fecha_subida)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <a
                        href={comprobante.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-oliva-200 bg-oliva-50 px-3 py-2 text-xs font-semibold text-oliva-800 hover:bg-oliva-100 transition-colors"
                    >
                        <ExternalLink size={14} />
                        Abrir
                    </a>
                    <a
                        href={comprobante.url}
                        download
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-cafe-700 hover:bg-gray-50 transition-colors"
                    >
                        <Download size={14} />
                        Descargar
                    </a>
                </div>
            </div>

            {comprobante.es_imagen ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 overflow-hidden">
                    <img
                        src={comprobante.url}
                        alt="Comprobante de pago"
                        className="w-full max-h-[480px] object-contain rounded-lg mx-auto"
                    />
                </div>
            ) : comprobante.es_pdf ? (
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100" style={{ minHeight: 420 }}>
                    <iframe
                        title="Comprobante PDF"
                        src={comprobante.url}
                        className="w-full h-[480px] border-0"
                    />
                </div>
            ) : (
                <p className="text-sm text-gray-500">Vista previa no disponible para este formato.</p>
            )}

            {comprobante.nombre && (
                <p className="text-xs text-gray-400 font-mono truncate">{comprobante.nombre}</p>
            )}
        </div>
    );
}
