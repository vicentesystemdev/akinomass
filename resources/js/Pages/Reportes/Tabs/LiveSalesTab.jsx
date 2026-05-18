import SectionCard from '@/Components/UI/SectionCard';
import PieChartComponent from '@/Components/Charts/PieChart';
import VerticalBarChart from '@/Components/Charts/VerticalBarChart';
import KpiCard from '@/Components/Charts/KpiCard';
import HorizontalBar from '@/Components/Charts/HorizontalBar';

export default function LiveSalesTab({ reportes }) {
    const sesionesPorEstado = (reportes?.sesiones_live_por_estado || []).map((s) => ({
        name: s.estado.charAt(0).toUpperCase() + s.estado.slice(1),
        value: s.total,
    }));
    const interaccionesPorSesion = (reportes?.interacciones_por_sesion || []).map((s) => ({
        name: s.sesion.length > 25 ? s.sesion.substring(0, 25) + '...' : s.sesion,
        interacciones: s.total_interacciones,
    }));
    const tasaLiveLead = reportes?.tasa_conversion_live_lead || 0;
    const tasaLivePedido = reportes?.tasa_conversion_live_pedido || 0;
    const tasaLeadPedido = reportes?.tasa_conversion_lead_pedido || 0;
    const leadsDesdeLive = reportes?.leads_desde_live || 0;
    const pedidosDesdeLive = reportes?.pedidos_desde_live || 0;

    return (
        <div className="space-y-6">
            {/* KPIs de conversión */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard
                    title="Leads desde Live"
                    value={leadsDesdeLive}
                    variant="oliva"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
                <KpiCard
                    title="Pedidos desde Live"
                    value={pedidosDesdeLive}
                    variant="terracota"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                />
                <KpiCard
                    title="Conv. Live→Lead"
                    value={`${tasaLiveLead}%`}
                    variant="green"
                    subtitle="Interacciones convertidas a lead"
                />
                <KpiCard
                    title="Conv. Live→Pedido"
                    value={`${tasaLivePedido}%`}
                    variant="cyan"
                    subtitle="Interacciones convertidas a pedido"
                />
                <KpiCard
                    title="Conv. Lead→Pedido"
                    value={`${tasaLeadPedido}%`}
                    variant="amber"
                    subtitle="Leads que se convirtieron en pedido"
                />
            </div>

            {/* Funnel de conversión visual */}
            <SectionCard title="Embudo de Conversión Live Sales">
                <div className="flex items-center justify-center gap-4 py-6">
                    <div className="text-center">
                        <div className="w-32 h-20 bg-oliva-100 rounded-xl flex items-center justify-center border-2 border-oliva-300">
                            <div>
                                <p className="text-2xl font-bold text-oliva-700">{reportes?.resumen?.total_interacciones_live || 0}</p>
                                <p className="text-xs text-oliva-600">Interacciones</p>
                            </div>
                        </div>
                    </div>
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="text-center">
                        <div className="w-32 h-20 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-300">
                            <div>
                                <p className="text-2xl font-bold text-green-700">{leadsDesdeLive}</p>
                                <p className="text-xs text-green-600">Leads</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{tasaLiveLead}%</p>
                    </div>
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="text-center">
                        <div className="w-32 h-20 bg-terracota-100 rounded-xl flex items-center justify-center border-2 border-terracota-300">
                            <div>
                                <p className="text-2xl font-bold text-terracota-700">{pedidosDesdeLive}</p>
                                <p className="text-xs text-terracota-600">Pedidos</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{tasaLivePedido}%</p>
                    </div>
                </div>
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Sesiones por Estado">
                    <PieChartComponent data={sesionesPorEstado} height={250} innerRadius={50} />
                </SectionCard>

                <SectionCard title="Interacciones por Sesión" subtitle="Top sesiones por cantidad de interacciones">
                    <VerticalBarChart
                        data={interaccionesPorSesion}
                        dataKey="interacciones"
                        labelKey="name"
                        height={250}
                        color="#0891B2"
                    />
                </SectionCard>
            </div>
        </div>
    );
}
