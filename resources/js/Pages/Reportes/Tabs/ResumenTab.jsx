import SectionCard from '@/Components/UI/SectionCard';
import KpiCard from '@/Components/Charts/KpiCard';
import AreaTrendChart from '@/Components/Charts/AreaTrendChart';
import { formatBOB } from '@/lib/formatters';

export default function ResumenTab({ reportes }) {
    const resumen = reportes?.resumen || {};
    const ventasPorFecha = reportes?.ventas_por_fecha || [];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Clientes"
                    value={resumen.total_clientes || 0}
                    variant="oliva"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                />
                <KpiCard
                    title="Total Leads"
                    value={resumen.total_leads || 0}
                    variant="cyan"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                />
                <KpiCard
                    title="Total Pedidos"
                    value={resumen.total_pedidos || 0}
                    variant="terracota"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    }
                />
                <KpiCard
                    title="Monto Pagado"
                    value={formatBOB(resumen.monto_total_pagado)}
                    variant="green"
                    subtitle={`${resumen.total_pagos || 0} pagos registrados`}
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KpiCard
                    title="Sesiones Live"
                    value={resumen.total_sesiones_live || 0}
                    variant="amber"
                />
                <KpiCard
                    title="Interacciones Live"
                    value={resumen.total_interacciones_live || 0}
                    variant="oliva"
                />
            </div>

            <SectionCard
                title="Evolución de ventas"
                subtitle="Montos pagados por fecha — valores visibles en cada punto"
            >
                {ventasPorFecha.length > 0 ? (
                    <AreaTrendChart data={ventasPorFecha} formatValue={formatBOB} height={340} />
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400 text-sm rounded-xl bg-gray-50">
                        No hay datos de ventas para el período seleccionado
                    </div>
                )}
            </SectionCard>
        </div>
    );
}
