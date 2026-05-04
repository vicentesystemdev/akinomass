import React from 'react';

export default function StatusBadge({ children, type = 'neutral' }) {
    const styles = {
        success: 'bg-green-100 text-green-700 border-green-200',
        warning: 'bg-[#D77A61]/10 text-[#D77A61] border-[#D77A61]/20',
        danger: 'bg-red-100 text-red-700 border-red-200',
        info: 'bg-blue-100 text-blue-700 border-blue-200',
        neutral: 'bg-gray-100 text-gray-600 border-gray-200',
        primary: 'bg-[#3C473A]/10 text-[#3C473A] border-[#3C473A]/20',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[type]}`}>
            {children}
        </span>
    );
}
