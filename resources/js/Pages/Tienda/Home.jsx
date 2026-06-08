import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductGrid from '@/Components/Tienda/ProductGrid';
import CatalogFilters from '@/Components/Tienda/CatalogFilters';
import Pagination from '@/Components/UI/Pagination';
import { ShoppingCart, Truck, Shield, RefreshCw, Sparkles, ArrowRight, Search } from 'lucide-react';

export default function Home({ productos, categorias, tallas = [], filtros, auth }) {
    const [search, setSearch] = useState(filtros?.q || '');
    const lista = productos?.data ?? productos ?? [];

    const handleFilter = (newFiltros) => {
        router.get('/tienda', newFiltros, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/tienda', { ...filtros, q: search }, { preserveState: true });
    };

    return (
        <StorefrontLayout auth={auth}>
            <Head title="AKINOMASS - Tienda" />

            <section className="relative overflow-hidden" style={{ minHeight: 360 }}>
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #1a1f19 0%, #3C473A 50%, #D77A61 100%)' }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-14">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
                    >
                        <Sparkles size={13} color="white" />
                        <span style={{ fontSize: 12.5, color: 'white', fontWeight: 600 }}>Colección 2026</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 12 }}>
                        Moda y equipamiento
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 440, marginBottom: 20 }}>
                        Productos activos con stock en tiempo real. Compra segura y envío a todo Bolivia.
                    </p>
                    <button
                        type="button"
                        onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl"
                        style={{ background: 'white', color: '#3C473A', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                        Ver colección
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>

            <div className="px-4 md:px-8 py-4 bg-white" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Truck, label: 'Envío a todo Bolivia', color: '#3C473A', bg: '#f4f5f4' },
                        { icon: Shield, label: 'Pago seguro', color: '#D77A61', bg: '#fdf5f2' },
                        { icon: RefreshCw, label: 'Devoluciones', color: '#059669', bg: '#ECFDF5' },
                        { icon: ShoppingCart, label: 'Stock en vivo', color: '#D97706', bg: '#FFFBEB' },
                    ].map((b) => (
                        <div key={b.label} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: b.bg }}>
                                <b.icon size={16} style={{ color: b.color }} />
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#2B221E' }}>{b.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <section id="products-section" className="max-w-7xl mx-auto px-4 md:px-8 py-10">
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

                <CatalogFilters categorias={categorias} tallas={tallas} filtros={filtros} onFilter={handleFilter} />
                <ProductGrid productos={lista} />

                {productos?.last_page > 1 && (
                    <div className="mt-8">
                        <Pagination
                            links={{ prev: productos.prev_page_url, next: productos.next_page_url }}
                            meta={{
                                from: productos.from,
                                to: productos.to,
                                total: productos.total,
                                last_page: productos.last_page,
                                links: productos.links,
                            }}
                        />
                    </div>
                )}
            </section>
        </StorefrontLayout>
    );
}
