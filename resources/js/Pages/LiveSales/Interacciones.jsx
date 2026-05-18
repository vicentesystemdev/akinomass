import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const interaccionEstadoConfig = {
    nuevo: { label: 'Nuevo', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    contactado: { label: 'Contactado', bg: 'bg-terracota-100', text: 'text-terracota-800', dot: 'bg-terracota-500' },
    convertido_lead: { label: 'Convertido Lead', bg: 'bg-oliva-100', text: 'text-oliva-800', dot: 'bg-oliva-500' },
    convertido_pedido: { label: 'Convertido Pedido', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    descartado: { label: 'Descartado', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

const InteraccionBadge = ({ estado }) => {
    const config = interaccionEstadoConfig[estado] || { label: estado, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
    return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full px-2.5 py-1 text-xs ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
};

export default function Interacciones({ sesiones = [] }) {
    const [filterEstado, setFilterEstado] = useState('');

    const allInteracciones = useMemo(() => {
        const interacciones = [];
        sesiones.forEach((sesion) => {
            if (sesion.interacciones_live) {
                sesion.interacciones_live.forEach((inter) => {
                    interacciones.push({
                        ...inter,
                        sesion_titulo: sesion.titulo_ses,
                        sesion_estado: sesion.estado_ses,
                    });
                });
            }
        });
        return interacciones.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [sesiones]);

    const filteredInteracciones = useMemo(() => {
        if (!filterEstado) return allInteracciones;
        return allInteracciones.filter((i) => i.estado_int === filterEstado);
    }, [allInteracciones, filterEstado]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-BO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Interacciones Live"
                    subtitle="Vista global de todas las interacciones de venta en vivo"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Live Sales', href: route('live-sales.index') },
                        { label: 'Interacciones' },
                    ]}
                />
            }
        >
            <Head title="Interacciones Live" />

            <div className="space-y-6">
                {/* Filtro */}
                <SectionCard>
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm font-medium text-cafe-700">Filtrar por estado:</span>
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200 w-48"
                        >
                            <option value="">Todas las interacciones</option>
                            {Object.entries(interaccionEstadoConfig).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500">
                            {filteredInteracciones.length} {filteredInteracciones.length === 1 ? 'interacción' : 'interacciones'}
                        </span>
                    </div>
                </SectionCard>

                {/* Tabla de interacciones */}
                <SectionCard noPadding>
                    {filteredInteracciones.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Fecha</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Sesión</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Interesado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Producto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Intención</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {filteredInteracciones.map((inter) => (
                                    <TableWrapper.Row key={inter.cod_interaccion_live}>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-cafe-700 whitespace-nowrap">
                                                {formatDate(inter.created_at)}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <Link
                                                href={route('live-sales.show', inter.cod_sesion_live)}
                                                className="text-sm font-medium text-oliva-600 hover:text-oliva-700 transition-colors"
                                            >
                                                {inter.sesion_titulo || `Sesión #${inter.cod_sesion_live}`}
                                            </Link>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <div>
                                                <p className="font-medium text-cafe-900">
                                                    {inter.alias_int || inter.nombre_int || 'Sin nombre'}
                                                </p>
                                                {inter.telefono_int && (
                                                    <p className="text-xs text-gray-500">{inter.telefono_int}</p>
                                                )}
                                            </div>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-cafe-700">{inter.producto?.nombre_pro || '-'}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-cafe-700">{inter.intencion_compra_int || '-'}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <InteraccionBadge estado={inter.estado_int} />
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <div className="flex items-center justify-end gap-2">
                                                {inter.cod_lead && (
                                                    <Link
                                                        href={route('leads.edit', inter.cod_lead)}
                                                        className="text-xs font-medium text-oliva-600 hover:text-oliva-700 transition-colors"
                                                    >
                                                        Lead
                                                    </Link>
                                                )}
                                                {inter.cod_pedido && (
                                                    <Link
                                                        href={route('pedidos.show', inter.cod_pedido)}
                                                        className="text-xs font-medium text-terracota-600 hover:text-terracota-700 transition-colors"
                                                    >
                                                        Pedido
                                                    </Link>
                                                )}
                                                <Link
                                                    href={route('live-sales.show', inter.cod_sesion_live)}
                                                    className="text-xs font-medium text-gray-500 hover:text-cafe-700 transition-colors"
                                                >
                                                    Ver sesión
                                                </Link>
                                            </div>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title={filterEstado ? 'No hay interacciones con este estado' : 'No hay interacciones registradas'}
                            description={
                                filterEstado
                                    ? 'Intenta cambiar el filtro para ver otras interacciones.'
                                    : 'Las interacciones de sesiones Live aparecerán aquí.'
                            }
                        />
                    )}
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
