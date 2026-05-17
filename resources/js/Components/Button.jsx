export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-800 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
        success: 'bg-success text-white hover:bg-green-600 focus:ring-green-500',
        warning: 'bg-warning text-white hover:bg-amber-600 focus:ring-amber-500',
        danger: 'bg-danger text-white hover:bg-red-600 focus:ring-red-500',
        info: 'bg-info text-white hover:bg-cyan-600 focus:ring-cyan-500',
        outline: 'border-2 border-primary-800 text-primary-800 hover:bg-primary-50 focus:ring-primary-500',
        ghost: 'text-primary-800 hover:bg-primary-50 focus:ring-primary-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}