import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3C473A', '#D77A61', '#059669', '#0891B2', '#D97706', '#DC2626', '#636e60', '#a6543e'];

const CustomTooltip = ({ active, payload, label, formatValue }) => {
    if (!active || !payload || !payload.length) return null;
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

export default function VerticalBarChart({ data, dataKey, labelKey = 'name', height = 300, formatValue, color, showGrid = true }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No hay datos para mostrar
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7e4" />}
                <XAxis
                    dataKey={labelKey}
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e5e7e4' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e5e7e4' }}
                    tickLine={false}
                    tickFormatter={formatValue}
                />
                <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
                <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={color || COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}
