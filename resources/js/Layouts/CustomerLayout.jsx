import { Link, usePage } from '@inertiajs/react';
import StorefrontShell from '@/Components/Tienda/StorefrontShell';
import { User, Package, MapPin, LogOut } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Mi Cuenta', href: '/tienda/mi-cuenta', icon: User },
    { label: 'Mis Pedidos', href: '/tienda/mis-pedidos', icon: Package },
    { label: 'Mis Direcciones', href: '/tienda/mis-direcciones', icon: MapPin },
];

export default function CustomerLayout({ children, auth }) {
    const { url, props } = usePage();
    const { carrito, flash } = props;

    return (
        <StorefrontShell auth={auth} initialCarrito={carrito} openCartOnMount={Boolean(flash?.open_cart)}>
            <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl p-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)' }}
                                >
                                    <User size={18} color="white" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>{auth?.user?.name}</p>
                                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>{auth?.user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = url.startsWith(item.href);
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
                                            style={{
                                                fontSize: 13,
                                                fontWeight: isActive ? 600 : 500,
                                                color: isActive ? '#2B221E' : '#6B7280',
                                                background: isActive ? '#FDF6F0' : 'transparent',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <Icon size={16} style={{ color: isActive ? '#D77A61' : '#9CA3AF' }} />
                                            {item.label}
                                        </Link>
                                    );
                                })}

                                <div className="pt-2 mt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
                                    <Link
                                        href="/tienda/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all w-full hover:bg-red-50"
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: '#DC2626',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <LogOut size={16} />
                                        Cerrar Sesión
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </div>

                    <div className="md:col-span-3">{children}</div>
                </div>
            </div>
        </StorefrontShell>
    );
}
