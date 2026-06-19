import { ChevronLeft, Shield, QrCode, Building2, CreditCard, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ComprobanteUpload from './ComprobanteUpload';

const PAYMENT_METHODS = [
    { id: 'qr', label: 'Código QR', sub: 'Pago instantáneo', icon: QrCode, color: '#3C473A', bg: '#f4f5f4' },
    { id: 'transferencia', label: 'Transferencia Bancaria', sub: 'BCP, BISA, BNB', icon: Building2, color: '#D77A61', bg: '#fdf5f2' },
    { id: 'deposito', label: 'Depósito Bancario', sub: 'En ventanilla', icon: CreditCard, color: '#059669', bg: '#ECFDF5' },
];

function InfoRow({ label, value, copyable = false }) {
    const [copied, setCopied] = useState(false);

    if (!value) return null;

    function handleCopy() {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}</span>
            <div className="flex items-center gap-2">
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{value}</span>
                {copyable && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        title="Copiar"
                    >
                        {copied ? <Check size={12} style={{ color: '#059669' }} /> : <Copy size={12} style={{ color: '#9CA3AF' }} />}
                    </button>
                )}
            </div>
        </div>
    );
}

function PaymentInfoCard({ method, config }) {
    if (!config) return null;

    const colorMap = {
        qr: '#3C473A',
        transferencia: '#D77A61',
        deposito: '#059669',
    };

    const color = colorMap[method];

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${color}20`, background: `${color}05` }}
        >
            {config.imagen && (
                <div className="p-4 flex justify-center" style={{ background: 'white' }}>
                    <img
                        src={`/storage/${config.imagen}`}
                        alt={config.titulo || 'Información de pago'}
                        className="rounded-xl object-contain"
                        style={{ maxHeight: 200, maxWidth: '100%' }}
                    />
                </div>
            )}

            <div className="p-4 space-y-2">
                {config.titulo && (
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>{config.titulo}</p>
                )}

                {method === 'qr' && config.instrucciones && (
                    <p style={{ fontSize: 12.5, color: '#6B7280', lineHeight: 1.5 }}>{config.instrucciones}</p>
                )}

                {method !== 'qr' && (
                    <div className="space-y-0">
                        <InfoRow label="Banco" value={config.banco} />
                        <InfoRow label="Cuenta" value={config.cuenta} copyable />
                        <InfoRow label="Titular" value={config.titular} />
                        {config.cci && <InfoRow label="CCI" value={config.cci} copyable />}
                    </div>
                )}

                {config.instrucciones && method !== 'qr' && (
                    <p className="mt-2" style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, fontStyle: 'italic' }}>
                        {config.instrucciones}
                    </p>
                )}

                {!config.imagen && !config.titulo && !config.instrucciones && method === 'qr' && (
                    <p style={{ fontSize: 12.5, color: '#9CA3AF', textAlign: 'center', padding: '8px 0' }}>
                        El administrador aún no ha configurado la información de este método de pago.
                    </p>
                )}

                {!config.imagen && !config.cuenta && !config.banco && method !== 'qr' && (
                    <p style={{ fontSize: 12.5, color: '#9CA3AF', textAlign: 'center', padding: '8px 0' }}>
                        El administrador aún no ha configurado la información de este método de pago.
                    </p>
                )}
            </div>
        </div>
    );
}

export default function PaymentStep({
    method,
    onMethod,
    data,
    onChange,
    onNext,
    onBack,
    processing = false,
    comprobanteError = null,
    onComprobanteError = () => {},
    mediosPago = {},
}) {
    const canSubmit = Boolean(data.comprobante) && !processing;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 4 }}>Elige tu método de pago</h3>

                {PAYMENT_METHODS.map((opt) => (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onMethod(opt.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{
                            border: `2px solid ${method === opt.id ? opt.color : '#E5E7EB'}`,
                            background: method === opt.id ? opt.bg : 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: method === opt.id ? opt.color : '#F3F4F6' }}
                        >
                            <opt.icon size={20} color={method === opt.id ? 'white' : '#9CA3AF'} />
                        </div>
                        <div className="flex-1">
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>{opt.label}</p>
                            <p style={{ fontSize: 12.5, color: '#6B7280' }}>{opt.sub}</p>
                        </div>
                        <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: method === opt.id ? opt.color : '#D1D5DB' }}
                        >
                            {method === opt.id && (
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: opt.color }} />
                            )}
                        </div>
                    </button>
                ))}

                {method && mediosPago[method] && (
                    <PaymentInfoCard method={method} config={mediosPago[method]} />
                )}

                <div className="p-5 rounded-2xl" style={{ background: '#FAFAFA', border: '1px solid #F3F4F6' }}>
                    <div className="space-y-4">
                        <div>
                            <label
                                style={{
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: '#544a45',
                                    display: 'block',
                                    marginBottom: 5,
                                }}
                            >
                                Referencia de pago
                            </label>
                            <input
                                type="text"
                                value={data.referencia_pago || ''}
                                onChange={(e) => onChange({ referencia_pago: e.target.value })}
                                placeholder="Número de operación, referencia bancaria…"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: '1.5px solid #E5E7EB',
                                    background: 'white',
                                    fontSize: 13.5,
                                    outline: 'none',
                                    color: '#2B221E',
                                }}
                            />
                        </div>

                        <ComprobanteUpload
                            file={data.comprobante}
                            error={comprobanteError}
                            onChange={(file, fileError = null) => {
                                onChange({ comprobante: file });
                                onComprobanteError(fileError);
                            }}
                        />
                    </div>

                    <div
                        className="flex items-start gap-2 p-3 rounded-xl mt-4"
                        style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}
                    >
                        <AlertCircle size={13} style={{ color: '#D97706', marginTop: 1, flexShrink: 0 }} />
                        <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                            Tu comprobante será revisado por nuestro equipo antes de confirmar el pago. El registro no
                            acredita automáticamente en el banco.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canSubmit}
                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{
                        background: canSubmit
                            ? 'linear-gradient(135deg, #059669, #10B981)'
                            : '#9CA3AF',
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 700,
                        border: 'none',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                    }}
                >
                    <Shield size={15} />
                    {processing ? 'Procesando...' : 'Confirmar pedido y enviar comprobante'}
                </button>
                {!data.comprobante && !processing && (
                    <p className="text-xs text-center text-amber-700 font-medium">Adjunta el comprobante para continuar</p>
                )}
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                    style={{
                        fontSize: 13,
                        color: '#6B7280',
                        border: '1px solid #E5E7EB',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <ChevronLeft size={13} />
                    Volver
                </button>
            </div>
        </div>
    );
}
