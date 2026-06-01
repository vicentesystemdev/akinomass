import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';

const estadoLabels = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    agotado: 'Agotado',
    descontinuado: 'Descontinuado',
};

export default function Edit({ producto, categorias, estados }) {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [removeExisting, setRemoveExisting] = useState(false);
    const fileInputRef = useRef(null);

    const estadoValue = producto?.estado_pro?.value ?? producto?.estado_pro ?? '';

    const form = useForm({
        _method: 'PUT',
        cod_categoria_producto: producto?.cod_categoria_producto ?? '',
        nombre_pro: producto?.nombre_pro ?? '',
        descripcion_pro: producto?.descripcion_pro ?? '',
        precio_venta_pro: producto?.precio_venta_pro ?? '',
        precio_costo_pro: producto?.precio_costo_pro ?? '',
        sku_pro: producto?.sku_pro ?? '',
        imagen_pro: null,
        eliminar_imagen: false,
        estado_pro: estadoValue || estados?.[0] || 'activo',
    });

    const handleFile = useCallback((file) => {
        if (!file) return;

        form.setData('imagen_pro', file);
        form.setData('eliminar_imagen', false);
        setRemoveExisting(false);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    }, [form]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const removeImage = () => {
        form.setData('imagen_pro', null);
        form.setData('eliminar_imagen', true);
        setPreview(null);
        setRemoveExisting(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = () => {
        form.post(route('productos.update', producto.cod_producto));
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

                    <FormCard.Section title="Imagen del Producto">
                        <div>
                            <label className={labelClass}>Foto del Producto</label>
                            <p className="text-xs text-gray-500 mb-3">
                                Tamaño recomendado: 800x800px (formato cuadrado). Máximo 2MB. JPG, PNG o WebP.
                            </p>

                            {(() => {
                                const showPreview = !!preview;
                                const showExisting = !showPreview && producto?.image_url && !removeExisting;

                                if (showPreview) {
                                    return (
                                        <div className="relative inline-block">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-48 h-48 object-cover rounded-xl border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                }

                                if (showExisting) {
                                    return (
                                        <div className="relative inline-block">
                                            <img
                                                src={producto.image_url}
                                                alt={producto.nombre_pro}
                                                className="w-48 h-48 object-cover rounded-xl border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                                            dragActive
                                                ? 'border-terracota-500 bg-terracota-50'
                                                : 'border-gray-300 hover:border-terracota-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm font-medium text-gray-600">
                                            Arrastra una imagen aquí o <span className="text-terracota-600">selecciona un archivo</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP (máx. 2MB)</p>
                                    </div>
                                );
                            })()}

                            {form.errors.imagen_pro && (
                                <p className={errorClass}>{form.errors.imagen_pro}</p>
                            )}
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
