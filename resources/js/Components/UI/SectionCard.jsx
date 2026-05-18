export default function SectionCard({ 
    title = '', 
    subtitle = '',
    headerActions = null,
    children, 
    className = '',
    noPadding = false 
}) {
    return (
        <div className={`bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-cafe-900">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="mt-0.5 text-sm text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {headerActions && (
                        <div className="flex items-center gap-2">
                            {headerActions}
                        </div>
                    )}
                </div>
            )}
            
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </div>
    );
}
