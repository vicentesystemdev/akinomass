import StorefrontShell from '@/Components/Tienda/StorefrontShell';
import { usePage } from '@inertiajs/react';

export default function StorefrontLayout({ children, auth }) {
    const { carrito, carrito_reservas, flash } = usePage().props;

    return (
        <StorefrontShell auth={auth} initialCarrito={carrito} initialReservas={carrito_reservas} openCartOnMount={Boolean(flash?.open_cart)}>
            {children}
        </StorefrontShell>
    );
}
