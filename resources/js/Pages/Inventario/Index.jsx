import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ inventarios = [], stockBajo = [] }) {
    const listaInventarios = Array.isArray(inventarios)
        ? inventarios
        : inventarios?.data || [];

    const listaStockBajo = Array.isArray(stockBajo)
        ? stockBajo
        : stockBajo?.data || [];

    const totalProductosInventariados = listaInventarios.length;

    const productosStockBajo = listaInventarios.filter((inventario) =>
        esStockBajo(inventario),
    ).length;

    const productosSinStock = listaInventarios.filter(
        (inventario) => Number(inventario.stock_actual_inv || 0) <= 0,
    ).length;

    const productosStockSaludable =
        totalProductosInventariados - productosStockBajo;

    const unidadesTotales = listaInventarios.reduce(
        (total, inventario) => total + Number(inventario.stock_actual_inv || 0),
        0,
    );

    return (
        <AuthenticatedLayout>
            <Head title="Inventario" />

            <div className="space-y-6">
                <section className="flex flex-col gap-4 rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
                            Control operativo y comercial
                        </p>

                        <h1 className="mt-2 text-3xl font-black text-[#2B221E]">
                            Inventario
                        </h1>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#2B221E]/65">
                            Supervisa la disponibilidad real de productos, identifica
                            riesgos de quiebre de stock y registra movimientos para
                            mantener trazabilidad comercial y operativa.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <ActionLink
                            href={route('inventario.entrada.form')}
                            label="Registrar entrada"
                            variant="primary"
                        />

                        <ActionLink
                            href={route('inventario.salida.form')}
                            label="Registrar salida"
                            variant="outline"
                        />

                        <ActionLink
                            href={route('inventario.ajuste.form')}
                            label="Ajustar stock"
                            variant="outline"
                        />

                        <ActionLink
                            href={route('inventario.movimientos')}
                            label="Movimientos"
                            variant="soft"
                        />
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <MetricCard
                        title="Productos"
                        value={totalProductosInventariados}
                        description="Con inventario registrado"
                    />

                    <MetricCard
                        title="Unidades"
                        value={unidadesTotales}
                        description="Stock total disponible"
                    />

                    <MetricCard
                        title="Stock saludable"
                        value={productosStockSaludable}
                        description="Por encima del mínimo"
                    />

                    <MetricCard
                        title="Stock bajo"
                        value={productosStockBajo}
                        description="Requiere reposición"
                        alert={productosStockBajo > 0}
                    />

                    <MetricCard
                        title="Sin stock"
                        value={productosSinStock}
                        description="Riesgo comercial crítico"
                        danger={productosSinStock > 0}
                    />
                </section>

                {listaStockBajo.length > 0 && (
                    <section className="rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <h2 className="text-lg font-black text-orange-800">
                                    Alerta de reposición
                                </h2>

                                <p className="mt-1 max-w-3xl text-sm leading-6 text-orange-700">
                                    Hay productos con stock igual o menor al mínimo.
                                    Desde gestión comercial, estos productos deben priorizarse
                                    para reposición, compra, producción o ajuste de publicación.
                                </p>
                            </div>

                            <span className="inline-flex rounded-full border border-orange-300 bg-white px-4 py-2 text-xs font-black text-orange-700">
                                {listaStockBajo.length} producto(s) en alerta
                            </span>
                        </div>
                    </section>
                )}

                <section className="overflow-hidden rounded-3xl border border-[#eadfd6] bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-[#eadfd6] px-6 py-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-[#2B221E]">
                                Estado de inventario por producto
                            </h2>

                            <p className="mt-1 text-sm text-[#2B221E]/60">
                                Visualiza stock actual, mínimo requerido y nivel operativo
                                para tomar decisiones de reposición.
                            </p>
                        </div>

                        <span className="rounded-full bg-[#FDF6F0] px-4 py-2 text-xs font-bold text-[#3C473A]">
                            {totalProductosInventariados} registros
                        </span>
                    </div>

                    {listaInventarios.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#eadfd6]">
                                <thead className="bg-[#FDF6F0]">
                                    <tr>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Stock actual</TableHead>
                                        <TableHead>Stock mínimo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Lectura comercial</TableHead>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#eadfd6] bg-white">
                                    {listaInventarios.map((inventario) => {
                                        const stockActual = Number(
                                            inventario.stock_actual_inv || 0,
                                        );
                                        const stockMinimo = Number(
                                            inventario.stock_minimo_inv || 0,
                                        );
                                        const estado = obtenerEstadoStock(
                                            stockActual,
                                            stockMinimo,
                                        );

                                        return (
                                            <tr
                                                key={inventario.cod_inventario}
                                                className="transition hover:bg-[#FDF6F0]/70"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDF6F0] text-sm font-black text-[#D77A61]">
                                                            {obtenerInicial(
                                                                inventario.producto?.nombre_pro,
                                                            )}
                                                        </div>

                                                        <div>
                                                            <p className="font-bold text-[#2B221E]">
                                                                {inventario.producto
                                                                    ?.nombre_pro ||
                                                                    'Producto sin nombre'}
                                                            </p>

                                                            <p className="text-xs text-[#2B221E]/50">
                                                                Código inventario:{' '}
                                                                {inventario.cod_inventario ||
                                                                    'N/D'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="text-2xl font-black text-[#2B221E]">
                                                        {stockActual}
                                                    </p>
                                                    <p className="text-xs font-semibold text-[#2B221E]/45">
                                                        unidades disponibles
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="text-lg font-black text-[#3C473A]">
                                                        {stockMinimo}
                                                    </p>
                                                    <p className="text-xs font-semibold text-[#2B221E]/45">
                                                        mínimo operativo
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <StockBadge estado={estado} />
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="max-w-md text-sm leading-6 text-[#2B221E]/65">
                                                        {obtenerLecturaComercial(
                                                            estado,
                                                            stockActual,
                                                            stockMinimo,
                                                        )}
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function ActionLink({ href, label, variant = 'outline' }) {
    const styles = {
        primary:
            'bg-[#D77A61] text-white hover:bg-[#c96f58] border-[#D77A61]',
        outline:
            'bg-white text-[#D77A61] hover:bg-[#D77A61] hover:text-white border-[#D77A61]/30',
        soft:
            'bg-[#FDF6F0] text-[#3C473A] hover:bg-[#3C473A] hover:text-white border-[#eadfd6]',
    };

    return (
        <Link
            href={href}
            className={[
                'inline-flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm transition',
                styles[variant],
            ].join(' ')}
        >
            {label}
        </Link>
    );
}

function MetricCard({ title, value, description, alert = false, danger = false }) {
    return (
        <div
            className={[
                'rounded-3xl border bg-white p-5 shadow-sm',
                danger
                    ? 'border-red-200'
                    : alert
                        ? 'border-orange-200'
                        : 'border-[#eadfd6]',
            ].join(' ')}
        >
            <p
                className={[
                    'text-xs font-bold uppercase tracking-[0.18em]',
                    danger
                        ? 'text-red-600'
                        : alert
                            ? 'text-orange-600'
                            : 'text-[#D77A61]',
                ].join(' ')}
            >
                {title}
            </p>

            <p className="mt-3 text-3xl font-black text-[#2B221E]">
                {value}
            </p>

            <p className="mt-1 text-sm text-[#2B221E]/60">
                {description}
            </p>
        </div>
    );
}

function TableHead({ children }) {
    return (
        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-[#2B221E]/60">
            {children}
        </th>
    );
}

function StockBadge({ estado }) {
    const styles = {
        sin_stock: 'border-red-200 bg-red-100 text-red-700',
        bajo: 'border-orange-200 bg-orange-100 text-orange-700',
        saludable: 'border-green-200 bg-green-100 text-green-700',
    };

    const labels = {
        sin_stock: 'Sin stock',
        bajo: 'Stock bajo',
        saludable: 'Saludable',
    };

    return (
        <span
            className={[
                'inline-flex rounded-full border px-3 py-1 text-xs font-black',
                styles[estado] || styles.saludable,
            ].join(' ')}
        >
            {labels[estado] || 'Saludable'}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FDF6F0] text-2xl font-black text-[#D77A61]">
                I
            </div>

            <h3 className="mt-5 text-xl font-black text-[#2B221E]">
                No hay inventario registrado
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#2B221E]/60">
                Registra una entrada inicial o un ajuste de stock para comenzar
                a controlar disponibilidad, reposición y trazabilidad comercial.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
                <ActionLink
                    href={route('inventario.entrada.form')}
                    label="Registrar entrada"
                    variant="primary"
                />

                <ActionLink
                    href={route('inventario.ajuste.form')}
                    label="Ajustar stock"
                    variant="outline"
                />
            </div>
        </div>
    );
}

function obtenerEstadoStock(stockActual, stockMinimo) {
    if (stockActual <= 0) {
        return 'sin_stock';
    }

    if (stockActual <= stockMinimo) {
        return 'bajo';
    }

    return 'saludable';
}

function esStockBajo(inventario) {
    return (
        Number(inventario.stock_actual_inv || 0) <=
        Number(inventario.stock_minimo_inv || 0)
    );
}

function obtenerLecturaComercial(estado, stockActual, stockMinimo) {
    if (estado === 'sin_stock') {
        return 'Producto sin disponibilidad. Riesgo alto de pérdida de venta; priorizar reposición o desactivar publicación comercial.';
    }

    if (estado === 'bajo') {
        return `Stock en zona crítica: ${stockActual} unidad(es) frente a un mínimo de ${stockMinimo}. Conviene reponer o monitorear ventas próximas.`;
    }

    return 'Inventario saludable para operación comercial. Mantener seguimiento según rotación del producto.';
}

function obtenerInicial(nombre) {
    return String(nombre || 'I')
        .trim()
        .charAt(0)
        .toUpperCase();
}
import { Head, Link } from '@inertiajs/react';
export default function Index({ inventarios, stockBajo }) { return <><Head title="Inventario" /><div className="p-6"><h1 className="text-xl font-bold">Inventarios</h1><div className="my-3 flex gap-2"><Link href={route('inventario.entrada.form')}>Entrada</Link><Link href={route('inventario.salida.form')}>Salida</Link><Link href={route('inventario.ajuste.form')}>Ajuste</Link><Link href={route('inventario.movimientos')}>Movimientos</Link></div><p>Stock bajo: {stockBajo.length}</p><table className="w-full border"><thead><tr><th>Producto</th><th>Stock</th><th>Mínimo</th></tr></thead><tbody>{inventarios.map((inv)=><tr key={inv.cod_inventario}><td>{inv.producto?.nombre_pro}</td><td>{inv.stock_actual_inv}</td><td>{inv.stock_minimo_inv}</td></tr>)}</tbody></table></div></>; }
