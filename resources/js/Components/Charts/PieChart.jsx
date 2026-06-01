import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3C473A', '#D77A61', '#059669', '#0891B2', '#D97706', '#DC2626', '#636e60', '#a6543e'];

const RADIAN = Math.PI / 180;

function renderSliceLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, formatValue }) {
    if (percent < 0.06) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const display = formatValue ? formatValue(value) : value;

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
            {display}
        </text>
    );
}

const CustomTooltip = ({ active, payload, formatValue }) => {
    if (!active || !payload?.length) return null;
    const { name, value, percent } = payload[0];
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
            <p className="text-xs font-medium text-cafe-700 mb-1">{name}</p>
            <p className="text-sm font-bold text-terracota-600">{formatValue ? formatValue(value) : value}</p>
            <p className="text-xs text-gray-500">{(percent * 100).toFixed(1)}% del total</p>
        </div>
    );
};

function PieLegend({ data, dataKey, formatValue }) {
    const total = (data || []).reduce((sum, d) => sum + (d[dataKey] || 0), 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 px-2">
            {data.map((item, index) => {
                const value = item?.[dataKey] ?? 0;
                const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                const color = COLORS[index % COLORS.length];

                return (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-xs text-cafe-700 truncate">{item.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-cafe-900 block">
                                {formatValue ? formatValue(value) : value}
                            </span>
                            <span className="text-[10px] text-gray-500">{pct}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function PieChartComponent({
    data,
    dataKey = 'value',
    nameKey = 'name',
    height = 300,
    formatValue,
    innerRadius = 0,
    showLegend = true,
    showLabels = true,
}) {
    if (!data?.length) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No hay datos para mostrar
            </div>
        );
    }

    const chartHeight = height;
    const radius = Math.min(chartHeight * 0.38, 120);

    return (
        <div className="flex flex-col">
            <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={radius}
                            paddingAngle={2}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            stroke="white"
                            strokeWidth={2}
                            label={showLabels ? (props) => renderSliceLabel({ ...props, formatValue }) : false}
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </div>
            {showLegend && (
                <PieLegend data={data} dataKey={dataKey} formatValue={formatValue} />
            )}
        </div>
    );
}
