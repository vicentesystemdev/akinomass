import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MetricCard from '@/Components/UI/MetricCard';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function Dashboard({ metricas }) {
    const amountFormatter = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
    });


    return (
        <AuthenticatedLayout header="Dashboard Comercial">
            <Head title="Dashboard Comercial" />

            {/* Hero Section */}
            <div className="mb-10">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-olive p-10 shadow-2xl">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-terracotta/20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-white/5 blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Resumen de Operaciones
                        </span>
                        <h1 className="text-4xl font-black text-terracotta mb-2 tracking-tight">
                            ¡Bienvenido de vuelta!
                        </h1>
                        <p className="text-terracotta/60 text-lg max-w-xl font-medium">
                            Aquí tienes el pulso comercial de <span className="text-terracotta font-bold">AKINOMASS</span> para el día de hoy. 
                            Revisa tus ventas, leads e inventario en un solo lugar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                <MetricCard 
                    title="Ventas Totales" 
                    value={amountFormatter.format(metricas.pagos.monto_total_pagado)} 
                    color="terracotta"
                    trend="up"
                    trendValue="12%"
                />
                <MetricCard 
                    title="Pedidos Confirmados" 
                    value={metricas.pedidos.confirmado} 
                    color="olive"
                />
                <MetricCard 
                    title="Leads Nuevos" 
                    value={metricas.leads.nuevos} 
                    color="cream"
                />
                <MetricCard 
                    title="Interacciones Live" 
                    value={metricas.live_sales.interacciones_totales} 
                    color="coffee"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* CRM & Funnel Summary */}
                    <SectionCard 
                        title="Embudo de Conversión" 
                        subtitle="Seguimiento de leads y clientes activos"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-6 rounded-3xl bg-[#FDF6F0] border border-olive/5">
                                <span className="text-[10px] font-black text-olive/40 uppercase tracking-widest block mb-1">Total Leads</span>
                                <span className="text-3xl font-black text-olive">{metricas.leads.total}</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-[#FDF6F0] border border-olive/5">
                                <span className="text-[10px] font-black text-olive/40 uppercase tracking-widest block mb-1">Convertidos</span>
                                <span className="text-3xl font-black text-olive">{metricas.leads.convertidos}</span>
                                <StatusBadge type="success" className="ml-2">+{Math.round((metricas.leads.convertidos / metricas.leads.total) * 100) || 0}%</StatusBadge>
                            </div>
                            <div className="p-6 rounded-3xl bg-terracotta text-terracotta shadow-xl">
                                <span className="text-[10px] font-black text-terracotta/40 uppercase tracking-widest block mb-1 text-terracotta/50">Clientes Reales</span>
                                <span className="text-3xl font-black">{metricas.clientes.total}</span>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Sales Channels Table */}
                    <SectionCard title="Ventas por Canal" subtitle="Distribución del volumen comercial por plataforma">
                        <div className="overflow-hidden rounded-2xl border border-olive/5">
                            <table className="w-full text-left">
                                <thead className="bg-[#3C473A]/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-olive/60">Canal de Venta</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-olive/60 text-right">Total Pedidos</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-olive/60 text-center">Rendimiento</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-olive/5">
                                    {metricas.ventas_por_canal.map((item) => (
                                        <tr key={item.etiqueta} className="hover:bg-[#FDF6F0]/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-coffee uppercase tracking-tight">{item.etiqueta}</td>
                                            <td className="px-6 py-4 text-sm font-black text-olive text-right">{item.total}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="w-full bg-olive/5 rounded-full h-1.5 max-w-[100px] mx-auto">
                                                    <div 
                                                        className="bg-terracotta h-1.5 rounded-full" 
                                                        style={{ width: `${Math.min(100, (item.total / metricas.pedidos.total) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SectionCard>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Inventory Status */}
                    <SectionCard title="Estado de Inventario">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDF6F0]">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-olive/50 uppercase tracking-wider">Productos Totales</span>
                                    <span className="text-2xl font-black text-olive">{metricas.productos.total}</span>
                                </div>
                                <StatusBadge type="primary">Catálogo</StatusBadge>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-red-100 bg-red-50/30">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Stock Bajo</span>
                                    <span className="text-2xl font-black text-red-600">{metricas.productos.stock_bajo}</span>
                                </div>
                                <StatusBadge type="danger">Revisar</StatusBadge>
                            </div>

                            <div className="pt-2">
                                <h4 className="text-[10px] font-black text-olive/30 uppercase tracking-[0.2em] mb-4">Métricas de Pago</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-coffee">Pagos Completados</span>
                                        <span className="font-black text-olive">{metricas.pagos.pagado}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-coffee/60">Pendientes de Pago</span>
                                        <span className="font-black text-terracotta">{metricas.pagos.pendiente}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Live Sales Mini Panel */}
                    <SectionCard title="Sesiones Live">
                        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-terracotta text-terracotta shadow-xl">
                            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center animate-pulse">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-terracotta/40 uppercase tracking-widest">En Vivo ahora</span>
                                <span className="text-xl font-black">{metricas.live_sales.sesiones_en_vivo_o_programadas} Activas</span>
                            </div>
                        </div>
                        <p className="text-xs text-[#3C473A]/60 leading-relaxed font-medium">
                            Tus sesiones en vivo están generando un alto nivel de interacción. Considera aumentar el stock de los productos más comentados.
                        </p>
                    </SectionCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

