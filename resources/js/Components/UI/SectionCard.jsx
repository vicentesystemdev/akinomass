import React from 'react';

export default function SectionCard({ title, subtitle, children, actions }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(43,34,30,0.03)] border border-[#3C473A]/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-[#2B221E]">{title}</h2>
                    {subtitle && <p className="text-sm text-[#3C473A]/50 mt-1 font-medium">{subtitle}</p>}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
