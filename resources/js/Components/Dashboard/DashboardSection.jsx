export default function DashboardSection({ title, accent = 'oliva', children, action }) {
    const accents = {
        oliva: 'bg-oliva-600',
        terracota: 'bg-terracota-500',
        green: 'bg-green-600',
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-3 text-lg font-bold text-cafe-900">
                    <span className={`h-7 w-1 rounded-full ${accents[accent] || accents.oliva}`} />
                    {title}
                </h3>
                {action}
            </div>
            {children}
        </section>
    );
}
