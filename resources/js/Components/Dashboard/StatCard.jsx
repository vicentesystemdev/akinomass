export default function StatCard({ title, value, description, trend, tone = 'blue', icon }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-emerald-50 text-emerald-700',
        violet: 'bg-violet-50 text-violet-700',
        amber: 'bg-amber-50 text-amber-700',
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className={['flex h-12 w-12 items-center justify-center rounded-lg', colors[tone]].join(' ')}>
                    <span className="text-lg font-bold">{icon}</span>
                </div>

                {trend && (
                    <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {trend}
                    </span>
                )}
            </div>

            <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                {description && (
                    <p className="mt-2 text-sm leading-5 text-slate-500">{description}</p>
                )}
            </div>
        </div>
    );
}
