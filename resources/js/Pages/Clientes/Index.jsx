import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ clientes = [] }) {
    const listaClientes = Array.isArray(clientes)
        ? clientes
        : clientes?.data || [];

    const totalClientes = listaClientes.length;

    const clientesActivos = listaClientes.filter((cliente) =>
        normalizarEstado(cliente.estado_cli).includes('activo'),
    ).length;

    const clientesInactivos = listaClientes.filter((cliente) =>
        normalizarEstado(cliente.estado_cli).includes('inactivo'),
    ).length;

    const clientesSinCanal = listaClientes.filter(
        (cliente) => !cliente.canal_venta?.nombre_can,
    ).length;

    const clientesConFlujo = listaClientes.filter(
        (cliente) => Boolean(cliente.tipo_flujo_comercial?.nombre_tip),
    ).length;

    return (
        <DashboardLayout>
            <Head title="Clientes" />

            <div className="space-y-6">
                <section className="flex flex-col gap-4 rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
                            CRM comercial
                        </p>

                        <h1 className="mt-2 text-3xl font-black text-akin-text">
                            Clientes
                        </h1>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                            Administra clientes registrados, canal de adquisición,
                            estado comercial y flujo de atención. Esta vista permite
                            identificar clientes activos, oportunidades de seguimiento y
                            registros que necesitan completar información.
                        </p>
                    </div>

                    <Link
                        href={route('clientes.create')}
                        className="inline-flex items-center justify-center rounded-2xl bg-akin-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-akin-accentSoft focus:outline-none focus:ring-4 focus:ring-akin-accent/20"
                    >
                        Nuevo cliente
                    </Link>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <MetricCard
                        title="Total clientes"
                        value={totalClientes}
                        description="Registros comerciales"
                    />

                    <MetricCard
                        title="Activos"
                        value={clientesActivos}
                        description="Clientes disponibles"
                    />

                    <MetricCard
                        title="Inactivos"
                        value={clientesInactivos}
                        description="Requieren revisión"
                        alert={clientesInactivos > 0}
                    />

                    <MetricCard
                        title="Con flujo"
                        value={clientesConFlujo}
                        description="Segmentados comercialmente"
                    />

                    <MetricCard
                        title="Sin canal"
                        value={clientesSinCanal}
                        description="Origen no identificado"
                        danger={clientesSinCanal > 0}
                    />
                </section>

                {clientesSinCanal > 0 && (
                    <section className="rounded-3xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/30 dark:bg-orange-500/10 shadow-sm">
                        <h2 className="text-base font-black text-orange-800 dark:text-orange-300">
                            Datos comerciales incompletos
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-orange-700 dark:text-orange-300">
                            Hay clientes sin canal de venta registrado. Completar este dato
                            ayuda a medir qué medios atraen más clientes y dónde conviene
                            invertir esfuerzo comercial.
                        </p>
                    </section>
                )}

                <section className="overflow-hidden rounded-3xl border border-akin-border bg-akin-surface shadow-sm dark:shadow-black/20">
                    <div className="flex flex-col gap-3 border-b border-akin-border px-6 py-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-akin-text">
                                Listado de clientes
                            </h2>

                            <p className="mt-1 text-sm text-akin-muted">
                                Consulta datos comerciales clave y edita registros cuando
                                falte información de seguimiento.
                            </p>
                        </div>

                        <span className="rounded-full bg-akin-bg px-4 py-2 text-xs font-bold text-akin-primary">
                            {totalClientes} registros
                        </span>
                    </div>

                    {listaClientes.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-akin-border">
                                <thead className="bg-akin-bg">
                                    <tr>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Canal</TableHead>
                                        <TableHead>Flujo comercial</TableHead>
                                        <TableHead>Lectura comercial</TableHead>
                                        <TableHead align="right">Acciones</TableHead>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-akin-border bg-akin-surface">
                                    {listaClientes.map((cliente) => {
                                        const estado = normalizarEstado(cliente.estado_cli);
                                        const canal = cliente.canal_venta?.nombre_can;
                                        const flujo =
                                            cliente.tipo_flujo_comercial?.nombre_tip;

                                        return (
                                            <tr
                                                key={cliente.cod_cliente}
                                                className="transition hover:bg-akin-bg/70"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-akin-bg text-sm font-black text-akin-accent">
                                                            {obtenerInicial(cliente.nombre_cli)}
                                                        </div>

                                                        <div>
                                                            <p className="font-bold text-akin-text">
                                                                {cliente.nombre_cli ||
                                                                    'Cliente sin nombre'}
                                                            </p>

                                                            <p className="text-xs text-akin-muted">
                                                                Código:{' '}
                                                                {cliente.cod_cliente || 'N/D'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <EstadoBadge estado={estado} original={cliente.estado_cli} />
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={[
                                                            'inline-flex rounded-full border px-3 py-1 text-xs font-black',
                                                            canal
                                                                ? 'border-akin-border bg-akin-bg text-akin-primary'
                                                                : 'border-orange-200 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
                                                        ].join(' ')}
                                                    >
                                                        {canal || 'Sin canal'}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={[
                                                            'inline-flex rounded-full border px-3 py-1 text-xs font-black',
                                                            flujo
                                                                ? 'border-blue-200 bg-blue-100 text-blue-700'
                                                                : 'border-gray-200 bg-gray-100 text-gray-700',
                                                        ].join(' ')}
                                                    >
                                                        {flujo || 'Sin flujo'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="max-w-md text-sm leading-6 text-akin-muted">
                                                        {obtenerLecturaComercial({
                                                            estado,
                                                            canal,
                                                            flujo,
                                                        })}
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'clientes.edit',
                                                            cliente.cod_cliente,
                                                        )}
                                                        className="inline-flex items-center justify-center rounded-xl border border-akin-accent/30 px-4 py-2 text-xs font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
                                                    >
                                                        Editar
                                                    </Link>
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

function TableHead({ children, align = 'left' }) {
    return (
        <th
            className={[
                'px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-akin-muted',
                align === 'right' ? 'text-right' : 'text-left',
            ].join(' ')}
        >
            {children}
        </th>
    );
}

function EstadoBadge({ estado, original }) {
    if (estado.includes('activo')) {
        return (
            <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
                {formatearTexto(original || 'Activo')}
            </span>
        );
    }

    if (estado.includes('inactivo')) {
        return (
            <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-black text-gray-700 dark:border-gray-500/30 dark:bg-gray-500/10 dark:text-gray-300">
                {formatearTexto(original || 'Inactivo')}
            </span>
        );
    }

    if (estado.includes('potencial') || estado.includes('prospecto')) {
        return (
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-black text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                {formatearTexto(original || 'Potencial')}
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
            {formatearTexto(original || 'Sin estado')}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-akin-bg text-2xl font-black text-akin-accent">
                C
            </div>

            <h3 className="mt-5 text-xl font-black text-akin-text">
                No hay clientes registrados
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-akin-muted">
                Cuando registres clientes, aparecerán aquí con su canal,
                estado y flujo comercial para seguimiento.
            </p>

            <Link
                href={route('clientes.create')}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-akin-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-akin-accentSoft"
            >
                Crear primer cliente
            </Link>
        </div>
    );
}

function obtenerLecturaComercial({ estado, canal, flujo }) {
    if (!canal && !flujo) {
        return 'Registro incompleto para análisis comercial. Conviene completar canal y flujo para medir origen y estrategia de atención.';
    }

    if (!canal) {
        return 'Falta canal de origen. Este dato es clave para saber qué medio atrae clientes.';
    }

    if (!flujo) {
        return 'Cliente sin flujo comercial asignado. Conviene segmentarlo para definir seguimiento o atención.';
    }

    if (estado.includes('inactivo')) {
        return 'Cliente inactivo. Revisar si corresponde reactivación, seguimiento o depuración comercial.';
    }

    return 'Cliente con información comercial útil para seguimiento, segmentación y análisis de ventas.';
}

function normalizarEstado(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
}

function formatearTexto(value) {
    return String(value || 'Sin dato')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function obtenerInicial(nombre) {
    return String(nombre || 'C')
        .trim()
        .charAt(0)
        .toUpperCase();
}