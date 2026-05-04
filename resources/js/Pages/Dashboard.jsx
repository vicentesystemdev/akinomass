import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <section className="rounded-3xl border border-[#eadfd6] bg-white p-8 shadow-sm">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#D77A61]">
                        Panel principal
                    </p>

                    <h1 className="mt-2 text-3xl font-black text-[#2B221E]">
                        Bienvenido a AKINOMASS
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#2B221E]/70">
                        Sistema web comercial para la gestión de catálogo, inventario,
                        clientes, leads, pedidos, pagos y reportes del emprendimiento.
                    </p>
                </section>

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <DashboardCard
                        title="Productos"
                        description="Administra prendas, precios, SKU, categorías y estado comercial."
                        href="/productos"
                        indicator="Catálogo"
                    />

                    <DashboardCard
                        title="Categorías"
                        description="Organiza los productos por grupos comerciales."
                        href="/categorias-producto"
                        indicator="Clasificación"
                    />

                    <DashboardCard
                        title="Inventario"
                        description="Controla stock actual, stock mínimo y alertas de bajo inventario."
                        href="/inventario"
                        indicator="Stock"
                    />

                    <DashboardCard
                        title="Movimientos"
                        description="Consulta entradas, salidas, ajustes y trazabilidad del inventario."
                        href="/inventario/movimientos"
                        indicator="Historial"
                    />
                </section>

                <section className="grid gap-5 lg:grid-cols-3">
                    <InfoCard
                        title="Área asignada"
                        value="Catálogo e Inventario"
                        description="Tu rama debe enfocarse en productos, categorías, inventario y movimientos."
                    />

                    <InfoCard
                        title="Rol recomendado"
                        value="Encargado de Inventario"
                        description="Usa este perfil para validar permisos específicos del módulo."
                    />

                    <InfoCard
                        title="Regla de trabajo"
                        value="Solo Frontend"
                        description="No modificar migraciones, modelos, controladores, rutas ni seeders."
                    />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

function DashboardCard({ title, description, href, indicator }) {
    return (
        <Link
            href={href}
            className="group rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D77A61]/50 hover:shadow-xl"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF6F0] text-lg font-black text-[#D77A61]">
                    {title.charAt(0)}
                </div>

                <span className="rounded-full bg-[#FDF6F0] px-3 py-1 text-xs font-bold text-[#3C473A]">
                    {indicator}
                </span>
            </div>

            <h2 className="mt-5 text-lg font-black text-[#2B221E]">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#2B221E]/65">
                {description}
            </p>

            <p className="mt-5 text-sm font-bold text-[#D77A61]">
                Ingresar →
            </p>
        </Link>
    );
}

function InfoCard({ title, value, description }) {
    return (
        <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D77A61]">
                {title}
            </p>

            <h3 className="mt-2 text-xl font-black text-[#2B221E]">
                {value}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#2B221E]/65">
                {description}
            </p>
        </div>
    );
}