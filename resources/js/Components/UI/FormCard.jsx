export default function FormCard({ 
    title = '', 
    subtitle = '',
    children, 
    onSubmit,
    className = '' 
}) {
    const content = (
        <div className={`space-y-6 ${className}`}>
            {children}
        </div>
    );

    if (onSubmit) {
        return (
            <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
                {title && (
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-cafe-900">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="mt-0.5 text-sm text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                <div className="p-6">
                    {content}
                </div>
            </form>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
            {title && (
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-cafe-900">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="mt-0.5 text-sm text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            <div className="p-6">
                {content}
            </div>
        </div>
    );
}

FormCard.Section = function FormSection({ title, children, className = '' }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {title && (
                <h4 className="text-sm font-semibold text-cafe-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                    {title}
                </h4>
            )}
            {children}
        </div>
    );
};

FormCard.Row = function FormRow({ children, className = '' }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {children}
        </div>
    );
};

FormCard.Actions = function FormActions({ children, className = '' }) {
    return (
        <div className={`flex items-center justify-end gap-3 pt-4 border-t border-gray-100 ${className}`}>
            {children}
        </div>
    );
};
