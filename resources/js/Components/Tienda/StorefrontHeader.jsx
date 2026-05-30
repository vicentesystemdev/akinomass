import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ShoppingCart, User, Menu, X, LogOut, Package, MapPin } from 'lucide-react';

export default function StorefrontHeader({ auth, cartCount = 0, onCartClick, badgePulse = false }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const user = auth?.user;
    const isCliente = user?.roles?.includes('Cliente');

    return (
        <header
            className="sticky top-0 z-40"
            style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0,0,0,0.07)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8" style={{ height: 64 }}>
                <div className="flex items-center justify-between h-full gap-4">
                    <Link href="/tienda" className="flex items-center gap-2.5 flex-shrink-0" style={{ textDecoration: 'none' }}>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)' }}
                        >
                            <ShoppingCart size={16} color="white" />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#2B221E' }}>AKINOMASS</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/tienda/catalogo"
                            style={{ fontSize: 14, fontWeight: 500, color: '#544a45', textDecoration: 'none' }}
                            className="hover:text-terracota-500 transition-colors"
                        >
                            Catálogo
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCartClick}
                            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:opacity-90"
                            style={{
                                background: 'linear-gradient(135deg, #D77A61, #c56950)',
                                color: 'white',
                                fontSize: 13,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} productos` : ''}`}
                        >
                            <ShoppingCart size={15} />
                            <span className="hidden md:inline">Carrito</span>
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center"
                                    style={{
                                        background: '#DC2626',
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: 'white',
                                        border: '2px solid white',
                                        transform: badgePulse ? 'scale(1.2)' : 'scale(1)',
                                        transition: 'transform 0.2s ease-out',
                                    }}
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:bg-gray-50"
                                    style={{ border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer' }}
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)' }}>
                                        <User size={13} color="white" />
                                    </div>
                                    <span className="hidden md:block" style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>
                                        {user.name?.split(' ')[0]}
                                    </span>
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div
                                            className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg z-50 py-2"
                                            style={{ background: 'white', border: '1px solid #E5E7EB' }}
                                        >
                                            <div className="px-4 py-2 border-b" style={{ borderColor: '#F3F4F6' }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{user.name}</p>
                                                <p style={{ fontSize: 12, color: '#9CA3AF' }}>{user.email}</p>
                                            </div>

                                            {isCliente && (
                                                <>
                                                    <Link
                                                        href="/tienda/mi-cuenta"
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                                                        style={{ fontSize: 13, color: '#544a45', textDecoration: 'none' }}
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <User size={14} />
                                                        Mi Cuenta
                                                    </Link>
                                                    <Link
                                                        href="/tienda/mis-pedidos"
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                                                        style={{ fontSize: 13, color: '#544a45', textDecoration: 'none' }}
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Package size={14} />
                                                        Mis Pedidos
                                                    </Link>
                                                    <Link
                                                        href="/tienda/mis-direcciones"
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                                                        style={{ fontSize: 13, color: '#544a45', textDecoration: 'none' }}
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <MapPin size={14} />
                                                        Mis Direcciones
                                                    </Link>
                                                </>
                                            )}

                                            <div className="border-t mt-1 pt-1" style={{ borderColor: '#F3F4F6' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        router.post('/tienda/logout');
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 transition-colors"
                                                    style={{ fontSize: 13, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <LogOut size={14} />
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
                                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all hover:bg-gray-50"
                                style={{ fontSize: 13, fontWeight: 500, color: '#544a45', border: '1px solid #E5E7EB', textDecoration: 'none' }}
                            >
                                <User size={14} />
                                Iniciar Sesión
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            {menuOpen ? <X size={18} color="#544a45" /> : <Menu size={18} color="#544a45" />}
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t" style={{ borderColor: '#F3F4F6', background: 'white' }}>
                    <div className="px-4 py-3 space-y-2">
                        <Link
                            href="/tienda/catalogo"
                            className="block px-3 py-2 rounded-lg hover:bg-gray-50"
                            style={{ fontSize: 14, fontWeight: 500, color: '#544a45', textDecoration: 'none' }}
                            onClick={() => setMenuOpen(false)}
                        >
                            Catálogo
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                onCartClick?.();
                            }}
                            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50"
                            style={{ fontSize: 14, fontWeight: 500, color: '#544a45', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Carrito {cartCount > 0 ? `(${cartCount})` : ''}
                        </button>
                        {!user && (
                            <Link
                                href="/tienda/login"
                                className="block px-3 py-2 rounded-lg hover:bg-gray-50"
                                style={{ fontSize: 14, fontWeight: 500, color: '#544a45', textDecoration: 'none' }}
                                onClick={() => setMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
