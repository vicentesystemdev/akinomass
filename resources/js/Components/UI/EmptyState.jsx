import React from 'react';

export default function EmptyState({ message = "No hay datos disponibles para este reporte con los filtros seleccionados." }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#FDF6F0]/30 rounded-3xl border border-dashed border-[#3C473A]/10">
            <div className="w-16 h-16 bg-olive/5 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-olive/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            </div>
            <p className="text-sm font-medium text-[#3C473A]/50 max-w-[200px]">
                {message}
            </p>
        </div>
    );
}
