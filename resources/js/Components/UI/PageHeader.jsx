import { Link } from '@inertiajs/react';

export default function PageHeader({ 
    title, 
    subtitle = '', 
    actions = null, 
    breadcrumbs = [],
    className = '' 
}) {
    return (
        <div className={`mb-6 ${className}`}>
            {breadcrumbs.length > 0 && (
                <nav className="flex mb-3" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                    <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {crumb.href ? (
                                    <Link 
                                        href={crumb.href} 
                                        className="text-sm text-gray-500 hover:text-cafe-700 transition-colors duration-200"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-sm text-cafe-700 font-medium">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-cafe-950 tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>
                
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
