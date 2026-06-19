import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import { router } from '@inertiajs/react';
import { CircleDollarSign, ShieldAlert, Sparkles, UsersRound } from 'lucide-react';
import { useState } from 'react';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import MetricCard from './Components/MetricCard';
import { formatBOB, formatDate, formatDecimal, formatNumber } from './Components/formatters';

const clusterTones = {
    1: 'border-terracota-200 bg-terracota-50 text-terracota-800',
    2: 'border-oliva-200 bg-oliva-50 text-oliva-800',
    3: 'border-amber-200 bg-amber-50 text-amber-800',
    4: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    5: 'border-green-200 bg-green-50 text-green-800',
    6: 'border-gray-200 bg-gray-50 text-gray-700',
};

export default function SegmentacionClientes({ segmentacion = {} }) {
    const filtrosIniciales = segmentacion.filtros ?? {};
    const [filtros, setFiltros] = useState({
        clusters: filtrosIniciales.clusters ?? 3,
        periodo_inicio: filtrosIniciales.periodo_inicio ?? '',
        periodo_fin: filtrosIniciales.periodo_fin ?? '',
    });
    const metricas = segmentacion.metricas ?? {};
    const clientes = segmentacion.clientes ?? [];
    const clusters = segmentacion.resumen_clusters ?? [];

    const aplicar = (event) => {
        event.preventDefault();
        const params = Object.fromEntries(Object.entries(filtros).filter(([, value]) => value !== ''));
        router.get(route('inteligencia-ventas.segmentacion-clientes'), params, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <InteligenciaVentasLayout
            title="Segmentación de Clientes"
            subtitle="Agrupación conductual mediante K-Means para orientar fidelización, recompra y recuperación"
        >
            <SectionCard
                title="Parámetros del análisis"
                subtitle="K-Means compara clientes con variables normalizadas en una escala común de 0 a 1."
            >
                <form onSubmit={aplicar} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Field label="Número de clusters">
                        <select
                            value={filtros.clusters}
                            onChange={(event) => setFiltros((actual) => ({ ...actual, clusters: event.target.value }))}
                            className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500"
                        >
                            {[2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value} grupos</option>)}
                        </select>
                    </Field>
                    <Field label="Desde">
                        <input
                            type="date"
                            value={filtros.periodo_inicio}
                            onChange={(event) => setFiltros((actual) => ({ ...actual, periodo_inicio: event.target.value }))}
                            className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500"
                        />
                    </Field>
                    <Field label="Hasta">
                        <input
                            type="date"
                            value={filtros.periodo_fin}
                            onChange={(event) => setFiltros((actual) => ({ ...actual, periodo_fin: event.target.value }))}
                            className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500"
                        />
                    </Field>
                    <div className="flex items-end">
                        <button type="submit" className="w-full rounded-xl bg-terracota-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-terracota-600">
                            Analizar clientes
                        </button>
                    </div>
                </form>
            </SectionCard>

            {segmentacion.suficientes_datos ? (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricCard title="Clientes analizados" value={formatNumber(metricas.clientes_analizados)} icon={UsersRound} tone="oliva" />
                        <MetricCard title="Cluster de mayor valor" value={metricas.cluster_mayor_valor ?? '-'} icon={Sparkles} tone="terracota" />
                        <MetricCard title="Ticket promedio general" value={formatBOB(metricas.ticket_promedio_general)} icon={CircleDollarSign} tone="green" />
                        <MetricCard title="Clientes en riesgo" value={formatNumber(metricas.clientes_en_riesgo)} icon={ShieldAlert} tone="red" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        {clusters.map((cluster) => (
                            <article key={cluster.cluster} className={`rounded-2xl border p-5 ${clusterTones[cluster.cluster] ?? clusterTones[6]}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">Cluster {cluster.cluster}</p>
                                        <h3 className="mt-2 text-lg font-bold">{cluster.etiqueta}</h3>
                                    </div>
                                    <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold">
                                        {formatNumber(cluster.cantidad_clientes)}
                                    </span>
                                </div>
                                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                    <ClusterMetric label="Puntaje promedio" value={formatDecimal(cluster.puntaje_promedio, 1)} />
                                    <ClusterMetric label="Ticket promedio" value={formatBOB(cluster.ticket_promedio)} />
                                    <ClusterMetric label="Compra acumulada" value={formatBOB(cluster.total_comprado)} className="col-span-2" />
                                </dl>
                            </article>
                        ))}
                    </div>

                    <SectionCard title="Clientes segmentados" subtitle="El puntaje resume valor, frecuencia, recencia, variedad y cumplimiento de pago." noPadding>
                        <TableWrapper className="rounded-none border-0 shadow-none">
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Cliente</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Segmento</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Puntaje</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Pedidos</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Total comprado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Ticket promedio</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Última compra</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Días sin compra</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Recomendación comercial</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {clientes.map((cliente) => (
                                    <TableWrapper.Row key={cliente.cliente_id}>
                                        <TableWrapper.Cell className="font-semibold text-cafe-900">{cliente.nombre_cliente}</TableWrapper.Cell>
                                        <TableWrapper.Cell><ClusterBadge cluster={cliente.cluster} label={cliente.etiqueta_cluster} /></TableWrapper.Cell>
                                        <TableWrapper.Cell align="right" className="font-bold text-terracota-700">{formatDecimal(cliente.puntaje_valor_cliente, 1)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatNumber(cliente.cantidad_pedidos)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatBOB(cliente.total_comprado)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatBOB(cliente.ticket_promedio)}</TableWrapper.Cell>
                                        <TableWrapper.Cell>{formatDate(cliente.ultima_compra)}</TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">{formatNumber(cliente.dias_desde_ultima_compra)}</TableWrapper.Cell>
                                        <TableWrapper.Cell className="max-w-xs whitespace-normal leading-5">{cliente.recomendacion_comercial}</TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    </SectionCard>
                </>
            ) : (
                <InsufficientData message={segmentacion.mensaje} />
            )}

            <SectionCard title="Fundamento académico: K-Means">
                <div className="grid gap-5 text-sm leading-7 text-cafe-700 lg:grid-cols-2">
                    <p>
                        K-Means es un algoritmo no supervisado que asigna cada cliente al centroide más cercano.
                        Antes de calcular distancias, el sistema aplica normalización Min-Max para que montos,
                        frecuencias y días de recencia sean comparables.
                    </p>
                    <p>
                        Se utilizan pedidos confirmados, pagos aceptados, ticket promedio, frecuencia, recencia,
                        productos distintos y porcentaje de pago. Las etiquetas comerciales se interpretan después
                        del agrupamiento y sirven como apoyo, no como una decisión automática definitiva.
                    </p>
                </div>
            </SectionCard>
        </InteligenciaVentasLayout>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-cafe-700">{label}</span>
            {children}
        </label>
    );
}

function ClusterMetric({ label, value, className = '' }) {
    return (
        <div className={`rounded-xl bg-white/65 p-3 ${className}`}>
            <dt className="text-xs font-semibold opacity-70">{label}</dt>
            <dd className="mt-1 font-bold">{value}</dd>
        </div>
    );
}

function ClusterBadge({ cluster, label }) {
    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${clusterTones[cluster] ?? clusterTones[6]}`}>
            {label}
        </span>
    );
}

function InsufficientData({ message }) {
    return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
            <ShieldAlert className="mx-auto h-9 w-9 text-amber-600" />
            <h3 className="mt-3 text-lg font-bold text-amber-900">Segmentación no disponible</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-amber-800">{message}</p>
        </div>
    );
}
