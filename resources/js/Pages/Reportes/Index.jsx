import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import SectionCard from '@/Components/UI/SectionCard';
import MetricCard from '@/Components/UI/MetricCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import EmptyState from '@/Components/UI/EmptyState';

export default function Index({ reportes }) {
    const { auth } = usePage().props;
    const [filters, setFilters] = useState({
        fecha_inicio: reportes?.filtros?.fecha_inicio || '',
        fecha_fin: reportes?.filtros?.fecha_fin || '',
        estado_pedido: reportes?.filtros?.estado_pedido || '',
        estado_pago: reportes?.filtros?.estado_pago || '',
        estado_lead: reportes?.filtros?.estado_lead || '',
        cod_canal_venta: reportes?.filtros?.cod_canal_venta || '',
        cod_tipo_flujo_comercial: reportes?.filtros?.cod_tipo_flujo_comercial || '',
    });

    const amountFormatter = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    });

    const submit = (e) => {
        e.preventDefault();
        router.get(route('reportes.index'), filters, { preserveState: true });
    };

    const clearFilters = () => {
        const emptyFilters = {
            fecha_inicio: '',
            fecha_fin: '',
            estado_pedido: '',
            estado_pago: '',
            estado_lead: '',
            cod_canal_venta: '',
            cod_tipo_flujo_comercial: '',
        };
        setFilters(emptyFilters);
        router.get(route('reportes.index'), emptyFilters);
    };

    // Calculate summary metrics
    const metrics = useMemo(() => {
        const totalVentas = (reportes?.ventas_por_fecha || []).reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
        const totalPedidos = (reportes?.pedidos_por_estado || []).reduce((acc, curr) => acc + (curr.total || 0), 0);
        const totalLeads = (reportes?.leads_por_estado || []).reduce((acc, curr) => acc + (curr.total || 0), 0);
        const stockBajo = (reportes?.productos_stock_bajo || []).length;
        
        return { totalVentas, totalPedidos, totalLeads, stockBajo };
    }, [reportes]);

    const getStatusType = (status) => {
        const s = status?.toLowerCase() || '';
        if (['pagado', 'confirmado', 'entregado', 'completado', 'activo'].includes(s)) return 'success';
        if (['pendiente', 'en preparación', 'observado'].includes(s)) return 'warning';
        if (['cancelado', 'rechazado', 'agotado', 'error'].includes(s)) return 'danger';
        if (['enviado', 'en proceso'].includes(s)) return 'info';
        return 'neutral';
    };

    return (
        <AuthenticatedLayout header="Reportes Comerciales">
            <Head title="Reportes Comerciales" />

            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-coffee tracking-tight">Reportes comerciales</h1>
                <p className="text-olive/60 mt-1 font-medium">Analiza ventas, pedidos, pagos, leads e inventario desde una vista consolidada.</p>
            </div>

            {/* Filters Section */}
            <div className="mb-10">
                <SectionCard title="Filtros de Análisis" subtitle="Refina los datos para obtener reportes más precisos.">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Dates */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-olive/40 px-1">Fecha Inicio</label>
                                <input 
                                    type="date" 
                                    value={filters.fecha_inicio}
                                    onChange={(e) => setFilters(p => ({ ...p, fecha_inicio: e.target.value }))}
                                    className="w-full rounded-xl border-olive/5 bg-[#FDF6F0] focus:border-terracotta focus:ring-0 text-sm font-bold text-coffee"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-olive/40 px-1">Fecha Fin</label>
                                <input 
                                    type="date" 
                                    value={filters.fecha_fin}
                                    onChange={(e) => setFilters(p => ({ ...p, fecha_fin: e.target.value }))}
                                    className="w-full rounded-xl border-olive/5 bg-[#FDF6F0] focus:border-terracotta focus:ring-0 text-sm font-bold text-coffee"
                                />
                            </div>

                            {/* Statuses */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-olive/40 px-1">Estado Pedido</label>
                                <input 
                                    type="text" 
                                    value={filters.estado_pedido}
                                    placeholder="Ej: Confirmado"
                                    onChange={(e) => setFilters(p => ({ ...p, estado_pedido: e.target.value }))}
                                    className="w-full rounded-xl border-olive/5 bg-[#FDF6F0] focus:border-terracotta focus:ring-0 text-sm font-bold text-coffee"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-olive/40 px-1">Canal de Venta</label>
                                <select 
                                    value={filters.cod_canal_venta} 
                                    onChange={(e) => setFilters(p => ({ ...p, cod_canal_venta: e.target.value }))}
                                    className="w-full rounded-xl border-olive/5 bg-[#FDF6F0] focus:border-terracotta focus:ring-0 text-sm font-bold text-coffee"
                                >
                                    <option value="">Todos los canales</option>
                                    {(reportes?.opciones_filtros?.canales_venta || []).map((canal) => (
                                        <option key={canal.cod_canal_venta} value={canal.cod_canal_venta}>{canal.nombre_can}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-olive/5">
                            <button 
                                type="submit"
                                className="px-8 py-3 rounded-xl bg-terracotta text-white font-bold text-sm shadow-lg shadow-terracotta/20 hover:bg-olive transition-all duration-300"
                            >
                                Filtrar Reportes
                            </button>
                            <button 
                                type="button"
                                onClick={clearFilters}
                                className="px-8 py-3 rounded-xl bg-olive/5 text-olive font-bold text-sm hover:bg-olive/10 transition-all duration-300"
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    </form>
                </SectionCard>
            </div>

            {/* Metrics Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MetricCard title="Volumen Ventas" value={amountFormatter.format(metrics.totalVentas)} color="terracotta" />
                <MetricCard title="Total Pedidos" value={metrics.totalPedidos} color="olive" />
                <MetricCard title="Total Leads" value={metrics.totalLeads} color="coffee" />
                <MetricCard title="Stock Bajo" value={metrics.stockBajo} color={metrics.stockBajo > 0 ? 'cream' : 'olive'} />
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Ventas por Fecha */}
                <SectionCard title="Ventas por Fecha" subtitle="Desempeño diario del monto pagado">
                    {(reportes?.ventas_por_fecha?.length > 0) ? (
                        <div className="overflow-hidden rounded-2xl border border-olive/5">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-olive/5">
                                    <tr>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/40">Fecha</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/40 text-right">Monto</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/40 text-center">Volumen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-olive/5">
                                    {reportes.ventas_por_fecha.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-cream/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-coffee">{row.fecha}</td>
                                            <td className="px-6 py-4 font-black text-olive text-right">{amountFormatter.format(row.monto)}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-full bg-olive/5 rounded-full h-2 max-w-[120px] mx-auto">
                                                    <div className="bg-terracotta h-2 rounded-full" style={{ width: `${Math.min(100, (row.monto / metrics.totalVentas) * 200)}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState />}
                </SectionCard>

                {/* Pedidos por Estado */}
                <SectionCard title="Pedidos por Estado" subtitle="Distribución del flujo operativo">
                    {(reportes?.pedidos_por_estado?.length > 0) ? (
                        <div className="grid grid-cols-2 gap-4">
                            {reportes.pedidos_por_estado.map((row, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-[#FDF6F0] border border-olive/5 flex flex-col items-center text-center">
                                    <StatusBadge type={getStatusType(row.etiqueta)}>{row.etiqueta}</StatusBadge>
                                    <span className="text-3xl font-black text-coffee mt-3">{row.total}</span>
                                    <span className="text-[10px] font-black text-olive/40 uppercase tracking-widest">Pedidos</span>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState />}
                </SectionCard>

                {/* Pagos por Estado */}
                <SectionCard title="Pagos por Estado" subtitle="Resumen de transacciones financieras">
                    {(reportes?.pagos_por_estado?.length > 0) ? (
                        <div className="space-y-4">
                            {reportes.pagos_por_estado.map((row, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-olive/5 hover:bg-cream/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-2 w-2 rounded-full ${getStatusType(row.etiqueta) === 'success' ? 'bg-green-500' : 'bg-terracotta'}`}></div>
                                        <span className="font-bold text-coffee">{row.etiqueta}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-olive">{row.total}</span>
                                        <span className="text-[10px] font-black text-olive/30 uppercase tracking-widest">Pagos</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState />}
                </SectionCard>

                {/* Leads por Estado */}
                <SectionCard title="Leads por Estado" subtitle="Prospección y captación de clientes">
                    {(reportes?.leads_por_estado?.length > 0) ? (
                        <div className="overflow-hidden rounded-2xl border border-olive/5">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-olive/5">
                                    <tr>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/40">Estado</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-olive/40 text-right">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-olive/5">
                                    {reportes.leads_por_estado.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-cream/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <StatusBadge type={getStatusType(row.etiqueta)}>{row.etiqueta}</StatusBadge>
                                            </td>
                                            <td className="px-6 py-4 font-black text-coffee text-right">{row.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState />}
                </SectionCard>

                {/* Ventas por Canal */}
                <SectionCard title="Ventas por Canal" subtitle="Efectividad de los puntos de contacto">
                    {(reportes?.ventas_por_canal?.length > 0) ? (
                        <div className="space-y-4">
                            {reportes.ventas_por_canal.map((row, idx) => (
                                <div key={idx} className="group relative p-6 rounded-2xl bg-olive text-white shadow-xl overflow-hidden">
                                    <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/5 transition-transform group-hover:scale-150 duration-500"></div>
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{row.etiqueta}</span>
                                            <h4 className="text-xl font-bold mt-1 uppercase tracking-tighter">AKINOMASS <span className="text-terracotta">DIRECT</span></h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-black">{row.total}</span>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Órdenes</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState />}
                </SectionCard>

                {/* Productos más vendidos */}
                <SectionCard title="Productos más Vendidos" subtitle="Ranking de popularidad en el catálogo">
                    {(reportes?.productos_mas_vendidos?.length > 0) ? (
                        <div className="space-y-3">
                            {reportes.productos_mas_vendidos.map((row, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-olive/5 hover:shadow-md transition-all">
                                    <div className="h-10 w-10 rounded-xl bg-terracotta/10 flex items-center justify-center font-black text-terracotta">
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-coffee uppercase text-xs tracking-tight">{row.etiqueta}</h5>
                                        <p className="text-[10px] text-olive/40 font-bold uppercase tracking-widest">Catálogo Akinomass</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-black text-olive">{row.total}</span>
                                        <span className="text-[10px] ml-1 font-bold text-olive/30 uppercase">uds</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState />}
                </SectionCard>

                {/* Stock Bajo */}
                <SectionCard title="Alertas de Stock" subtitle="Productos que requieren reposición inmediata">
                    {(reportes?.productos_stock_bajo?.length > 0) ? (
                        <div className="overflow-hidden rounded-2xl border border-red-100 bg-red-50/10">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-red-50 text-red-700">
                                    <tr>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Producto</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">Actual</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">Mínimo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-100">
                                    {reportes.productos_stock_bajo.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-red-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-red-700">{row.etiqueta}</td>
                                            <td className="px-6 py-4 text-center font-black text-red-600">{row.stock_actual}</td>
                                            <td className="px-6 py-4 text-center font-bold text-red-400">{row.stock_minimo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState message="¡Excelente! Todo el stock está en niveles óptimos." />}
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}

