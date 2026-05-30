import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { MapPin, Plus, Edit, Trash, Check } from 'lucide-react';

export default function CuentaDirecciones({ auth, direcciones }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        etiqueta_dir: '',
        nombre_destinatario_dir: '',
        telefono_dir: '',
        direccion_dir: '',
        ciudad_dir: '',
        departamento_dir: '',
        es_predeterminada_dir: false,
    });

    const resetForm = () => {
        setForm({
            etiqueta_dir: '',
            nombre_destinatario_dir: '',
            telefono_dir: '',
            direccion_dir: '',
            ciudad_dir: '',
            departamento_dir: '',
            es_predeterminada_dir: false,
        });
        setEditing(null);
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            router.patch(`/tienda/mis-direcciones/${editing}`, form, {
                preserveScroll: true,
                onSuccess: resetForm,
            });
        } else {
            router.post('/tienda/mis-direcciones', form, {
                preserveScroll: true,
                onSuccess: resetForm,
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar esta dirección?')) {
            router.delete(`/tienda/mis-direcciones/${id}`, { preserveScroll: true });
        }
    };

    const handleSetDefault = (id) => {
        router.patch(`/tienda/mis-direcciones/${id}/predeterminada`, {}, { preserveScroll: true });
    };

    return (
        <CustomerLayout auth={auth}>
            <Head title="Mis Direcciones - AKINOMASS" />

            <div className="flex items-center justify-between mb-6">
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2B221E' }}>Mis Direcciones</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                    <Plus size={14} />
                    Nueva Dirección
                </button>
            </div>

            {showForm && (
                <div className="p-5 rounded-2xl bg-white mb-6" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>
                        {editing ? 'Editar Dirección' : 'Nueva Dirección'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Etiqueta</label>
                                <input
                                    type="text"
                                    value={form.etiqueta_dir}
                                    onChange={(e) => setForm({ ...form, etiqueta_dir: e.target.value })}
                                    placeholder="Ej: Casa, Oficina"
                                    required
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 13.5, outline: 'none', color: '#2B221E' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Nombre destinatario</label>
                                <input
                                    type="text"
                                    value={form.nombre_destinatario_dir}
                                    onChange={(e) => setForm({ ...form, nombre_destinatario_dir: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 13.5, outline: 'none', color: '#2B221E' }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Dirección completa</label>
                                <input
                                    type="text"
                                    value={form.direccion_dir}
                                    onChange={(e) => setForm({ ...form, direccion_dir: e.target.value })}
                                    placeholder="Av. 6 de Agosto #1234"
                                    required
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 13.5, outline: 'none', color: '#2B221E' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Ciudad</label>
                                <input
                                    type="text"
                                    value={form.ciudad_dir}
                                    onChange={(e) => setForm({ ...form, ciudad_dir: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 13.5, outline: 'none', color: '#2B221E' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#544a45', display: 'block', marginBottom: 5 }}>Departamento</label>
                                <input
                                    type="text"
                                    value={form.departamento_dir}
                                    onChange={(e) => setForm({ ...form, departamento_dir: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 13.5, outline: 'none', color: '#2B221E' }}
                                />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.es_predeterminada_dir}
                                onChange={(e) => setForm({ ...form, es_predeterminada_dir: e.target.checked })}
                                style={{ accentColor: '#D77A61' }}
                            />
                            <span style={{ fontSize: 13, color: '#544a45' }}>Marcar como predeterminada</span>
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl"
                                style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                            >
                                {editing ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2.5 rounded-xl hover:bg-gray-50"
                                style={{ fontSize: 13, color: '#6B7280', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!direcciones || direcciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#FDF6F0' }}>
                        <MapPin size={32} style={{ color: '#D77A61' }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#544a45' }}>No tienes direcciones guardadas</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {direcciones.map((dir) => (
                        <div
                            key={dir.cod_direccion_cliente}
                            className="p-5 rounded-2xl bg-white"
                            style={{ border: `1px solid ${dir.es_predeterminada_dir ? '#D77A61' : 'rgba(0,0,0,0.07)'}` }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="px-2 py-0.5 rounded-lg"
                                            style={{ fontSize: 11, fontWeight: 600, background: '#f4f5f4', color: '#3C473A' }}
                                        >
                                            {dir.etiqueta_dir}
                                        </span>
                                        {dir.es_predeterminada_dir && (
                                            <span
                                                className="px-2 py-0.5 rounded-lg flex items-center gap-1"
                                                style={{ fontSize: 11, fontWeight: 600, background: '#ECFDF5', color: '#059669' }}
                                            >
                                                <Check size={10} /> Predeterminada
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2B221E' }}>{dir.nombre_destinatario_dir}</p>
                                    <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{dir.direccion_dir}</p>
                                    <p style={{ fontSize: 13, color: '#6B7280' }}>
                                        {[dir.ciudad_dir, dir.departamento_dir].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!dir.es_predeterminada_dir && (
                                        <button
                                            onClick={() => handleSetDefault(dir.cod_direccion_cliente)}
                                            className="px-3 py-1.5 rounded-lg hover:bg-gray-50"
                                            style={{ fontSize: 12, color: '#3C473A', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer' }}
                                        >
                                            Predeterminada
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(dir.cod_direccion_cliente)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                                        style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CustomerLayout>
    );
}
