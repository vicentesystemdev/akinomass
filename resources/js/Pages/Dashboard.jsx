import ChartCard from '@/Components/Dashboard/ChartCard';
import DataTable from '@/Components/Dashboard/DataTable';
import RecentActivity from '@/Components/Dashboard/RecentActivity';
import StatCard from '@/Components/Dashboard/StatCard';
import QuickActionCard from '@/Components/UI/QuickActionCard';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

const defaultStats = [
    {
        title: 'Ventas del dia',
        value: 'Bs 4.820',
        description: 'Ingresos registrados desde canales sociales.',
        trend: '+12%',
        trendType: 'positive',
        tone: 'clay',
        icon: 'Bs',
    },
    {
        title: 'Pedidos pendientes',
        value: '18',
        description: 'Ordenes por confirmar, preparar o despachar.',
        trend: '+5 hoy',
        trendType: 'warning',
        tone: 'earth',
        icon: '#',
    },
    {
        title: 'Leads nuevos',
        value: '34',
        description: 'Contactos captados por campanas y lives.',
        trend: '+9%',
        trendType: 'positive',
        tone: 'green',
        icon: '+',
    },
    {
        title: 'Productos con bajo stock',
        value: '7',
        description: 'Items que requieren reposicion comercial.',
        trend: 'alerta',
        trendType: 'warning',
        tone: 'red',
        icon: '!',
    },
    {
        title: 'Conversion estimada',
        value: '23%',
        description: 'Relacion entre leads y pedidos confirmados.',
        trend: '+3.1%',
        trendType: 'positive',
        tone: 'blue',
        icon: '%',
    },
    {
        title: 'Canales activos',
        value: '5',
        description: 'TikTok, WhatsApp, Instagram, Facebook y manual.',
        trend: 'online',
        trendType: 'neutral',
        tone: 'neutral',
        icon: 'ON',
    },
];

const defaultOrders = [
    { code: 'PED-1028', customer: 'Mariana Rojas', channel: 'TikTok LIVE', status: 'Pendiente', paymentStatus: 'Pendiente', total: 'Bs 320', date: '23/05/2026', href: '#' },
    { code: 'PED-1027', customer: 'Luis Fernandez', channel: 'WhatsApp', status: 'Confirmado', paymentStatus: 'Pagado', total: 'Bs 180', date: '23/05/2026', href: '#' },
    { code: 'PED-1026', customer: 'Camila Torres', channel: 'Instagram', status: 'En preparacion', paymentStatus: 'Observado', total: 'Bs 245', date: '22/05/2026', href: '#' },
    { code: 'PED-1025', customer: 'Andrea Salazar', channel: 'Facebook', status: 'Entregado', paymentStatus: 'Pagado', total: 'Bs 410', date: '22/05/2026', href: '#' },
    { code: 'PED-1024', customer: 'Diego Vargas', channel: 'Manual', status: 'Cancelado', paymentStatus: 'Rechazado', total: 'Bs 95', date: '21/05/2026', href: '#' },
];

const defaultChannelSales = [
    { label: 'TikTok LIVE', shortLabel: 'TT', value: 1680 },
    { label: 'WhatsApp', shortLabel: 'WA', value: 1260 },
    { label: 'Instagram', shortLabel: 'IG', value: 980 },
    { label: 'Facebook', shortLabel: 'FB', value: 620 },
    { label: 'Manual', shortLabel: 'MN', value: 280 },
];

const defaultActivities = [
    {
        icon: 'L',
        title: 'Nuevo lead registrado desde TikTok LIVE',
        description: 'Contacto interesado en jeans wide leg y envio nacional.',
        time: 'Hace 8 min',
        tone: 'info',
    },
    {
        icon: 'P',
        title: 'Pedido confirmado por WhatsApp',
        description: 'La orden PED-1027 paso a preparacion comercial.',
        time: 'Hace 18 min',
        tone: 'success',
    },
    {
        icon: 'S',
        title: 'Producto marcado con bajo stock',
        description: 'Polera basica algodon llego al umbral minimo.',
        time: 'Hace 32 min',
        tone: 'warning',
    },
    {
        icon: 'C',
        title: 'Cliente actualizado',
        description: 'Se completo telefono, canal favorito y ciudad.',
        time: 'Hace 46 min',
        tone: 'neutral',
    },
    {
        icon: 'V',
        title: 'Venta registrada desde Instagram',
        description: 'Nueva venta de outfit casual femenino.',
        time: 'Hace 1 h',
        tone: 'success',
    },
    {
        icon: '!',
        title: 'Pago observado pendiente de revision',
        description: 'Comprobante requiere validacion antes del despacho.',
        time: 'Hace 2 h',
        tone: 'warning',
    },
];

const channelSummary = [
    { label: 'TikTok LIVE', leads: 52, orders: 21, conversion: '40%', tone: 'info' },
    { label: 'WhatsApp', leads: 39, orders: 18, conversion: '46%', tone: 'success' },
    { label: 'Instagram', leads: 31, orders: 12, conversion: '39%', tone: 'warning' },
    { label: 'Facebook', leads: 18, orders: 7, conversion: '38%', tone: 'info' },
];

const funnel = [
    { label: 'Leads captados', value: 140, width: '100%' },
    { label: 'Contactados', value: 96, width: '74%' },
    { label: 'Pedidos creados', value: 58, width: '48%' },
    { label: 'Ventas pagadas', value: 39, width: '34%' },
];

export default function Dashboard({
    auth,
    stats = defaultStats,
    recentOrders = defaultOrders,
    channelSales = defaultChannelSales,
    activities = defaultActivities,
}) {
    const safeHref = (routeName, fallback = '#') => {
        try {
            if (typeof route === 'function') {
                const router = route();

                if (router?.has) {
                    return router.has(routeName) ? route(routeName) : fallback;
                }

                return route(routeName);
            }
        } catch (error) {
            return fallback;
        }

        return fallback;
    };

    const quickActions = [
        { title: 'Registrar lead', description: 'Captura contacto desde live o redes.', href: safeHref('leads.create', '#'), icon: '+', tone: 'earth' },
        { title: 'Crear pedido', description: 'Prepara una orden comercial.', href: '#', icon: '#', tone: 'clay' },
        { title: 'Agregar producto', description: 'Publica una prenda o variante.', href: safeHref('productos.create', '#'), icon: 'P', tone: 'leaf' },
        { title: 'Registrar pago', description: 'Controla pagos observados.', href: '#', icon: 'Bs', tone: 'sky' },
        { title: 'Ver reportes', description: 'Analiza ventas y conversion.', href: '#', icon: '%', tone: 'stone' },
    ];

    return (
        <DashboardLayout user={auth?.user}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-[#3C473A] p-6 text-white shadow-xl shadow-[#3C473A]/20 dark:bg-[#252D24] dark:shadow-black/30 sm:p-8">
                    <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-[#D77A61]/30 to-transparent lg:block" />
                    <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#D77A61]/20 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#F2B39F]">
                                AKINOMASS CRM ecommerce
                            </p>
                            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                Operacion comercial multicanal
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#FDF6F0]/70">
                                Gestiona clientes, leads, pedidos, inventario y pagos desde TikTok LIVE,
                                WhatsApp, Instagram, Facebook y ventas manuales con una vista preparada
                                para datos reales de Laravel/Inertia.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={safeHref('leads.create', '#')}
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#D77A61] px-5 text-sm font-black text-white shadow-lg shadow-black/10 transition hover:bg-[#c96f58]"
                            >
                                Registrar lead
                            </Link>
                            <Link
                                href={safeHref('productos.index', '/productos')}
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 px-5 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/20"
                            >
                                Ver catalogo
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
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

                <section className="grid gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <DataTable orders={recentOrders} />
                    </div>

                    <SectionCard title="Acciones rapidas" description="Atajos preparados para conectar rutas reales.">
                        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-1">
                            {quickActions.map((action) => (
                                <QuickActionCard key={action.title} {...action} />
                            ))}
                        </div>
                    </SectionCard>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <SectionCard title="Resumen por canal" description="Lectura comercial de captacion y conversion.">
                        <div className="divide-y divide-[#EADFD6]/70 dark:divide-white/10">
                            {channelSummary.map((channel) => (
                                <div key={channel.label} className="grid grid-cols-4 items-center gap-3 px-5 py-4">
                                    <div className="col-span-4 sm:col-span-1">
                                        <p className="font-black text-[#2B221E] dark:text-[#FDF6F0]">{channel.label}</p>
                                    </div>
                                    <p className="text-sm text-[#2B221E]/60 dark:text-[#FDF6F0]/55">
                                        <span className="font-black text-[#2B221E] dark:text-[#FDF6F0]">{channel.leads}</span> leads
                                    </p>
                                    <p className="text-sm text-[#2B221E]/60 dark:text-[#FDF6F0]/55">
                                        <span className="font-black text-[#2B221E] dark:text-[#FDF6F0]">{channel.orders}</span> pedidos
                                    </p>
                                    <StatusBadge tone={channel.tone}>{channel.conversion}</StatusBadge>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Embudo CRM" description="Flujo simulado desde lead hasta venta pagada.">
                        <div className="space-y-4 p-5">
                            {funnel.map((step) => (
                                <div key={step.label}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-bold text-[#2B221E]/70 dark:text-[#FDF6F0]/65">{step.label}</span>
                                        <span className="font-black text-[#2B221E] dark:text-[#FDF6F0]">{step.value}</span>
                                    </div>
                                    <div className="h-10 rounded-2xl bg-[#FDF6F0] ring-1 ring-[#EADFD6]/80 dark:bg-white/[0.03] dark:ring-white/10">
                                        <div
                                            className="flex h-10 items-center justify-end rounded-2xl bg-[#D77A61] px-3 text-xs font-black text-white shadow-sm"
                                            style={{ width: step.width }}
                                        >
                                            {step.width}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </section>
            </div>
        </DashboardLayout>
    );
}
