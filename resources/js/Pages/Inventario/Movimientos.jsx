import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Movimientos({ movimientos = [] }) {
    const listaMovimientos = Array.isArray(movimientos)
        ? movimientos
        : movimientos?.data || [];

    const totalMovimientos = listaMovimientos.length;

    const totalEntradas = listaMovimientos.filter((movimiento) =>
        normalizarTipo(movimiento.tipo_movimiento_mov).includes('entrada'),
    ).length;

    const totalSalidas = listaMovimientos.filter((movimiento) =>
        normalizarTipo(movimiento.tipo_movimiento_mov).includes('salida'),
    ).length;

    const totalAjustes = listaMovimientos.filter((movimiento) =>
        normalizarTipo(movimiento.tipo_movimiento_mov).includes('ajuste'),
    ).length;

    const movimientosCriticos = listaMovimientos.filter((movimiento) =>
        Number(movimiento.stock_nuevo_mov || 0) <= 0,
    ).length;

    return (
        <DashboardLayout>
            <Head title="Movimientos de inventario" />

            <div className="space-y-6">
                <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
                        Trazabilidad operativa
                    </p>

                    <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-akin-text">
                                Movimientos de inventario
                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                                Consulta el historial de entradas, salidas y ajustes.
                                Esta vista funciona como bitácora comercial para auditar
                                cambios de stock, responsables y motivos de cada operación.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <ActionLink
                                href={route('inventario.index')}
                                label="Volver a inventario"
                                variant="outline"
                            />

                            <ActionLink
                                href={route('inventario.entrada.form')}
                                label="Entrada"
                                variant="primary"
                            />

                            <ActionLink
                                href={route('inventario.salida.form')}
                                label="Salida"
                                variant="outline"
                            />

                            <ActionLink
                                href={route('inventario.ajuste.form')}
                                label="Ajuste"
                                variant="soft"
                            />
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <MetricCard
                        title="Total"
                        value={totalMovimientos}
                        description="Movimientos registrados"
                    />

                    <MetricCard
                        title="Entradas"
                        value={totalEntradas}
                        description="Incrementos de stock"
                    />

                    <MetricCard
                        title="Salidas"
                        value={totalSalidas}
                        description="Reducciones de stock"
                        alert={totalSalidas > 0}
                    />

                    <MetricCard
                        title="Ajustes"
                        value={totalAjustes}
                        description="Correcciones directas"
                    />

                    <MetricCard
                        title="Stock cero"
                        value={movimientosCriticos}
                        description="Movimientos dejaron stock crítico"
                        danger={movimientosCriticos > 0}
                    />
                </section>

                {movimientosCriticos > 0 && (
                    <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
                        <h2 className="text-base font-black text-red-700">
                            Atención comercial
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-red-600">
                            Existen movimientos cuyo stock final quedó en cero o negativo.
                            Revisa estos productos para priorizar reposición, pausar ventas
                            o validar si el movimiento fue registrado correctamente.
                        </p>
                    </section>
                )}

                <section className="overflow-hidden rounded-3xl border border-akin-border bg-akin-surface shadow-sm dark:shadow-black/20">
                    <div className="flex flex-col gap-3 border-b border-akin-border px-6 py-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-akin-text">
                                Historial detallado
                            </h2>

                            <p className="mt-1 text-sm text-akin-muted">
                                Revisa fecha, producto, tipo, cantidad, cambio de stock,
                                responsable y justificación del movimiento.
                            </p>
                        </div>

                        <span className="rounded-full bg-akin-bg px-4 py-2 text-xs font-bold text-akin-primary">
                            {totalMovimientos} registros
                        </span>
                    </div>

                    {listaMovimientos.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-akin-border">
                                <thead className="bg-akin-bg">
                                    <tr>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Responsable</TableHead>
                                        <TableHead>Motivo</TableHead>
                                        <TableHead>Lectura</TableHead>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-akin-border bg-akin-surface">
                                    {listaMovimientos.map((movimiento) => {
                                        const tipo = normalizarTipo(
                                            movimiento.tipo_movimiento_mov,
                                        );
                                        const stockAnterior = Number(
                                            movimiento.stock_anterior_mov || 0,
                                        );
                                        const stockNuevo = Number(
                                            movimiento.stock_nuevo_mov || 0,
                                        );
                                        const cantidad = Number(
                                            movimiento.cantidad_mov || 0,
                                        );

                                        return (
                                            <tr
                                                key={
                                                    movimiento.cod_movimiento_inventario
                                                }
                                                className="transition hover:bg-akin-bg/70"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="text-sm font-bold text-akin-text">
                                                        {formatearFecha(
                                                            movimiento.created_at,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-akin-text/45">
                                                        {formatearHora(
                                                            movimiento.created_at,
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-akin-bg text-sm font-black text-akin-accent">
                                                            {obtenerInicial(
                                                                movimiento.producto
                                                                    ?.nombre_pro,
                                                            )}
                                                        </div>

                                                        <div>
                                                            <p className="font-bold text-akin-text">
                                                                {movimiento.producto
                                                                    ?.nombre_pro ||
                                                                    'Producto no disponible'}
                                                            </p>

                                                            <p className="text-xs text-akin-muted">
                                                                Movimiento:{' '}
                                                                {movimiento.cod_movimiento_inventario ||
                                                                    'N/D'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <TipoBadge tipo={tipo} />
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p
                                                        className={[
                                                            'text-xl font-black',
                                                            tipo.includes('salida')
                                                                ? 'text-red-600'
                                                                : tipo.includes('entrada')
                                                                    ? 'text-green-700'
                                                                    : 'text-akin-accent',
                                                        ].join(' ')}
                                                    >
                                                        {tipo.includes('salida')
                                                            ? `-${cantidad}`
                                                            : tipo.includes('entrada')
                                                                ? `+${cantidad}`
                                                                : cantidad}
                                                    </p>

                                                    <p className="text-xs font-semibold text-akin-text/45">
                                                        unidades
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="rounded-2xl bg-akin-bg px-4 py-3">
                                                        <p className="text-sm font-black text-akin-text">
                                                            {stockAnterior} → {stockNuevo}
                                                        </p>

                                                        <p className="mt-1 text-xs font-semibold text-akin-text/45">
                                                            Cambio final:{' '}
                                                            {calcularDiferencia(
                                                                stockAnterior,
                                                                stockNuevo,
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="text-sm font-bold text-akin-text">
                                                        {movimiento.usuario_responsable
                                                            ?.name || 'N/A'}
                                                    </p>

                                                    <p className="text-xs text-akin-text/45">
                                                        Usuario responsable
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="max-w-xs text-sm font-bold text-akin-text">
                                                        {movimiento.motivo_mov ||
                                                            'Sin motivo'}
                                                    </p>

                                                    {movimiento.observacion_mov && (
                                                        <p className="mt-1 max-w-xs text-xs leading-5 text-akin-text/55">
                                                            {
                                                                movimiento.observacion_mov
                                                            }
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="max-w-sm text-sm leading-6 text-akin-muted">
                                                        {obtenerLecturaMovimiento(
                                                            tipo,
                                                            stockAnterior,
                                                            stockNuevo,
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
        </DashboardLayout>
    );
}

function ActionLink({ href, label, variant = 'outline' }) {
    const styles = {
        primary:
            'bg-akin-accent text-white hover:bg-akin-accentSoft border-akin-accent',
        outline:
            'bg-akin-surface text-akin-accent hover:bg-akin-accent hover:text-white border-akin-accent/30',
        soft:
            'bg-akin-bg text-akin-primary hover:bg-akin-primary hover:text-white border-akin-border',
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
                'rounded-3xl border bg-akin-surface p-5 shadow-sm dark:shadow-black/20',
                danger
                    ? 'border-red-200'
                    : alert
                        ? 'border-orange-200'
                        : 'border-akin-border',
            ].join(' ')}
        >
            <p
                className={[
                    'text-xs font-bold uppercase tracking-[0.18em]',
                    danger
                        ? 'text-red-600'
                        : alert
                            ? 'text-orange-600'
                            : 'text-akin-accent',
                ].join(' ')}
            >
                {title}
            </p>

            <p className="mt-3 text-3xl font-black text-akin-text">
                {value}
            </p>

            <p className="mt-1 text-sm text-akin-muted">
                {description}
            </p>
        </div>
    );
}

function TableHead({ children }) {
    return (
        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-akin-muted">
            {children}
        </th>
    );
}

function TipoBadge({ tipo }) {
    if (tipo.includes('entrada')) {
        return (
            <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
                Entrada
            </span>
        );
    }

    if (tipo.includes('salida')) {
        return (
            <span className="inline-flex rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-black text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                Salida
            </span>
        );
    }

    if (tipo.includes('ajuste')) {
        return (
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
                Ajuste
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-black text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
            {formatearTexto(tipo)}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-akin-bg text-2xl font-black text-akin-accent">
                M
            </div>

            <h3 className="mt-5 text-xl font-black text-akin-text">
                No hay movimientos registrados
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-akin-muted">
                Cuando registres entradas, salidas o ajustes, aparecerán aquí
                para consulta operativa y auditoría del inventario.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
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
                    label="Registrar ajuste"
                    variant="soft"
                />
            </div>
        </div>
    );
}

function normalizarTipo(tipo) {
    if (tipo && typeof tipo === 'object') {
        return String(tipo.value || tipo.name || tipo.label || '')
            .trim()
            .toLowerCase();
    }

    return String(tipo || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
}

function calcularDiferencia(stockAnterior, stockNuevo) {
    const diferencia = stockNuevo - stockAnterior;

    if (diferencia > 0) {
        return `+${diferencia}`;
    }

    return String(diferencia);
}

function obtenerLecturaMovimiento(tipo, stockAnterior, stockNuevo) {
    if (stockNuevo <= 0) {
        return 'El producto quedó sin disponibilidad. Revisar reposición, publicación comercial o consistencia del movimiento.';
    }

    if (tipo.includes('entrada')) {
        return 'Incremento de stock registrado. Mejora disponibilidad comercial y capacidad de venta.';
    }

    if (tipo.includes('salida')) {
        return 'Reducción de stock registrada. Verificar que la salida esté asociada a venta, merma o justificación válida.';
    }

    if (tipo.includes('ajuste')) {
        return 'Corrección directa de inventario. Debe estar respaldada por conteo físico, auditoría o regularización documentada.';
    }

    if (stockNuevo < stockAnterior) {
        return 'Movimiento redujo disponibilidad. Conviene revisar impacto en ventas e inventario mínimo.';
    }

    return 'Movimiento registrado correctamente. Mantener seguimiento según rotación del producto.';
}

function formatearFecha(value) {
    if (!value) return 'Sin fecha';

    try {
        return new Intl.DateTimeFormat('es-BO', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function formatearHora(value) {
    if (!value) return '';

    try {
        return new Intl.DateTimeFormat('es-BO', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));
    } catch {
        return '';
    }
}

function formatearTexto(value) {
    return String(value || 'Movimiento')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function obtenerInicial(nombre) {
    return String(nombre || 'M')
        .trim()
        .charAt(0)
        .toUpperCase();
}