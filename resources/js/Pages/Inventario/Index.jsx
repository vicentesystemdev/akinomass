import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/UI/EmptyState';
import PageHeader from '@/Components/UI/PageHeader';
import Pagination from '@/Components/UI/Pagination';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { Head, Link } from '@inertiajs/react';

const estadoConfig = {
    correcto: { label: 'Correcto', classes: 'bg-green-100 text-green-800' },
    stock_bajo: { label: 'Stock bajo', classes: 'bg-terracota-100 text-terracota-800' },
    sin_stock: { label: 'Sin stock', classes: 'bg-red-100 text-red-800' },
    sin_inventario: { label: 'Sin inventario', classes: 'bg-gray-100 text-gray-600' },
};

const StockBadge = ({ estado }) => {
    const config = estadoConfig[estado] || estadoConfig.sin_inventario;
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${config.classes}`}>{config.label}</span>;
};

const MetricCard = ({ label, value, detail, color = 'text-cafe-900' }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
        <p className="mt-1 text-xs text-gray-500">{detail}</p>
    </div>
);

const ActionLink = ({ href, children, primary = false }) => (
    <Link
        href={href}
        preserveScroll
        className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            primary
                ? 'bg-terracota-500 text-white hover:bg-terracota-600'
                : 'border border-gray-200 bg-white text-cafe-700 hover:bg-gray-50'
        }`}
    >
        {children}
    </Link>
);

const CategoryDetail = ({ detalle }) => {
    if (!detalle) return null;

    return (
        <SectionCard
            title={`Detalle: ${detalle.categoria.nombre_cat}`}
            subtitle="El stock continúa administrándose por producto. Las variantes se muestran solo como referencia."
            headerActions={<ActionLink href={route('inventario.index')}>Cerrar detalle</ActionLink>}
        >
            {detalle.productos.length > 0 ? (
                <div className="space-y-3">
                    {detalle.productos.map((producto) => (
                        <div key={producto.cod_producto} className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-cafe-900">{producto.nombre_pro}</h3>
                                        <StockBadge estado={producto.estado_stock} />
                                        {producto.variantes.length > 0 && (
                                            <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-800">
                                                {producto.variantes.length} variantes
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        SKU: {producto.sku_pro || 'Sin SKU'} · Estado: {producto.estado_pro}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                                    <div><p className="text-xs text-gray-500">Físico</p><p className="font-bold text-cafe-900">{producto.stock_actual}</p></div>
                                    <div><p className="text-xs text-gray-500">Reservado</p><p className="font-bold text-terracota-700">{producto.stock_reservado}</p></div>
                                    <div><p className="text-xs text-gray-500">Disponible</p><p className="font-bold text-green-700">{producto.stock_disponible}</p></div>
                                    <div><p className="text-xs text-gray-500">Mínimo</p><p className="font-bold text-gray-700">{producto.stock_minimo}</p></div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <ActionLink href={route('inventario.ajuste.form', { cod_producto: producto.cod_producto })}>Ajustar stock</ActionLink>
                                    <ActionLink href={route('inventario.movimientos', { cod_categoria_producto: detalle.categoria.cod_categoria_producto })}>
                                        Ver movimientos
                                    </ActionLink>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 md:grid-cols-2 xl:grid-cols-3">
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-cafe-900">Producto base</p>
                                            <p className="text-xs text-gray-500">{producto.sku_pro || 'Sin SKU base'}</p>
                                        </div>
                                        <StockBadge estado={producto.inventario_base?.estado_stock || 'sin_inventario'} />
                                    </div>
                                    <p className="mt-3 text-lg font-bold text-cafe-900">Stock: {producto.inventario_base?.stock_actual ?? 0}</p>
                                    <p className="text-xs text-gray-500">Mínimo: {producto.inventario_base?.stock_minimo ?? 0}</p>
                                    <div className="mt-3">
                                        <ActionLink href={route('inventario.ajuste.form', { cod_producto: producto.cod_producto })}>Ajustar base</ActionLink>
                                    </div>
                                </div>
                                {producto.variantes.map((variante) => (
                                    <div key={variante.cod_variante_producto} className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-cafe-900">Talla {variante.talla || 'Sin talla'}</p>
                                                <p className="text-xs text-gray-500">{variante.sku_variante_producto || 'Sin SKU de variante'}</p>
                                            </div>
                                            <StockBadge estado={variante.inventario?.estado_stock || 'sin_inventario'} />
                                        </div>
                                        <p className="mt-3 text-lg font-bold text-cafe-900">Stock: {variante.inventario?.stock_actual ?? 0}</p>
                                        <p className="text-xs text-gray-500">Mínimo: {variante.inventario?.stock_minimo ?? 0}</p>
                                        <div className="mt-3">
                                            <ActionLink href={route('inventario.ajuste.form', {
                                                cod_producto: producto.cod_producto,
                                                cod_variante_producto: variante.cod_variante_producto,
                                            })}>Ajustar variante</ActionLink>
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
                    subtitle="Resumen de stock físico, reservado y disponible"
                    breadcrumbs={[{ label: 'Dashboard', href: route('dashboard') }, { label: 'Inventario' }]}
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <ActionLink href={route('inventario.entrada.form')} primary>Registrar entrada</ActionLink>
                            <ActionLink href={route('inventario.salida.form')}>Registrar salida</ActionLink>
                            <ActionLink href={route('inventario.movimientos')}>Movimientos</ActionLink>
                        </div>
                    }
                />
            }
        >
            <Head title="Inventario por categorías" />

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <MetricCard label="Categorías" value={kpis.categorias ?? 0} detail="Registradas" />
                    <MetricCard label="Productos activos" value={kpis.productos_activos ?? 0} detail="En categorías visibles" />
                    <MetricCard label="Stock físico" value={kpis.stock_total ?? 0} detail="Unidades registradas" color="text-cafe-900" />
                    <MetricCard label="Reservado" value={kpis.stock_reservado ?? 0} detail="Reservas activas" color="text-terracota-700" />
                    <MetricCard label="Disponible" value={kpis.stock_disponible ?? 0} detail="Físico menos reservado" color="text-green-700" />
                </div>

                <CategoryDetail detalle={detalleCategoria} />

                <SectionCard title="Resumen por categoría" subtitle="Las categorías agrupan el stock; los ajustes se realizan sobre productos específicos." noPadding>
                    {categoriasData.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Categoría</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Productos / variantes</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Físico</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Reservado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Disponible</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="center">Mínimo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {categoriasData.map((categoria) => (
                                    <TableWrapper.Row key={categoria.cod_categoria_producto}>
                                        <TableWrapper.Cell>
                                            <p className="font-semibold text-cafe-900">{categoria.nombre_cat}</p>
                                            <p className="text-xs text-gray-500">{categoria.inventarios} inventarios registrados</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">
                                            <p className="font-medium text-cafe-800">{categoria.productos_activos} / {categoria.variantes_activas}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">{categoria.stock_total}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="center"><span className="text-terracota-700">{categoria.stock_reservado}</span></TableWrapper.Cell>
                                        <TableWrapper.Cell align="center"><span className="font-bold text-green-700">{categoria.stock_disponible}</span></TableWrapper.Cell>
                                        <TableWrapper.Cell align="center">{categoria.stock_minimo}</TableWrapper.Cell>
                                        <TableWrapper.Cell><StockBadge estado={categoria.estado_stock} /></TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <div className="flex flex-wrap gap-2">
                                                <ActionLink href={route('inventario.index', { cod_categoria_producto: categoria.cod_categoria_producto })}>Ver detalle</ActionLink>
                                                <ActionLink href={route('inventario.ajuste.form')}>Ajustar stock</ActionLink>
                                                <ActionLink href={route('inventario.movimientos', { cod_categoria_producto: categoria.cod_categoria_producto })}>Movimientos</ActionLink>
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
