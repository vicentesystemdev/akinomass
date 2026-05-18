import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import ResumenTab from './Tabs/ResumenTab';
import VentasTab from './Tabs/VentasTab';
import PedidosTab from './Tabs/PedidosTab';
import PagosTab from './Tabs/PagosTab';
import CrmTab from './Tabs/CrmTab';
import InventarioTab from './Tabs/InventarioTab';
import LiveSalesTab from './Tabs/LiveSalesTab';

const tabs = [
    { id: 'resumen', label: 'Resumen', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'ventas', label: 'Ventas', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'pedidos', label: 'Pedidos', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'pagos', label: 'Pagos', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'crm', label: 'CRM', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'inventario', label: 'Inventario', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'livesales', label: 'Live Sales', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
];

export default function Index({ reportes }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [filters, setFilters] = useState({
        fecha_inicio: reportes?.filtros?.fecha_inicio || '',
        fecha_fin: reportes?.filtros?.fecha_fin || '',
        estado_pedido: reportes?.filtros?.estado_pedido || '',
        estado_pago: reportes?.filtros?.estado_pago || '',
        estado_lead: reportes?.filtros?.estado_lead || '',
        cod_canal_venta: reportes?.filtros?.cod_canal_venta || '',
        cod_tipo_flujo_comercial: reportes?.filtros?.cod_tipo_flujo_comercial || '',
    });

    const handleFilter = () => {
        router.get(route('reportes.index'), filters, { preserveState: true });
    };

    const handleClear = () => {
        setFilters({
            fecha_inicio: '', fecha_fin: '', estado_pedido: '', estado_pago: '',
            estado_lead: '', cod_canal_venta: '', cod_tipo_flujo_comercial: '',
        });
        router.get(route('reportes.index'), {}, { preserveState: true });
    };

    const handleExportPdf = () => {
        window.print();
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-xs font-medium text-gray-500 mb-1";

    const estadoPedidoOptions = ['borrador', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado', 'devuelto'];
    const estadoPagoOptions = ['pendiente', 'pagado', 'observado', 'rechazado', 'reembolsado'];
    const estadoLeadOptions = ['nuevo', 'contactado', 'interesado', 'pendiente_pago', 'convertido', 'perdido', 'descartado'];

    const renderTab = () => {
        switch (activeTab) {
            case 'resumen': return <ResumenTab reportes={reportes} />;
            case 'ventas': return <VentasTab reportes={reportes} />;
            case 'pedidos': return <PedidosTab reportes={reportes} />;
            case 'pagos': return <PagosTab reportes={reportes} />;
            case 'crm': return <CrmTab reportes={reportes} />;
            case 'inventario': return <InventarioTab reportes={reportes} />;
            case 'livesales': return <LiveSalesTab reportes={reportes} />;
            default: return <ResumenTab reportes={reportes} />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Reportes"
                    subtitle="Análisis comercial y operativo por módulo"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Reportes' },
                    ]}
                    actions={
                        <SecondaryButton onClick={handleExportPdf}>
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Exportar PDF
                        </SecondaryButton>
                    }
                />
            }
        >
            <Head title="Reportes" />

            <div className="space-y-6">
                {/* Filtros globales */}
                <SectionCard>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
                        <div>
                            <label className={labelClass}>Fecha Inicio</label>
                            <input
                                type="date"
                                value={filters.fecha_inicio}
                                onChange={(e) => setFilters((p) => ({ ...p, fecha_inicio: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Fecha Fin</label>
                            <input
                                type="date"
                                value={filters.fecha_fin}
                                onChange={(e) => setFilters((p) => ({ ...p, fecha_fin: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Estado Pedido</label>
                            <select
                                value={filters.estado_pedido}
                                onChange={(e) => setFilters((p) => ({ ...p, estado_pedido: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {estadoPedidoOptions.map((e) => (
                                    <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Estado Pago</label>
                            <select
                                value={filters.estado_pago}
                                onChange={(e) => setFilters((p) => ({ ...p, estado_pago: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {estadoPagoOptions.map((e) => (
                                    <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Estado Lead</label>
                            <select
                                value={filters.estado_lead}
                                onChange={(e) => setFilters((p) => ({ ...p, estado_lead: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {estadoLeadOptions.map((e) => (
                                    <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Canal</label>
                            <select
                                value={filters.cod_canal_venta}
                                onChange={(e) => setFilters((p) => ({ ...p, cod_canal_venta: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {(reportes?.opciones_filtros?.canales_venta || []).map((c) => (
                                    <option key={c.cod_canal_venta} value={c.cod_canal_venta}>{c.nombre_can}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Flujo</label>
                            <select
                                value={filters.cod_tipo_flujo_comercial}
                                onChange={(e) => setFilters((p) => ({ ...p, cod_tipo_flujo_comercial: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Todos</option>
                                {(reportes?.opciones_filtros?.tipos_flujo_comercial || []).map((t) => (
                                    <option key={t.cod_tipo_flujo_comercial} value={t.cod_tipo_flujo_comercial}>{t.nombre_tip}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <PrimaryActionButton onClick={handleFilter} size="sm" className="flex-1">
                                Filtrar
                            </PrimaryActionButton>
                            <SecondaryButton onClick={handleClear} className="px-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </SecondaryButton>
                        </div>
                    </div>
                </SectionCard>

                {/* Tabs de módulos */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-1 overflow-x-auto pb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-terracota-500 text-terracota-600'
                                        : 'border-transparent text-gray-500 hover:text-cafe-700 hover:border-gray-300'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Contenido del tab activo */}
                {renderTab()}
            </div>
        </AuthenticatedLayout>
    );
}
