import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addCarritoItem, removeCarritoItem, updateCarritoItem } from '@/lib/tiendaCartApi';

const CartContext = createContext(null);

export function CartProvider({ children, auth, initialCarrito = null, openCartOnMount = false }) {
    const [carrito, setCarrito] = useState(initialCarrito);
    const [cartOpen, setCartOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [updatingProductId, setUpdatingProductId] = useState(null);
    const [toast, setToast] = useState(null);
    const [badgePulse, setBadgePulse] = useState(false);
    const toastTimer = useRef(null);

    useEffect(() => {
        setCarrito(initialCarrito ?? null);
    }, [initialCarrito]);

    useEffect(() => {
        if (openCartOnMount) {
            setCartOpen(true);
        }
    }, [openCartOnMount]);

    const showToast = useCallback((message, type = 'success') => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast({ message, type });
        toastTimer.current = setTimeout(() => setToast(null), 2800);
    }, []);

    const pulseBadge = useCallback(() => {
        setBadgePulse(true);
        setTimeout(() => setBadgePulse(false), 600);
    }, []);

    const openCart = useCallback(() => setCartOpen(true), []);
    const closeCart = useCallback(() => setCartOpen(false), []);

    const isInCart = useCallback(
        (codProducto) => (carrito?.detalles || []).some((d) => d.cod_producto === codProducto),
        [carrito],
    );

    const cartCount = useMemo(
        () => (carrito?.detalles || []).reduce((sum, d) => sum + (d.cantidad_dca || 0), 0),
        [carrito],
    );

    const addItem = useCallback(
        async (codProducto, cantidad = 1, { openDrawer = false, silent = false } = {}) => {
            setBusy(true);
            try {
                const updated = await addCarritoItem(codProducto, cantidad);
                setCarrito(updated);
                pulseBadge();
                if (!silent) {
                    showToast('Producto agregado al carrito');
                }
                if (openDrawer) {
                    setCartOpen(true);
                }
                return updated;
            } catch (error) {
                showToast(error.message || 'Error al agregar', 'error');
                throw error;
            } finally {
                setBusy(false);
            }
        },
        [pulseBadge, showToast],
    );

    const changeQuantity = useCallback(
        async (codProducto, cantidad) => {
            setUpdatingProductId(codProducto);
            try {
                const updated =
                    cantidad <= 0
                        ? await removeCarritoItem(codProducto)
                        : await updateCarritoItem(codProducto, cantidad);
                setCarrito(updated);
                pulseBadge();
            } catch (error) {
                showToast(error.message || 'Error al actualizar', 'error');
            } finally {
                setUpdatingProductId(null);
            }
        },
        [pulseBadge, showToast],
    );

    const removeItem = useCallback(
        async (codProducto) => {
            setUpdatingProductId(codProducto);
            try {
                const updated = await removeCarritoItem(codProducto);
                setCarrito(updated);
                showToast('Producto eliminado');
            } catch (error) {
                showToast(error.message || 'Error al eliminar', 'error');
            } finally {
                setUpdatingProductId(null);
            }
        },
        [showToast],
    );

    const value = useMemo(
        () => ({
            carrito,
            cartOpen,
            cartCount,
            busy,
            updatingProductId,
            badgePulse,
            toast,
            auth,
            openCart,
            closeCart,
            isInCart,
            addItem,
            changeQuantity,
            removeItem,
        }),
        [
            carrito,
            cartOpen,
            cartCount,
            busy,
            updatingProductId,
            badgePulse,
            toast,
            auth,
            openCart,
            closeCart,
            isInCart,
            addItem,
            changeQuantity,
            removeItem,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return ctx;
}
