import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ShoppingCart, User, Menu, X, LogOut, Package, MapPin, ChevronDown, LayoutGrid } from 'lucide-react';

export default function StorefrontHeader({ auth, cartCount = 0, onCartClick, badgePulse = false }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const user = auth?.user;
    const isCliente = user?.roles?.includes('Cliente');

    return (
        <header
            className="sticky top-0 z-40"
            style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(90deg, #3C473A 0%, #4e5849 100%)',
                    padding: '6px 0',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center">
                    <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.9)', fontWeight: 500, letterSpacing: '0.02em' }}>
                        Envío a todo Bolivia · Pago seguro · Stock en tiempo real
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between gap-4" style={{ height: 68 }}>
                    <Link href="/tienda" className="flex items-center gap-3 flex-shrink-0" style={{ textDecoration: 'none' }}>
                        <div
                            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #3C473A 0%, #4e5849 100%)',
                                boxShadow: '0 2px 8px rgba(60,71,58,0.25)',
                            }}
                        >
                            <ShoppingCart size={17} color="white" strokeWidth={2.2} />
                            <div
                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
                                style={{
                                    background: '#D77A61',
                                    border: '2px solid white',
                                }}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <span style={{ fontSize: 19, fontWeight: 800, color: '#2B221E', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                AKINOMASS
                            </span>
                            <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, marginTop: 1, letterSpacing: '0.05em' }}>
                                MODA & ESTILO
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/tienda"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all"
                            style={{
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: '#544a45',
                                textDecoration: 'none',
                                background: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FDF6F0';
                                e.currentTarget.style.color = '#2B221E';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#544a45';
                            }}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/tienda/catalogo"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all"
                            style={{
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: '#544a45',
                                textDecoration: 'none',
                                background: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FDF6F0';
                                e.currentTarget.style.color = '#2B221E';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#544a45';
                            }}
                        >
                            Catálogo
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={onCartClick}
                            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #D77A61, #c56950)',
                                color: 'white',
                                fontSize: 13,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(215,122,97,0.3)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(215,122,97,0.4)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(215,122,97,0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} productos` : ''}`}
                        >
                            <ShoppingCart size={15} strokeWidth={2.2} />
                            <span className="hidden md:inline">Carrito</span>
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center"
                                    style={{
                                        background: '#1a1f19',
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: 'white',
                                        border: '2.5px solid white',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                        transform: badgePulse ? 'scale(1.15)' : 'scale(1)',
                                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    }}
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>

                        {user && !isCliente && (
                            <Link
                                href="/dashboard"
                                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all"
                                style={{
                                    background: '#3C473A',
                                    color: 'white',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 8px rgba(60,71,58,0.25)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,71,58,0.35)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(60,71,58,0.25)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <LayoutGrid size={15} strokeWidth={2.2} />
                                Dashboard
                            </Link>
                        )}

                        {user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all"
                                    style={{
                                        border: '1.5px solid #E5E7EB',
                                        background: 'white',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#D1D5DB';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #3C473A, #4e5849)',
                                            boxShadow: '0 1px 3px rgba(60,71,58,0.2)',
                                        }}
                                    >
                                        <User size={14} color="white" strokeWidth={2.2} />
                                    </div>
                                    <div className="hidden md:flex flex-col items-start">
                                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#2B221E', lineHeight: 1.2 }}>
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        <span style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, lineHeight: 1.2 }}>
                                            Mi cuenta
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className="hidden md:block"
                                        style={{
                                            color: '#9CA3AF',
                                            transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div
                                            className="absolute right-0 mt-2.5 w-64 rounded-2xl z-50 overflow-hidden"
                                            style={{
                                                background: 'white',
                                                border: '1px solid #E5E7EB',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                                                animation: 'headerDropdownIn 0.15s ease-out',
                                            }}
                                        >
                                            <div
                                                className="px-4 py-3.5"
                                                style={{
                                                    background: 'linear-gradient(135deg, #FDF6F0, #FAFAFA)',
                                                    borderBottom: '1px solid #F3F4F6',
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #3C473A, #4e5849)',
                                                            boxShadow: '0 2px 6px rgba(60,71,58,0.2)',
                                                        }}
                                                    >
                                                        <User size={16} color="white" strokeWidth={2.2} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p style={{ fontSize: 13.5, fontWeight: 700, color: '#2B221E', lineHeight: 1.3 }}>
                                                            {user.name}
                                                        </p>
                                                        <p style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 500, lineHeight: 1.3 }} className="truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {isCliente && (
                                                <div className="py-1.5">
                                                    {[
                                                        { icon: User, label: 'Mi Cuenta', href: '/tienda/mi-cuenta' },
                                                        { icon: Package, label: 'Mis Pedidos', href: '/tienda/mis-pedidos' },
                                                        { icon: MapPin, label: 'Mis Direcciones', href: '/tienda/mis-direcciones' },
                                                    ].map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-lg transition-colors"
                                                            style={{ fontSize: 13, color: '#544a45', textDecoration: 'none', fontWeight: 500 }}
                                                            onClick={() => setUserMenuOpen(false)}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#FDF6F0';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = 'transparent';
                                                            }}
                                                        >
                                                            <div
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                                style={{ background: '#F3F4F6' }}
                                                            >
                                                                <item.icon size={14} style={{ color: '#3C473A' }} strokeWidth={2} />
                                                            </div>
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            <div style={{ borderTop: '1px solid #F3F4F6' }} className="py-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        router.post('/tienda/logout');
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-lg w-[calc(100%-12px)] transition-colors"
                                                    style={{ fontSize: 13, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#FEF2F2';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ background: '#FEE2E2' }}
                                                    >
                                                        <LogOut size={14} strokeWidth={2} />
                                                    </div>
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/tienda/login"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#3C473A',
                                    border: '1.5px solid #3C473A',
                                    textDecoration: 'none',
                                    background: 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#3C473A';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#3C473A';
                                }}
                            >
                                <User size={14} strokeWidth={2.2} />
                                Iniciar Sesión
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                            style={{
                                background: menuOpen ? '#FDF6F0' : 'transparent',
                                border: '1.5px solid #E5E7EB',
                                cursor: 'pointer',
                            }}
                        >
                            {menuOpen ? <X size={18} color="#2B221E" strokeWidth={2.2} /> : <Menu size={18} color="#544a45" strokeWidth={2.2} />}
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div
                    className="md:hidden"
                    style={{
                        borderTop: '1px solid #F3F4F6',
                        background: 'white',
                        animation: 'headerMobileMenuIn 0.2s ease-out',
                    }}
                >
                    <div className="px-4 py-4 space-y-1">
                        <Link
                            href="/tienda"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                            style={{ fontSize: 14, fontWeight: 600, color: '#2B221E', textDecoration: 'none', background: '#FDF6F0' }}
                            onClick={() => setMenuOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/tienda/catalogo"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                            style={{ fontSize: 14, fontWeight: 600, color: '#544a45', textDecoration: 'none' }}
                            onClick={() => setMenuOpen(false)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FDF6F0';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            Catálogo
                        </Link>
                        {user && !isCliente && (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                                style={{ fontSize: 14, fontWeight: 600, color: '#3C473A', textDecoration: 'none', background: '#F0F5EE' }}
                                onClick={() => setMenuOpen(false)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#E4EDE2';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#F0F5EE';
                                }}
                            >
                                <LayoutGrid size={16} style={{ color: '#3C473A' }} strokeWidth={2.2} />
                                Dashboard
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                onCartClick?.();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors"
                            style={{ fontSize: 14, fontWeight: 600, color: '#544a45', background: 'none', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FDF6F0';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <ShoppingCart size={16} style={{ color: '#D77A61' }} strokeWidth={2.2} />
                            Carrito
                            {cartCount > 0 && (
                                <span
                                    className="ml-auto min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center"
                                    style={{
                                        background: '#D77A61',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: 'white',
                                    }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        {!user && (
                            <Link
                                href="/tienda/login"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                                style={{ fontSize: 14, fontWeight: 600, color: '#544a45', textDecoration: 'none' }}
                                onClick={() => setMenuOpen(false)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#FDF6F0';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <User size={16} style={{ color: '#3C473A' }} strokeWidth={2.2} />
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>

                    {!user && (
                        <div className="px-4 pb-4">
                            <Link
                                href="/tienda/registro"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-all"
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: 'white',
                                    background: 'linear-gradient(135deg, #D77A61, #c56950)',
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 8px rgba(215,122,97,0.3)',
                                }}
                                onClick={() => setMenuOpen(false)}
                            >
                                Crear Cuenta
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes headerDropdownIn {
                    from { opacity: 0; transform: translateY(-4px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes headerMobileMenuIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
}
