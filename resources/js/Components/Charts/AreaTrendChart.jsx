import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import { formatCompactBOB } from '@/lib/formatters';

const CustomTooltip = ({ active, payload, label, formatValue }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
            <p className="text-xs font-medium text-cafe-700 mb-1">{label}</p>
            <p className="text-sm font-bold text-terracota-600">
                {formatValue ? formatValue(payload[0].value) : payload[0].value}
            </p>
        </div>
    );
};

export default function AreaTrendChart({ data, dataKey = 'monto_pagado', labelKey = 'fecha', height = 320, formatValue }) {
    if (!data?.length) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No hay datos para mostrar
            </div>
        );
    }

    const fmt = formatValue || formatCompactBOB;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 24, right: 16, left: 8, bottom: 8 }}>
                <defs>
                    <linearGradient id="areaTerracota" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D77A61" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#D77A61" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7e4" vertical={false} />
                <XAxis dataKey={labelKey} tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={fmt} width={64} />
                <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke="#D77A61"
                    fill="url(#areaTerracota)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#D77A61', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                >
                    <LabelList dataKey={dataKey} position="top" formatter={fmt} className="fill-cafe-800 text-[10px] font-semibold" />
                </Area>
            </AreaChart>
        </ResponsiveContainer>
    );
}
