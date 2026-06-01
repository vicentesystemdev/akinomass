import { useEffect, useRef, useState } from 'react';
import { Upload, X, FileText, ImageIcon } from 'lucide-react';

const MAX_MB = 5;
const ACCEPT = '.jpg,.jpeg,.png,.pdf';

export default function ComprobanteUpload({ file, onChange, error }) {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPdf, setIsPdf] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            setIsPdf(false);
            return undefined;
        }

        const pdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        setIsPdf(pdf);

        if (pdf) {
            setPreviewUrl(null);
            return undefined;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleFile = (selected) => {
        if (!selected) {
            onChange(null);
            return;
        }
        if (selected.size > MAX_MB * 1024 * 1024) {
            onChange(null, `El archivo supera ${MAX_MB} MB.`);
            return;
        }
        onChange(selected, null);
    };

    return (
        <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>
                Comprobante de pago <span style={{ color: '#DC2626' }}>*</span>
            </label>

            {!file ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-terracota-200 bg-terracota-50/40 p-6 text-center transition-colors hover:border-terracota-400 hover:bg-terracota-50"
                >
                    <Upload size={28} className="mx-auto text-terracota-500 mb-2" />
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2B221E' }}>Sube tu comprobante</p>
                    <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                        Captura de transferencia, depósito o pago QR · JPG, PNG o PDF · máx. {MAX_MB} MB
                    </p>
                </button>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            {isPdf ? (
                                <FileText size={20} className="text-terracota-600 shrink-0" />
                            ) : (
                                <ImageIcon size={20} className="text-terracota-600 shrink-0" />
                            )}
                            <span className="text-sm font-medium text-cafe-900 truncate">{file.name}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleFile(null)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                            aria-label="Quitar archivo"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Vista previa comprobante"
                            className="w-full max-h-48 object-contain rounded-lg border border-gray-100 bg-gray-50"
                        />
                    )}
                    {isPdf && (
                        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                            PDF listo para enviar. El equipo lo revisará al validar tu pago.
                        </p>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />

            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
            )}
            {!error && (
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                    Obligatorio para validar tu pago en tienda online.
                </p>
            )}
        </div>
    );
}
