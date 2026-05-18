import { useState } from "react";
import { Plus, X, MessageSquare, ChevronRight, Send, Copy } from "lucide-react";

const INTERACTIONS = [
  { id: 1, alias: "@user_cristal", client: "Cristal Mamani", channel: "TikTok LIVE", flow: "Venta en vivo", product: "Blusa floral", status: "lead", date: "2026-05-03 19:45", notes: "Interesada, consulta talla M" },
  { id: 2, alias: "Ana_Bolivia", client: "Ana García", channel: "Instagram", flow: "Campaña de marketing", product: "Conjunto deportivo", status: "pedido", date: "2026-05-03 14:20", notes: "Confirmó pedido, envió QR" },
  { id: 3, alias: "+591 74-123456", client: "Carlos Mamani", channel: "WhatsApp", flow: "Conversación directa", product: "Vestido negro", status: "seguimiento", date: "2026-05-02 11:00", notes: "Solicitó más fotos" },
  { id: 4, alias: "LuisBolivia23", client: "Luis Flores", channel: "Facebook", flow: "Marketplace", product: "Camisa cuadros", status: "convertido", date: "2026-05-01 16:35", notes: "Venta completada" },
  { id: 5, alias: "@pao_moda", client: "Paola Quispe", channel: "TikTok LIVE", flow: "Venta en vivo", product: "Falda rosa", status: "lead", date: "2026-05-01 20:00", notes: "Vio el live, pidió info por DM" },
];

const TEMPLATES = [
  { id: 1, type: "bienvenida", title: "Saludo inicial", text: "¡Hola! 👋 Gracias por contactar a AKI NO MASS. ¿En qué prenda te interesa? Te ayudamos con tallas, precios y puntos de entrega en La Paz. 🛍️" },
  { id: 2, type: "confirmacion", title: "Confirmar pedido", text: "¡Perfecto! Tu pedido ha sido registrado ✅\n📦 Producto: {producto}\n💰 Total: Bs. {monto}\n📍 Punto de entrega: {entrega}\n\nPor favor envía el comprobante de pago QR al {numero}." },
  { id: 3, type: "seguimiento", title: "Seguimiento post-venta", text: "Hola {nombre} 😊 Queremos saber cómo llegó tu pedido. ¿Todo está bien con tu compra? Tu satisfacción es lo más importante para nosotros. ⭐" },
  { id: 4, type: "live", title: "Invitación a Live", text: "🔴 ¡ATENCIÓN! Esta noche a las 8pm TikTok LIVE con ropa de temporada. Precios especiales solo durante el live. ¡No te lo pierdas! @akinomass 🛍️✨" },
];

const CHANNELS = ["TikTok LIVE", "WhatsApp", "Instagram", "Facebook", "Telegram", "Marketplace", "Web", "Venta directa", "Otro"];
const FLOWS = ["Venta en vivo", "Conversación directa", "Marketplace", "Campaña de marketing", "Referido", "Venta directa", "Otro"];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  lead: { label: "Lead", bg: "#EFF6FF", text: "#2563EB" },
  seguimiento: { label: "Seguimiento", bg: "#FEF3C7", text: "#D97706" },
  pedido: { label: "Pedido creado", bg: "#F5F3FF", text: "#7C3AED" },
  convertido: { label: "Convertido", bg: "#ECFDF5", text: "#059669" },
};

const CHANNEL_COLORS: Record<string, string> = {
  "TikTok LIVE": "#7C3AED", "Instagram": "#EC4899",
  "Facebook": "#2563EB", "WhatsApp": "#16A34A", "Telegram": "#0EA5E9",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  bienvenida: { bg: "#EFF6FF", text: "#2563EB" },
  confirmacion: { bg: "#ECFDF5", text: "#059669" },
  seguimiento: { bg: "#FEF3C7", text: "#D97706" },
  live: { bg: "#FEF2F2", text: "#DC2626" },
};

export function SocialPage() {
  const [tab, setTab] = useState<"interacciones" | "plantillas">("interacciones");
  const [showAdd, setShowAdd] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [newInt, setNewInt] = useState({ alias: "", client: "", channel: "", flow: "", product: "", notes: "" });

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Interacciones Sociales</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>
            Registro manual de contactos desde redes sociales — Sin integración automática
          </p>
        </div>
        {tab === "interacciones" && (
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", fontSize: 13.5, fontWeight: 500 }}>
            <Plus size={16} /> Nueva Interacción
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
          <div key={key} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-gray-500" style={{ fontSize: 12 }}>{conf.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: conf.text, marginTop: 2 }}>
              {INTERACTIONS.filter((i) => i.status === key).length}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "interacciones", label: "Interacciones" },
          { key: "plantillas", label: "Plantillas de Mensajes" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className="px-4 py-2 rounded-xl transition-all"
            style={{
              fontSize: 13.5, fontWeight: 500,
              background: tab === t.key ? "#7C3AED" : "white",
              color: tab === t.key ? "white" : "#6B7280",
              border: "1px solid",
              borderColor: tab === t.key ? "#7C3AED" : "#E5E7EB",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Interacciones */}
      {tab === "interacciones" && (
        <div className="space-y-3">
          {INTERACTIONS.map((i) => {
            const sc = STATUS_CONFIG[i.status];
            const cc = CHANNEL_COLORS[i.channel];
            return (
              <div key={i.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cc}18` || "#F3F4F6" }}>
                      <MessageSquare size={18} style={{ color: cc || "#6B7280" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p style={{ fontSize: 14.5, fontWeight: 700, color: "#111827" }}>{i.alias}</p>
                        <span style={{
                          fontSize: 11.5, fontWeight: 500,
                          background: sc.bg, color: sc.text,
                          padding: "2px 8px", borderRadius: 20
                        }}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-gray-500" style={{ fontSize: 12.5 }}>{i.client} · {i.date}</p>
                      <p className="text-gray-600 mt-1.5" style={{ fontSize: 13 }}>{i.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <span style={{
                      fontSize: 11.5, fontWeight: 500,
                      color: cc || "#6B7280",
                      background: `${cc}15`,
                      padding: "3px 10px", borderRadius: 20
                    }}>
                      {i.channel}
                    </span>
                    <span className="text-gray-400" style={{ fontSize: 12 }}>{i.flow}</span>
                    <span className="text-blue-500" style={{ fontSize: 12.5 }}>{i.product}</span>
                    {i.status === "lead" && (
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white"
                        style={{ background: "#2563EB", fontSize: 12, fontWeight: 500 }}>
                        <ChevronRight size={13} />
                        Convertir a pedido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plantillas */}
      {tab === "plantillas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((t) => {
            const tc = TYPE_COLORS[t.type];
            return (
              <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{
                      fontSize: 11.5, fontWeight: 500,
                      background: tc.bg, color: tc.text,
                      padding: "2px 8px", borderRadius: 20, textTransform: "capitalize"
                    }}>
                      {t.type}
                    </span>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{t.title}</h4>
                  </div>
                </div>
                <div className="p-3 rounded-xl mb-3" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {t.text}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(t.id, t.text)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all"
                    style={{
                      background: copiedId === t.id ? "#ECFDF5" : "#F3F4F6",
                      color: copiedId === t.id ? "#059669" : "#6B7280",
                      fontSize: 12.5, fontWeight: 500
                    }}>
                    <Copy size={13} />
                    {copiedId === t.id ? "¡Copiado!" : "Copiar"}
                  </button>
                  <button className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-blue-50 transition-all"
                    style={{ color: "#2563EB" }}>
                    <Send size={13} />
                  </button>
                </div>
              </div>
            );
          })}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all"
            style={{ border: "2px dashed #E5E7EB", minHeight: 160 }}>
            <Plus size={24} className="text-gray-300 mb-2" />
            <p style={{ fontSize: 13.5, color: "#9CA3AF", fontWeight: 500 }}>Agregar nueva plantilla</p>
          </div>
        </div>
      )}

      {/* Add Interaction Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-screen overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Nueva Interacción Social</h3>
              <button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Alias / Usuario en red social *", key: "alias", placeholder: "Ej: @user_cristal o +591 74-123456" },
                { label: "Nombre del cliente (si se conoce)", key: "client", placeholder: "Ej: Cristal Mamani" },
                { label: "Producto de interés", key: "product", placeholder: "Ej: Blusa floral talla M" },
                { label: "Observaciones / Notas", key: "notes", placeholder: "Ej: Interesada, consulta por talla y precio" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</label>
                  <input value={newInt[f.key as keyof typeof newInt]}
                    onChange={(e) => setNewInt((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl outline-none"
                    style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}
                    onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>Canal de origen *</label>
                <select value={newInt.channel}
                  onChange={(e) => setNewInt((p) => ({ ...p, channel: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}>
                  <option value="">Seleccionar canal...</option>
                  {CHANNELS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>Tipo de flujo comercial *</label>
                <select value={newInt.flow}
                  onChange={(e) => setNewInt((p) => ({ ...p, flow: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}>
                  <option value="">Seleccionar flujo...</option>
                  {FLOWS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border text-gray-700"
                  style={{ fontSize: 14, borderColor: "#E5E7EB" }}>Cancelar</button>
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
