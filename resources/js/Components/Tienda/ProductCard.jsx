import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ShoppingCart, Check } from 'lucide-react';

export default function ProductCard({ producto, auth }) {
    const [added, setAdded] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (processing) return;

        setProcessing(true);
        router.post('/tienda/carrito/items', {
            cod_producto: producto.cod_producto,
            cantidad: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const isAvailable = producto.stock_disponible > 0;
    const displayPrice = Number(producto.precio_venta_pro).toFixed(2);

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.07)', transition: 'box-shadow 0.2s, transform 0.2s' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(60,71,58,0.13)';
                e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <Link href={`/tienda/productos/${producto.cod_producto}`} style={{ textDecoration: 'none' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#F8F8FA' }}>
                    {producto.imagen_pro ? (
                        <img
                            src={producto.imagen_pro}
                            alt={producto.nombre_pro}
                            className="w-full h-full object-cover"
                            style={{ transition: 'transform 0.4s ease' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                            <ShoppingCart size={40} style={{ color: '#D1D5DB' }} />
                        </div>
                    )}

                    {!isAvailable && (
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.5)' }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Agotado</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-3.5">
                {producto.categoria && (
                    <p style={{ fontSize: 11, color: '#D77A61', fontWeight: 600, marginBottom: 2 }}>
                        {producto.categoria.nombre_cat}
                    </p>
                )}

                <Link href={`/tienda/productos/${producto.cod_producto}`} style={{ textDecoration: 'none' }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#2B221E', lineHeight: 1.3, marginBottom: 6 }}>
                        {producto.nombre_pro}
                    </p>
                </Link>

                <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: 17, fontWeight: 800, color: '#2B221E' }}>
                        Bs. {displayPrice}
                    </span>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable || processing}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                    style={{
                        background: added
                            ? 'linear-gradient(135deg, #059669, #10B981)'
                            : isAvailable
                            ? 'linear-gradient(135deg, #D77A61, #c56950)'
                            : '#9CA3AF',
                        color: 'white',
                        fontSize: 12.5,
                        fontWeight: 600,
                        border: 'none',
                        cursor: isAvailable && !processing ? 'pointer' : 'not-allowed',
                        opacity: processing ? 0.7 : 1,
                    }}
                >
                    {added && <Check size={14} />}
                    {added && <span>Añadido</span>}
                    {!added && processing && <span>Procesando...</span>}
                    {!added && !processing && <ShoppingCart size={13} />}
                    {!added && !processing && <span>Añadir al carrito</span>}
                </button>
            </div>
        </div>
    );
}
