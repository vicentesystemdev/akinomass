import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

const estadoLabels = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    agotado: 'Agotado',
    descontinuado: 'Descontinuado',
};

export default function Edit({ producto, categorias, estados }) {
    const form = useForm({
        cod_categoria_producto: producto?.cod_categoria_producto ?? '',
        nombre_pro: producto?.nombre_pro ?? '',
        descripcion_pro: producto?.descripcion_pro ?? '',
        precio_venta_pro: producto?.precio_venta_pro ?? '',
        precio_costo_pro: producto?.precio_costo_pro ?? '',
        sku_pro: producto?.sku_pro ?? '',
        imagen_pro: producto?.imagen_pro ?? '',
        estado_pro: producto?.estado_pro ?? estados?.[0] ?? 'activo',
    });

    const submit = () => {
        form.put(route('productos.update', producto.cod_producto));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Editar Producto"
                    subtitle={`Modifique los datos de "${producto.nombre_pro}"`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Productos', href: route('productos.index') },
                        { label: producto.nombre_pro },
                    ]}
                />
            }
        >
            <Head title="Editar Producto" />

            <div className="max-w-3xl mx-auto">
                <FormCard
                    title="Datos del Producto"
                    subtitle="Modifique la información del producto"
                    onSubmit={(e) => { e.preventDefault(); submit(); }}
                >
                    <FormCard.Section title="Información Básica">
                        <FormCard.Row>
                            <div>
                                <label className={labelClass}>
                                    Nombre del Producto <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.data.nombre_pro ?? ''}
                                    onChange={(e) => form.setData('nombre_pro', e.target.value)}
                                    className={`${inputClass} ${form.errors.nombre_pro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Ej: Remera básica algodón"
                                    required
                                />
                                {form.errors.nombre_pro && (
                                    <p className={errorClass}>{form.errors.nombre_pro}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>SKU</label>
                                <input
                                    type="text"
                                    value={form.data.sku_pro ?? ''}
                                    onChange={(e) => form.setData('sku_pro', e.target.value)}
                                    className={`${inputClass} font-mono ${form.errors.sku_pro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Ej: REM-001"
                                />
                                {form.errors.sku_pro && (
                                    <p className={errorClass}>{form.errors.sku_pro}</p>
                                )}
                            </div>
                        </FormCard.Row>

                        <div>
                            <label className={labelClass}>Descripción</label>
                            <textarea
                                value={form.data.descripcion_pro ?? ''}
                                onChange={(e) => form.setData('descripcion_pro', e.target.value)}
                                rows={3}
                                className={`${inputClass} resize-y ${form.errors.descripcion_pro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="Descripción detallada del producto"
                            />
                            {form.errors.descripcion_pro && (
                                <p className={errorClass}>{form.errors.descripcion_pro}</p>
                            )}
                        </div>
                    </FormCard.Section>

                    <FormCard.Section title="Clasificación">
                        <FormCard.Row>
                            <div>
                                <label className={labelClass}>
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.cod_categoria_producto ?? ''}
                                    onChange={(e) => form.setData('cod_categoria_producto', e.target.value)}
                                    className={`${inputClass} ${form.errors.cod_categoria_producto ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categorias.map((c) => (
                                        <option key={c.cod_categoria_producto} value={c.cod_categoria_producto}>
                                            {c.nombre_cat}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.cod_categoria_producto && (
                                    <p className={errorClass}>{form.errors.cod_categoria_producto}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Estado <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.estado_pro ?? ''}
                                    onChange={(e) => form.setData('estado_pro', e.target.value)}
                                    className={`${inputClass} ${form.errors.estado_pro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                >
                                    {estados.map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estadoLabels[estado] || estado}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.estado_pro && (
                                    <p className={errorClass}>{form.errors.estado_pro}</p>
                                )}
                            </div>
                        </FormCard.Row>
                    </FormCard.Section>

                    <FormCard.Section title="Precios">
                        <FormCard.Row>
                            <div>
                                <label className={labelClass}>
                                    Precio de Venta <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Bs</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.precio_venta_pro ?? ''}
                                        onChange={(e) => form.setData('precio_venta_pro', e.target.value)}
                                        className={`${inputClass} pl-10 ${form.errors.precio_venta_pro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                {form.errors.precio_venta_pro && (
                                    <p className={errorClass}>{form.errors.precio_venta_pro}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Precio de Costo</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Bs</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.precio_costo_pro ?? ''}
                                        onChange={(e) => form.setData('precio_costo_pro', e.target.value)}
                                        className={`${inputClass} pl-10 ${form.errors.precio_costo_pro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {form.errors.precio_costo_pro && (
                                    <p className={errorClass}>{form.errors.precio_costo_pro}</p>
                                )}
                            </div>
                        </FormCard.Row>
                    </FormCard.Section>

                    <FormCard.Section title="Imagen">
                        <div>
                            <label className={labelClass}>URL de la Imagen</label>
                            <input
                                type="url"
                                value={form.data.imagen_pro ?? ''}
                                onChange={(e) => form.setData('imagen_pro', e.target.value)}
                                className={`${inputClass} ${form.errors.imagen_pro ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            {form.errors.imagen_pro && (
                                <p className={errorClass}>{form.errors.imagen_pro}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Ingrese la URL de la imagen del producto. Si no tiene, puede dejarlo vacío.
                            </p>
                        </div>
                    </FormCard.Section>

                    <FormCard.Actions>
                        <Link href={route('productos.index')}>
                            <SecondaryButton>Cancelar</SecondaryButton>
                        </Link>
                        <PrimaryActionButton
                            type="submit"
                            loading={form.processing}
                            disabled={form.processing}
                        >
                            Actualizar Producto
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
