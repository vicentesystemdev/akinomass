import { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

export default function PaymentImageUpload({ currentImage, error, onChange, disabled = false }) {
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);

    const currentUrl = currentImage ? `/storage/${currentImage}` : null;

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            onChange(null, 'La imagen no debe superar 2 MB.');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            onChange(null, 'Solo se permiten archivos JPG o PNG.');
            return;
        }

        setPreview(URL.createObjectURL(file));
        onChange(file, null);
    }

    function handleRemove() {
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
        onChange(null, null);
    }

    const displayUrl = preview || currentUrl;

    return (
        <div>
            {displayUrl ? (
                <div className="relative inline-block">
                    <img
                        src={displayUrl}
                        alt="Vista previa"
                        className="rounded-xl border border-gray-200 object-cover"
                        style={{ maxHeight: 180, maxWidth: '100%' }}
                    />
                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                            style={{ background: '#DC2626', color: 'white' }}
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors"
                    style={{
                        borderColor: disabled ? '#E5E7EB' : '#D1D5DB',
                        background: disabled ? '#F9FAFB' : '#FAFAFA',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                        <Upload size={18} style={{ color: '#9CA3AF' }} />
                    </div>
                    <div className="text-center">
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                            Subir imagen
                        </p>
                        <p style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 2 }}>
                            JPG o PNG, máximo 2 MB
                        </p>
                    </div>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
            />

            {error && (
                <p className="mt-1.5 text-xs font-medium" style={{ color: '#DC2626' }}>{error}</p>
            )}
        </div>
    );
}
