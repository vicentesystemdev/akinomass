import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import StatusBadge from '@/Components/UI/StatusBadge';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { contactoNombre, estadoLabels, formatBOB, formatDate, tipoInteraccionLabels } from './Components/VentaRedHelpers';

export default function Index({ ventas = { data: [] }, filtros = {}, estados = [], tiposInteraccion = [], canales = [], usuarios = [] }) {
    const [filters, setFilters] = useState({
        estado: filtros.estado ?? '',
        cod_canal_venta: filtros.cod_canal_venta ?? '',
        tipo_interaccion: filtros.tipo_interaccion ?? '',
        cod_usuario_responsable: filtros.cod_usuario_responsable ?? '',
        busqueda: filtros.busqueda ?? '',
    });

    const applyFilters = (nextFilters = filters) => {
        router.get(route('ventas-redes.index'), nextFilters, { preserveState: true, replace: true });
    };

    const updateFilter = (key, value) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        if (key !== 'busqueda') applyFilters(next);
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Ventas por Redes"
                    subtitle="Centraliza ventas e interesados provenientes de canales digitales"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Ventas por Redes' },
                    ]}
                    actions={
                        <Link href={route('ventas-redes.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
                                    </svg>
                                }
                            >
                                Nueva venta
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Ventas por Redes" />

            <div className="space-y-6">
                <SectionCard>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        <input
                            value={filters.busqueda}
                            onChange={(event) => updateFilter('busqueda', event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
                            placeholder="Buscar venta, contacto o referencia"
                            className="rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500 md:col-span-2"
                        />
                        <select value={filters.estado} onChange={(event) => updateFilter('estado', event.target.value)} className="rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500">
                            <option value="">Todos los estados</option>
                            {estados.map((estado) => <option key={estado} value={estado}>{estadoLabels[estado] ?? estado}</option>)}
                        </select>
                        <select value={filters.cod_canal_venta} onChange={(event) => updateFilter('cod_canal_venta', event.target.value)} className="rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500">
                            <option value="">Todos los canales</option>
                            {canales.map((canal) => <option key={canal.cod_canal_venta} value={canal.cod_canal_venta}>{canal.nombre_can}</option>)}
                        </select>
                        <select value={filters.tipo_interaccion} onChange={(event) => updateFilter('tipo_interaccion', event.target.value)} className="rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500">
                            <option value="">Todas las interacciones</option>
                            {tiposInteraccion.map((tipo) => <option key={tipo} value={tipo}>{tipoInteraccionLabels[tipo] ?? tipo}</option>)}
                        </select>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button type="button" onClick={() => applyFilters()} className="rounded-lg bg-oliva-50 px-3 py-2 text-sm font-medium text-oliva-700 hover:bg-oliva-100">
                            Aplicar filtros
                        </button>
                    </div>
                </SectionCard>

                <SectionCard noPadding>
                    {(ventas.data ?? []).length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Codigo</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Contacto</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Canal</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Interaccion</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Responsable</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Total</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Fecha</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {ventas.data.map((venta) => (
                                    <TableWrapper.Row key={venta.cod_venta_red}>
                                        <TableWrapper.Cell>
                                            <span className="font-mono font-semibold text-cafe-900">{venta.codigo_venta_red}</span>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="font-medium text-cafe-900">{contactoNombre(venta)}</p>
                                            <p className="text-xs text-gray-500">{venta.cliente ? 'Cliente' : venta.lead ? 'Lead' : 'Borrador'}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>{venta.canal_venta?.nombre_can ?? '-'}</TableWrapper.Cell>
                                        <TableWrapper.Cell>{tipoInteraccionLabels[venta.tipo_interaccion] ?? '-'}</TableWrapper.Cell>
                                        <TableWrapper.Cell>{venta.usuario_responsable?.name ?? '-'}</TableWrapper.Cell>
                                        <TableWrapper.Cell><StatusBadge status={venta.estado_venta_red} /></TableWrapper.Cell>
                                        <TableWrapper.Cell align="right"><span className="font-bold text-terracota-600">{formatBOB(venta.total)}</span></TableWrapper.Cell>
                                        <TableWrapper.Cell>{formatDate(venta.created_at)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('ventas-redes.show', venta.cod_venta_red)} className="text-sm font-medium text-oliva-600 hover:text-oliva-700">Ver</Link>
                                                {['borrador', 'pendiente_confirmacion', 'confirmada'].includes(venta.estado_venta_red) && (
                                                    <Link href={route('ventas-redes.edit', venta.cod_venta_red)} className="text-sm font-medium text-terracota-600 hover:text-terracota-700">Editar</Link>
                                                )}
                                            </div>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title="No hay ventas por redes registradas"
                            description="Registra la primera venta o interes recibido desde canales digitales."
                            action={
                                <Link href={route('ventas-redes.create')}>
                                    <PrimaryActionButton>Nueva venta</PrimaryActionButton>
                                </Link>
                            }
                        />
                    )}
                    <Pagination links={ventas.links} meta={ventas.meta} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
