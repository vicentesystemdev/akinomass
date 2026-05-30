import { router } from '@inertiajs/react';
import { ShoppingCart, X, Plus, Minus, Shield, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartDrawer({ auth }) {
    const {
        carrito,
        cartOpen,
        closeCart,
        changeQuantity,
        removeItem,
        updatingProductId,
    } = useCart();

    const items = carrito?.detalles || [];
    const subtotal = carrito ? Number(carrito.subtotal_car) : 0;
    const total = carrito ? Number(carrito.total_car) : 0;
    const itemCount = items.reduce((sum, d) => sum + d.cantidad_dca, 0);

    const handleCheckout = () => {
        closeCart();
        if (auth?.user) {
            router.post('/tienda/checkout', { cod_carrito: carrito.cod_carrito });
        } else {
            router.visit('/tienda/login');
        }
    };

    return (
        <>
            <div
                onClick={closeCart}
                aria-hidden={!cartOpen}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    zIndex: 40,
                    opacity: cartOpen ? 1 : 0,
                    pointerEvents: cartOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s',
                }}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Carrito de compras"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 'min(420px, 100vw)',
                    background: 'white',
                    zIndex: 50,
                    transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
                }}
            >
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)' }}
                        >
                            <ShoppingCart size={15} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#2B221E' }}>Mi Carrito</p>
                            <p style={{ fontSize: 11.5, color: '#9CA3AF' }}>
                                {itemCount} {itemCount === 1 ? 'unidad' : 'unidades'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeCart}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        aria-label="Cerrar carrito"
                    >
                        <X size={16} color="#6B7280" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#FDF6F0' }}>
                                <ShoppingCart size={32} style={{ color: '#D77A61' }} />
                            </div>
                            <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                                Tu carrito está vacío.
                                <br />
                                <span style={{ color: '#D77A61', fontWeight: 500 }}>¡Explora nuestra colección!</span>
                            </p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const isUpdating = updatingProductId === item.cod_producto;

                            return (
                                <div
                                    key={item.cod_detalle_carrito}
                                    className="flex gap-3 p-3 rounded-xl"
                                    style={{
                                        background: '#FAFAFA',
                                        border: '1px solid #F3F4F6',
                                        opacity: isUpdating ? 0.65 : 1,
                                        transition: 'opacity 0.15s',
                                    }}
                                >
                                    <div
                                        className="w-16 h-20 rounded-lg flex-shrink-0 flex items-center justify-center"
                                        style={{ background: '#F3F4F6' }}
                                    >
                                        <ShoppingCart size={20} style={{ color: '#D1D5DB' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E', lineHeight: 1.3 }}>
                                            {item.nombre_producto_dca}
                                        </p>
                                        {item.sku_producto_dca && (
                                            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>SKU: {item.sku_producto_dca}</p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <p style={{ fontSize: 14, fontWeight: 700, color: '#D77A61' }}>
                                                Bs. {Number(item.subtotal_dca).toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    disabled={isUpdating}
                                                    onClick={() => changeQuantity(item.cod_producto, item.cantidad_dca - 1)}
                                                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                    style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                                                    {isUpdating ? <Loader2 size={13} className="animate-spin mx-auto" /> : item.cantidad_dca}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={isUpdating}
                                                    onClick={() => changeQuantity(item.cod_producto, item.cantidad_dca + 1)}
                                                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                    style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isUpdating}
                                        onClick={() => removeItem(item.cod_producto)}
                                        className="self-start hover:text-red-500 transition-colors disabled:opacity-50"
                                        style={{ color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer' }}
                                        aria-label="Eliminar producto"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {items.length > 0 && (
                    <div className="px-5 py-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                        <div className="space-y-1.5 mb-4">
                            <div className="flex justify-between">
                                <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal</span>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2 mt-1" style={{ borderTop: '1px solid #F3F4F6' }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>Total</span>
                                <span style={{ fontSize: 17, fontWeight: 800, color: '#D77A61' }}>Bs. {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCheckout}
                            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                            style={{
                                background: 'linear-gradient(135deg, #D77A61, #c56950)',
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {auth?.user ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar'}
                        </button>

                        <div className="flex items-center justify-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                                <Shield size={11} style={{ color: '#9CA3AF' }} />
                                <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>Pago seguro</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
