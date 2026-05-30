import StorefrontShell from '@/Components/Tienda/StorefrontShell';
import { usePage } from '@inertiajs/react';

export default function StorefrontLayout({ children, auth }) {
    const { carrito, flash } = usePage().props;

    return (
        <StorefrontShell auth={auth} initialCarrito={carrito} openCartOnMount={Boolean(flash?.open_cart)}>
            {children}
        </StorefrontShell>
    );
}
