import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormCard from '@/Components/UI/FormCard';
import PageHeader from '@/Components/UI/PageHeader';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { filterInteger, toUpper } from '@/utils/formatters';

export default function Ajustar({ categorias = [], codCategoriaSeleccionada = null, tipoSeleccionado = null }) {
    const form = useForm({
        cod_categoria_producto: codCategoriaSeleccionada ?? '',
        tipo_ajuste: tipoSeleccionado ?? '',
        cantidad: 0,
        motivo_mov: '',
        observacion_mov: '',
    });

    const categoria = categorias.find((item) => String(item.cod_categoria_producto) === String(form.data.cod_categoria_producto));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.data.cod_categoria_producto) {
            form.setError('cod_categoria_producto', 'Debe seleccionar una categoría.');
            return;
        }
        if (!form.data.tipo_ajuste) {
            form.setError('tipo_ajuste', 'Debe seleccionar el tipo de ajuste.');
            return;
        }

        form.post(route('inventario.ajuste'));
    };

    const inputClass = 'w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm text-cafe-700 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 transition-all';
    const labelClass = 'mb-1.5 block text-sm font-medium text-cafe-700';
    const errorClass = 'mt-1 text-xs text-red-650 font-medium';

    return (
        <AuthenticatedLayout
            header={<PageHeader title="Ajustar Inventario" subtitle="Gestión y control de stock a nivel de categorías (lotes, fardos y mermas)" breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Inventario', href: route('inventario.index') },
                { label: 'Ajustar' },
            ]} />}
        >
            <Head title="Ajustar Inventario por Categoría" />
            <div className="mx-auto max-w-2xl">
                <FormCard 
                    title="Ajuste agrupado por categoría" 
                    subtitle="Selecciona la categoría y define la operación de stock a realizar" 
                    onSubmit={handleSubmit}
                >
                    {/* Selección de Categoría */}
                    <div>
                        <label className={labelClass}>Categoría <span className="text-red-500">*</span></label>
                        <select
                            value={form.data.cod_categoria_producto}
                            onChange={(event) => form.setData('cod_categoria_producto', event.target.value)}
                            className={inputClass}
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((item) => (
                                <option key={item.cod_categoria_producto} value={item.cod_categoria_producto}>
                                    {item.nombre_cat}
                                </option>
                            ))}
                        </select>
                        {form.errors.cod_categoria_producto && <p className={errorClass}>{form.errors.cod_categoria_producto}</p>}
                    </div>

                    {/* Información Dinámica de Stock de la Categoría */}
                    {categoria && (
                        <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Stock físico agrupado</p>
                                <p className="mt-1 text-2xl font-bold text-cafe-900">{categoria.stock_total} prendas</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Stock disponible agrupado</p>
                                <p className="mt-1 text-2xl font-bold text-green-700">{categoria.stock_disponible} prendas</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Stock reservado agrupado</p>
                                <p className="mt-1 text-lg font-bold text-terracota-700">{categoria.stock_reservado} prendas</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Mínimo agrupado registrado</p>
                                <p className="mt-1 text-lg font-bold text-cafe-850">{categoria.stock_minimo} prendas</p>
                            </div>
                        </div>
                    )}

                    {/* Selección del Tipo de Ajuste */}
                    <div>
                        <label className={labelClass}>Tipo de Ajuste <span className="text-red-500">*</span></label>
                        <select
                            value={form.data.tipo_ajuste}
                            onChange={(event) => form.setData('tipo_ajuste', event.target.value)}
                            className={inputClass}
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="entrada_fardo">Entrada de fardo / lote (+ stock)</option>
                            <option value="salida_merma">Salida / merma (- stock)</option>
                            <option value="ajuste_conteo">Ajuste de conteo (inventario físico)</option>
                            <option value="ajuste_minimo">Ajustar stock mínimo agrupado</option>
                        </select>
                        {form.errors.tipo_ajuste && <p className={errorClass}>{form.errors.tipo_ajuste}</p>}
                    </div>

                    {/* Alertas Contextuales */}
                    {form.data.tipo_ajuste === 'entrada_fardo' && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                            Esta operación sumará el valor indicado directamente al inventario general de la categoría seleccionada.
                        </div>
                    )}
                    {form.data.tipo_ajuste === 'salida_merma' && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                            Esta operación restará el valor indicado del stock agrupado. La cantidad no puede superar el stock disponible.
                        </div>
                    )}
                    {form.data.tipo_ajuste === 'ajuste_conteo' && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                            Esta operación sobrescribirá de forma absoluta el stock de la categoría con el nuevo valor indicado. Use con cuidado.
                        </div>
                    )}
                    {form.data.tipo_ajuste === 'ajuste_minimo' && (
                        <div className="rounded-lg border border-oliva-200 bg-oliva-50 p-3 text-sm text-oliva-800">
                            Esta operación actualizará la meta de stock mínimo para la generación de alertas en la categoría.
                        </div>
                    )}

                    {/* Cantidad / Valor Nuevo */}
                    {form.data.tipo_ajuste && (
                        <div>
                            <label className={labelClass}>
                                {form.data.tipo_ajuste === 'ajuste_minimo' ? 'Stock Mínimo Agrupado' : 'Cantidad de Prendas'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                min="0"
                                value={form.data.cantidad}
                                onChange={(event) => form.setData('cantidad', filterInteger(event.target.value))}
                                className={inputClass}
                                required
                            />
                            {form.errors.cantidad && <p className={errorClass}>{form.errors.cantidad}</p>}
                        </div>
                    )}

                    {/* Motivo y Observación */}
                    {form.data.tipo_ajuste && (
                        <>
                            <div>
                                <label className={labelClass}>Motivo <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.data.motivo_mov}
                                    onChange={(event) => form.setData('motivo_mov', toUpper(event.target.value))}
                                    className={inputClass}
                                    placeholder="Ej: INGRESO DE NUEVO FARDO DE ROPA"
                                    required
                                />
                                {form.errors.motivo_mov && <p className={errorClass}>{form.errors.motivo_mov}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Observación</label>
                                <textarea
                                    value={form.data.observacion_mov}
                                    onChange={(event) => form.setData('observacion_mov', event.target.value)}
                                    rows={3}
                                    className={inputClass}
                                    placeholder="Detalles adicionales opcionales..."
                                />
                                {form.errors.observacion_mov && <p className={errorClass}>{form.errors.observacion_mov}</p>}
                            </div>
                        </>
                    )}

                    <FormCard.Actions>
                        <Link href={route('inventario.index')}>
                            <SecondaryButton>Cancelar / Volver</SecondaryButton>
                        </Link>
                        {form.data.tipo_ajuste && (
                            <PrimaryActionButton type="submit" loading={form.processing} disabled={form.processing}>
                                Confirmar Ajuste
                            </PrimaryActionButton>
                        )}
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
