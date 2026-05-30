import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Package, MapPin, User } from 'lucide-react';

export default function CuentaIndex({ auth, cuentaCliente, pedidosCount, direccionesCount }) {
    return (
        <CustomerLayout auth={auth}>
            <Head title="Mi Cuenta - AKINOMASS" />

            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2B221E', marginBottom: 24 }}>Mi Cuenta</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Link
                    href="/tienda/mis-pedidos"
                    className="p-5 rounded-2xl bg-white hover:shadow-md transition-all"
                    style={{ border: '1px solid rgba(0,0,0,0.07)', textDecoration: 'none' }}
                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#fdf5f2' }}>
                        <Package size={18} style={{ color: '#D77A61' }} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>Mis Pedidos</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{pedidosCount || 0} pedidos</p>
                </Link>

                <Link
                    href="/tienda/mis-direcciones"
                    className="p-5 rounded-2xl bg-white hover:shadow-md transition-all"
                    style={{ border: '1px solid rgba(0,0,0,0.07)', textDecoration: 'none' }}
                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#f4f5f4' }}>
                        <MapPin size={18} style={{ color: '#3C473A' }} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>Mis Direcciones</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{direccionesCount || 0} direcciones</p>
                </Link>

                <div
                    className="p-5 rounded-2xl bg-white"
                    style={{ border: '1px solid rgba(0,0,0,0.07)' }}
                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#ECFDF5' }}>
                        <User size={18} style={{ color: '#059669' }} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>Mi Perfil</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{auth?.user?.email}</p>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2B221E', marginBottom: 12 }}>Datos de la cuenta</h2>
                <div className="space-y-3">
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: 13, color: '#6B7280' }}>Nombre</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{auth?.user?.name}</span>
                    </div>
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: 13, color: '#6B7280' }}>Email</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{auth?.user?.email}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span style={{ fontSize: 13, color: '#6B7280' }}>Estado</span>
                        <span className="px-2 py-0.5 rounded-lg" style={{ fontSize: 12, fontWeight: 600, background: '#ECFDF5', color: '#059669' }}>
                            {cuentaCliente?.estado_cue || 'Activa'}
                        </span>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
