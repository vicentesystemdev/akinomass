import { useForm } from '@inertiajs/react';

export default function AuditoriaFilters({ usuarios, modulos, acciones, filtros }) {
    const form = useForm({
        user_id: filtros?.user_id ?? '',
        accion_aud: filtros?.accion_aud ?? '',
        modulo_aud: filtros?.modulo_aud ?? '',
        fecha_desde: filtros?.fecha_desde ?? '',
        fecha_hasta: filtros?.fecha_hasta ?? '',
        buscar: filtros?.buscar ?? '',
    });

    const apply = () => {
        const params = {};
        Object.entries(form.data).forEach(([k, v]) => {
            if (v !== '' && v !== null) params[k] = v;
        });
        window.location.href = route('auditoria.index') + '?' + new URLSearchParams(params).toString();
    };

    const clear = () => {
        window.location.href = route('auditoria.index');
    };

    const selectClass = "rounded-lg border-gray-300 text-sm py-2 px-3 focus:border-terracota-500 focus:ring-terracota-500";

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                <div className="w-40">
                    <label className="block text-xs text-gray-500 mb-1">Desde</label>
                    <input
                        type="date"
                        value={form.data.fecha_desde}
                        onChange={(e) => form.setData('fecha_desde', e.target.value)}
                        className={selectClass + ' w-full'}
                    />
                </div>
                <div className="w-40">
                    <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                    <input
                        type="date"
                        value={form.data.fecha_hasta}
                        onChange={(e) => form.setData('fecha_hasta', e.target.value)}
                        className={selectClass + ' w-full'}
                    />
                </div>
                <div className="w-48">
                    <label className="block text-xs text-gray-500 mb-1">Usuario</label>
                    <select
                        value={form.data.user_id}
                        onChange={(e) => form.setData('user_id', e.target.value)}
                        className={selectClass + ' w-full'}
                    >
                        <option value="">Todos</option>
                        {usuarios.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-40">
                    <label className="block text-xs text-gray-500 mb-1">Módulo</label>
                    <select
                        value={form.data.modulo_aud}
                        onChange={(e) => form.setData('modulo_aud', e.target.value)}
                        className={selectClass + ' w-full'}
                    >
                        <option value="">Todos</option>
                        {modulos.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="w-40">
                    <label className="block text-xs text-gray-500 mb-1">Acción</label>
                    <select
                        value={form.data.accion_aud}
                        onChange={(e) => form.setData('accion_aud', e.target.value)}
                        className={selectClass + ' w-full'}
                    >
                        <option value="">Todas</option>
                        {acciones.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs text-gray-500 mb-1">Buscar</label>
                    <input
                        type="text"
                        value={form.data.buscar}
                        onChange={(e) => form.setData('buscar', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && apply()}
                        placeholder="Descripción, tabla, registro, IP..."
                        className={selectClass + ' w-full'}
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={apply}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-terracota-500 rounded-lg hover:bg-terracota-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Filtrar
                </button>
                <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
}
