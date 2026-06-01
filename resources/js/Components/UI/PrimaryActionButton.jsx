export default function PrimaryActionButton({ 
    children, 
    onClick, 
    disabled = false, 
    loading = false, 
    icon = null,
    type = 'button',
    size = 'md',
    className = '' 
}) {
    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const spinner = (
        <svg key="spinner" className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 font-semibold text-white bg-terracota-500 rounded-xl shadow-sm transition-all duration-200 ease-in-out hover:bg-terracota-600 focus:outline-none focus:ring-2 focus:ring-terracota-500 focus:ring-offset-2 active:bg-terracota-700 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${className}`}
        >
            {loading && spinner}
            {!loading && icon && <span key="icon" className="w-4 h-4">{icon}</span>}
            <span key="text">{loading ? 'Procesando...' : children}</span>
        </button>
    );
}
