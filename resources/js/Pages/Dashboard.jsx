import ChartCard from '@/Components/Dashboard/ChartCard';
import DataTable from '@/Components/Dashboard/DataTable';
import RecentActivity from '@/Components/Dashboard/RecentActivity';
import StatCard from '@/Components/Dashboard/StatCard';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

const defaultStats = [
    {
        title: 'Ventas del dia',
        value: 'Bs 4.820',
        description: 'Ingresos registrados desde canales sociales.',
        trend: '+12%',
        tone: 'blue',
        icon: 'Bs',
    },
    {
        title: 'Pedidos pendientes',
        value: '18',
        description: 'Ordenes por confirmar o preparar.',
        trend: '+5',
        tone: 'amber',
        icon: '#',
    },
    {
        title: 'Leads nuevos',
        value: '34',
        description: 'Contactos captados hoy.',
        trend: '+9%',
        tone: 'green',
        icon: '+',
    },
    {
        title: 'Productos con bajo stock',
        value: '7',
        description: 'Items que requieren reposicion.',
        trend: 'alerta',
        tone: 'violet',
        icon: '!',
    },
];

const defaultOrders = [
    { code: 'PED-1028', customer: 'Mariana Rojas', channel: 'TikTok LIVE', status: 'Pendiente', total: 'Bs 320', date: '22/05/2026' },
    { code: 'PED-1027', customer: 'Luis Fernandez', channel: 'WhatsApp', status: 'Confirmado', total: 'Bs 180', date: '22/05/2026' },
    { code: 'PED-1026', customer: 'Camila Torres', channel: 'Instagram', status: 'En preparacion', total: 'Bs 245', date: '21/05/2026' },
    { code: 'PED-1025', customer: 'Andrea Salazar', channel: 'Facebook', status: 'Entregado', total: 'Bs 410', date: '21/05/2026' },
    { code: 'PED-1024', customer: 'Diego Vargas', channel: 'Manual', status: 'Cancelado', total: 'Bs 95', date: '20/05/2026' },
];

const defaultChannelSales = [
    { label: 'TikTok LIVE', value: 48 },
    { label: 'WhatsApp', value: 36 },
    { label: 'Instagram', value: 29 },
    { label: 'Facebook', value: 18 },
    { label: 'Manual', value: 12 },
];

const defaultActivities = [
    { title: 'Nuevo lead registrado desde TikTok LIVE', time: 'Hace 8 minutos' },
    { title: 'Pedido confirmado por WhatsApp', time: 'Hace 18 minutos' },
    { title: 'Producto marcado con bajo stock', time: 'Hace 32 minutos' },
    { title: 'Cliente actualizado', time: 'Hace 46 minutos' },
    { title: 'Venta registrada desde Instagram', time: 'Hace 1 hora' },
];

export default function Dashboard({
    auth,
    stats = defaultStats,
    recentOrders = defaultOrders,
    channelSales = defaultChannelSales,
    activities = defaultActivities,
}) {
    return (
        <DashboardLayout user={auth?.user}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold text-blue-600">AKINOMASS CRM ecommerce</p>
                            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                Control comercial multicanal
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Centraliza clientes, leads, pedidos, inventario y ventas provenientes de TikTok LIVE,
                                WhatsApp, Instagram, Facebook y registros manuales.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:min-w-80">
                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-xs font-semibold text-slate-500">Canales activos</p>
                                <p className="mt-2 text-2xl font-bold text-slate-900">5</p>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-4">
                                <p className="text-xs font-semibold text-blue-700">Conversion hoy</p>
                                <p className="mt-2 text-2xl font-bold text-blue-700">23%</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <ChartCard data={channelSales} />
                    </div>
                    <RecentActivity items={activities} />
                </section>

                <DataTable orders={recentOrders} />
            </div>
        </DashboardLayout>
    );
}
