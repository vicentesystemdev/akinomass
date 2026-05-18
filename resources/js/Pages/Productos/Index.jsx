import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import EmptyState from '@/Components/UI/EmptyState';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const estadoLabels = {
    activo: { label: 'Activo', variant: 'success' },
    inactivo: { label: 'Inactivo', variant: 'gray' },
    agotado: { label: 'Agotado', variant: 'danger' },
    descontinuado: { label: 'Descontinuado', variant: 'danger' },
};

const formatBOB = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Index({ productos, categorias = [] }) {
    const [search, setSearch] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    const filteredProductos = useMemo(() => {
        return productos.filter((producto) => {
            if (search) {
                const q = search.toLowerCase();
                const matchNombre = producto.nombre_pro?.toLowerCase().includes(q);
                const matchSku = producto.sku_pro?.toLowerCase().includes(q);
                if (!matchNombre && !matchSku) return false;
            }
            if (filterCategoria && producto.cod_categoria_producto != filterCategoria) return false;
            if (filterEstado && producto.estado_pro?.toLowerCase() !== filterEstado.toLowerCase()) return false;
            return true;
        });
    }, [productos, search, filterCategoria, filterEstado]);

    const allCategorias = useMemo(() => {
        return categorias.length > 0
            ? categorias
            : [...new Map(productos.filter(p => p.categoria).map(p => [p.categoria.cod_categoria_producto, p.categoria])).values()];
    }, [productos, categorias]);

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Productos"
                    subtitle="Gestiona tu catálogo de productos"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Productos' },
                    ]}
                    actions={
                        <Link href={route('productos.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Nuevo Producto
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Productos" />

            <div className="space-y-6">
                {/* Filtros */}
                <SectionCard>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por nombre o SKU..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-300 text-sm focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <select
                            value={filterCategoria}
                            onChange={(e) => setFilterCategoria(e.target.value)}
                            className="rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200 w-full sm:w-48"
                        >
                            <option value="">Todas las categorías</option>
                            {allCategorias.map((cat) => (
                                <option key={cat.cod_categoria_producto} value={cat.cod_categoria_producto}>
                                    {cat.nombre_cat}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200 w-full sm:w-40"
                        >
                            <option value="">Todos los estados</option>
                            {Object.entries(estadoLabels).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                            ))}
                        </select>
                    </div>
                </SectionCard>

                {/* Grilla de productos */}
                {filteredProductos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProductos.map((producto) => (
                            <div
                                key={producto.cod_producto}
                                className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
                            >
                                {/* Imagen del producto */}
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    {producto.imagen_pro ? (
                                        <img
                                            src={producto.imagen_pro}
                                            alt={producto.nombre_pro}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-oliva-50 to-oliva-100 ${producto.imagen_pro ? 'hidden' : 'flex'}`}
                                    >
                                        <svg className="w-16 h-16 text-oliva-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>

                                    {/* Badge de estado */}
                                    <div className="absolute top-3 right-3">
                                        <StatusBadge status={producto.estado_pro} size="sm" />
                                    </div>
                                </div>

                                {/* Contenido de la card */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <h3 className="font-semibold text-cafe-900 text-sm leading-tight truncate">
                                            {producto.nombre_pro}
                                        </h3>
                                        {producto.sku_pro && (
                                            <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                                SKU: {producto.sku_pro}
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-500 mb-3">
                                        {producto.categoria?.nombre_cat || 'Sin categoría'}
                                    </p>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-terracota-600">
                                                {formatBOB(producto.precio_venta_pro)}
                                            </p>
                                            {producto.precio_costo_pro && (
                                                <p className="text-xs text-gray-400">
                                                    Costo: {formatBOB(producto.precio_costo_pro)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
                                    <Link
                                        href={route('productos.edit', producto.cod_producto)}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-terracota-600 hover:text-terracota-700 transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title={search || filterCategoria || filterEstado ? 'No se encontraron productos' : 'No hay productos registrados'}
                        description={
                            search || filterCategoria || filterEstado
                                ? 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.'
                                : 'Comienza creando tu primer producto para construir tu catálogo.'
                        }
                        action={
                            !search && !filterCategoria && !filterEstado ? (
                                <Link href={route('productos.create')}>
                                    <PrimaryActionButton
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        }
                                    >
                                        Crear Producto
                                    </PrimaryActionButton>
                                </Link>
                            ) : null
                        }
                    />
                )}

                {/* Contador de resultados */}
                {filteredProductos.length > 0 && (
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Mostrando {filteredProductos.length} de {productos.length} productos
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
