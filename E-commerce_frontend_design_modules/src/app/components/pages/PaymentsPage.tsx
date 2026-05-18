import { useState } from "react";
import { CheckCircle, XCircle, Clock, Upload, Eye, X, QrCode, AlertCircle } from "lucide-react";

const PAYMENTS = [
  { id: "PAG-001", orderId: "P-0089", client: "María Pérez", amount: 370, method: "QR", status: "pendiente", uploadDate: "2026-05-03 10:30", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop" },
  { id: "PAG-002", orderId: "P-0088", client: "Carlos Mamani", amount: 220, method: "Transferencia", status: "pendiente", uploadDate: "2026-05-02 15:45", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=120&fit=crop" },
  { id: "PAG-003", orderId: "P-0087", client: "Ana García", amount: 450, method: "QR", status: "aprobado", uploadDate: "2026-05-01 09:20", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop" },
  { id: "PAG-004", orderId: "P-0086", client: "Luis Flores", amount: 180, method: "Efectivo", status: "aprobado", uploadDate: "2026-04-30 14:10", img: null },
  { id: "PAG-005", orderId: "P-0085", client: "Paola Quispe", amount: 150, method: "QR", status: "rechazado", uploadDate: "2026-04-30 11:55", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=120&fit=crop" },
  { id: "PAG-006", orderId: "P-0083", client: "Valentina Soria", amount: 160, method: "Transferencia", status: "pendiente", uploadDate: "2026-04-28 16:30", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop" },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: typeof Clock }> = {
  pendiente: { label: "Pendiente", bg: "#FEF3C7", text: "#D97706", icon: Clock },
  aprobado: { label: "Aprobado", bg: "#ECFDF5", text: "#059669", icon: CheckCircle },
  rechazado: { label: "Rechazado", bg: "#FEF2F2", text: "#DC2626", icon: XCircle },
};

const METHOD_COLORS: Record<string, { bg: string; color: string }> = {
  QR: { bg: "#F5F3FF", color: "#7C3AED" },
  Transferencia: { bg: "#EFF6FF", color: "#2563EB" },
  Efectivo: { bg: "#ECFDF5", color: "#059669" },
};

export function PaymentsPage() {
  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState<typeof PAYMENTS[0] | null>(null);
  const [obs, setObs] = useState("");

  const filtered = PAYMENTS.filter((p) => filter === "todos" || p.status === filter);

  const stats = {
    pendiente: PAYMENTS.filter((p) => p.status === "pendiente").length,
    aprobado: PAYMENTS.filter((p) => p.status === "aprobado").length,
    rechazado: PAYMENTS.filter((p) => p.status === "rechazado").length,
    total: PAYMENTS.reduce((s, p) => (p.status === "aprobado" ? s + p.amount : s), 0),
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Validación de Pagos</h1>
        <p className="text-gray-500" style={{ fontSize: 13.5 }}>
          Revisión y validación de comprobantes de pago — {stats.pendiente} pendientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pendientes", value: stats.pendiente.toString(), color: "#D97706", bg: "#FEF3C7" },
          { label: "Aprobados", value: stats.aprobado.toString(), color: "#059669", bg: "#ECFDF5" },
          { label: "Rechazados", value: stats.rechazado.toString(), color: "#DC2626", bg: "#FEF2F2" },
          { label: "Monto validado", value: `Bs. ${stats.total.toLocaleString()}`, color: "#2563EB", bg: "#EFF6FF" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm"
            style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
            <p style={{ fontSize: s.label === "Monto validado" ? 18 : 24, fontWeight: 700, color: s.color, marginTop: 2 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <AlertCircle size={18} style={{ color: "#2563EB", flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13.5, color: "#1E40AF", fontWeight: 600 }}>Proceso de validación manual</p>
          <p style={{ fontSize: 12.5, color: "#3B82F6", marginTop: 2 }}>
            Revisa el comprobante adjunto por el cliente. Verifica que el monto, destinatario y fecha coincidan con el pedido. Solo aprueba si todo está correcto.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {["todos", "pendiente", "aprobado", "rechazado"].map((f) => {
          const conf = f === "todos" ? null : STATUS_CONFIG[f];
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl transition-all capitalize"
              style={{
                fontSize: 13, fontWeight: 500,
                background: filter === f ? (conf?.text || "#2563EB") : "white",
                color: filter === f ? "white" : "#6B7280",
                border: "1px solid",
                borderColor: filter === f ? (conf?.text || "#2563EB") : "#E5E7EB",
              }}>
              {f === "todos" ? `Todos (${PAYMENTS.length})` : `${conf?.label} (${stats[f as keyof typeof stats]})`}
            </button>
          );
        })}
      </div>

      {/* Payment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const sc = STATUS_CONFIG[p.status];
          const mc = METHOD_COLORS[p.method];
          const Icon = sc.icon;
          return (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{p.id}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>→</span>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>#{p.orderId}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 2 }}>{p.client}</p>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 500, background: sc.bg, color: sc.text, padding: "3px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon size={11} />
                    {sc.label}
                  </span>
                </div>

                {/* Comprobante preview */}
                <div className="rounded-xl overflow-hidden mb-3"
                  style={{ background: p.img ? "transparent" : "#F9FAFB", border: "1px dashed #E5E7EB", height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.img ? (
                    <img src={p.img} alt="Comprobante" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload size={24} className="mx-auto mb-1" />
                      <p style={{ fontSize: 12 }}>Sin comprobante</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 11.5 }}>Monto</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Bs. {p.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400" style={{ fontSize: 11.5 }}>Método</p>
                    <span style={{
                      fontSize: 11.5, fontWeight: 500,
                      background: mc?.bg, color: mc?.color,
                      padding: "2px 8px", borderRadius: 20
                    }}>
                      {p.method === "QR" && <QrCode size={10} className="inline mr-1" />}
                      {p.method}
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 mb-3" style={{ fontSize: 11 }}>
                  Enviado: {p.uploadDate}
                </p>

                {p.status === "pendiente" && (
                  <div className="flex gap-2">
                    <button onClick={() => setSelected(p)}
                      className="flex-1 py-2 rounded-xl transition-all hover:opacity-80"
                      style={{ background: "#ECFDF5", color: "#059669", fontSize: 12.5, fontWeight: 500 }}>
                      <CheckCircle size={13} className="inline mr-1" />Aprobar
                    </button>
                    <button onClick={() => setSelected(p)}
                      className="flex-1 py-2 rounded-xl transition-all hover:opacity-80"
                      style={{ background: "#FEF2F2", color: "#DC2626", fontSize: 12.5, fontWeight: 500 }}>
                      <XCircle size={13} className="inline mr-1" />Rechazar
                    </button>
                    <button onClick={() => setSelected(p)}
                      className="py-2 px-3 rounded-xl transition-all hover:bg-gray-100"
                      style={{ color: "#6B7280" }}>
                      <Eye size={15} />
                    </button>
                  </div>
                )}
                {p.status !== "pendiente" && (
                  <button onClick={() => setSelected(p)}
                    className="w-full py-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    style={{ fontSize: 12.5, border: "1px solid #E5E7EB" }}>
                    <Eye size={13} className="inline mr-1" />Ver detalle
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail/Action Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>Validar Comprobante</h3>
                <p className="text-gray-500" style={{ fontSize: 12.5 }}>{selected.id} — {selected.client}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {selected.img && (
                <div className="rounded-xl overflow-hidden" style={{ height: 180 }}>
                  <img src={selected.img} alt="Comprobante" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Pedido", value: `#${selected.orderId}` },
                  { label: "Monto", value: `Bs. ${selected.amount}` },
                  { label: "Método", value: selected.method },
                  { label: "Fecha envío", value: selected.uploadDate },
                ].map((f) => (
                  <div key={f.label} className="p-3 rounded-xl" style={{ background: "#F9FAFB" }}>
                    <p className="text-gray-400" style={{ fontSize: 11 }}>{f.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
                  Observaciones (opcional)
                </label>
                <textarea value={obs} onChange={(e) => setObs(e.target.value)}
                  placeholder="Ej: Monto correcto, fecha 03/05/2026..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl outline-none resize-none"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
              {selected.status === "pendiente" && (
                <div className="flex gap-3">
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-2.5 rounded-xl font-semibold"
                    style={{ background: "#ECFDF5", color: "#059669", fontSize: 14 }}>
                    <CheckCircle size={16} className="inline mr-2" />Aprobar
                  </button>
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-2.5 rounded-xl font-semibold"
                    style={{ background: "#FEF2F2", color: "#DC2626", fontSize: 14 }}>
                    <XCircle size={16} className="inline mr-2" />Rechazar
                  </button>
                </div>
              )}
              <button onClick={() => setSelected(null)}
                className="w-full py-2 rounded-xl text-gray-600 hover:bg-gray-50 border"
                style={{ fontSize: 13, borderColor: "#E5E7EB" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
