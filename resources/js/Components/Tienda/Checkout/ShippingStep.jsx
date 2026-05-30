import { useState } from 'react';
import { ChevronLeft, ChevronRight, Phone, Mail, FileText, MapPin, Building2 } from 'lucide-react';

const DEPARTAMENTOS = ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'];

const inputStyle = (hasError) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: `1.5px solid ${hasError ? '#DC2626' : '#E5E7EB'}`,
    background: 'white',
    fontSize: 13.5,
    outline: 'none',
    color: '#2B221E',
});

function CheckoutField({ label, field, type = 'text', placeholder = '', value, error, onChange, icon: Icon }) {
    return (
        <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>{label}</label>
            <div className="relative">
                {Icon && (
                    <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
                )}
                <input
                    type={type}
                    name={field}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(field, e.target.value)}
                    style={{ ...inputStyle(!!error), paddingLeft: Icon ? '36px' : '12px' }}
                    onFocus={(e) => { e.target.style.borderColor = '#3C473A'; }}
                    onBlur={(e) => { e.target.style.borderColor = error ? '#DC2626' : '#E5E7EB'; }}
                />
            </div>
            {error && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{error}</p>}
        </div>
    );
}

export default function ShippingStep({ data, onChange, onNext, onBack }) {
    const [errors, setErrors] = useState({});

    function handleFieldChange(field, value) {
        onChange({ [field]: value });
    }

    function validate() {
        const e = {};
        if (!data.email_contacto?.trim() || !data.email_contacto.includes('@')) e.email_contacto = 'Email inválido';
        if (!data.telefono_contacto?.trim()) e.telefono_contacto = 'Requerido';
        if (!data.direccion_entrega?.trim()) e.direccion_entrega = 'Requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleNext() {
        if (validate()) onNext();
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Datos de Contacto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CheckoutField
                            label="Email *"
                            field="email_contacto"
                            type="email"
                            placeholder="tu@email.com"
                            icon={Mail}
                            value={data.email_contacto || ''}
                            error={errors.email_contacto}
                            onChange={handleFieldChange}
                        />
                        <CheckoutField
                            label="Teléfono / WhatsApp *"
                            field="telefono_contacto"
                            type="tel"
                            placeholder="+591 7XXXXXXX"
                            icon={Phone}
                            value={data.telefono_contacto || ''}
                            error={errors.telefono_contacto}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Dirección de Entrega</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Departamento</label>
                            <select
                                name="departamento_entrega"
                                value={data.departamento_entrega || 'La Paz'}
                                onChange={(e) => handleFieldChange('departamento_entrega', e.target.value)}
                                style={inputStyle(false)}
                            >
                                {DEPARTAMENTOS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <CheckoutField
                            label="Ciudad *"
                            field="ciudad_entrega"
                            placeholder="Ej: La Paz"
                            icon={MapPin}
                            value={data.ciudad_entrega || ''}
                            error={errors.ciudad_entrega}
                            onChange={handleFieldChange}
                        />
                        <div className="sm:col-span-2">
                            <CheckoutField
                                label="Dirección completa *"
                                field="direccion_entrega"
                                placeholder="Ej: Av. 6 de Agosto #1234, Sopocachi"
                                value={data.direccion_entrega || ''}
                                error={errors.direccion_entrega}
                                onChange={handleFieldChange}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <CheckoutField
                                label="Referencia"
                                field="referencia_entrega"
                                placeholder="Ej: Frente al parque, edificio azul"
                                value={data.referencia_entrega || ''}
                                error={errors.referencia_entrega}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Datos de Facturación</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CheckoutField
                            label="Documento (CI/NIT)"
                            field="documento_facturacion"
                            placeholder="Ej: 12345678"
                            icon={FileText}
                            value={data.documento_facturacion || ''}
                            error={errors.documento_facturacion}
                            onChange={handleFieldChange}
                        />
                        <CheckoutField
                            label="Razón Social"
                            field="razon_social"
                            placeholder="Nombre o empresa"
                            icon={Building2}
                            value={data.razon_social || ''}
                            error={errors.razon_social}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                    Ir al Pago
                    <ChevronRight size={16} />
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                    style={{ fontSize: 13, color: '#6B7280', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer' }}
                >
                    <ChevronLeft size={13} />
                    Volver
                </button>
            </div>
        </div>
    );
}
