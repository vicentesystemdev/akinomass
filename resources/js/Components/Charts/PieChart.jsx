import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3C473A', '#D77A61', '#059669', '#0891B2', '#D97706', '#DC2626', '#636e60', '#a6543e'];

const CustomTooltip = ({ active, payload, formatValue }) => {
    if (!active || !payload || !payload.length) return null;
    const { name, value, percent } = payload[0];
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
            <p className="text-xs font-medium text-cafe-700 mb-1">{name}</p>
            <p className="text-sm font-bold text-terracota-600">
                {formatValue ? formatValue(value) : value}
            </p>
            <p className="text-xs text-gray-500">{(percent * 100).toFixed(1)}%</p>
        </div>
    );
};

const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-cafe-700">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function PieChartComponent({ data, dataKey = 'value', nameKey = 'name', height = 300, formatValue, innerRadius = 0, showLegend = true }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No hay datos para mostrar
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={height * 0.35}
                    paddingAngle={2}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
                {showLegend && <Legend content={<CustomLegend />} />}
            </RechartsPieChart>
        </ResponsiveContainer>
    );
}
