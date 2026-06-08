import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link } from '@inertiajs/react';
import { Package, Database, Layers, ArrowLeft, Edit } from 'lucide-react';

const formatBOB = (value) => {
    if (value === null || value === undefined) return '-';
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    return `Bs ${Number(num.toFixed(1))}`;
};

export default function Show({ categoria, productos = [], tallasDisponibles = [], stockPorTalla = {}, totalStock = 0 }) {
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={`Categoría: ${categoria.nombre_cat}`}
                    subtitle="Información detallada y catálogo de productos asociados"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Categorías', href: route('categorias-producto.index') },
                        { label: categoria.nombre_cat },
                    ]}
                    actions={
                        <div className="flex gap-2">
                            <Link href={route('categorias-producto.index')}>
                                <SecondaryButton className="flex items-center gap-1.5">
                                    <ArrowLeft className="w-4 h-4" /> Volver
                                </SecondaryButton>
                            </Link>
                            <Link href={route('categorias-producto.edit', categoria.cod_categoria_producto)}>
                                <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-terracota-600 hover:bg-terracota-750 text-white rounded-xl text-sm font-semibold transition-colors duration-200">
                                    <Edit className="w-4 h-4" /> Editar Categoría
                                </button>
                            </Link>
                        </div>
                    }
                />
            }
        >
            <Head title={`Categoría - ${categoria.nombre_cat}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel de detalles y estadísticas */}
                <div className="space-y-6 lg:col-span-1">
                    <SectionCard title="Resumen General">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-cafe-500 mb-1">Descripción</label>
                                <p className="text-cafe-900 text-sm leading-relaxed">
                                    {categoria.descripcion_cat || 'Sin descripción disponible.'}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-cafe-700">Estado Operativo</span>
                                <StatusBadge status={categoria.activo_cat ? 'activo' : 'inactivo'} />
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-cafe-700">Total Productos</span>
                                <span className="text-sm font-bold text-cafe-900">{productos.length}</span>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-cafe-700">Stock Total Acumulado</span>
                                    <span className={`text-base font-bold ${totalStock > 0 ? 'text-oliva-700' : 'text-red-600'}`}>
                                        {totalStock} {totalStock === 1 ? 'unidad' : 'unidades'}
                                    </span>
                                </div>
                                {totalStock === 0 && (
                                    <div className="mt-2 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
                                        Esta categoría se encuentra agotada comercialmente.
                                    </div>
                                )}
                            </div>
                        </div>
                    </SectionCard>

                    {/* Stock por Talla */}
                    <SectionCard title="Stock por Talla">
                        {tallasDisponibles.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {tallasDisponibles.map((talla) => {
                                    const stock = stockPorTalla[talla.cod_talla_producto] ?? 0;
                                    return (
                                        <div key={talla.cod_talla_producto} className="py-2.5 flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cafe-50 text-cafe-800 font-bold font-mono text-xs">
                                                    {talla.codigo_talla_producto}
                                                </span>
                                                <span className="text-cafe-700 font-medium">{talla.nom_talla_producto}</span>
                                            </div>
                                            <span className={`font-semibold ${stock > 0 ? 'text-cafe-900' : 'text-gray-400'}`}>
                                                {stock} unids.
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic text-center py-4">
                                No se encontraron tallas asociadas a variantes activas en esta categoría.
                            </p>
                        )}
                    </SectionCard>
                </div>

                {/* Listado de Productos */}
                <div className="lg:col-span-2 space-y-6">
                    <SectionCard title="Productos de esta Categoría" className="h-full">
                        {productos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {productos.map((producto) => {
                                    const stockBase = producto.inventarios.whereNull ? 0 : producto.inventarios.filter(inv => inv.cod_variante_producto === null).reduce((sum, inv) => sum + Number(inv.stock_actual_inv), 0);
                                    const stockVariantes = producto.variantes.reduce((sum, v) => sum + v.inventarios.reduce((vSum, inv) => vSum + Number(inv.stock_actual_inv), 0), 0);
                                    const stockTotalProd = producto.variantes.length > 0 ? stockVariantes : stockBase;
                                    const hasStock = stockTotalProd > 0;

                                    return (
                                        <div
                                            key={producto.cod_producto}
                                            className="border border-gray-100 rounded-xl p-4 flex gap-4 items-start bg-white hover:shadow-card transition-shadow duration-200"
                                        >
                                            {/* Imagen o Placeholder */}
                                            <div className="w-16 h-16 rounded-lg bg-cafe-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                                                {producto.image_url ? (
                                                    <img src={producto.image_url} alt={producto.nombre_pro} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-cafe-300" />
                                                )}
                                            </div>

                                            {/* Detalles del Producto */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold text-cafe-900 text-sm truncate">{producto.nombre_pro}</h4>
                                                    <StatusBadge status={producto.estado_pro?.value || producto.estado_pro} size="sm" />
                                                </div>
                                                <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {producto.sku_pro || 'Sin SKU'}</p>
                                                
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-sm font-bold text-terracota-600">{formatBOB(producto.precio_venta_pro)}</span>
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${hasStock ? 'bg-oliva-50 text-oliva-700' : 'bg-red-50 text-red-600'}`}>
                                                        {hasStock ? `${stockTotalProd} unidades` : 'Agotado'}
                                                    </span>
                                                </div>

                                                {producto.variantes.length > 0 && (
                                                    <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                                                        <div className="flex items-center gap-1.5 text-xs text-cafe-600 font-medium">
                                                            <Layers className="w-3.5 h-3.5" />
                                                            <span>Tallas disponibles:</span>
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {producto.variantes.map(v => {
                                                                const vStock = v.inventarios.reduce((sum, inv) => sum + Number(inv.stock_actual_inv), 0);
                                                                return (
                                                                    <span
                                                                        key={v.cod_variante_producto}
                                                                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${vStock > 0 ? 'bg-cafe-50 text-cafe-800' : 'bg-gray-100 text-gray-400 line-through'}`}
                                                                        title={`Stock: ${vStock}`}
                                                                    >
                                                                        {v.talla?.codigo_talla_producto}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="w-12 h-12 text-gray-300 mb-3" />
                                <h4 className="text-sm font-semibold text-cafe-900">No hay productos asociados</h4>
                                <p className="text-xs text-gray-500 max-w-xs mt-1">
                                    Esta categoría aún no tiene productos vinculados en el catálogo.
                                </p>
                            </div>
                        )}
                    </SectionCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
