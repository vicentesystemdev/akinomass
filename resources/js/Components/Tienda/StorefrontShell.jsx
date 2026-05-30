import { CartProvider, useCart } from '@/contexts/CartContext';
import StorefrontHeader from '@/Components/Tienda/StorefrontHeader';
import StorefrontFooter from '@/Components/Tienda/StorefrontFooter';
import CartDrawer from '@/Components/Tienda/CartDrawer';
import { Check, AlertCircle } from 'lucide-react';

function CartToast() {
    const { toast } = useCart();
    if (!toast) return null;

    const isError = toast.type === 'error';

    return (
        <div
            className="fixed bottom-6 left-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg"
            style={{
                transform: 'translateX(-50%)',
                background: isError ? '#FEF2F2' : '#ECFDF5',
                border: `1px solid ${isError ? '#FECACA' : '#A7F3D0'}`,
                color: isError ? '#B91C1C' : '#047857',
                fontSize: 13,
                fontWeight: 600,
                animation: 'cartToastIn 0.25s ease-out',
            }}
        >
            {isError ? <AlertCircle size={16} /> : <Check size={16} />}
            {toast.message}
        </div>
    );
}

function StorefrontShellInner({ children, auth }) {
    const { cartCount, openCart, badgePulse } = useCart();

    return (
        <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Figtree, sans-serif', background: '#FDF6F0' }}>
            <StorefrontHeader auth={auth} cartCount={cartCount} onCartClick={openCart} badgePulse={badgePulse} />
            <main className="flex-1">{children}</main>
            <StorefrontFooter />
            <CartDrawer auth={auth} />
            <CartToast />
        </div>
    );
}

export default function StorefrontShell({ children, auth, initialCarrito, openCartOnMount = false }) {
    return (
        <CartProvider auth={auth} initialCarrito={initialCarrito} openCartOnMount={openCartOnMount}>
            <StorefrontShellInner auth={auth}>{children}</StorefrontShellInner>
        </CartProvider>
    );
}
