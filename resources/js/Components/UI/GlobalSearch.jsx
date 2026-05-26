import { router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const searchItems = [
    { label: 'Dashboard', routeName: 'dashboard', fallback: '/dashboard', description: 'Resumen comercial y metricas principales', keywords: 'inicio panel metricas control' },
    { label: 'Clientes', routeName: 'clientes.index', fallback: '/clientes', description: 'Gestion de clientes y datos de contacto', keywords: 'crm compradores contactos' },
    { label: 'Leads', routeName: 'leads.index', fallback: '/leads', description: 'Interesados, seguimiento y conversion', keywords: 'prospectos oportunidades ventas' },
    { label: 'Plantillas', routeName: 'plantillas-mensaje.index', fallback: '/plantillas-mensaje', description: 'Mensajes sugeridos para atencion comercial', keywords: 'respuestas textos comunicacion' },
    { label: 'Categorias', routeName: 'categorias-producto.index', fallback: '/categorias-producto', description: 'Clasificacion del catalogo', keywords: 'catalogo familias productos' },
    { label: 'Productos', routeName: 'productos.index', fallback: '/productos', description: 'Catalogo comercial y precios', keywords: 'ropa jeans algodon kakis inventario' },
    { label: 'Inventario', routeName: 'inventario.index', fallback: '/inventario', description: 'Stock disponible y alertas', keywords: 'existencias almacen' },
    { label: 'Movimientos', routeName: 'inventario.movimientos', fallback: '/inventario/movimientos', description: 'Entradas, salidas y ajustes de stock', keywords: 'kardex entradas salidas ajustes' },
    { label: 'Pedidos', routeName: 'pedidos.index', fallback: '/pedidos', description: 'Ordenes comerciales y estados', keywords: 'ventas ordenes entregas' },
    { label: 'Pagos', routeName: 'pagos.index', fallback: '/pagos', description: 'Registro y control de pagos', keywords: 'cobros efectivo qr transferencia' },
    { label: 'LiveSales', routeName: 'live-sales.index', fallback: '/live-sales', description: 'Sesiones de venta en vivo', keywords: 'tiktok live ventas directo' },
    { label: 'Reportes', routeName: 'reportes.index', fallback: '/reportes', description: 'Analisis operativo y comercial', keywords: 'informes analisis resultados' },
    { label: 'Perfil', routeName: 'profile.edit', fallback: '/profile', description: 'Datos de usuario y seguridad', keywords: 'cuenta password contrasena usuario' },
];

export default function GlobalSearch({ safeRoute }) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const wrapperRef = useRef(null);

    const results = useMemo(() => {
        const normalizedQuery = normalize(query);

        if (!normalizedQuery) {
            return searchItems.slice(0, 6).map((item) => resolveItem(item, safeRoute));
        }

        return searchItems
            .filter((item) => {
                const haystack = normalize(`${item.label} ${item.description} ${item.keywords}`);
                return haystack.includes(normalizedQuery);
            })
            .map((item) => resolveItem(item, safeRoute));
    }, [query, safeRoute]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const goToResult = (item) => {
        if (!item || item.href === '#') return;

        setOpen(false);
        setQuery('');
        router.visit(item.href);
    };

    const handleKeyDown = (event) => {
        if (!open && ['ArrowDown', 'Enter'].includes(event.key)) {
            setOpen(true);
        }

        if (event.key === 'Escape') {
            setOpen(false);
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((value) => Math.max(value - 1, 0));
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            goToResult(results[activeIndex]);
        }
    };

    return (
        <div className="relative w-full max-w-md group" ref={wrapperRef}>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-akin-muted transition-colors group-focus-within:text-akin-accent" />
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar modulo, pedido, producto..."
                className="akin-input h-11 w-full pl-11 pr-4 text-sm shadow-sm transition-shadow focus:shadow-md"
                aria-label="Busqueda global de modulos"
                aria-expanded={open}
            />

            {open && (
                <div className="akin-card absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-hidden p-2 shadow-xl dark:shadow-black/30 akin-dropdown-enter">
                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                        {results.length > 0 ? (
                            results.map((item, index) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => goToResult(item)}
                                    className={[
                                        'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition',
                                        index === activeIndex ? 'bg-akin-surfaceSoft text-akin-text' : 'text-akin-muted hover:bg-akin-surfaceSoft hover:text-akin-text',
                                        item.href === '#' ? 'cursor-not-allowed opacity-60' : '',
                                    ].join(' ')}
                                >
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-akin-accent/10 text-xs font-black text-akin-accent">
                                        {item.label.slice(0, 2).toUpperCase()}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-black">{item.label}</span>
                                        <span className="mt-0.5 block text-xs leading-5 text-akin-muted">{item.description}</span>
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm font-black text-akin-text">No se encontraron resultados</p>
                                <p className="mt-1 text-xs text-akin-muted">Prueba con clientes, productos, pagos o reportes.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function resolveItem(item, safeRoute) {
    return {
        ...item,
        href: safeRoute ? safeRoute(item.routeName, item.fallback) : item.fallback,
    };
}

function normalize(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function SearchIcon({ className = '' }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
