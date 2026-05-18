import SectionCard from '@/Components/UI/SectionCard';
import KpiCard from '@/Components/Charts/KpiCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatBOB = (value) => {
    if (value === null || value === undefined) return 'Bs 0.00';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Bs 0.00';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
            <p className="text-xs font-medium text-cafe-700 mb-1">{label}</p>
            <p className="text-sm font-bold text-terracota-600">{formatBOB(payload[0].value)}</p>
        </div>
    );
};

export default function ResumenTab({ reportes }) {
    const resumen = reportes?.resumen || {};
    const ventasPorFecha = reportes?.ventas_por_fecha || [];

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Clientes"
                    value={resumen.total_clientes || 0}
                    variant="oliva"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <KpiCard
                    title="Total Leads"
                    value={resumen.total_leads || 0}
                    variant="cyan"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                />
                <KpiCard
                    title="Total Pedidos"
                    value={resumen.total_pedidos || 0}
                    variant="terracota"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                />
                <KpiCard
                    title="Monto Pagado"
                    value={formatBOB(resumen.monto_total_pagado)}
                    variant="green"
                    subtitle={`${resumen.total_pagos || 0} pagos registrados`}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard
                    title="Sesiones Live"
                    value={resumen.total_sesiones_live || 0}
                    variant="amber"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                />
                <KpiCard
                    title="Interacciones Live"
                    value={resumen.total_interacciones_live || 0}
                    variant="oliva"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                />
            </div>

            {/* Gráfica de ventas por fecha */}
            <SectionCard title="Evolución de Ventas" subtitle="Monto pagado por fecha">
                {ventasPorFecha.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={ventasPorFecha} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7e4" />
                            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#e5e7e4' }} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#e5e7e4' }} tickLine={false} tickFormatter={(v) => `Bs ${v}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="monto_pagado" stroke="#D77A61" fill="#D77A61" fillOpacity={0.15} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                        No hay datos de ventas para mostrar
                    </div>
                )}
            </SectionCard>
        </div>
    );
}
