import Button from '@/Components/Button';
import { Link } from '@inertiajs/react';

export default function ClienteForm({ form, submit, canales, tiposFlujo, estados, isEdit = false }) {
    const onChange = (e) => form.setData(e.target.name, e.target.value);

    const inputClass = "w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5 px-3 text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Nombre *</label>
                    <input
                        type="text"
                        name="nombre_cli"
                        value={form.data.nombre_cli ?? ''}
                        onChange={onChange}
                        className={inputClass}
                        placeholder="Ingrese el nombre"
                        required
                    />
                </div>

                <div>
                    <label className={labelClass}>Teléfono</label>
                    <input
                        type="text"
                        name="telefono_cli"
                        value={form.data.telefono_cli ?? ''}
                        onChange={onChange}
                        className={inputClass}
                        placeholder="Ingrese el teléfono"
                    />
                </div>

                <div>
                    <label className={labelClass}>Correo</label>
                    <input
                        type="email"
                        name="correo_cli"
                        value={form.data.correo_cli ?? ''}
                        onChange={onChange}
                        className={inputClass}
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div>
                    <label className={labelClass}>Documento</label>
                    <input
                        type="text"
                        name="documento_cli"
                        value={form.data.documento_cli ?? ''}
                        onChange={onChange}
                        className={inputClass}
                        placeholder="CI, NIT, etc."
                    />
                </div>

                <div className="md:col-span-2">
                    <label className={labelClass}>Dirección</label>
                    <input
                        type="text"
                        name="direccion_cli"
                        value={form.data.direccion_cli ?? ''}
                        onChange={onChange}
                        className={inputClass}
                        placeholder="Dirección completa"
                    />
                </div>

                <div>
                    <label className={labelClass}>Estado</label>
                    <select
                        name="estado_cli"
                        value={form.data.estado_cli ?? ''}
                        onChange={onChange}
                        className={inputClass}
                    >
                        {estados.map((e) => (
                            <option key={e} value={e}>
                                {e.charAt(0).toUpperCase() + e.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Canal de Venta</label>
                    <select
                        name="cod_canal_venta"
                        value={form.data.cod_canal_venta ?? ''}
                        onChange={onChange}
                        className={inputClass}
                    >
                        <option value="">Seleccionar canal</option>
                        {canales.map((c) => (
                            <option key={c.cod_canal_venta} value={c.cod_canal_venta}>
                                {c.nombre_can}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Tipo de Flujo Comercial</label>
                    <select
                        name="cod_tipo_flujo_comercial"
                        value={form.data.cod_tipo_flujo_comercial ?? ''}
                        onChange={onChange}
                        className={inputClass}
                    >
                        <option value="">Seleccionar flujo</option>
                        {tiposFlujo.map((t) => (
                            <option key={t.cod_tipo_flujo_comercial} value={t.cod_tipo_flujo_comercial}>
                                {t.nombre_tip}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className={labelClass}>Observación</label>
                    <textarea
                        name="observacion_cli"
                        value={form.data.observacion_cli ?? ''}
                        onChange={onChange}
                        rows={3}
                        className={inputClass}
                        placeholder="Notas adicionales sobre el cliente"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Link href={route('clientes.index')}>
                    <Button variant="secondary">Cancelar</Button>
                </Link>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={form.processing}
                >
                    {form.processing ? 'Guardando...' : (isEdit ? 'Actualizar Cliente' : 'Crear Cliente')}
                </Button>
            </div>
        </form>
    );
}