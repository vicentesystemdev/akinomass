import React from 'react';

export default function MetricCard({ title, value, icon, trend, trendValue, color = 'olive' }) {
    const colorClasses = {
        olive: 'bg-[#3C473A] text-[#FDF6F0]',
        terracota: 'bg-[#D77A61] text-[#FDF6F0]',
        terracotta: 'bg-[#D77A61] text-[#FDF6F0]',
        cream: 'bg-white text-[#2B221E]',
        coffee: 'bg-[#2B221E] text-[#FDF6F0]',
    };

    return (
        <div className={`rounded-2xl p-6 shadow-sm border border-[#3C473A]/5 transition-all duration-300 hover:shadow-md ${color === 'cream' ? 'bg-white' : colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold uppercase tracking-wider opacity-80 ${color === 'cream' ? 'text-[#3C473A]/60' : ''}`}>
                    {title}
                </span>
                {icon && <div className="p-2 rounded-lg bg-white/10">{icon}</div>}
            </div>
            <div className="flex flex-col">
                <h3 className={`text-3xl font-black ${color === 'cream' ? 'text-[#2B221E]' : ''}`}>
                    {value}
                </h3>
                {trend && (
                    <div className="mt-2 flex items-center gap-1">
                        <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {trend === 'up' ? '↑' : '↓'} {trendValue}
                        </span>
                        <span className="text-[10px] opacity-60">vs mes anterior</span>
                    </div>
                )}
            </div>
        </div>
    );
}
