import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Database, Layers, Search } from 'lucide-react';

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
    return `Bs ${Number(num.toFixed(1))}`;
};

export default function Index({ productos = { data: [] }, categorias = [], filters = {} }) {
    const [search, setSearch] = useState(filters.q || '');
    const [filterCategoria, setFilterCategoria] = useState(filters.cod_categoria_producto || '');
    const [filterEstado, setFilterEstado] = useState(filters.estado_pro || '');

    const productosData = productos.data || [];

    const applyFilters = (newParams = {}) => {
        const params = {
            q: search,
            cod_categoria_producto: filterCategoria,
            estado_pro: filterEstado,
            ...newParams,
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get(route('productos.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setFilterCategoria('');
        setFilterEstado('');
        router.get(route('productos.index'));
    };

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
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-medium text-cafe-600 mb-1">Buscar por Nombre o SKU</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') applyFilters();
                                    }}
                                    placeholder="Buscar por nombre o SKU..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-300 text-sm focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-xs font-medium text-cafe-600 mb-1">Categoría</label>
                            <select
                                value={filterCategoria}
                                onChange={(e) => {
                                    setFilterCategoria(e.target.value);
                                    applyFilters({ cod_categoria_producto: e.target.value });
                                }}
                                className="w-full rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200"
                            >
                                <option value="">Todas</option>
                                {categorias.map((cat) => (
                                    <option key={cat.cod_categoria_producto} value={cat.cod_categoria_producto}>
                                        {cat.nombre_cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-xs font-medium text-cafe-600 mb-1">Estado</label>
                            <select
                                value={filterEstado}
                                onChange={(e) => {
                                    setFilterEstado(e.target.value);
                                    applyFilters({ estado_pro: e.target.value });
                                }}
                                className="w-full rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200"
                            >
                                <option value="">Todos</option>
                                {Object.entries(estadoLabels).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors duration-200 w-full md:w-auto"
                            >
                                Limpiar
                            </button>
                            <button
                                onClick={() => applyFilters()}
                                className="px-5 py-2.5 bg-terracota-600 hover:bg-terracota-750 text-white rounded-xl text-sm font-medium transition-colors duration-200 w-full md:w-auto"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
                </SectionCard>

                {/* Grilla de productos */}
                {productosData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {productosData.map((producto) => {
                            // Calculate stockTotal:
                            const stockBase = producto.inventarios?.filter(inv => inv.cod_variante_producto === null).reduce((sum, inv) => sum + Number(inv.stock_actual_inv), 0) || 0;
                            const stockVariantes = producto.variantes?.reduce((sum, v) => sum + (v.inventarios?.reduce((vSum, inv) => vSum + Number(inv.stock_actual_inv), 0) || 0), 0) || 0;
                            const stockTotal = producto.variantes?.length > 0 ? stockVariantes : stockBase;
                            const hasStock = stockTotal > 0;
                            const isActivo = producto.estado_pro === 'activo';

                            return (
                                <div
                                    key={producto.cod_producto}
                                    className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Imagen del producto */}
                                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                            {producto.image_url ? (
                                                <img
                                                    src={producto.image_url}
                                                    alt={producto.nombre_pro}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-oliva-50 to-oliva-100 ${producto.image_url ? 'hidden' : 'flex'}`}
                                            >
                                                <svg className="w-16 h-16 text-oliva-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>

                                            {/* Badges de estado e inventario */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                                                {isActivo ? (
                                                    hasStock ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 shadow-sm border border-green-200">
                                                            Activo (Disponible)
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col gap-1 items-end">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shadow-sm border border-amber-200">
                                                                Activo
                                                            </span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 shadow-sm border border-red-200">
                                                                Sin Stock
                                                            </span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
                                                        {producto.estado_pro === 'inactivo' ? 'Inactivo' : producto.estado_pro === 'agotado' ? 'Agotado' : producto.estado_pro}
                                                    </span>
                                                )}

                                                {(!producto.inventarios || producto.inventarios.length === 0) && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-red-650 text-white shadow-sm animate-pulse">
                                                        Sin Inventario
                                                    </span>
                                                )}
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

                                            {/* Resumen de Tallas/Variantes */}
                                            {producto.variantes?.length > 0 ? (
                                                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                                                    <div className="flex items-center gap-1.5 text-xs text-cafe-600 font-medium mb-1">
                                                        <Layers className="w-3.5 h-3.5" />
                                                        <span>Tallas ({producto.variantes.length}):</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {producto.variantes.map((v) => {
                                                            const vStock = v.inventarios?.reduce((sum, inv) => sum + Number(inv.stock_actual_inv), 0) || 0;
                                                            return (
                                                                <span
                                                                    key={v.cod_variante_producto}
                                                                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${vStock > 0 ? 'bg-cafe-50 text-cafe-850 border border-cafe-100' : 'bg-red-50 text-red-400 line-through border border-red-100'}`}
                                                                    title={`Talla ${v.talla?.codigo_talla_producto} - Stock: ${vStock}`}
                                                                >
                                                                    {v.talla?.codigo_talla_producto}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-cafe-600 font-medium">
                                                    <span>Stock Base:</span>
                                                    <span className={stockTotal > 0 ? 'text-oliva-750 font-bold' : 'text-red-650 font-bold'}>
                                                        {stockTotal} unids.
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <span className="text-[11px] font-semibold text-cafe-500">
                                            Total: {stockTotal} u.
                                        </span>
                                        <div className="flex gap-1.5">
                                            <a
                                                href={route('tienda.producto.show', producto.cod_producto)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Ver en Tienda"
                                                className="p-1.5 text-cafe-600 hover:text-cafe-900 bg-white hover:bg-cafe-50 rounded-lg border border-gray-200 transition-colors duration-150"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                            <Link
                                                href={route('productos.edit', producto.cod_producto)}
                                                title="Editar Producto"
                                                className="p-1.5 text-terracota-600 hover:text-terracota-950 bg-white hover:bg-terracota-50 rounded-lg border border-gray-200 transition-colors duration-150"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={route('inventario.index', { q: producto.nombre_pro })}
                                                title="Ajustar Inventario"
                                                className="p-1.5 text-amber-700 hover:text-amber-950 bg-white hover:bg-amber-50 rounded-lg border border-gray-200 transition-colors duration-150"
                                            >
                                                <Database className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                {productosData.length > 0 && (
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Mostrando {productosData.length} de {productos.total || productos.meta?.total || productosData.length} productos
                        </p>
                    </div>
                )}

                <Pagination links={productos.links} meta={productos.meta || productos} />
            </div>
        </AuthenticatedLayout>
    );
}
