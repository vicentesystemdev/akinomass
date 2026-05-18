import { useState } from "react";
import { Download, TrendingUp, Search, Filter, Eye, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SALES = [
  { id: "VEN-001", orderId: "P-0087", client: "Ana García", product: "Conjunto deportivo", amount: 450, channel: "Instagram", date: "2026-05-01", validatedBy: "Carla Encinas" },
  { id: "VEN-002", orderId: "P-0086", client: "Luis Flores", product: "Camisa cuadros azul", amount: 180, channel: "Facebook", date: "2026-04-30", validatedBy: "Carla Encinas" },
  { id: "VEN-003", orderId: "P-0082", client: "Diego Alvarado", product: "Pantalón jeans slim", amount: 250, channel: "Facebook", date: "2026-04-27", validatedBy: "Admin" },
  { id: "VEN-004", orderId: "P-0080", client: "Paola Quispe", product: "Vestido elegante rojo", amount: 320, channel: "TikTok LIVE", date: "2026-04-25", validatedBy: "Carla Encinas" },
  { id: "VEN-005", orderId: "P-0078", client: "María Pérez", product: "Blusa floral + Jean", amount: 370, channel: "TikTok LIVE", date: "2026-04-23", validatedBy: "Admin" },
  { id: "VEN-006", orderId: "P-0075", client: "Carlos Mamani", product: "Chaqueta cuero negro", amount: 580, channel: "WhatsApp", date: "2026-04-20", validatedBy: "Carla Encinas" },
];

const byChannel = [
  { name: "TikTok LIVE", ventas: 8, monto: 14200, color: "#7C3AED" },
  { name: "Instagram", ventas: 5, monto: 7400, color: "#EC4899" },
  { name: "Facebook", ventas: 6, monto: 9800, color: "#2563EB" },
  { name: "WhatsApp", ventas: 4, monto: 6200, color: "#16A34A" },
  { name: "Otros", ventas: 2, monto: 3200, color: "#94A3B8" },
];

const CHANNEL_COLORS: Record<string, string> = {
  "TikTok LIVE": "#7C3AED", "Instagram": "#EC4899", "Facebook": "#2563EB",
  "WhatsApp": "#16A34A",
};

export function SalesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof SALES[0] | null>(null);

  const totalRevenue = SALES.reduce((s, v) => s + v.amount, 0);
  const avgTicket = Math.round(totalRevenue / SALES.length);

  const filtered = SALES.filter((s) => {
    const q = search.toLowerCase();
    return s.client.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.product.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Consolidación de Ventas</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>{SALES.length} ventas registradas este mes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #059669, #0EA5E9)", fontSize: 13.5, fontWeight: 500 }}>
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total ventas", value: SALES.length.toString(), color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Ingresos totales", value: `Bs. ${totalRevenue.toLocaleString()}`, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Ticket promedio", value: `Bs. ${avgTicket}`, color: "#059669", bg: "#ECFDF5" },
          { label: "Canal top", value: "TikTok LIVE", color: "#D97706", bg: "#FEF3C7" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
            <p style={{ fontSize: s.label.includes("Canal") ? 14 : 20, fontWeight: 700, color: s.color, marginTop: 2, lineHeight: 1.2 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Channel chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Ventas por Canal</h3>
            <p className="text-gray-400" style={{ fontSize: 12 }}>Monto total vendido por canal de origen</p>
          </div>
          <TrendingUp size={18} style={{ color: "#7C3AED" }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byChannel} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `Bs.${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v) => [`Bs. ${v.toLocaleString()}`, "Monto"]} />
              <Bar dataKey="monto" radius={[6, 6, 0, 0]}>
                {byChannel.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {byChannel.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "#F9FAFB" }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{c.name}</p>
                    <p className="text-gray-400" style={{ fontSize: 11.5 }}>{c.ventas} ventas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 14, fontWeight: 700, color: c.color }}>Bs. {c.monto.toLocaleString()}</p>
                  <p className="text-gray-400" style={{ fontSize: 11 }}>
                    {Math.round((c.monto / byChannel.reduce((s, x) => s + x.monto, 0)) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "#F3F4F6" }}>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar venta..." className="bg-transparent outline-none flex-1" style={{ fontSize: 13.5 }} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                {["ID Venta", "Pedido", "Cliente", "Producto", "Canal", "Monto", "Fecha", "Validado por", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500"
                    style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #F9FAFB" }}>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{v.id}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600" style={{ fontSize: 12.5 }}>#{v.orderId}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{v.client}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-36 truncate" style={{ fontSize: 12.5 }}>{v.product}</td>
                  <td className="px-4 py-3">
                    <span style={{
                      fontSize: 11.5, fontWeight: 500,
                      color: CHANNEL_COLORS[v.channel] || "#6B7280",
                      background: `${CHANNEL_COLORS[v.channel]}18`,
                      padding: "2px 8px", borderRadius: 20
                    }}>
                      {v.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>
                    Bs. {v.amount}
                  </td>
                  <td className="px-4 py-3 text-gray-500" style={{ fontSize: 12 }}>{v.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={12} style={{ color: "#059669" }} />
                      <span style={{ fontSize: 12, color: "#374151" }}>{v.validatedBy}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(v)}
                      className="p-1.5 rounded-lg hover:bg-blue-50" style={{ color: "#2563EB" }}>
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: "#F3F4F6" }}>
          <p className="text-gray-500" style={{ fontSize: 12.5 }}>Mostrando {filtered.length} de {SALES.length} ventas</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>
            Total: Bs. {filtered.reduce((s, v) => s + v.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Detalle Venta</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400"><Eye size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "ID Venta", value: selected.id },
                { label: "Pedido", value: `#${selected.orderId}` },
                { label: "Cliente", value: selected.client },
                { label: "Producto", value: selected.product },
                { label: "Canal", value: selected.channel },
                { label: "Monto", value: `Bs. ${selected.amount}` },
                { label: "Fecha", value: selected.date },
                { label: "Validado por", value: selected.validatedBy },
              ].map((f) => (
                <div key={f.label} className="flex justify-between items-center py-1.5 border-b"
                  style={{ borderColor: "#F3F4F6" }}>
                  <span className="text-gray-500" style={{ fontSize: 12.5 }}>{f.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{f.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)}
              className="w-full py-2.5 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 14, fontWeight: 500 }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
