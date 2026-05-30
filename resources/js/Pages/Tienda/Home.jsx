import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductGrid from '@/Components/Tienda/ProductGrid';
import CatalogFilters from '@/Components/Tienda/CatalogFilters';
import CartDrawer from '@/Components/Tienda/CartDrawer';
import { ShoppingCart, Truck, Shield, RefreshCw, Sparkles, ArrowRight, Search } from 'lucide-react';

export default function Home({ productos, categorias, filtros, auth, carrito }) {
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch] = useState(filtros?.q || '');

    const cartCount = carrito?.detalles?.reduce((sum, d) => sum + d.cantidad_dca, 0) || 0;

    const handleFilter = (newFiltros) => {
        router.get('/tienda/catalogo', newFiltros, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/tienda/catalogo', { q: search }, { preserveState: true });
    };

    return (
        <StorefrontLayout auth={auth} cartCount={cartCount}>
            <Head title="AKINOMASS - Moda Boliviana" />

            {/* Hero */}
            <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #1a1f19 0%, #3C473A 50%, #D77A61 100%)' }}
                />
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-64 h-64 rounded-full" style={{ background: 'white' }} />
                    <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full" style={{ background: 'white' }} />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 py-16">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
                    >
                        <Sparkles size={13} color="white" />
                        <span style={{ fontSize: 12.5, color: 'white', fontWeight: 600 }}>Colección 2026</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16, maxWidth: 600 }}>
                        Moda Boliviana<br />con Estilo Propio
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', maxWidth: 460, lineHeight: 1.6, marginBottom: 28 }}>
                        Descubre nuestra colección exclusiva de prendas diseñadas para la mujer boliviana moderna.
                    </p>

                    <button
                        onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-90"
                        style={{ background: 'white', color: '#3C473A', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                        Ver Colección
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>

            {/* Benefits */}
            <div className="px-4 md:px-8 py-4" style={{ background: 'white', borderBottom: '1px solid #F3F4F6' }}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Truck, label: 'Envío a todo Bolivia', color: '#3C473A', bg: '#f4f5f4' },
                        { icon: Shield, label: 'Pago seguro', color: '#D77A61', bg: '#fdf5f2' },
                        { icon: RefreshCw, label: 'Devoluciones', color: '#059669', bg: '#ECFDF5' },
                        { icon: Sparkles, label: 'Calidad premium', color: '#D97706', bg: '#FFFBEB' },
                    ].map((b) => (
                        <div key={b.label} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: b.bg }}>
                                <b.icon size={16} style={{ color: b.color }} />
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#2B221E' }}>{b.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Products */}
            <section id="products-section" className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="md:hidden relative mb-5">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl"
                        style={{ background: 'white', border: '1px solid #E5E7EB', outline: 'none', fontSize: 13.5 }}
                    />
                </form>

                <CatalogFilters categorias={categorias} filtros={filtros} onFilter={handleFilter} />

                <ProductGrid productos={productos?.data || productos} auth={auth} />
            </section>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} carrito={carrito} auth={auth} />
        </StorefrontLayout>
    );
}
