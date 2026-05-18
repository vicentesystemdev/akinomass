import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link } from '@inertiajs/react';

export default function LeadForm({ form, submit, canales, tiposFlujo, usuarios, estados, isEdit = false }) {
    const onChange = (e) => form.setData(e.target.name, e.target.value);

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <FormCard
            title={isEdit ? 'Datos del Lead' : 'Nuevo Lead'}
            subtitle={isEdit ? 'Modifique la información del lead' : 'Complete la información del prospecto'}
            onSubmit={(e) => { e.preventDefault(); submit(); }}
        >
            <FormCard.Section title="Información del Prospecto">
                <FormCard.Row>
                    <div>
                        <label className={labelClass}>
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre_lea"
                            value={form.data.nombre_lea ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.nombre_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Nombre completo del lead"
                            required
                        />
                        {form.errors.nombre_lea && (
                            <p className={errorClass}>{form.errors.nombre_lea}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Alias</label>
                        <input
                            type="text"
                            name="alias_lea"
                            value={form.data.alias_lea ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.alias_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Apodo o nombre corto"
                        />
                        {form.errors.alias_lea && (
                            <p className={errorClass}>{form.errors.alias_lea}</p>
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
                            name="telefono_lea"
                            value={form.data.telefono_lea ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.telefono_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Número de teléfono"
                        />
                        {form.errors.telefono_lea && (
                            <p className={errorClass}>{form.errors.telefono_lea}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo_lea"
                            value={form.data.correo_lea ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.correo_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="correo@ejemplo.com"
                        />
                        {form.errors.correo_lea && (
                            <p className={errorClass}>{form.errors.correo_lea}</p>
                        )}
                    </div>
                </FormCard.Row>
            </FormCard.Section>

            <FormCard.Section title="Interés Comercial">
                <div>
                    <label className={labelClass}>Producto de Interés</label>
                    <input
                        type="text"
                        name="producto_interes_lea"
                        value={form.data.producto_interes_lea ?? ''}
                        onChange={onChange}
                        className={`${inputClass} ${form.errors.producto_interes_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="¿Qué producto o servicio le interesa?"
                    />
                    {form.errors.producto_interes_lea && (
                        <p className={errorClass}>{form.errors.producto_interes_lea}</p>
                    )}
                </div>

                <FormCard.Row>
                    <div>
                        <label className={labelClass}>
                            Estado <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="estado_lea"
                            value={form.data.estado_lea ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.estado_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                            {estados.map((e) => (
                                <option key={e} value={e}>
                                    {e.charAt(0).toUpperCase() + e.slice(1)}
                                </option>
                            ))}
                        </select>
                        {form.errors.estado_lea && (
                            <p className={errorClass}>{form.errors.estado_lea}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Fecha de Seguimiento</label>
                        <input
                            type="date"
                            name="fecha_seguimiento_lea"
                            value={form.data.fecha_seguimiento_lea ?? ''}
                            onChange={onChange}
                            className={`${inputClass} ${form.errors.fecha_seguimiento_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {form.errors.fecha_seguimiento_lea && (
                            <p className={errorClass}>{form.errors.fecha_seguimiento_lea}</p>
                        )}
                    </div>
                </FormCard.Row>
            </FormCard.Section>

            <FormCard.Section title="Clasificación Comercial">
                <FormCard.Row>
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
                </FormCard.Row>

                <div>
                    <label className={labelClass}>Responsable</label>
                    <select
                        name="cod_usuario_responsable"
                        value={form.data.cod_usuario_responsable ?? ''}
                        onChange={onChange}
                        className={`${inputClass} ${form.errors.cod_usuario_responsable ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    >
                        <option value="">Sin responsable asignado</option>
                        {usuarios.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {form.errors.cod_usuario_responsable && (
                        <p className={errorClass}>{form.errors.cod_usuario_responsable}</p>
                    )}
                </div>
            </FormCard.Section>

            <FormCard.Section title="Observaciones">
                <div>
                    <label className={labelClass}>Observaciones</label>
                    <textarea
                        name="observacion_lea"
                        value={form.data.observacion_lea ?? ''}
                        onChange={onChange}
                        rows={3}
                        className={`${inputClass} ${form.errors.observacion_lea ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Notas adicionales sobre el lead"
                    />
                    {form.errors.observacion_lea && (
                        <p className={errorClass}>{form.errors.observacion_lea}</p>
                    )}
                </div>
            </FormCard.Section>

            <FormCard.Actions>
                <Link href={route('leads.index')}>
                    <SecondaryButton>Cancelar</SecondaryButton>
                </Link>
                <PrimaryActionButton
                    type="submit"
                    loading={form.processing}
                    disabled={form.processing}
                >
                    {isEdit ? 'Actualizar Lead' : 'Registrar Lead'}
                </PrimaryActionButton>
            </FormCard.Actions>
        </FormCard>
    );
}
