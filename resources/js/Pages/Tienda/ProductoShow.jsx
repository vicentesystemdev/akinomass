import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import CartDrawer from '@/Components/Tienda/CartDrawer';
import { ShoppingCart, Check, ArrowLeft, Package } from 'lucide-react';

export default function ProductoShow({ producto, auth, carrito }) {
    const [cartOpen, setCartOpen] = useState(false);
    const [added, setAdded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [cantidad, setCantidad] = useState(1);

    const cartCount = carrito?.detalles?.reduce((sum, d) => sum + d.cantidad_dca, 0) || 0;
    const isAvailable = producto.disponible && producto.stock_disponible > 0;

    const handleAddToCart = () => {
        if (processing) return;

        setProcessing(true);
        router.post('/tienda/carrito/items', {
            cod_producto: producto.cod_producto,
            cantidad: cantidad,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <StorefrontLayout auth={auth} cartCount={cartCount}>
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
                    {/* Image */}
                    <div className="rounded-2xl overflow-hidden" style={{ background: '#F8F8FA', aspectRatio: '3/4' }}>
                        {producto.imagen_pro ? (
                            <img src={producto.imagen_pro} alt={producto.nombre_pro} className="w-full h-full object-cover" />
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

                        {/* Stock */}
                        <div className="mb-6">
                            {isAvailable ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#059669' }} />
                                    <span style={{ fontSize: 13, color: '#059669', fontWeight: 500 }}>
                                        Disponible ({producto.stock_disponible} en stock)
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#DC2626' }} />
                                    <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>Agotado</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        {isAvailable && (
                            <div className="flex items-center gap-4 mb-6">
                                <label style={{ fontSize: 13, fontWeight: 600, color: '#544a45' }}>Cantidad:</label>
                                <div className="flex items-center gap-2 rounded-xl p-1" style={{ background: '#F3F4F6' }}>
                                    <button
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
                                        onClick={() => setCantidad(Math.min(producto.stock_disponible, cantidad + 1))}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                                        style={{ fontSize: 16, fontWeight: 700, color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!isAvailable || processing}
                            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                            style={{
                                background: added
                                    ? 'linear-gradient(135deg, #059669, #10B981)'
                                    : isAvailable
                                    ? 'linear-gradient(135deg, #D77A61, #c56950)'
                                    : '#9CA3AF',
                                color: 'white',
                                fontSize: 15,
                                fontWeight: 700,
                                border: 'none',
                                cursor: isAvailable && !processing ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {added ? (
                                <><Check size={16} /> Añadido al carrito</>
                            ) : processing ? (
                                'Procesando...'
                            ) : (
                                <><ShoppingCart size={16} /> Añadir al carrito</>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} carrito={carrito} auth={auth} />
        </StorefrontLayout>
    );
}
