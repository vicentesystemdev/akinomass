import { useState } from "react";
import { Search, Plus, Filter, User, Phone, MapPin, ShoppingBag, Eye, Edit2, X, Star } from "lucide-react";

const CLIENTS = [
  { id: 1, name: "María Pérez Quispe", email: "mperez@gmail.com", phone: "74123456", city: "La Paz", orders: 12, spent: 3840, segment: "VIP", channel: "TikTok LIVE", status: "activo", avatar: "MP", lastOrder: "2026-04-28" },
  { id: 2, name: "Carlos Mamani Rivera", email: "cmamani@yahoo.com", phone: "67890123", city: "Cochabamba", orders: 5, spent: 1250, segment: "Regular", channel: "WhatsApp", status: "activo", avatar: "CM", lastOrder: "2026-04-15" },
  { id: 3, name: "Ana García López", email: "ana.garcia@gmail.com", phone: "78456789", city: "La Paz", orders: 8, spent: 2400, segment: "VIP", channel: "Instagram", status: "activo", avatar: "AG", lastOrder: "2026-05-01" },
  { id: 4, name: "Luis Flores Condori", email: "lflores@hotmail.com", phone: "71234567", city: "Santa Cruz", orders: 3, spent: 680, segment: "Nuevo", channel: "Facebook", status: "activo", avatar: "LF", lastOrder: "2026-04-10" },
  { id: 5, name: "Paola Quispe Mamani", email: "paola.q@gmail.com", phone: "69012345", city: "La Paz", orders: 15, spent: 4920, segment: "VIP", channel: "TikTok LIVE", status: "activo", avatar: "PQ", lastOrder: "2026-05-02" },
  { id: 6, name: "Roberto Chura Apaza", email: "rchura@gmail.com", phone: "76543210", city: "El Alto", orders: 2, spent: 380, segment: "Nuevo", channel: "WhatsApp", status: "inactivo", avatar: "RC", lastOrder: "2026-03-20" },
  { id: 7, name: "Valentina Soria Cruz", email: "vsoria@gmail.com", phone: "72345678", city: "La Paz", orders: 7, spent: 1980, segment: "Regular", channel: "Instagram", status: "activo", avatar: "VS", lastOrder: "2026-04-22" },
  { id: 8, name: "Diego Alvarado Pinto", email: "dalvarado@gmail.com", phone: "68901234", city: "Cochabamba", orders: 4, spent: 960, segment: "Regular", channel: "Facebook", status: "activo", avatar: "DA", lastOrder: "2026-04-18" },
];

const segmentColors: Record<string, { bg: string; text: string }> = {
  VIP: { bg: "#FEF3C7", text: "#D97706" },
  Regular: { bg: "#EFF6FF", text: "#2563EB" },
  Nuevo: { bg: "#ECFDF5", text: "#059669" },
};

const channelColors: Record<string, string> = {
  "TikTok LIVE": "#7C3AED", "Instagram": "#EC4899", "Facebook": "#2563EB", "WhatsApp": "#16A34A",
};

export function CRMPage() {
  const [search, setSearch] = useState("");
  const [segFilter, setSegFilter] = useState("todos");
  const [selected, setSelected] = useState<typeof CLIENTS[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", city: "", channel: "" });

  const filtered = CLIENTS.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
    const matchSeg = segFilter === "todos" || c.segment.toLowerCase() === segFilter;
    return matchSearch && matchSeg;
  });

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>CRM — Clientes</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>{CLIENTS.length} clientes registrados</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", fontSize: 13.5, fontWeight: 500 }}
        >
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Clientes", value: "128", color: "#2563EB", bg: "#EFF6FF" },
          { label: "VIP", value: "38", color: "#D97706", bg: "#FEF3C7" },
          { label: "Nuevos (mes)", value: "14", color: "#059669", bg: "#ECFDF5" },
          { label: "Inactivos", value: "12", color: "#EF4444", bg: "#FEF2F2" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm"
            style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o ciudad..."
            className="bg-transparent outline-none flex-1 text-gray-700"
            style={{ fontSize: 13.5 }} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-gray-400" />
          {["todos", "vip", "regular", "nuevo"].map((s) => (
            <button key={s} onClick={() => setSegFilter(s)}
              className="px-3 py-1.5 rounded-lg capitalize transition-all"
              style={{
                fontSize: 12.5, fontWeight: 500,
                background: segFilter === s ? "#7C3AED" : "#F3F4F6",
                color: segFilter === s ? "white" : "#6B7280",
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                {["Cliente", "Contacto", "Ciudad", "Canal", "Pedidos", "Total gastado", "Segmento", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500"
                    style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const seg = segmentColors[c.segment];
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: "1px solid #F9FAFB" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 12, fontWeight: 700 }}>
                          {c.avatar}
                        </div>
                        <div>
                          <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{c.name}</p>
                          <p className="text-gray-400" style={{ fontSize: 11.5 }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600" style={{ fontSize: 12.5 }}>
                        <Phone size={12} className="text-gray-400" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600" style={{ fontSize: 12.5 }}>
                        <MapPin size={12} className="text-gray-400" />
                        {c.city}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{
                        fontSize: 11.5, fontWeight: 500,
                        color: channelColors[c.channel] || "#6B7280",
                        background: `${channelColors[c.channel]}18` || "#F3F4F6",
                        padding: "2px 8px", borderRadius: 20
                      }}>
                        {c.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag size={13} style={{ color: "#7C3AED" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{c.orders}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>
                        Bs. {c.spent.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 11.5, fontWeight: 500, background: seg.bg, color: seg.text, padding: "2px 8px", borderRadius: 20 }}>
                        {c.segment === "VIP" && <Star size={10} className="inline mr-1" />}
                        {c.segment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{
                        fontSize: 11.5, fontWeight: 500,
                        background: c.status === "activo" ? "#ECFDF5" : "#F3F4F6",
                        color: c.status === "activo" ? "#059669" : "#6B7280",
                        padding: "2px 8px", borderRadius: 20
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(c)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          style={{ color: "#2563EB" }}>
                          <Eye size={15} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                          style={{ color: "#7C3AED" }}>
                          <Edit2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <User size={36} className="mx-auto mb-2 opacity-30" />
            <p style={{ fontSize: 14 }}>No se encontraron clientes</p>
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 text-white" style={{ background: "linear-gradient(135deg, #1E1B4B, #2563EB)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: "rgba(255,255,255,0.2)", fontSize: 18 }}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 17 }}>{selected.name}</h3>
                    <p style={{ fontSize: 13, color: "#A5B4FC" }}>Cliente ID #{selected.id.toString().padStart(4, "0")}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Email", value: selected.email },
                  { label: "Teléfono", value: selected.phone },
                  { label: "Ciudad", value: selected.city },
                  { label: "Canal origen", value: selected.channel },
                  { label: "Segmento", value: selected.segment },
                  { label: "Último pedido", value: selected.lastOrder },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-gray-400" style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase" }}>{f.label}</p>
                    <p style={{ fontSize: 13.5, color: "#111827", fontWeight: 500, marginTop: 2 }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl" style={{ background: "#EFF6FF" }}>
                  <p className="text-gray-500" style={{ fontSize: 12 }}>Total pedidos</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: "#2563EB" }}>{selected.orders}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "#F5F3FF" }}>
                  <p className="text-gray-500" style={{ fontSize: 12 }}>Total gastado</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#7C3AED" }}>Bs. {selected.spent.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 rounded-xl text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 14 }}
              >
                Ver historial completo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Nuevo Cliente</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Nombre completo *", key: "name", placeholder: "Ej: Ana García" },
                { label: "Correo electrónico *", key: "email", placeholder: "Ej: ana@gmail.com" },
                { label: "Teléfono", key: "phone", placeholder: "Ej: 74123456" },
                { label: "Ciudad", key: "city", placeholder: "Ej: La Paz" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</label>
                  <input value={newClient[f.key as keyof typeof newClient] as string}
                    onChange={(e) => setNewClient((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl outline-none"
                    style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}
                    onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>Canal de origen</label>
                <select value={newClient.channel}
                  onChange={(e) => setNewClient((p) => ({ ...p, channel: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}>
                  <option value="">Seleccionar canal...</option>
                  {["TikTok LIVE", "WhatsApp", "Instagram", "Facebook", "Telegram", "Marketplace", "Web", "Venta directa", "Otro"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontSize: 14, borderColor: "#E5E7EB" }}>
                  Cancelar
                </button>
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", fontSize: 14, fontWeight: 500 }}>
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
