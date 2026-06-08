import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ShoppingCart, Check, AlertTriangle, Layers } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ producto }) {
    const { isInCart, addItem, busy } = useCart();
    const [addedFlash, setAddedFlash] = useState(false);

    const inCart = isInCart(producto.cod_producto);
    const stock = producto.stock_disponible ?? 0;
    const badge = producto.stock_badge || (stock > 0 ? 'disponible' : 'agotado');
    const isAvailable = badge === 'disponible' || badge === 'ultimo_stock';
    const displayPrice = Number(Number(producto.precio_venta_pro).toFixed(1));
    const processing = busy && !addedFlash;
    const tieneVariantes = (producto.variantes || []).length > 0;

    const tallasDisponibles = tieneVariantes
        ? producto.variantes.filter((v) => v.disponible).length
        : 0;
    const tallasVisibles = tieneVariantes ? producto.variantes.slice(0, 5) : [];
    const tallasRestantes = tieneVariantes ? Math.max(0, producto.variantes.length - tallasVisibles.length) : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (busy || !isAvailable || tieneVariantes) return;

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
                    {producto.image_url ? (
                        <img src={producto.image_url} alt={producto.nombre_pro} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                            <ShoppingCart size={40} style={{ color: '#D1D5DB' }} />
                        </div>
                    )}

                    {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Vendido</span>
                        </div>
                    )}

                    {badge === 'ultimo_stock' && isAvailable && (
                        <span
                            className="absolute top-3 left-3 px-2 py-1 rounded-lg flex items-center gap-1"
                            style={{ fontSize: 10.5, fontWeight: 700, background: '#FEF3C7', color: '#B45309' }}
                        >
                            <AlertTriangle size={11} />
                            {tieneVariantes ? 'Stock bajo' : `Últimas ${stock} u.`}
                        </span>
                    )}

                    {tieneVariantes && isAvailable && (
                        <span
                            className="absolute bottom-3 left-3 px-2 py-1 rounded-lg flex items-center gap-1"
                            style={{ fontSize: 10.5, fontWeight: 600, background: 'rgba(255,255,255,0.92)', color: '#3C473A' }}
                        >
                            <Layers size={11} />
                            {tallasDisponibles} {tallasDisponibles === 1 ? 'talla' : 'tallas'}
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
                    {isAvailable && !tieneVariantes && (
                        <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
                            Disponible
                        </span>
                    )}
                </div>

                {tieneVariantes && (
                    <div className="flex flex-wrap gap-1.5 mb-3" aria-label="Tallas disponibles">
                        {tallasVisibles.map((variante) => {
                            const disponible = Boolean(variante.disponible);
                            return (
                                <span
                                    key={variante.cod_variante_producto}
                                    className="px-2 py-1 rounded-lg"
                                    title={disponible ? `${variante.stock_disponible ?? 0} disponibles` : 'Vendido'}
                                    style={{
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        color: disponible ? '#3C473A' : '#B91C1C',
                                        background: disponible ? '#F4F5F4' : '#FEF2F2',
                                        border: `1px solid ${disponible ? '#E5E7EB' : '#FECACA'}`,
                                        textDecoration: disponible ? 'none' : 'line-through',
                                    }}
                                >
                                    {variante.talla?.codigo_talla_producto || 'Talla'}
                                </span>
                            );
                        })}
                        {tallasRestantes > 0 && (
                            <span className="px-2 py-1 rounded-lg" style={{ fontSize: 10.5, fontWeight: 700, color: '#6B7280', background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                                +{tallasRestantes}
                            </span>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    onClick={tieneVariantes ? () => router.visit(`/tienda/productos/${producto.cod_producto}`) : handleAddToCart}
                    disabled={!isAvailable || busy || inCart}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 duration-200"
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
                        cursor: isAvailable && !busy && !inCart ? 'pointer' : 'not-allowed',
                        opacity: processing ? 0.75 : 1,
                        transform: addedFlash ? 'scale(0.98)' : 'scale(1)',
                        transition: 'background 0.2s, opacity 0.2s, transform 0.15s',
                    }}
                >
                    {!isAvailable ? (
                        <span>Agotado</span>
                    ) : tieneVariantes ? (
                        <>
                            <Layers size={13} />
                            <span>Elige talla</span>
                        </>
                    ) : addedFlash ? (
                        <>
                            <Check size={14} />
                            <span>Añadido</span>
                        </>
                    ) : processing ? (
                        <span>Agregando...</span>
                    ) : inCart ? (
                        <>
                            <Check size={13} />
                            <span>Reservado en Carrito</span>
                        </>
                    ) : (
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
