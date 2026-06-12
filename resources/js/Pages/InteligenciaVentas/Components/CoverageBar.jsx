import { formatPercent } from './formatters';

export default function CoverageBar({ value }) {
    const number = Number.parseFloat(value);
    const percent = Number.isNaN(number) ? 0 : Math.max(0, Math.min(number * 100, 100));
    const color = percent < 35 ? 'bg-red-500' : percent < 70 ? 'bg-amber-500' : 'bg-green-600';

    return (
        <div className="min-w-[140px]">
            <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-cafe-700">Cobertura</span>
                <span className="font-bold text-cafe-900">{formatPercent(number * 100)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100">
                <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
