import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import LiveSyncBadge from '@/Components/UI/LiveSyncBadge';
import SecondaryButton from '@/Components/SecondaryButton';
import ReportFilterBar from '@/Components/Reports/ReportFilterBar';
import ReportTabs from '@/Components/Reports/ReportTabs';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useInertiaPoll } from '@/hooks/useInertiaPoll';

import ResumenTab from './Tabs/ResumenTab';
import VentasTab from './Tabs/VentasTab';
import PedidosTab from './Tabs/PedidosTab';
import PagosTab from './Tabs/PagosTab';
import CrmTab from './Tabs/CrmTab';
import InventarioTab from './Tabs/InventarioTab';
import LiveSalesTab from './Tabs/LiveSalesTab';

export default function Index({ reportes }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [isApplyingFilters, setIsApplyingFilters] = useState(false);

    const initialFilters = useMemo(
        () => ({
            fecha_inicio: reportes?.filtros?.fecha_inicio || '',
            fecha_fin: reportes?.filtros?.fecha_fin || '',
            estado_pedido: reportes?.filtros?.estado_pedido || '',
            estado_pago: reportes?.filtros?.estado_pago || '',
            estado_lead: reportes?.filtros?.estado_lead || '',
            cod_canal_venta: reportes?.filtros?.cod_canal_venta || '',
            cod_tipo_flujo_comercial: reportes?.filtros?.cod_tipo_flujo_comercial || '',
        }),
        [reportes?.filtros],
    );

    const { lastUpdated, isRefreshing, refresh } = useInertiaPoll(['reportes'], 20000, true);

    const renderTab = () => {
        switch (activeTab) {
            case 'ventas':
                return <VentasTab reportes={reportes} />;
            case 'pedidos':
                return <PedidosTab reportes={reportes} />;
            case 'pagos':
                return <PagosTab reportes={reportes} />;
            case 'crm':
                return <CrmTab reportes={reportes} />;
            case 'inventario':
                return <InventarioTab reportes={reportes} />;
            case 'livesales':
                return <LiveSalesTab reportes={reportes} />;
            default:
                return <ResumenTab reportes={reportes} />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Reportes"
                    subtitle="Análisis comercial con filtros intuitivos y actualización automática"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Reportes' },
                    ]}
                    actions={
                        <div className="flex flex-wrap items-center gap-3">
                            <LiveSyncBadge
                                isRefreshing={isRefreshing || isApplyingFilters}
                                lastUpdated={lastUpdated}
                                onRefresh={refresh}
                            />
                            <SecondaryButton onClick={() => window.print()}>
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                Exportar PDF
                            </SecondaryButton>
                        </div>
                    }
                />
            }
        >
            <Head title="Reportes" />

            <div className="space-y-6">
                <ReportFilterBar
                    initialFilters={initialFilters}
                    opcionesFiltros={reportes?.opciones_filtros}
                    onApplying={setIsApplyingFilters}
                />

                <ReportTabs activeTab={activeTab} onChange={setActiveTab} />

                <div key={activeTab} className={isRefreshing ? 'opacity-90 transition-opacity' : ''}>
                    {renderTab()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
