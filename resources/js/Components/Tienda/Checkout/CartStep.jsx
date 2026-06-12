import { router } from '@inertiajs/react';
import { ShoppingCart, X, Plus, Minus, ChevronRight, Shield, Truck, RefreshCw } from 'lucide-react';

export default function CartStep({ checkout, onNext }) {
    const carrito = checkout?.carrito;
    const items = carrito?.detalles || [];
    const subtotal = checkout ? Number(checkout.subtotal_che) : 0;
    const total = checkout ? Number(checkout.total_che) : 0;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#FDF6F0' }}>
                    <ShoppingCart size={32} style={{ color: '#D77A61' }} />
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#544a45' }}>Tu carrito está vacío</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2B221E', marginBottom: 12 }}>
                    Productos en tu carrito ({items.length})
                </h3>
                {items.map((item) => (
                    <div
                        key={item.cod_detalle_carrito}
                        className="flex gap-4 p-4 rounded-2xl bg-white"
                        style={{ border: '1px solid rgba(0,0,0,0.07)' }}
                    >
                        <div className="w-20 h-24 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                            <ShoppingCart size={24} style={{ color: '#D1D5DB' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>{item.nombre_producto_dca}</p>
                            {item.sku_producto_dca && (
                                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>SKU: {item.sku_producto_dca}</p>
                            )}
                            {item.variante?.talla && (
                                <p style={{ fontSize: 12, color: '#D77A61', marginTop: 2 }}>Talla: {item.variante.talla.codigo_talla_producto}</p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 rounded-xl p-1" style={{ background: '#F3F4F6' }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#2B221E', padding: '0 8px' }}>
                                        ×{item.cantidad_dca}
                                    </span>
                                </div>
                                <p style={{ fontSize: 16, fontWeight: 800, color: '#D77A61' }}>
                                    Bs. {Number(item.subtotal_dca).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Resumen del pedido</h3>
                    <div className="space-y-2.5">
                        {items.map((item) => (
                            <div key={`s-${item.cod_detalle_carrito}`} className="flex justify-between">
                                <span style={{ fontSize: 12.5, color: '#6B7280' }}>
                                    {item.nombre_producto_dca} × {item.cantidad_dca}
                                </span>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45' }}>
                                    Bs. {Number(item.subtotal_dca).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid #F3F4F6' }}>
                        <div className="flex justify-between">
                            <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal</span>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '2px solid #F3F4F6' }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: '#2B221E' }}>Total</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: '#D77A61' }}>
                                Bs. {total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onNext}
                        className="w-full mt-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                        Continuar
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="p-4 rounded-2xl" style={{ background: '#FAFAFA', border: '1px solid #F3F4F6' }}>
                    <div className="space-y-2">
                        {[
                            { icon: Shield, text: 'Pago 100% seguro' },
                            { icon: Truck, text: 'Entrega en 2-3 días hábiles' },
                            { icon: RefreshCw, text: 'Devolución gratuita en 30 días' },
                        ].map((t) => (
                            <div key={t.text} className="flex items-center gap-2">
                                <t.icon size={13} style={{ color: '#3C473A', flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: '#6B7280' }}>{t.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
