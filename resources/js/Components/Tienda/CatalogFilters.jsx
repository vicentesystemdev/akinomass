import { Search } from 'lucide-react';

const chipStyle = (active) => ({
    fontSize: 12.5,
    fontWeight: 600,
    background: active ? 'linear-gradient(135deg, #3C473A, #4e5849)' : 'white',
    color: active ? 'white' : '#6B7280',
    border: active ? 'none' : '1px solid #E5E7EB',
    cursor: 'pointer',
});

export default function CatalogFilters({ categorias = [], tallas = [], filtros = {}, onFilter }) {
    const tallasActivas = tallas.length > 0;
    const mismaOpcion = (actual, esperado) => String(actual ?? '') === String(esperado ?? '');
    const aplicarFiltro = (nuevosFiltros) => {
        const filtrados = Object.fromEntries(
            Object.entries({ ...nuevosFiltros, page: null }).filter(([, value]) => value !== null && value !== '' && value !== undefined),
        );
        onFilter(filtrados);
    };

    return (
        <div className="flex flex-col gap-3 mb-7">
            {/* Fila superior: título + orden */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#2B221E' }}>Nuestra Colección</h2>
                <select
                    value={filtros.orden || ''}
                    onChange={(e) => aplicarFiltro({ ...filtros, orden: e.target.value || null })}
                    className="px-3 py-1.5 rounded-xl"
                    style={{ fontSize: 12.5, color: '#374151', background: 'white', border: '1px solid #E5E7EB', outline: 'none', cursor: 'pointer' }}
                >
                    <option value="">Ordenar</option>
                    <option value="precio_asc">Precio: menor a mayor</option>
                    <option value="precio_desc">Precio: mayor a menor</option>
                    <option value="nombre_asc">Nombre A-Z</option>
                    <option value="recientes">Más recientes</option>
                </select>
            </div>

            {/* Chips de categoría */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={() => aplicarFiltro({ ...filtros, cod_categoria_producto: null })}
                    className="px-3.5 py-1.5 rounded-xl transition-all"
                    style={chipStyle(!filtros.cod_categoria_producto)}
                >
                    Todos
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat.cod_categoria_producto}
                        type="button"
                        onClick={() => aplicarFiltro({ ...filtros, cod_categoria_producto: cat.cod_categoria_producto })}
                        className="px-3.5 py-1.5 rounded-xl transition-all"
                        style={chipStyle(mismaOpcion(filtros.cod_categoria_producto, cat.cod_categoria_producto))}
                    >
                        {cat.nombre_cat}
                    </button>
                ))}
            </div>

            {/* Chips de talla — solo si hay tallas disponibles */}
            {tallasActivas && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: '#9CA3AF', marginRight: 2 }}>
                        Talla:
                    </span>
                    <button
                        type="button"
                        onClick={() => aplicarFiltro({ ...filtros, cod_talla_producto: null })}
                        className="px-3 py-1 rounded-lg transition-all"
                        style={chipStyle(!filtros.cod_talla_producto)}
                    >
                        Todas
                    </button>
                    {tallas.map((talla) => (
                        <button
                            key={talla.cod_talla_producto}
                            type="button"
                            onClick={() => aplicarFiltro({ ...filtros, cod_talla_producto: talla.cod_talla_producto })}
                            className="px-3 py-1 rounded-lg transition-all"
                            style={chipStyle(mismaOpcion(filtros.cod_talla_producto, talla.cod_talla_producto))}
                        >
                            {talla.codigo_talla_producto}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
