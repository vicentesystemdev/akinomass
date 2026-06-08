import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import Pagination from '@/Components/UI/Pagination';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { Head, Link } from '@inertiajs/react';
import { Eye, Plus, Minus, Settings, History, CheckCircle, TrendingDown, AlertCircle, Layers } from 'lucide-react';

const estadoConfig = {
    correcto: { label: 'Correcto', classes: 'bg-green-50 text-green-700 border border-green-200' },
    stock_bajo: { label: 'Stock Bajo', classes: 'bg-orange-50 text-orange-700 border border-orange-200' },
    sin_stock: { label: 'Agotado', classes: 'bg-red-50 text-red-700 border border-red-200' },
    sin_inventario: { label: 'Sin Inventario', classes: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

const StockBadge = ({ estado }) => {
    const config = estadoConfig[estado] || estadoConfig.sin_inventario;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}>
            {estado === 'correcto' && <CheckCircle className="w-3.5 h-3.5" />}
            {estado === 'stock_bajo' && <TrendingDown className="w-3.5 h-3.5" />}
            {estado === 'sin_stock' && <AlertCircle className="w-3.5 h-3.5" />}
            {estado === 'sin_inventario' && <AlertCircle className="w-3.5 h-3.5" />}
            {config.label}
        </span>
    );
};

const MetricCard = ({ label, value, detail, color = 'text-cafe-900' }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
        <p className="mt-1 text-xs text-gray-500">{detail}</p>
    </div>
);

const CategoryDetail = ({ detalle }) => {
    if (!detalle) return null;

    return (
        <SectionCard
            title={`Detalle: ${detalle.categoria.nombre_cat}`}
            subtitle="Las prendas de esta categoría se listan abajo. Cada producto es una prenda única."
            headerActions={
                <Link
                    href={route('inventario.index')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white text-cafe-700 hover:bg-gray-50 rounded-lg text-xs font-semibold transition"
                >
                    Cerrar detalle
                </Link>
            }
        >
            <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div className="rounded-xl border border-terracota-100 bg-terracota-50/40 p-4">
                    <h4 className="font-bold text-cafe-900 text-sm">Stock a granel (Fardos / Sin individualizar)</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Prendas en lote que no se han creado como prendas únicas.</p>
                    <p className="mt-2 text-2xl font-extrabold text-terracota-700">{detalle.stock_virtual} prendas</p>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50/40 p-4">
                    <h4 className="font-bold text-cafe-900 text-sm">Prendas Únicas Disponibles</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Prendas activas y listas para la venta.</p>
                    <p className="mt-2 text-2xl font-extrabold text-green-700">
                        {detalle.productos.filter(p => p.stock_disponible > 0 && p.estado_pro === 'activo').length} prendas
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h4 className="font-bold text-cafe-900 text-sm">Prendas Vendidas o No Disponibles</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Prendas que ya fueron vendidas o están inactivas.</p>
                    <p className="mt-2 text-2xl font-extrabold text-gray-700">
                        {detalle.productos.filter(p => p.stock_disponible <= 0 || p.estado_pro !== 'activo').length} prendas
                    </p>
                </div>
            </div>

            {detalle.productos.length > 0 ? (
                <div className="space-y-4">
                    {detalle.productos.map((producto) => (
                        <div key={producto.cod_producto} className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-3 border-b border-gray-100">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-cafe-900 text-base">{producto.nombre_pro}</h3>
                                        <StockBadge estado={producto.estado_stock} />
                                        {producto.variantes.length > 0 && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 text-xs font-bold text-cyan-700">
                                                <Layers className="w-3 h-3" /> {producto.variantes.length} variantes
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        SKU: {producto.sku_pro || 'Sin SKU'} · Estado Comercial: <span className="font-semibold">{producto.estado_pro}</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                                    <div><p className="text-[10px] font-medium uppercase text-gray-500">Físico</p><p className="font-bold text-cafe-900">{producto.stock_actual}</p></div>
                                    <div><p className="text-[10px] font-medium uppercase text-gray-500">Reservado</p><p className="font-bold text-terracota-700">{producto.stock_reservado}</p></div>
                                    <div><p className="text-[10px] font-medium uppercase text-gray-500">Disponible</p><p className="font-bold text-green-700">{producto.stock_disponible}</p></div>
                                    <div><p className="text-[10px] font-medium uppercase text-gray-500">Mínimo</p><p className="font-bold text-gray-700">{producto.stock_minimo}</p></div>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {/* Producto Base */}
                                <div className="rounded-lg border border-gray-200 bg-gray-55/30 p-3 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-cafe-900">Base</span>
                                                <span className="text-[10px] text-gray-400 font-mono">{producto.sku_pro || 'Sin SKU base'}</span>
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-gray-150 text-gray-600 border border-gray-250">Prenda única</span>
                                        </div>
                                        <p className="mt-3 text-lg font-extrabold text-cafe-900">Disponibilidad: {producto.stock_disponible > 0 ? 'Sí' : 'No'}</p>
                                    </div>
                                </div>

                                {/* Variantes */}
                                {producto.variantes.map((variante) => (
                                    <div key={variante.cod_variante_producto} className="rounded-lg border border-cyan-100 bg-cyan-50/20 p-3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-cafe-900">Talla {variante.talla || 'Sin talla'}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">{variante.sku_variante_producto || 'Sin SKU'}</span>
                                                </div>
                                                <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-cyan-50 text-cyan-700 border border-cyan-200">Prenda única</span>
                                            </div>
                                            <p className="mt-3 text-lg font-extrabold text-cafe-900">Disponibilidad: {variante.inventario?.stock_actual > 0 ? 'Sí' : 'No'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState title="Categoría sin productos" description="No existen productos asociados a esta categoría." />
            )}
        </SectionCard>
    );
};

export default function Index({ categorias = { data: [] }, detalleCategoria = null, kpis = {} }) {
    const categoriasData = categorias.data || [];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Inventario por categorías"
                    subtitle="Resumen de stock físico, reservado y disponible a nivel de categoría"
                    breadcrumbs={[{ label: 'Dashboard', href: route('dashboard') }, { label: 'Inventario' }]}
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <Link href={route('inventario.ajuste.form')} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-terracota-600 hover:bg-terracota-750 text-white rounded-xl text-sm font-semibold transition shadow-sm">
                                <Plus className="w-4 h-4" /> Ajustes por Categoría
                            </Link>
                            <Link href={route('inventario.movimientos')} className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 bg-white text-cafe-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition shadow-sm">
                                <History className="w-4 h-4" /> Movimientos
                            </Link>
                        </div>
                    }
                />
            }
        >
            <Head title="Inventario por categorías" />

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <MetricCard label="Categorías" value={kpis.categorias ?? 0} detail="Registradas" />
                    <MetricCard label="Productos / Prendas" value={kpis.productos_activos ?? 0} detail="Prendas registradas" />
                    <MetricCard label="Stock físico total" value={kpis.stock_total ?? 0} detail="Unidades agrupadas" color="text-cafe-900" />
                    <MetricCard label="Reservado" value={kpis.stock_reservado ?? 0} detail="Reservas activas" color="text-terracota-700" />
                    <MetricCard label="Disponible" value={kpis.stock_disponible ?? 0} detail="Stock libre" color="text-green-700" />
                </div>

                <CategoryDetail detalle={detalleCategoria} />

                <SectionCard title="Resumen por categoría" subtitle="El stock operativo se agrupa por categoría. Los ajustes se realizan a nivel de categoría (lotes/fardos)." noPadding>
                    {categoriasData.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Categoría</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Prendas (Reg / Disp / Res / Vend)</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Físico Agrupado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Reservado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Disponible</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Mínimo Agrupado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {categoriasData.map((categoria) => (
                                    <TableWrapper.Row key={categoria.cod_categoria_producto}>
                                        <TableWrapper.Cell>
                                            <p className="font-semibold text-cafe-900">{categoria.nombre_cat}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <p className="font-medium text-cafe-800">
                                                {categoria.total_productos_registrados} / <span className="text-green-750 font-semibold">{categoria.productos_disponibles}</span> / <span className="text-terracota-700 font-semibold">{categoria.productos_reservados}</span> / <span className="text-gray-500">{categoria.productos_vendidos}</span>
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">{categoria.stock_total}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="center"><span className="text-terracota-700">{categoria.stock_reservado}</span></TableWrapper.Cell>
                                        <TableWrapper.Cell align="center"><span className="font-bold text-green-700">{categoria.stock_disponible}</span></TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">{categoria.stock_minimo}</TableWrapper.Cell>
                                        <TableWrapper.Cell><StockBadge estado={categoria.estado_stock} /></TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <div className="flex justify-end gap-1.5">
                                                <Link
                                                    href={route('inventario.index', { cod_categoria_producto: categoria.cod_categoria_producto })}
                                                    title="Ver Detalle de Prendas"
                                                    className="p-2 text-cafe-650 hover:text-cafe-900 bg-cafe-50 hover:bg-cafe-100 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('inventario.ajuste.form', { cod_categoria_producto: categoria.cod_categoria_producto, tipo: 'entrada_fardo' })}
                                                    title="Registrar Entrada (Fardo)"
                                                    className="p-2 text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('inventario.ajuste.form', { cod_categoria_producto: categoria.cod_categoria_producto, tipo: 'salida_merma' })}
                                                    title="Registrar Salida (Merma)"
                                                    className="p-2 text-terracota-650 hover:text-terracota-900 bg-terracota-50 hover:bg-terracota-100 rounded-lg transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('inventario.ajuste.form', { cod_categoria_producto: categoria.cod_categoria_producto, tipo: 'ajuste_minimo' })}
                                                    title="Ajustar Mínimo Agrupado"
                                                    className="p-2 text-oliva-700 hover:text-oliva-900 bg-oliva-50 hover:bg-oliva-100 rounded-lg transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('inventario.movimientos', { cod_categoria_producto: categoria.cod_categoria_producto })}
                                                    title="Ver Movimientos"
                                                    className="p-2 text-cafe-600 hover:text-cafe-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <History className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState title="No hay categorías registradas" description="Las categorías con productos e inventario aparecerán aquí." />
                    )}
                    <Pagination links={categorias.links} meta={categorias.meta} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
