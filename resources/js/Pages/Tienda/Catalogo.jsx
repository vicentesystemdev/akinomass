import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductGrid from '@/Components/Tienda/ProductGrid';
import CatalogFilters from '@/Components/Tienda/CatalogFilters';
import CartDrawer from '@/Components/Tienda/CartDrawer';
import { Search } from 'lucide-react';

export default function Catalogo({ productos, categorias, filtros, auth, carrito }) {
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch] = useState(filtros?.q || '');

    const cartCount = carrito?.detalles?.reduce((sum, d) => sum + d.cantidad_dca, 0) || 0;

    const handleFilter = (newFiltros) => {
        router.get('/tienda/catalogo', newFiltros, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/tienda/catalogo', { ...filtros, q: search }, { preserveState: true });
    };

    return (
        <StorefrontLayout auth={auth} cartCount={cartCount}>
            <Head title="Catálogo - AKINOMASS" />

            <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
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
