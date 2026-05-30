import { Link } from '@inertiajs/react';

export default function Pagination({ links, meta }) {
    if (!meta || meta.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {links.prev ? (
                    <Link href={links.prev} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-cafe-700 hover:bg-gray-50 transition-all duration-200">
                        Anterior
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                        Anterior
                    </span>
                )}
                {links.next ? (
                    <Link href={links.next} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-cafe-700 hover:bg-gray-50 transition-all duration-200">
                        Siguiente
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                        Siguiente
                    </span>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-600">
                        Mostrando{' '}
                        <span className="font-medium">{meta.from}</span>
                        {' '}a{' '}
                        <span className="font-medium">{meta.to}</span>
                        {' '}de{' '}
                        <span className="font-medium">{meta.total}</span>
                        {' '}resultados
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {meta.links?.map((link, i) => {
                            if (i < 3 || i >= meta.links.length - 3) {
                                const isActive = link.active;
                                const isDisabled = link.url === null;

                                if (isDisabled) {
                                    return (
                                        <span
                                            key={i}
                                            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-200 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }

                                const positionClass = i === 0 ? 'rounded-l-md' : i === meta.links.length - 1 ? 'rounded-r-md' : '';

                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border transition-all duration-200 ${positionClass} ${
                                            isActive
                                                ? 'z-10 bg-terracota-500 text-white border-terracota-500 hover:bg-terracota-600'
                                                : 'bg-white text-cafe-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            if (i === 3 || i === meta.links.length - 4) {
                                return (
                                    <span
                                        key={i}
                                        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return null;
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
