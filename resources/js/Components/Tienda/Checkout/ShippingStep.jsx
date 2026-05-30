import { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Phone, Mail, FileText, MapPin, Building2 } from 'lucide-react';

const DEPARTAMENTOS = ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'];

export default function ShippingStep({ data, onChange, onNext, onBack }) {
    const [errors, setErrors] = useState({});

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

    function inp(field) {
        return {
            value: data[field] || '',
            onChange: (e) => onChange({ [field]: e.target.value }),
            style: {
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: `1.5px solid ${errors[field] ? '#DC2626' : '#E5E7EB'}`,
                background: 'white',
                fontSize: 13.5,
                outline: 'none',
                color: '#2B221E',
                transition: 'border-color 0.2s',
            },
            onFocus: (e) => { e.target.style.borderColor = '#3C473A'; },
            onBlur: (e) => { e.target.style.borderColor = errors[field] ? '#DC2626' : '#E5E7EB'; },
        };
    }

    function Field({ label, field, type = 'text', placeholder = '', icon: Icon }) {
        return (
            <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>{label}</label>
                <div className="relative">
                    {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />}
                    <input type={type} placeholder={placeholder} {...inp(field)} style={{ ...inp(field).style, paddingLeft: Icon ? '36px' : '12px' }} />
                </div>
                {errors[field] && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors[field]}</p>}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Datos de Contacto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Email *" field="email_contacto" type="email" placeholder="tu@email.com" icon={Mail} />
                        <Field label="Teléfono / WhatsApp *" field="telefono_contacto" type="tel" placeholder="+591 7XXXXXXX" icon={Phone} />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Dirección de Entrega</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Departamento</label>
                            <select {...inp('departamento_entrega')}>
                                {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <Field label="Ciudad *" field="ciudad_entrega" placeholder="Ej: La Paz" icon={MapPin} />
                        <div className="sm:col-span-2">
                            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Dirección completa *</label>
                            <input type="text" placeholder="Ej: Av. 6 de Agosto #1234, Sopocachi" {...inp('direccion_entrega')} />
                            {errors.direccion_entrega && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors.direccion_entrega}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Referencia</label>
                            <input type="text" placeholder="Ej: Frente al parque, edificio azul" {...inp('referencia_entrega')} />
                        </div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Datos de Facturación</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Documento (CI/NIT)" field="documento_facturacion" placeholder="Ej: 12345678" icon={FileText} />
                        <Field label="Razón Social" field="razon_social" placeholder="Nombre o empresa" icon={Building2} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleNext}
                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                    Ir al Pago
                    <ChevronRight size={16} />
                </button>
                <button
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
