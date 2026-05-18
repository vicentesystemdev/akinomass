import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link } from '@inertiajs/react';

export default function ClienteForm({ form, submit, canales, tiposFlujo, estados, isEdit = false }) {
    const onChange = (e) => form.setData(e.target.name, e.target.value);

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <FormCard
            title={isEdit ? 'Datos del Cliente' : 'Nuevo Cliente'}
            subtitle={isEdit ? 'Modifique la información del cliente' : 'Complete la información del cliente'}
            onSubmit={(e) => { e.preventDefault(); submit(); }}
        >
            <FormCard.Section title="Información Personal">
                <FormCard.Row>
                    <div>
                        <label className={labelClass}>
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre_cli"
                            value={form.data.nombre_cli ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.nombre_cli ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Ingrese el nombre completo"
                            required
                        />
                        {form.errors.nombre_cli && (
                            <p className={errorClass}>{form.errors.nombre_cli}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Documento</label>
                        <input
                            type="text"
                            name="documento_cli"
                            value={form.data.documento_cli ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.documento_cli ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="CI, NIT, etc."
                        />
                        {form.errors.documento_cli && (
                            <p className={errorClass}>{form.errors.documento_cli}</p>
                        )}
                    </div>
                </FormCard.Row>
            </FormCard.Section>

            <FormCard.Section title="Contacto">
                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Teléfono</label>
                        <input
                            type="text"
                            name="telefono_cli"
                            value={form.data.telefono_cli ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.telefono_cli ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Número de teléfono"
                        />
                        {form.errors.telefono_cli && (
                            <p className={errorClass}>{form.errors.telefono_cli}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo_cli"
                            value={form.data.correo_cli ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.correo_cli ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="correo@ejemplo.com"
                        />
                        {form.errors.correo_cli && (
                            <p className={errorClass}>{form.errors.correo_cli}</p>
                        )}
                    </div>
                </FormCard.Row>

                <div>
                    <label className={labelClass}>Dirección</label>
                    <input
                        type="text"
                        name="direccion_cli"
                        value={form.data.direccion_cli ?? ''}
                        onChange={onChange}
                        className={`${inputClass} ${form.errors.direccion_cli ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Dirección completa"
                    />
                    {form.errors.direccion_cli && (
                        <p className={errorClass}>{form.errors.direccion_cli}</p>
                    )}
                </div>
            </FormCard.Section>

            <FormCard.Section title="Clasificación Comercial">
                <FormCard.Row>
                    <div>
                        <label className={labelClass}>
                            Estado <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="estado_cli"
                            value={form.data.estado_cli ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.estado_cli ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                            {estados.map((e) => (
                                <option key={e} value={e}>
                                    {e.charAt(0).toUpperCase() + e.slice(1)}
                                </option>
                            ))}
                        </select>
                        {form.errors.estado_cli && (
                            <p className={errorClass}>{form.errors.estado_cli}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>
                            Canal de Venta <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="cod_canal_venta"
                            value={form.data.cod_canal_venta ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.cod_canal_venta ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                            <option value="">Seleccionar canal</option>
                            {canales.map((c) => (
                                <option key={c.cod_canal_venta} value={c.cod_canal_venta}>
                                    {c.nombre_can}
                                </option>
                            ))}
                        </select>
                        {form.errors.cod_canal_venta && (
                            <p className={errorClass}>{form.errors.cod_canal_venta}</p>
                        )}
                    </div>
                </FormCard.Row>

                <div>
                    <label className={labelClass}>
                        Tipo de Flujo Comercial <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="cod_tipo_flujo_comercial"
                        value={form.data.cod_tipo_flujo_comercial ?? ''}
                        onChange={onChange}
                        className={`${inputClass} ${form.errors.cod_tipo_flujo_comercial ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    >
                        <option value="">Seleccionar flujo</option>
                        {tiposFlujo.map((t) => (
                            <option key={t.cod_tipo_flujo_comercial} value={t.cod_tipo_flujo_comercial}>
                                {t.nombre_tip}
                            </option>
                        ))}
                    </select>
                    {form.errors.cod_tipo_flujo_comercial && (
                        <p className={errorClass}>{form.errors.cod_tipo_flujo_comercial}</p>
                    )}
                </div>
            </FormCard.Section>

            <FormCard.Section title="Observaciones">
                <div>
                    <label className={labelClass}>Observaciones</label>
                    <textarea
                        name="observacion_cli"
                        value={form.data.observacion_cli ?? ''}
                        onChange={onChange}
                        rows={3}
                        className={`${inputClass} ${form.errors.observacion_cli ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Notas adicionales sobre el cliente"
                    />
                    {form.errors.observacion_cli && (
                        <p className={errorClass}>{form.errors.observacion_cli}</p>
                    )}
                </div>
            </FormCard.Section>

            <FormCard.Actions>
                <Link href={route('clientes.index')}>
                    <SecondaryButton>Cancelar</SecondaryButton>
                </Link>
                <PrimaryActionButton
                    type="submit"
                    loading={form.processing}
                    disabled={form.processing}
                >
                    {isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
                </PrimaryActionButton>
            </FormCard.Actions>
        </FormCard>
    );
}
