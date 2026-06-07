import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { ShoppingCart, Check, ArrowLeft, AlertTriangle, Package, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

function StockBadge({ badge, stock, sinVariante }) {
    if (badge === 'agotado') {
        return (
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#DC2626' }} />
                <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>Agotado</span>
            </div>
        );
    }
    if (badge === 'ultimo_stock') {
        return (
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#D97706' }} />
                <span style={{ fontSize: 13, color: '#D97706', fontWeight: 500 }}>
                    Stock bajo — {sinVariante ? `${stock} disponibles` : `quedan ${stock}`}
                </span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#059669' }} />
            <span style={{ fontSize: 13, color: '#059669', fontWeight: 500 }}>
                Disponible{sinVariante ? ` (${stock} en stock)` : ''}
            </span>
        </div>
    );
}

export default function ProductoShow({ producto, auth }) {
    const { isInCart, addItem, busy, openCart } = useCart();
    const [added, setAdded] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const [codVarianteProducto, setCodVarianteProducto] = useState(null);
    const [errorTalla, setErrorTalla] = useState(false);

    const tieneVariantes = (producto.variantes || []).length > 0;
    const varianteSeleccionada = producto.variantes?.find((v) => v.cod_variante_producto === codVarianteProducto);
    const inCart = isInCart(producto.cod_producto, codVarianteProducto);

    const stock = tieneVariantes
        ? (varianteSeleccionada?.stock_disponible ?? 0)
        : (producto.stock_disponible ?? 0);

    const badgeActivo = tieneVariantes
        ? (varianteSeleccionada?.stock_badge ?? null)
        : (producto.stock_badge || (stock > 0 ? 'disponible' : 'agotado'));

    const isAvailable = tieneVariantes
        ? Boolean(varianteSeleccionada?.disponible)
        : badgeActivo === 'disponible' || badgeActivo === 'ultimo_stock';

    const handleSeleccionarVariante = (cod) => {
        setCodVarianteProducto(cod);
        setCantidad(1);
        setErrorTalla(false);
    };

    const handleAddToCart = async () => {
        if (busy) return;
        if (tieneVariantes && !codVarianteProducto) {
            setErrorTalla(true);
            return;
        }
        if (!isAvailable) return;

        try {
            await addItem(producto.cod_producto, cantidad, { openDrawer: true, codVarianteProducto });
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
        } catch {
            // toast en contexto
        }
    };

    return (
        <StorefrontLayout auth={auth}>
            <Head title={`${producto.nombre_pro} - AKINOMASS`} />

            <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                <Link
                    href="/tienda/catalogo"
                    className="inline-flex items-center gap-1.5 mb-6 hover:underline"
                    style={{ fontSize: 13, color: '#D77A61', fontWeight: 500, textDecoration: 'none' }}
                >
                    <ArrowLeft size={14} />
                    Volver al catálogo
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Imagen */}
                    <div className="rounded-2xl overflow-hidden" style={{ background: '#F8F8FA', aspectRatio: '3/4' }}>
                        {producto.image_url ? (
                            <img src={producto.image_url} alt={producto.nombre_pro} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={64} style={{ color: '#D1D5DB' }} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        {producto.categoria && (
                            <p style={{ fontSize: 12, color: '#D77A61', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {producto.categoria.nombre_cat}
                            </p>
                        )}

                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#2B221E', lineHeight: 1.2, marginBottom: 8 }}>
                            {producto.nombre_pro}
                        </h1>

                        {producto.sku_pro && !tieneVariantes && (
                            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>SKU: {producto.sku_pro}</p>
                        )}

                        {varianteSeleccionada?.sku_variante_producto && (
                            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>
                                SKU: {varianteSeleccionada.sku_variante_producto}
                            </p>
                        )}

                        <div className="mb-6">
                            <span style={{ fontSize: 32, fontWeight: 900, color: '#2B221E' }}>
                                Bs. {Number(varianteSeleccionada?.precio_venta_variante ?? producto.precio_venta_pro).toFixed(2)}
                            </span>
                        </div>

                        {producto.descripcion_pro && (
                            <p style={{ fontSize: 14, color: '#544a45', lineHeight: 1.7, marginBottom: 24 }}>
                                {producto.descripcion_pro}
                            </p>
                        )}

                        {/* Selector de tallas */}
                        {tieneVariantes && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold" style={{ color: '#2B221E' }}>Talla</p>
                                    {codVarianteProducto && (
                                        <button
                                            type="button"
                                            onClick={() => { setCodVarianteProducto(null); setCantidad(1); setErrorTalla(false); }}
                                            className="flex items-center gap-1 text-xs"
                                            style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <X size={11} /> Limpiar
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {producto.variantes.map((variante) => {
                                        const esSeleccionada = codVarianteProducto === variante.cod_variante_producto;
                                        const agotada = !variante.disponible;
                                        return (
                                            <button
                                                key={variante.cod_variante_producto}
                                                type="button"
                                                disabled={agotada}
                                                onClick={() => handleSeleccionarVariante(variante.cod_variante_producto)}
                                                title={agotada ? 'Sin stock' : `${variante.stock_disponible ?? 0} disponibles`}
                                                className="relative rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                                                style={{
                                                    borderWidth: 1.5,
                                                    borderStyle: 'solid',
                                                    borderColor: esSeleccionada ? '#D77A61' : agotada ? '#E5E7EB' : '#D1D5DB',
                                                    background: esSeleccionada ? '#FDF6F0' : 'white',
                                                    color: agotada ? '#C4C4C4' : esSeleccionada ? '#D77A61' : '#2B221E',
                                                    cursor: agotada ? 'not-allowed' : 'pointer',
                                                    textDecoration: agotada ? 'line-through' : 'none',
                                                    opacity: agotada ? 0.6 : 1,
                                                }}
                                            >
                                                {variante.talla?.codigo_talla_producto ?? '?'}
                                                {variante.stock_badge === 'ultimo_stock' && !agotada && (
                                                    <span
                                                        className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full"
                                                        style={{ background: '#D97706' }}
                                                        title="Stock bajo"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {errorTalla && !codVarianteProducto && (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#DC2626' }}>
                                        <AlertTriangle size={12} />
                                        Debes seleccionar una talla para continuar.
                                    </p>
                                )}
                                {!errorTalla && !codVarianteProducto && (
                                    <p className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
                                        Selecciona una talla para ver disponibilidad.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Badge de stock */}
                        <div className="mb-6">
                            {tieneVariantes && !varianteSeleccionada ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#D97706' }} />
                                    <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>
                                        Elige una talla para ver disponibilidad
                                    </span>
                                </div>
                            ) : (
                                <StockBadge badge={badgeActivo} stock={stock} sinVariante={!tieneVariantes} />
                            )}
                        </div>

                        {/* Selector de cantidad */}
                        {isAvailable && (
                            <div className="flex items-center gap-4 mb-6">
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#544a45' }}>Cantidad:</label>
                                <div className="flex items-center gap-2 rounded-xl p-1" style={{ background: '#F3F4F6' }}>
                                    <button
                                        type="button"
                                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                                        style={{ fontSize: 16, fontWeight: 700, color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        -
                                    </button>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#2B221E', minWidth: 32, textAlign: 'center' }}>
                                        {cantidad}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setCantidad(Math.min(stock, cantidad + 1))}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                                        style={{ fontSize: 16, fontWeight: 700, color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {badgeActivo === 'ultimo_stock' && isAvailable && (
                            <p
                                className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-xl"
                                style={{ fontSize: 13, fontWeight: 600, background: '#FEF3C7', color: '#B45309' }}
                            >
                                <AlertTriangle size={14} />
                                Stock bajo: quedan {stock} unidades
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={busy || (tieneVariantes && codVarianteProducto && !isAvailable)}
                                className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                                style={{
                                    background: added
                                        ? 'linear-gradient(135deg, #059669, #10B981)'
                                        : inCart && !added
                                          ? 'linear-gradient(135deg, #3C473A, #4e5849)'
                                          : tieneVariantes && codVarianteProducto && !isAvailable
                                            ? '#9CA3AF'
                                            : 'linear-gradient(135deg, #D77A61, #c56950)',
                                    color: 'white',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: busy ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {added ? (
                                    <>
                                        <Check size={16} /> Añadido al carrito
                                    </>
                                ) : busy ? (
                                    'Agregando...'
                                ) : tieneVariantes && codVarianteProducto && !isAvailable ? (
                                    'Agotado'
                                ) : inCart ? (
                                    <>
                                        <Check size={16} /> Ya está en tu carrito
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} /> Añadir al carrito
                                    </>
                                )}
                            </button>
                            {inCart && (
                                <button
                                    type="button"
                                    onClick={openCart}
                                    className="py-4 px-5 rounded-xl transition-all hover:bg-gray-50"
                                    style={{ fontSize: 14, fontWeight: 600, color: '#544a45', border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer' }}
                                >
                                    Ver carrito
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
