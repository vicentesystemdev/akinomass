import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import VariantsSection from './VariantsSection';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import { filterLetters, toUpper, filterNumeric } from '@/utils/formatters';

export default function Create({ categorias, tallas }) {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const form = useForm({
        cod_categoria_producto: '',
        nombre_pro: '',
        descripcion_pro: '',
        precio_venta_pro: '',
        precio_costo_pro: '',
        sku_pro: '',
        imagen_pro: null,
        estado_pro: 'activo',
        variantes: [],
    });

    const handleFile = useCallback((file) => {
        if (!file) return;

        form.setData('imagen_pro', file);
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
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const validateDecimal = (val) => {
        if (val === '' || val === null || val === undefined) return true;
        return /^\d+(\.\d)?$/.test(val.toString());
    };

    const submit = () => {
        form.clearErrors();

        const venta = form.data.precio_venta_pro;
        const costo = form.data.precio_costo_pro;

        if (venta && !validateDecimal(venta)) {
            form.setError('precio_venta_pro', 'El precio de venta no puede tener más de un decimal (ej: 10.5).');
            return;
        }

        if (costo && !validateDecimal(costo)) {
            form.setError('precio_costo_pro', 'El precio de costo no puede tener más de un decimal (ej: 10.5).');
            return;
        }

        const ventaFloat = parseFloat(venta);
        const costoFloat = parseFloat(costo);

        if (costoFloat && ventaFloat < costoFloat) {
            form.setError('precio_venta_pro', 'El precio de venta no puede ser menor al precio de costo.');
            return;
        }

        let hasVariantError = false;
        if (form.data.variantes && form.data.variantes.length > 0) {
            form.data.variantes.forEach((v, index) => {
                if (v.precio_venta_variante && !validateDecimal(v.precio_venta_variante)) {
                    form.setError(`variantes.${index}.precio_venta_variante`, 'El precio de la variante no puede tener más de un decimal (ej: 10.5).');
                    hasVariantError = true;
                }
            });
        }

        if (hasVariantError) return;

        form.post(route('productos.store'));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Nuevo Producto"
                    subtitle="Agrega un nuevo producto a tu catálogo"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Productos', href: route('productos.index') },
                        { label: 'Nuevo Producto' },
                    ]}
                />
            }
        >
            <Head title="Nuevo Producto" />

            <div className="max-w-3xl mx-auto">
                <FormCard
                    title="Datos del Producto"
                    subtitle="Complete la información del nuevo producto"
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
                                    onChange={(e) => form.setData('nombre_pro', filterLetters(e.target.value))}
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
                                    onChange={(e) => form.setData('sku_pro', toUpper(e.target.value))}
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
                            <p className="mt-2 text-xs text-gray-500">El producto se creará con estado activo.</p>
                        </div>
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
                                        type="text"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={form.data.precio_venta_pro ?? ''}
                                        onChange={(e) => form.setData('precio_venta_pro', filterNumeric(e.target.value))}
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
                                        type="text"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={form.data.precio_costo_pro ?? ''}
                                        onChange={(e) => form.setData('precio_costo_pro', filterNumeric(e.target.value))}
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

                    <FormCard.Section title="Variantes y tallas">
                        <VariantsSection form={form} tallas={tallas} baseSku={form.data.sku_pro} categorias={categorias} />
                    </FormCard.Section>

                    <FormCard.Section title="Imagen del Producto">
                        <div>
                            <label className={labelClass}>Foto del Producto</label>
                            <p className="text-xs text-gray-500 mb-3">
                                Tamaño recomendado: 800x800px (formato cuadrado). Máximo 2MB. JPG, PNG o WebP.
                            </p>

                            {preview ? (
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
                            ) : (
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
                            )}

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
                            Crear Producto
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
