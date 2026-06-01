import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { ShoppingCart, Check, ArrowLeft, AlertTriangle, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function ProductoShow({ producto, auth }) {
    const { isInCart, addItem, busy, openCart } = useCart();
    const [added, setAdded] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    const inCart = isInCart(producto.cod_producto);
    const stock = producto.stock_disponible ?? 0;
    const badge = producto.stock_badge || (stock > 0 ? 'disponible' : 'agotado');
    const isAvailable = badge === 'disponible' || badge === 'ultimo_stock';

    const handleAddToCart = async () => {
        if (busy || !isAvailable) return;

        try {
            await addItem(producto.cod_producto, cantidad, { openDrawer: true });
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
                    <div className="rounded-2xl overflow-hidden" style={{ background: '#F8F8FA', aspectRatio: '3/4' }}>
                        {producto.image_url ? (
                            <img src={producto.image_url} alt={producto.nombre_pro} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={64} style={{ color: '#D1D5DB' }} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        {producto.categoria && (
                            <p
                                style={{
                                    fontSize: 12,
                                    color: '#D77A61',
                                    fontWeight: 600,
                                    marginBottom: 4,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {producto.categoria.nombre_cat}
                            </p>
                        )}

                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#2B221E', lineHeight: 1.2, marginBottom: 8 }}>
                            {producto.nombre_pro}
                        </h1>

                        {producto.sku_pro && (
                            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>SKU: {producto.sku_pro}</p>
                        )}

                        <div className="mb-6">
                            <span style={{ fontSize: 32, fontWeight: 900, color: '#2B221E' }}>
                                Bs. {Number(producto.precio_venta_pro).toFixed(2)}
                            </span>
                        </div>

                        {producto.descripcion_pro && (
                            <p style={{ fontSize: 14, color: '#544a45', lineHeight: 1.7, marginBottom: 24 }}>
                                {producto.descripcion_pro}
                            </p>
                        )}

                        <div className="mb-6">
                            {isAvailable ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: badge === 'ultimo_stock' ? '#D97706' : '#059669' }} />
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: badge === 'ultimo_stock' ? '#D97706' : '#059669',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {badge === 'ultimo_stock' ? `Stock bajo (${stock} disponibles)` : `Disponible (${stock} en stock)`}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#DC2626' }} />
                                    <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>Agotado</span>
                                </div>
                            )}
                        </div>

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

                        {badge === 'ultimo_stock' && isAvailable && (
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
                                disabled={!isAvailable || busy}
                                className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                                style={{
                                    background: added
                                        ? 'linear-gradient(135deg, #059669, #10B981)'
                                        : inCart && !added
                                          ? 'linear-gradient(135deg, #3C473A, #4e5849)'
                                          : isAvailable
                                            ? 'linear-gradient(135deg, #D77A61, #c56950)'
                                            : '#9CA3AF',
                                    color: 'white',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: isAvailable && !busy ? 'pointer' : 'not-allowed',
                                }}
                            >
                                {added ? (
                                    <>
                                        <Check size={16} /> Añadido al carrito
                                    </>
                                ) : busy ? (
                                    'Agregando...'
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
