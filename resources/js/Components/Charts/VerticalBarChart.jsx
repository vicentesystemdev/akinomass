import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from 'recharts';

const COLORS = ['#3C473A', '#D77A61', '#059669', '#0891B2', '#D97706', '#DC2626', '#636e60', '#a6543e'];

const CustomTooltip = ({ active, payload, label, formatValue }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
            <p className="text-xs font-medium text-cafe-700 mb-1">{label}</p>
            {payload.map((entry, index) => (
                <p key={index} className="text-sm font-bold" style={{ color: entry.color || '#D77A61' }}>
                    {formatValue ? formatValue(entry.value) : entry.value}
                </p>
            ))}
        </div>
    );
};

export default function VerticalBarChart({
    data,
    dataKey,
    labelKey = 'name',
    height = 300,
    formatValue,
    color,
    showGrid = true,
    showLabels = true,
}) {
    if (!data?.length) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No hay datos para mostrar
            </div>
        );
    }

    const labelFormatter = (v) => (formatValue ? formatValue(v) : v);

    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart data={data} margin={{ top: showLabels ? 28 : 5, right: 12, left: 8, bottom: 5 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7e4" vertical={false} />}
                <XAxis
                    dataKey={labelKey}
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={{ stroke: '#e5e7e4' }}
                    tickLine={false}
                    interval={0}
                    angle={data.length > 5 ? -25 : 0}
                    textAnchor={data.length > 5 ? 'end' : 'middle'}
                    height={data.length > 5 ? 56 : 30}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatValue}
                    width={72}
                />
                <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
                <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={color || COLORS[index % COLORS.length]} />
                    ))}
                    {showLabels && (
                        <LabelList
                            dataKey={dataKey}
                            position="top"
                            formatter={labelFormatter}
                            className="fill-cafe-800 text-[10px] font-semibold"
                        />
                    )}
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}
