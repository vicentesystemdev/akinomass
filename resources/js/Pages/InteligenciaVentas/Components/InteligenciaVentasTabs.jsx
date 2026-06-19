import { Link } from '@inertiajs/react';
import { Boxes, Gauge, LayoutDashboard, Lightbulb, PackageSearch, Settings, Tags, TrendingUp, UsersRound } from 'lucide-react';

const tabs = [
    { label: 'Resumen', routeName: 'inteligencia-ventas.index', icon: LayoutDashboard },
    { label: 'Categorias', routeName: 'inteligencia-ventas.categorias', icon: Tags },
    { label: 'Productos', routeName: 'inteligencia-ventas.productos', icon: PackageSearch },
    { label: 'Abastecimiento', routeName: 'inteligencia-ventas.abastecimiento', icon: Boxes },
    { label: 'Canales', routeName: 'inteligencia-ventas.canales', icon: Gauge },
    { label: 'Segmentacion', routeName: 'inteligencia-ventas.segmentacion-clientes', icon: UsersRound },
    { label: 'Regresion lineal', routeName: 'inteligencia-ventas.tendencias-regresion', icon: TrendingUp },
    { label: 'Conclusiones', routeName: 'inteligencia-ventas.conclusiones', icon: Lightbulb },
    { label: 'Configuracion', routeName: 'inteligencia-ventas.configuracion', icon: Settings },
];

export default function InteligenciaVentasTabs() {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white p-1 shadow-card">
            <div className="flex min-w-max gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = route().current(tab.routeName);

                    return (
                        <Link
                            key={tab.routeName}
                            href={route(tab.routeName)}
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                active
                                    ? 'bg-terracota-500 text-white shadow-sm'
                                    : 'text-cafe-700 hover:bg-crema-100 hover:text-cafe-950'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
