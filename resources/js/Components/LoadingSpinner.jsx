export default function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizes[size]}`} />
        </div>
    );
}

export function LoadingOverlay({ show, message = 'Cargando...' }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center">
                <LoadingSpinner size="lg" />
                <p className="mt-3 text-sm text-gray-600">{message}</p>
            </div>
        </div>
    );
}