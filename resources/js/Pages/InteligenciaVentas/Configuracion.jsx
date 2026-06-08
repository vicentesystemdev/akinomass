import InputError from '@/Components/InputError';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SectionCard from '@/Components/UI/SectionCard';
import { useForm } from '@inertiajs/react';
import InteligenciaVentasLayout from './Components/InteligenciaVentasLayout';
import { periodoLabels, valueOf } from './Components/formatters';

const perfiles = {
    conservador: {
        nombre: 'Conservador',
        descripcion: 'Menor inversion, menor riesgo y recomendaciones mas prudentes. Ideal para cuidar liquidez.',
        etiqueta: 'Liquidez',
        valores: {
            umbral_indice_demanda_baja: 0.80,
            umbral_indice_demanda_alta: 1.30,
            porcentaje_stock_seguridad: 10,
            stock_seguridad_minimo: 1,
            limite_factor_tendencia_min: 0.80,
            limite_factor_tendencia_max: 1.20,
            peso_transicion_demanda: 0.45,
            peso_tendencia: 0.20,
            peso_rotacion: 0.25,
            peso_canal: 0.10,
        },
    },
    equilibrado: {
        nombre: 'Equilibrado',
        descripcion: 'Balance entre inversion, oportunidad y control de riesgo. Recomendado para uso normal.',
        etiqueta: 'Recomendado',
        valores: {
            umbral_indice_demanda_baja: 0.70,
            umbral_indice_demanda_alta: 1.20,
            porcentaje_stock_seguridad: 20,
            stock_seguridad_minimo: 1,
            limite_factor_tendencia_min: 0.70,
            limite_factor_tendencia_max: 1.40,
            peso_transicion_demanda: 0.40,
            peso_tendencia: 0.25,
            peso_rotacion: 0.20,
            peso_canal: 0.15,
        },
    },
    agresivo: {
        nombre: 'Agresivo',
        descripcion: 'Mayor inversion y mayor oportunidad de ganancia, con mayor riesgo comercial. Ideal para temporadas fuertes.',
        etiqueta: 'Temporada fuerte',
        valores: {
            umbral_indice_demanda_baja: 0.60,
            umbral_indice_demanda_alta: 1.10,
            porcentaje_stock_seguridad: 30,
            stock_seguridad_minimo: 2,
            limite_factor_tendencia_min: 0.60,
            limite_factor_tendencia_max: 1.60,
            peso_transicion_demanda: 0.30,
            peso_tendencia: 0.35,
            peso_rotacion: 0.15,
            peso_canal: 0.20,
        },
    },
};

export default function Configuracion({ configuracion = {} }) {
    const { data, setData, patch, processing, errors } = useForm({
        dias_analisis: configuracion?.dias_analisis ?? 90,
        periodo_agrupacion: valueOf(configuracion?.periodo_agrupacion) || 'mensual',
        umbral_indice_demanda_baja: configuracion?.umbral_indice_demanda_baja ?? 0.7,
        umbral_indice_demanda_alta: configuracion?.umbral_indice_demanda_alta ?? 1.2,
        porcentaje_stock_seguridad: configuracion?.porcentaje_stock_seguridad ?? 20,
        stock_seguridad_minimo: configuracion?.stock_seguridad_minimo ?? 1,
        limite_factor_tendencia_min: configuracion?.limite_factor_tendencia_min ?? 0.7,
        limite_factor_tendencia_max: configuracion?.limite_factor_tendencia_max ?? 1.4,
        peso_transicion_demanda: configuracion?.peso_transicion_demanda ?? 0.4,
        peso_tendencia: configuracion?.peso_tendencia ?? 0.25,
        peso_rotacion: configuracion?.peso_rotacion ?? 0.2,
        peso_canal: configuracion?.peso_canal ?? 0.15,
        activo: Boolean(configuracion?.activo ?? true),
    });
    const pesoTotal = ['peso_transicion_demanda', 'peso_tendencia', 'peso_rotacion', 'peso_canal']
        .reduce((total, field) => total + (Number.parseFloat(data[field]) || 0), 0);
    const pesosFueraDeRango = pesoTotal < 0.95 || pesoTotal > 1.05;
    const perfilSeleccionado = Object.entries(perfiles).find(([, perfil]) => {
        return Object.entries(perfil.valores).every(([field, value]) => Number.parseFloat(data[field]) === value);
    })?.[0];

    const submit = (event) => {
        event.preventDefault();
        patch(route('inteligencia-ventas.configuracion.update'), { preserveScroll: true });
    };

    const aplicarPerfil = (perfil) => {
        setData({ ...data, ...perfil.valores });
    };

    return (
        <InteligenciaVentasLayout
            title="Configuracion de Inteligencia de Ventas"
            subtitle="Parametros operativos del modelo de proyeccion comercial"
        >
            <form onSubmit={submit} className="space-y-6">
                <SectionCard
                    title="Perfil de recomendacion"
                    subtitle="Selecciona una base de configuracion segun el nivel de inversion y riesgo que quieras asumir."
                >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {Object.entries(perfiles).map(([key, perfil]) => {
                            const selected = perfilSeleccionado === key;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => aplicarPerfil(perfil)}
                                    className={`rounded-xl border p-5 text-left transition-all ${
                                        selected
                                            ? 'border-terracota-500 bg-terracota-50 shadow-card'
                                            : 'border-gray-100 bg-white hover:border-oliva-200 hover:bg-oliva-50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className={`text-lg font-bold ${selected ? 'text-terracota-800' : 'text-cafe-900'}`}>{perfil.nombre}</h3>
                                            <p className="mt-1 text-sm leading-6 text-cafe-700">{perfil.descripcion}</p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${selected ? 'bg-terracota-500 text-white' : 'bg-oliva-100 text-oliva-800'}`}>
                                            {perfil.etiqueta}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 rounded-xl border border-oliva-100 bg-oliva-50 px-4 py-3 text-sm leading-6 text-oliva-900">
                        Para uso normal se recomienda el perfil Equilibrado. Los valores avanzados pueden ajustarse manualmente si el comportamiento real del negocio lo requiere.
                    </div>
                </SectionCard>

                <SectionCard title="Configuracion avanzada" subtitle="Ajustes manuales del modelo para administradores que necesitan calibrar la recomendacion.">
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-cafe-700">Periodo de analisis</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field label="Dias de analisis" name="dias_analisis" type="number" value={data.dias_analisis} setData={setData} error={errors.dias_analisis} help="Cantidad de dias historicos que se revisan para proyectar ventas." range="Recomendado: 30 a 365 dias." />
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-cafe-700">Tipo de periodo</span>
                                    <select
                                        value={data.periodo_agrupacion}
                                        onChange={(event) => setData('periodo_agrupacion', event.target.value)}
                                        className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500"
                                    >
                                        {Object.entries(periodoLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                    <p className="mt-1 text-xs leading-5 text-gray-500">Define como se agrupan las ventas para leer la tendencia comercial.</p>
                                    <InputError message={errors.periodo_agrupacion} className="mt-1" />
                                </label>
                                <label className="flex items-center gap-3 rounded-xl border border-gray-100 bg-oliva-50 px-4 py-3 text-sm font-semibold text-oliva-800">
                                    <input
                                        type="checkbox"
                                        checked={data.activo}
                                        onChange={(event) => setData('activo', event.target.checked)}
                                        className="rounded border-gray-300 text-terracota-600 focus:ring-terracota-500"
                                    />
                                    Configuracion activa
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-cafe-700">Umbrales de demanda y seguridad</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <Field label="Umbral indice demanda baja" name="umbral_indice_demanda_baja" type="number" step="0.01" value={data.umbral_indice_demanda_baja} setData={setData} error={errors.umbral_indice_demanda_baja} help="Define cuando un producto se considera por debajo del comportamiento normal de su categoria." range="Rango recomendado: 0.60 a 0.80." />
                                <Field label="Umbral indice demanda alta" name="umbral_indice_demanda_alta" type="number" step="0.01" value={data.umbral_indice_demanda_alta} setData={setData} error={errors.umbral_indice_demanda_alta} help="Define cuando un producto se considera con demanda superior al promedio de su categoria." range="Rango recomendado: 1.10 a 1.40." />
                                <Field label="Porcentaje stock de seguridad" name="porcentaje_stock_seguridad" type="number" step="0.01" value={data.porcentaje_stock_seguridad} setData={setData} error={errors.porcentaje_stock_seguridad} help="Colchon adicional de mercaderia para reducir el riesgo de quedarse sin stock." range="Rango recomendado: 10% a 30%." />
                                <Field label="Stock de seguridad minimo" name="stock_seguridad_minimo" type="number" value={data.stock_seguridad_minimo} setData={setData} error={errors.stock_seguridad_minimo} help="Cantidad minima adicional recomendada aunque la proyeccion sea baja." range="Recomendado: 1 a 2 unidades." />
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-cafe-700">Factor de tendencia</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field label="Limite minimo de factor de tendencia" name="limite_factor_tendencia_min" type="number" step="0.01" value={data.limite_factor_tendencia_min} setData={setData} error={errors.limite_factor_tendencia_min} help="Evita que una caida temporal reduzca demasiado la proyeccion." range="Rango recomendado: 0.60 a 0.80." />
                                <Field label="Limite maximo de factor de tendencia" name="limite_factor_tendencia_max" type="number" step="0.01" value={data.limite_factor_tendencia_max} setData={setData} error={errors.limite_factor_tendencia_max} help="Evita que una subida puntual genere recomendaciones exageradas." range="Rango recomendado: 1.20 a 1.60." />
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-cafe-700">Pesos del modelo</h3>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${pesosFueraDeRango ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                    Suma actual: {pesoTotal.toFixed(2)}
                                </span>
                            </div>
                            {pesosFueraDeRango && (
                                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                                    Los pesos del modelo deberian sumar aproximadamente 1.00 para mantener una recomendacion equilibrada.
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <Field label="Peso transicion de demanda" name="peso_transicion_demanda" type="number" step="0.01" value={data.peso_transicion_demanda} setData={setData} error={errors.peso_transicion_demanda} help="Importancia del comportamiento historico de la demanda." range="Los pesos del modelo deben sumar aproximadamente 1.00." />
                                <Field label="Peso tendencia" name="peso_tendencia" type="number" step="0.01" value={data.peso_tendencia} setData={setData} error={errors.peso_tendencia} help="Importancia de si las ventas recientes estan subiendo o bajando." range="Los pesos del modelo deben sumar aproximadamente 1.00." />
                                <Field label="Peso rotacion" name="peso_rotacion" type="number" step="0.01" value={data.peso_rotacion} setData={setData} error={errors.peso_rotacion} help="Importancia de la velocidad con la que se vende el stock." range="Los pesos del modelo deben sumar aproximadamente 1.00." />
                                <Field label="Peso canal" name="peso_canal" type="number" step="0.01" value={data.peso_canal} setData={setData} error={errors.peso_canal} help="Importancia del canal dominante, como WhatsApp, Instagram o tienda web." range="Los pesos del modelo deben sumar aproximadamente 1.00." />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <div className="flex justify-end">
                    <PrimaryActionButton type="submit" loading={processing}>
                        Guardar configuracion
                    </PrimaryActionButton>
                </div>
            </form>
        </InteligenciaVentasLayout>
    );
}

function Field({ label, name, value, setData, error, help, range, ...props }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-cafe-700">{label}</span>
            <input
                {...props}
                value={value}
                onChange={(event) => setData(name, event.target.value)}
                className="w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm focus:border-terracota-500 focus:ring-terracota-500"
            />
            {help && <p className="mt-1 text-xs leading-5 text-gray-500">{help}</p>}
            {range && <p className="mt-1 text-[11px] font-semibold leading-5 text-oliva-700">{range}</p>}
            <InputError message={error} className="mt-1" />
        </label>
    );
}
