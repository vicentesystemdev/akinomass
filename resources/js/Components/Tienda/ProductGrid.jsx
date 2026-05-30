import ProductCard from './ProductCard';

export default function ProductGrid({ productos }) {
    if (!productos || productos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p style={{ fontSize: 15, color: '#9CA3AF' }}>No encontramos productos con ese criterio</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos.map((producto) => (
                <ProductCard key={producto.cod_producto} producto={producto} />
            ))}
        </div>
    );
}
