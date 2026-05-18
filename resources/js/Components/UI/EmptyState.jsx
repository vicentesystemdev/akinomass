export default function EmptyState({ 
    icon = null,
    title = 'No hay registros',
    description = 'No se encontraron datos para mostrar.',
    action = null,
    className = '' 
}) {
    const defaultIcon = (
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
    );

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
            <div className="p-4 bg-gray-50 rounded-full mb-4">
                {icon || defaultIcon}
            </div>
            
            <h3 className="text-lg font-semibold text-cafe-900 mb-1">
                {title}
            </h3>
            
            <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                {description}
            </p>
            
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
}
