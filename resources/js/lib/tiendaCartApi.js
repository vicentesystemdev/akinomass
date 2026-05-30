import axios from 'axios';

const client = axios.create({
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
});

function extractMessage(error) {
    const data = error?.response?.data;
    if (data?.message) return data.message;
    if (data?.errors) {
        const first = Object.values(data.errors)[0];
        return Array.isArray(first) ? first[0] : first;
    }
    return 'No se pudo actualizar el carrito.';
}

export async function fetchCarrito() {
    const { data } = await client.get('/tienda/carrito');
    return data.carrito;
}

export async function addCarritoItem(codProducto, cantidad = 1) {
    try {
        const { data } = await client.post('/tienda/carrito/items', {
            cod_producto: codProducto,
            cantidad,
        });
        return data.carrito;
    } catch (error) {
        throw new Error(extractMessage(error));
    }
}

export async function updateCarritoItem(codProducto, cantidad) {
    try {
        const { data } = await client.patch(`/tienda/carrito/items/${codProducto}`, { cantidad });
        return data.carrito;
    } catch (error) {
        throw new Error(extractMessage(error));
    }
}

export async function removeCarritoItem(codProducto) {
    try {
        const { data } = await client.delete(`/tienda/carrito/items/${codProducto}`);
        return data.carrito;
    } catch (error) {
        throw new Error(extractMessage(error));
    }
}
