import { Search } from 'lucide-react';

export default function CatalogFilters({ categorias = [], filtros = {}, onFilter }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#2B221E' }}>Nuestra Colección</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {/* Category chips */}
                <button
                    onClick={() => onFilter({ ...filtros, cod_categoria_producto: null })}
                    className="px-3.5 py-1.5 rounded-xl transition-all"
                    style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        background: !filtros.cod_categoria_producto ? 'linear-gradient(135deg, #3C473A, #4e5849)' : 'white',
                        color: !filtros.cod_categoria_producto ? 'white' : '#6B7280',
                        border: !filtros.cod_categoria_producto ? 'none' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                    }}
                >
                    Todos
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat.cod_categoria_producto}
                        onClick={() => onFilter({ ...filtros, cod_categoria_producto: cat.cod_categoria_producto })}
                        className="px-3.5 py-1.5 rounded-xl transition-all"
                        style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            background: filtros.cod_categoria_producto === cat.cod_categoria_producto
                                ? 'linear-gradient(135deg, #3C473A, #4e5849)'
                                : 'white',
                            color: filtros.cod_categoria_producto === cat.cod_categoria_producto ? 'white' : '#6B7280',
                            border: filtros.cod_categoria_producto === cat.cod_categoria_producto ? 'none' : '1px solid #E5E7EB',
                            cursor: 'pointer',
                        }}
                    >
                        {cat.nombre_cat}
                    </button>
                ))}

                {/* Sort */}
                <select
                    value={filtros.orden || ''}
                    onChange={(e) => onFilter({ ...filtros, orden: e.target.value || null })}
                    className="px-3 py-1.5 rounded-xl"
                    style={{
                        fontSize: 12.5,
                        color: '#374151',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <option value="">Ordenar</option>
                    <option value="precio_asc">Precio: menor a mayor</option>
                    <option value="precio_desc">Precio: mayor a menor</option>
                    <option value="nombre_asc">Nombre A-Z</option>
                    <option value="recientes">Más recientes</option>
                </select>
            </div>
        </div>
    );
}
