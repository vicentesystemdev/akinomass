import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart, Check, AlertTriangle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const STOCK_LABELS = {
    agotado: { bg: 'rgba(0,0,0,0.55)', color: 'white' },
    no_disponible: { bg: 'rgba(0,0,0,0.55)', color: 'white' },
    ultimo_stock: { bg: '#FEF3C7', color: '#B45309' },
};

export default function ProductCard({ producto }) {
    const { isInCart, addItem, busy } = useCart();
    const [addedFlash, setAddedFlash] = useState(false);

    const inCart = isInCart(producto.cod_producto);
    const stock = producto.stock_disponible ?? 0;
    const badge = producto.stock_badge || (stock > 0 ? 'disponible' : 'agotado');
    const isAvailable = badge === 'disponible' || badge === 'ultimo_stock';
    const stockInfo = STOCK_LABELS[badge];
    const displayPrice = Number(producto.precio_venta_pro).toFixed(2);
    const processing = busy && !addedFlash;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (busy || !isAvailable) return;

        try {
            await addItem(producto.cod_producto, 1, { openDrawer: false });
            setAddedFlash(true);
            setTimeout(() => setAddedFlash(false), 1200);
        } catch {
            // toast handled in context
        }
    };

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden relative"
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
            {inCart && (
                <div
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}
                    title="En tu carrito"
                >
                    <Check size={16} color="white" strokeWidth={3} />
                </div>
            )}

            <Link href={`/tienda/productos/${producto.cod_producto}`} style={{ textDecoration: 'none' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#F8F8FA' }}>
                    {producto.imagen_pro ? (
                        <img src={producto.imagen_pro} alt={producto.nombre_pro} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                            <ShoppingCart size={40} style={{ color: '#D1D5DB' }} />
                        </div>
                    )}

                    {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Agotado</span>
                        </div>
                    )}

                    {badge === 'ultimo_stock' && isAvailable && (
                        <span
                            className="absolute top-3 left-3 px-2 py-1 rounded-lg flex items-center gap-1"
                            style={{ fontSize: 10.5, fontWeight: 700, background: stockInfo.bg, color: stockInfo.color }}
                        >
                            <AlertTriangle size={11} />
                            Últimas {stock} u.
                        </span>
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
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#2B221E', lineHeight: 1.3, marginBottom: 4 }}>
                        {producto.nombre_pro}
                    </p>
                </Link>

                <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: 17, fontWeight: 800, color: '#2B221E' }}>Bs. {displayPrice}</span>
                    {isAvailable && (
                        <span style={{ fontSize: 11, color: badge === 'ultimo_stock' ? '#B45309' : '#6B7280', fontWeight: 500 }}>
                            {stock} en stock
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isAvailable || busy}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                    style={{
                        background: addedFlash
                            ? 'linear-gradient(135deg, #059669, #10B981)'
                            : inCart && !addedFlash
                              ? 'linear-gradient(135deg, #3C473A, #4e5849)'
                              : isAvailable
                                ? 'linear-gradient(135deg, #D77A61, #c56950)'
                                : '#9CA3AF',
                        color: 'white',
                        fontSize: 12.5,
                        fontWeight: 600,
                        border: 'none',
                        cursor: isAvailable && !busy ? 'pointer' : 'not-allowed',
                        opacity: processing ? 0.75 : 1,
                        transform: addedFlash ? 'scale(0.98)' : 'scale(1)',
                        transition: 'background 0.2s, opacity 0.2s, transform 0.15s',
                    }}
                >
                    {addedFlash && <Check size={14} />}
                    {addedFlash && <span>Añadido</span>}
                    {!addedFlash && processing && <span>Agregando...</span>}
                    {!addedFlash && !processing && inCart && (
                        <>
                            <Check size={13} />
                            <span>En carrito</span>
                        </>
                    )}
                    {!addedFlash && !processing && !inCart && (
                        <>
                            <ShoppingCart size={13} />
                            <span>Añadir al carrito</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
