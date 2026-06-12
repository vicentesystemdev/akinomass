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
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#059669' }} />
            <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>
                Disponible (Prenda única)
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
                            <span className="text-3xl font-black text-cafe-950">
                                Bs. {Number(Number(varianteSeleccionada?.precio_venta_variante ?? producto.precio_venta_pro).toFixed(1))}
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
                                                className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-all border-2 active:scale-95 duration-200 ${
                                                    esSeleccionada
                                                        ? 'border-terracota-500 bg-crema-100 text-terracota-500 shadow-sm'
                                                        : agotada
                                                        ? 'border-gray-200 bg-white text-gray-300 line-through opacity-50 cursor-not-allowed'
                                                        : 'border-gray-300 bg-white text-cafe-950 hover:border-terracota-300 hover:text-terracota-500 cursor-pointer'
                                                }`}
                                            >
                                                {variante.talla?.codigo_talla_producto ?? '?'}
                                                {variante.stock_badge === 'ultimo_stock' && !agotada && (
                                                    <span
                                                        className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-warning border-2 border-white"
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

                        {/* Botón de añadir al carrito */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={busy || inCart || (tieneVariantes && codVarianteProducto && !isAvailable)}
                                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-white font-bold border-none text-base active:scale-95 duration-200 ${
                                    busy || inCart ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                                } ${
                                    added
                                        ? 'bg-gradient-to-br from-success to-emerald-500'
                                        : inCart && !added
                                          ? 'bg-gray-400'
                                          : tieneVariantes && codVarianteProducto && !isAvailable
                                            ? 'bg-gray-400'
                                            : 'bg-gradient-to-br from-terracota-500 to-terracota-600 hover:shadow-md'
                                }`}
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
                                        <Check size={16} /> Reservado (En Carrito)
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
                                    className="py-4 px-5 rounded-xl transition-all border border-gray-200 bg-white text-cafe-700 font-semibold hover:bg-gray-50 cursor-pointer"
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
