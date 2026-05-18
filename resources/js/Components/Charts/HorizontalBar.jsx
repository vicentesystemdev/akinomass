const COLORS = ['#3C473A', '#D77A61', '#059669', '#0891B2', '#D97706', '#DC2626', '#636e60', '#a6543e'];

export default function HorizontalBar({ data, labelKey = 'name', valueKey = 'value', maxValue, formatValue, height = 'auto' }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No hay datos para mostrar
            </div>
        );
    }

    const max = maxValue || Math.max(...data.map((d) => d[valueKey] || 0));

    return (
        <div className="space-y-3" style={{ height }}>
            {data.map((item, index) => {
                const value = item[valueKey] || 0;
                const percentage = max > 0 ? (value / max) * 100 : 0;
                const color = COLORS[index % COLORS.length];

                return (
                    <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-cafe-700 truncate max-w-[60%]">
                                {item[labelKey]}
                            </span>
                            <span className="text-sm font-bold text-cafe-900">
                                {formatValue ? formatValue(value) : value}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(percentage, 100)}%`,
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
