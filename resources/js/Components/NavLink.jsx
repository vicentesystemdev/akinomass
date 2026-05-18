import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    activeClassName = '',
    inactiveClassName = '',
    children,
    sidebar = false,
    ...props
}) {
    const baseClasses = sidebar
        ? 'flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none rounded-lg mx-2'
        : 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition-all duration-200 ease-in-out focus:outline-none';

    const defaultActiveClasses = sidebar
        ? 'bg-terracota-500 text-white shadow-sm'
        : 'border-terracota-500 text-cafe-900 focus:border-terracota-700';

    const defaultInactiveClasses = sidebar
        ? 'text-oliva-200 hover:bg-oliva-600 hover:text-white'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-cafe-700 focus:border-gray-300 focus:text-cafe-700';

    const finalClassName = [
        baseClasses,
        active
            ? `${defaultActiveClasses} ${activeClassName}`
            : `${defaultInactiveClasses} ${inactiveClassName}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Link
            {...props}
            className={finalClassName}
        >
            {children}
        </Link>
    );
}
