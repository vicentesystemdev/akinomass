import { filterNumeric, toUpper } from '@/utils/formatters';

const inputClass = 'w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700';
const errorClass = 'mt-1 text-xs text-red-600';

export default function VariantsSection({ form, tallas = [], baseSku = '', categorias = [] }) {
    const variantes = form.data.variantes || [];
    const findVariante = (codTalla) =>
        variantes.find((variante) => String(variante.cod_talla_producto) === String(codTalla));

    const toggleTalla = (talla) => {
        const existente = findVariante(talla.cod_talla_producto);

        if (existente) {
            form.setData(
                'variantes',
                variantes.filter(
                    (variante) => String(variante.cod_talla_producto) !== String(talla.cod_talla_producto),
                ),
            );
            return;
        }

        const selectedCatId = form.data.cod_categoria_producto;
        const selectedCat = categorias?.find(c => String(c.cod_categoria_producto) === String(selectedCatId));
        const catPrefix = selectedCat ? selectedCat.nombre_cat.substring(0, 3).toUpperCase() : 'CAT';

        const prodName = form.data.nombre_pro || 'PROD';
        const prodPrefix = prodName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'PROD';

        const indexNum = variantes.length + 1;
        const correlative = String(indexNum).padStart(2, '0');
        const suggestedSku = `${catPrefix}-${prodPrefix}-${toUpper(talla.codigo_talla_producto)}-${correlative}`;

        form.setData('variantes', [
            ...variantes,
            {
                cod_talla_producto: talla.cod_talla_producto,
                sku_variante_producto: suggestedSku,
                precio_venta_variante: '',
                estado_variante_producto: 'activo',
                activo_variante_producto: true,
            },
        ]);
    };

    const updateVariante = (codTalla, field, value) => {
        form.setData(
            'variantes',
            variantes.map((variante) =>
                String(variante.cod_talla_producto) === String(codTalla)
                    ? { ...variante, [field]: value }
                    : variante,
            ),
        );
    };

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-medium text-cafe-700">Tallas disponibles</p>
                <p className="mt-1 text-xs text-gray-500">
                    Selecciona únicamente las tallas que manejará este producto.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {tallas.map((talla) => {
                    const selected = !!findVariante(talla.cod_talla_producto);

                    return (
                        <button
                            key={talla.cod_talla_producto}
                            type="button"
                            onClick={() => toggleTalla(talla)}
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                                selected
                                    ? 'border-terracota-500 bg-terracota-50 text-terracota-700'
                                    : 'border-gray-300 bg-white text-gray-600 hover:border-terracota-300'
                            }`}
                        >
                            {talla.codigo_talla_producto}
                        </button>
                    );
                })}
            </div>

            {form.errors.variantes && <p className={errorClass}>{form.errors.variantes}</p>}

            {variantes.map((variante, index) => {
                const talla = tallas.find(
                    (item) => String(item.cod_talla_producto) === String(variante.cod_talla_producto),
                );

                return (
                    <div
                        key={variante.cod_variante_producto || variante.cod_talla_producto}
                        className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[100px_1fr_1fr]"
                    >
                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500">Talla</p>
                            <p className="mt-2 font-bold text-cafe-800">
                                {talla?.codigo_talla_producto || variante.cod_talla_producto}
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-cafe-700">SKU variante</label>
                            <input
                                type="text"
                                value={variante.sku_variante_producto ?? ''}
                                onChange={(event) =>
                                    updateVariante(
                                        variante.cod_talla_producto,
                                        'sku_variante_producto',
                                        toUpper(event.target.value),
                                    )
                                }
                                className={`${inputClass} font-mono`}
                                placeholder="SKU opcional"
                            />
                            {form.errors[`variantes.${index}.sku_variante_producto`] && (
                                <p className={errorClass}>
                                    {form.errors[`variantes.${index}.sku_variante_producto`]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-cafe-700">Precio variante</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={variante.precio_venta_variante ?? ''}
                                onChange={(event) =>
                                    updateVariante(
                                        variante.cod_talla_producto,
                                        'precio_venta_variante',
                                        filterNumeric(event.target.value),
                                    )
                                }
                                className={inputClass}
                                placeholder="Usa precio base"
                            />
                            {form.errors[`variantes.${index}.precio_venta_variante`] && (
                                <p className={errorClass}>
                                    {form.errors[`variantes.${index}.precio_venta_variante`]}
                                </p>
                            )}
                            {form.errors[`variantes.${index}.cod_talla_producto`] && (
                                <p className={errorClass}>
                                    {form.errors[`variantes.${index}.cod_talla_producto`]}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
