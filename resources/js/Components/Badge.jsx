export default function Badge({ variant = 'default', size = 'md', className = '', children }) {
    const variants = {
        default: 'bg-gray-100 text-cafe-700',
        primary: 'bg-oliva-100 text-oliva-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-amber-100 text-amber-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-cyan-100 text-cyan-800',
        gray: 'bg-gray-200 text-gray-600',
        terracota: 'bg-terracota-100 text-terracota-800',
        oliva: 'bg-oliva-100 text-oliva-800',
        inactivo: 'bg-gray-200 text-gray-500',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
}
