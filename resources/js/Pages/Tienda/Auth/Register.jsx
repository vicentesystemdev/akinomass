import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingCart, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        telefono_cli: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('tienda.registro'));
    };

    return (
        <>
            <Head title="Crear Cuenta" />

            <div className="min-h-screen flex" style={{ fontFamily: 'Figtree, sans-serif' }}>
                {/* Panel izquierdo - Hero */}
                <div
                    className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1a1f19 0%, #3C473A 50%, #D77A61 100%)' }}
                >
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-16 right-20 w-72 h-72 rounded-full" style={{ background: 'white' }} />
                        <div className="absolute bottom-24 left-16 w-56 h-56 rounded-full" style={{ background: 'white' }} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <ShoppingCart size={28} color="white" />
                        </div>

                        <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
                            Únete a AKINOMASS
                        </h1>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', maxWidth: 380, lineHeight: 1.6, marginBottom: 32 }}>
                            Crea tu cuenta y accede a ofertas exclusivas, seguimiento de pedidos y más.
                        </p>

                        <div className="space-y-3 text-left w-full max-w-xs">
                            {['Acceso a ofertas exclusivas', 'Seguimiento de pedidos en tiempo real', 'Historial de compras', 'Direcciones guardadas'].map((benefit) => (
                                <div key={benefit} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <Check size={12} color="white" />
                                    </div>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel derecho - Formulario */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: '#FDF6F0' }}>
                    <div className="w-full max-w-md">
                        <div className="lg:hidden flex items-center gap-2.5 mb-8">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)' }}>
                                <ShoppingCart size={16} color="white" />
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 800, color: '#2B221E' }}>AKINOMASS</span>
                        </div>

                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#2B221E', marginBottom: 4 }}>
                            Crear cuenta
                        </h2>
                        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 28 }}>
                            Completa tus datos para registrarte
                        </p>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 6 }}>
                                    Nombre completo *
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl"
                                        style={{
                                            background: 'white',
                                            border: `1.5px solid ${errors.name ? '#DC2626' : '#E5E7EB'}`,
                                            outline: 'none',
                                            fontSize: 14,
                                            color: '#2B221E',
                                        }}
                                        placeholder="María Quispe"
                                    />
                                </div>
                                {errors.name && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.name}</p>}
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 6 }}>
                                    Correo electrónico *
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl"
                                        style={{
                                            background: 'white',
                                            border: `1.5px solid ${errors.email ? '#DC2626' : '#E5E7EB'}`,
                                            outline: 'none',
                                            fontSize: 14,
                                            color: '#2B221E',
                                        }}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                {errors.email && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.email}</p>}
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 6 }}>
                                    Teléfono / WhatsApp
                                </label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                                    <input
                                        type="tel"
                                        value={data.telefono_cli}
                                        onChange={(e) => setData('telefono_cli', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl"
                                        style={{
                                            background: 'white',
                                            border: `1.5px solid ${errors.telefono_cli ? '#DC2626' : '#E5E7EB'}`,
                                            outline: 'none',
                                            fontSize: 14,
                                            color: '#2B221E',
                                        }}
                                        placeholder="+591 7XXXXXXX"
                                    />
                                </div>
                                {errors.telefono_cli && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.telefono_cli}</p>}
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 6 }}>
                                    Contraseña *
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 rounded-xl"
                                        style={{
                                            background: 'white',
                                            border: `1.5px solid ${errors.password ? '#DC2626' : '#E5E7EB'}`,
                                            outline: 'none',
                                            fontSize: 14,
                                            color: '#2B221E',
                                        }}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.password}</p>}
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 6 }}>
                                    Confirmar contraseña *
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 rounded-xl"
                                        style={{
                                            background: 'white',
                                            border: '1.5px solid #E5E7EB',
                                            outline: 'none',
                                            fontSize: 14,
                                            color: '#2B221E',
                                        }}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 mt-2"
                                style={{
                                    background: processing ? '#9CA3AF' : 'linear-gradient(135deg, #D77A61, #c56950)',
                                    color: 'white',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {processing ? 'Creando cuenta...' : 'Crear Cuenta'}
                                {!processing && <ArrowRight size={16} />}
                            </button>
                        </form>

                        <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 20 }}>
                            ¿Ya tienes cuenta?{' '}
                            <Link href={route('tienda.login')} style={{ color: '#D77A61', fontWeight: 600, textDecoration: 'none' }}>
                                Inicia sesión
                            </Link>
                        </p>

                        <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
                            <Link
                                href="/tienda"
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all hover:bg-gray-50"
                                style={{ fontSize: 13, color: '#544a45', border: '1px solid #E5E7EB', textDecoration: 'none' }}
                            >
                                Volver a la tienda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
