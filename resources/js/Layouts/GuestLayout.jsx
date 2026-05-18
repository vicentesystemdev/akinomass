import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title = '', subtitle = '' }) {
    return (
        <div className="min-h-screen flex" style={{ fontFamily: 'Figtree, sans-serif' }}>
            {/* Panel Izquierdo - Hero */}
            <div
                className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a1f19 0%, #3C473A 40%, #D77A61 100%)' }}
            >
                {/* Círculos decorativos */}
                <div
                    className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
                    style={{ background: '#D77A61' }}
                />
                <div
                    className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-10"
                    style={{ background: '#3C473A' }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
                    style={{ background: '#D77A61' }}
                />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(215,122,97,0.3)' }}
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg tracking-tight">AKINOMASS</p>
                        <p className="text-oliva-200 text-xs">Plataforma Comercial Multicanal</p>
                    </div>
                </div>

                {/* Hero decorativo */}
                <div className="relative z-10 flex-1 flex items-center justify-center py-10">
                    <div className="relative">
                        {/* Ilustración abstracta con formas geométricas */}
                        <div className="w-64 h-64 lg:w-72 lg:h-72 relative">
                            {/* Círculo grande */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20"
                                style={{ background: '#D77A61', border: '2px solid rgba(215,122,97,0.3)' }}
                            />
                            {/* Círculo medio */}
                            <div
                                className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-15"
                                style={{ background: '#3C473A', border: '2px solid rgba(60,71,58,0.3)' }}
                            />
                            {/* Cuadrado rotado */}
                            <div
                                className="absolute bottom-1/4 right-1/4 w-24 h-24 opacity-10"
                                style={{ background: '#D77A61', transform: 'rotate(45deg)' }}
                            />
                            {/* Icono central */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                    style={{ background: 'rgba(215,122,97,0.25)', backdropFilter: 'blur(4px)' }}
                                >
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            {/* Líneas decorativas */}
                            <div className="absolute top-8 right-8 w-12 h-0.5 opacity-20" style={{ background: '#D77A61' }} />
                            <div className="absolute bottom-8 left-8 w-16 h-0.5 opacity-20" style={{ background: '#3C473A' }} />
                            <div className="absolute top-12 right-12 w-0.5 h-12 opacity-20" style={{ background: '#D77A61' }} />
                        </div>
                    </div>
                </div>

                {/* Texto inferior */}
                <div className="relative z-10">
                    <h1 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
                        Gestiona tu negocio
                        <br />
                        desde un solo lugar
                    </h1>
                    <p className="text-oliva-200 mt-3 text-sm leading-relaxed max-w-md">
                        CRM · Inventario · Pedidos · Ventas en Vivo · Analítica comercial
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <svg className="w-4 h-4 text-terracota-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-oliva-200 text-xs">Plataforma segura para emprendimientos bolivianos</p>
                    </div>
                </div>
            </div>

            {/* Panel Derecho - Contenido */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-crema-100">
                {/* Logo mobile */}
                <div className="lg:hidden flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-9 h-9 bg-oliva-700 rounded-lg">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <span className="text-cafe-950 font-bold text-xl tracking-tight">AKINOMASS</span>
                </div>

                {/* Contenedor del formulario */}
                <div className="w-full max-w-md">
                    {title && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-cafe-950">{title}</h2>
                            {subtitle && (
                                <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
                            )}
                        </div>
                    )}
                    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
