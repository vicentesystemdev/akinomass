import { useState } from "react";
import { Search, Plus, Filter, Eye, ChevronDown, ShoppingCart, X, Clock } from "lucide-react";

const ORDERS = [
  { id: "P-0089", client: "María Pérez", phone: "74123456", product: "Blusa floral + Jean slim", amount: 370, channel: "TikTok LIVE", flow: "Venta en vivo", status: "pendiente", date: "2026-05-03", deliveryPoint: "Centro La Paz" },
  { id: "P-0088", client: "Carlos Mamani", phone: "67890123", product: "Vestido casual negro", amount: 220, channel: "WhatsApp", flow: "Conversación directa", status: "procesando", date: "2026-05-02", deliveryPoint: "Miraflores" },
  { id: "P-0087", client: "Ana García", phone: "78456789", product: "Conjunto deportivo", amount: 450, channel: "Instagram", flow: "Campaña de marketing", status: "completado", date: "2026-05-01", deliveryPoint: "Sopocachi" },
  { id: "P-0086", client: "Luis Flores", phone: "71234567", product: "Camisa cuadros azul", amount: 180, channel: "Facebook", flow: "Marketplace", status: "completado", date: "2026-04-30", deliveryPoint: "San Miguel" },
  { id: "P-0085", client: "Paola Quispe", phone: "69012345", product: "Falda plisada rosa", amount: 150, channel: "TikTok LIVE", flow: "Venta en vivo", status: "pendiente", date: "2026-04-30", deliveryPoint: "El Alto" },
  { id: "P-0084", client: "Roberto Chura", phone: "76543210", product: "Chaqueta cuero negro", amount: 580, channel: "WhatsApp", flow: "Conversación directa", status: "cancelado", date: "2026-04-29", deliveryPoint: "Zona Sur" },
  { id: "P-0083", client: "Valentina Soria", phone: "72345678", product: "Blusa elegante blanca", amount: 160, channel: "Instagram", flow: "Referido", status: "procesando", date: "2026-04-28", deliveryPoint: "Calacoto" },
  { id: "P-0082", client: "Diego Alvarado", phone: "68901234", product: "Pantalón jeans slim", amount: 250, channel: "Facebook", flow: "Marketplace", status: "completado", date: "2026-04-27", deliveryPoint: "Obrajes" },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pendiente: { label: "Pendiente", bg: "#FEF3C7", text: "#D97706" },
  procesando: { label: "Procesando", bg: "#EFF6FF", text: "#2563EB" },
  completado: { label: "Completado", bg: "#ECFDF5", text: "#059669" },
  cancelado: { label: "Cancelado", bg: "#FEF2F2", text: "#DC2626" },
};

const CHANNEL_COLORS: Record<string, string> = {
  "TikTok LIVE": "#7C3AED", "Instagram": "#EC4899", "Facebook": "#2563EB",
  "WhatsApp": "#16A34A", "Telegram": "#0EA5E9",
};

const CHANNELS = ["TikTok LIVE", "WhatsApp", "Instagram", "Facebook", "Telegram", "Marketplace", "Web", "Venta directa", "Otro"];
const FLOWS = ["Venta en vivo", "Conversación directa", "Marketplace", "Campaña de marketing", "Referido", "Venta directa", "Otro"];
const DELIVERY_POINTS = ["Centro La Paz", "Miraflores", "Sopocachi", "San Miguel", "El Alto", "Zona Sur", "Calacoto", "Obrajes"];

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selected, setSelected] = useState<typeof ORDERS[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newOrder, setNewOrder] = useState({ client: "", phone: "", product: "", amount: "", channel: "", flow: "", deliveryPoint: "" });

  const filtered = ORDERS.filter((o) => {
    const q = search.toLowerCase();
    const ms = o.client.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    const mst = statusFilter === "todos" || o.status === statusFilter;
    return ms && mst;
  });

  const stats = {
    pendiente: ORDERS.filter((o) => o.status === "pendiente").length,
    procesando: ORDERS.filter((o) => o.status === "procesando").length,
    completado: ORDERS.filter((o) => o.status === "completado").length,
    cancelado: ORDERS.filter((o) => o.status === "cancelado").length,
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Gestión de Pedidos</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>{ORDERS.length} pedidos registrados</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 13.5, fontWeight: 500 }}>
          <Plus size={16} /> Nuevo Pedido
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
          <div key={key} className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
            style={{ border: `1px solid ${statusFilter === key ? conf.text : "rgba(0,0,0,0.06)"}` }}
            onClick={() => setStatusFilter(statusFilter === key ? "todos" : key)}>
            <p className="text-gray-500" style={{ fontSize: 12 }}>{conf.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: conf.text, marginTop: 2 }}>
              {stats[key as keyof typeof stats]}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, ID o producto..."
            className="bg-transparent outline-none flex-1" style={{ fontSize: 13.5 }} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          {["todos", "pendiente", "procesando", "completado", "cancelado"].map((s) => {
            const conf = s === "todos" ? null : STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg capitalize transition-all"
                style={{
                  fontSize: 12, fontWeight: 500,
                  background: statusFilter === s ? (conf?.text || "#2563EB") : "#F3F4F6",
                  color: statusFilter === s ? "white" : "#6B7280",
                }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                {["Pedido", "Cliente", "Producto", "Canal", "Flujo comercial", "Monto", "Estado", "Fecha", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500"
                    style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const sc = STATUS_CONFIG[o.status];
                return (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #F9FAFB" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EFF6FF" }}>
                          <ShoppingCart size={13} style={{ color: "#2563EB" }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB" }}>#{o.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{o.client}</p>
                      <p className="text-gray-400" style={{ fontSize: 11.5 }}>{o.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 max-w-32 truncate" style={{ fontSize: 13 }}>{o.product}</p>
                      <p className="text-gray-400" style={{ fontSize: 11.5 }}>{o.deliveryPoint}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{
                        fontSize: 11.5, fontWeight: 500,
                        color: CHANNEL_COLORS[o.channel] || "#6B7280",
                        background: `${CHANNEL_COLORS[o.channel]}18`,
                        padding: "2px 8px", borderRadius: 20
                      }}>
                        {o.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600" style={{ fontSize: 12 }}>{o.flow}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Bs. {o.amount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 11.5, fontWeight: 500, background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 20 }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={12} />
                        <span style={{ fontSize: 12 }}>{o.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(o)}
                        className="p-1.5 rounded-lg hover:bg-blue-50" style={{ color: "#2563EB" }}>
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #1E1B4B, #7C3AED)", borderRadius: "16px 16px 0 0" }}>
              <div>
                <h3 className="text-white" style={{ fontWeight: 700, fontSize: 17 }}>Pedido #{selected.id}</h3>
                <p style={{ color: "#C7D2FE", fontSize: 12.5 }}>Detalle del pedido</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Cliente", value: selected.client },
                  { label: "Teléfono", value: selected.phone },
                  { label: "Producto", value: selected.product },
                  { label: "Canal origen", value: selected.channel },
                  { label: "Flujo comercial", value: selected.flow },
                  { label: "Punto de entrega", value: selected.deliveryPoint },
                  { label: "Fecha pedido", value: selected.date },
                  { label: "Monto total", value: `Bs. ${selected.amount}` },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-gray-400" style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase" }}>{f.label}</p>
                    <p style={{ fontSize: 13.5, color: "#111827", fontWeight: 500, marginTop: 2 }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                <p className="text-gray-500 mb-2" style={{ fontSize: 12.5, fontWeight: 600 }}>Actualizar Estado</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                    <button key={key}
                      className="px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                      style={{ background: conf.bg, color: conf.text, fontSize: 12, fontWeight: 500 }}>
                      {conf.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-full py-2.5 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 14, fontWeight: 500 }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-screen overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Registrar Pedido Manual</h3>
              <button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Cliente (nombre o buscar) *", key: "client", placeholder: "Ej: María Pérez" },
                { label: "Teléfono de contacto", key: "phone", placeholder: "Ej: 74123456" },
                { label: "Producto(s) *", key: "product", placeholder: "Ej: Blusa floral talla M" },
                { label: "Monto total (Bs.) *", key: "amount", placeholder: "Ej: 370", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type || "text"} value={newOrder[f.key as keyof typeof newOrder]}
                    onChange={(e) => setNewOrder((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl outline-none"
                    style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}
              {[
                { label: "Canal de origen *", key: "channel", options: CHANNELS },
                { label: "Tipo de flujo comercial *", key: "flow", options: FLOWS },
                { label: "Punto de entrega", key: "deliveryPoint", options: DELIVERY_POINTS },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</label>
                  <select value={newOrder[f.key as keyof typeof newOrder]}
                    onChange={(e) => setNewOrder((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl outline-none"
                    style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}>
                    <option value="">Seleccionar...</option>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border text-gray-700"
                  style={{ fontSize: 14, borderColor: "#E5E7EB" }}>Cancelar</button>
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 14, fontWeight: 500 }}>
                  Registrar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
