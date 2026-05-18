import { useState } from "react";
import { Radio, Plus, Zap, User, Package, ShoppingCart, Check, X, Clock, Users } from "lucide-react";

const PRODUCTS_LIST = [
  { id: 1, name: "Blusa floral talla M", price: 120, stock: 15, img: "🌸" },
  { id: 2, name: "Pantalón jeans slim", price: 250, stock: 8, img: "👖" },
  { id: 3, name: "Vestido casual negro", price: 220, stock: 3, img: "👗" },
  { id: 4, name: "Conjunto deportivo", price: 450, stock: 6, img: "🏃" },
  { id: 5, name: "Falda plisada rosa", price: 150, stock: 12, img: "👘" },
  { id: 6, name: "Chaqueta cuero negro", price: 580, stock: 4, img: "🧥" },
];

interface LiveEntry {
  id: number;
  alias: string;
  product: string;
  productId: number;
  price: number;
  intent: "interesado" | "compra" | "consulta";
  converted: boolean;
  time: string;
}

export function LiveSalesPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionName, setSessionName] = useState("Live TikTok - Moda Primavera 2026");
  const [selectedProducts, setSelectedProducts] = useState<typeof PRODUCTS_LIST>([]);
  const [entries, setEntries] = useState<LiveEntry[]>([]);
  const [alias, setAlias] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS_LIST[0] | null>(null);
  const [intent, setIntent] = useState<LiveEntry["intent"]>("interesado");
  const [elapsed, setElapsed] = useState(0);

  const addEntry = () => {
    if (!alias.trim() || !selectedProduct) return;
    const entry: LiveEntry = {
      id: Date.now(),
      alias,
      product: selectedProduct.name,
      productId: selectedProduct.id,
      price: selectedProduct.price,
      intent,
      converted: false,
      time: new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }),
    };
    setEntries((prev) => [entry, ...prev]);
    setAlias("");
  };

  const toggleProduct = (p: typeof PRODUCTS_LIST[0]) => {
    setSelectedProducts((prev) =>
      prev.find((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p]
    );
  };

  const startSession = () => {
    setSessionActive(true);
    setEntries([]);
  };

  const endSession = () => {
    setSessionActive(false);
  };

  const convertEntry = (id: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, converted: true } : e))
    );
  };

  const intentColors: Record<LiveEntry["intent"], { bg: string; text: string; label: string }> = {
    interesado: { bg: "#FEF3C7", text: "#D97706", label: "Interesado" },
    compra: { bg: "#ECFDF5", text: "#059669", label: "¡Compra!" },
    consulta: { bg: "#EFF6FF", text: "#2563EB", label: "Consulta" },
  };

  const totalInterested = entries.filter((e) => e.intent === "interesado" || e.intent === "compra").length;
  const totalConverted = entries.filter((e) => e.converted).length;
  const totalRevenue = entries.filter((e) => e.converted).reduce((s, e) => s + e.price, 0);

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Ventas en Vivo</h1>
            {sessionActive && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white animate-pulse"
                style={{ background: "#DC2626", fontSize: 11, fontWeight: 600 }}>
                <span className="w-2 h-2 rounded-full bg-white" />
                EN VIVO
              </span>
            )}
          </div>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>
            Gestión rápida y simplificada para TikTok LIVE y transmisiones en vivo
          </p>
        </div>
        {!sessionActive ? (
          <button onClick={startSession}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)", fontSize: 14, fontWeight: 600 }}>
            <Radio size={16} /> Iniciar Live
          </button>
        ) : (
          <button onClick={endSession}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white hover:opacity-90"
            style={{ background: "#374151", fontSize: 14, fontWeight: 600 }}>
            <X size={16} /> Finalizar Live
          </button>
        )}
      </div>

      {!sessionActive ? (
        /* Pre-session setup */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
              Configurar sesión Live
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
                  Nombre de la sesión
                </label>
                <input value={sessionName} onChange={(e) => setSessionName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 14 }}
                  onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 500 }}>
                  Selecciona los productos a ofrecer:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PRODUCTS_LIST.map((p) => {
                    const isSelected = selectedProducts.find((x) => x.id === p.id);
                    return (
                      <div key={p.id} onClick={() => toggleProduct(p)}
                        className="cursor-pointer p-3 rounded-xl transition-all"
                        style={{
                          border: "2px solid",
                          borderColor: isSelected ? "#DC2626" : "#E5E7EB",
                          background: isSelected ? "#FFF1F2" : "white",
                        }}>
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontSize: 22 }}>{p.img}</span>
                          {isSelected && <Check size={14} style={{ color: "#DC2626" }} />}
                        </div>
                        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{p.name}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", marginTop: 2 }}>Bs. {p.price}</p>
                        <p className="text-gray-400" style={{ fontSize: 11 }}>Stock: {p.stock}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "#FFF1F2", border: "1px solid #FECACA" }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} style={{ color: "#DC2626" }} />
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "#DC2626" }}>Instrucciones para el Live</p>
            </div>
            <ul style={{ fontSize: 12.5, color: "#7F1D1D", lineHeight: 1.8 }} className="list-disc ml-4 space-y-1">
              <li>Inicia el Live en TikTok primero, luego activa esta sesión</li>
              <li>Registra rápido: alias del usuario → producto de interés → intención de compra</li>
              <li>Convierte a pedido cuando el cliente confirme</li>
              <li>Al finalizar el live, revisa el resumen y gestiona los pedidos</li>
            </ul>
          </div>
        </div>
      ) : (
        /* Active session */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left: Quick register */}
          <div className="xl:col-span-1 space-y-4">
            {/* Session stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Interesados", value: totalInterested, color: "#D97706", bg: "#FEF3C7", icon: Users },
                { label: "Convertidos", value: totalConverted, color: "#059669", bg: "#ECFDF5", icon: Check },
                { label: "Ingresos live", value: `Bs.${totalRevenue}`, color: "#2563EB", bg: "#EFF6FF", icon: Zap },
                { label: "Registros", value: entries.length, color: "#7C3AED", bg: "#F5F3FF", icon: Package },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-3 shadow-sm"
                  style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <s.icon size={13} style={{ color: s.color }} />
                    <p style={{ fontSize: 11, color: "#9CA3AF" }}>{s.label}</p>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Quick entry form */}
            <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                Registro rápido ⚡
              </h4>
              <div className="space-y-3">
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6B7280" }}>Alias del usuario</label>
                  <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg"
                    style={{ border: "1.5px solid #E5E7EB" }}>
                    <User size={14} className="text-gray-400" />
                    <input value={alias} onChange={(e) => setAlias(e.target.value)}
                      placeholder="@usuario o +591..."
                      className="flex-1 outline-none" style={{ fontSize: 13.5 }}
                      onKeyDown={(e) => e.key === "Enter" && addEntry()}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6B7280" }}>Producto de interés</label>
                  <div className="grid grid-cols-1 gap-1.5 mt-1">
                    {selectedProducts.length > 0 ? selectedProducts.map((p) => (
                      <button key={p.id} onClick={() => setSelectedProduct(p)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                        style={{
                          background: selectedProduct?.id === p.id ? "#EFF6FF" : "#F9FAFB",
                          border: "1px solid",
                          borderColor: selectedProduct?.id === p.id ? "#2563EB" : "#E5E7EB",
                        }}>
                        <span>{p.img}</span>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", lineHeight: 1.2 }} className="truncate">{p.name}</p>
                          <p style={{ fontSize: 11.5, color: "#2563EB", fontWeight: 700 }}>Bs. {p.price}</p>
                        </div>
                        {selectedProduct?.id === p.id && <Check size={14} style={{ color: "#2563EB" }} />}
                      </button>
                    )) : (
                      <p className="text-gray-400 text-center py-2" style={{ fontSize: 12 }}>
                        No hay productos seleccionados
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#6B7280" }}>Intención</label>
                  <div className="flex gap-2 mt-1">
                    {(["interesado", "compra", "consulta"] as const).map((i) => {
                      const ic = { interesado: "#D97706", compra: "#059669", consulta: "#2563EB" };
                      return (
                        <button key={i} onClick={() => setIntent(i)}
                          className="flex-1 py-1.5 rounded-lg capitalize transition-all"
                          style={{
                            fontSize: 11.5, fontWeight: 500,
                            background: intent === i ? ic[i] : "#F3F4F6",
                            color: intent === i ? "white" : "#6B7280",
                          }}>
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button onClick={addEntry}
                  className="w-full py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)", fontSize: 13.5 }}>
                  <Plus size={15} className="inline mr-1.5" />
                  Registrar
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live feed */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden"
              style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="p-4 border-b flex items-center justify-between"
                style={{ borderColor: "#F3F4F6", background: "#FFF1F2" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#DC2626" }}>{sessionName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock size={13} />
                  <span style={{ fontSize: 12 }}>En vivo</span>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Radio size={32} className="mx-auto mb-2 opacity-30" />
                    <p style={{ fontSize: 14 }}>Registra el primer interesado del live...</p>
                  </div>
                ) : entries.map((e) => {
                  const ic = intentColors[e.intent];
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{ background: e.converted ? "#ECFDF5" : "#F9FAFB", border: "1px solid", borderColor: e.converted ? "#A7F3D0" : "#F3F4F6" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)", fontSize: 11, fontWeight: 700 }}>
                        {e.alias.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{e.alias}</span>
                          <span style={{ fontSize: 11, fontWeight: 500, background: ic.bg, color: ic.text, padding: "1px 6px", borderRadius: 10 }}>
                            {ic.label}
                          </span>
                        </div>
                        <p className="text-gray-500 truncate" style={{ fontSize: 12 }}>
                          {e.product} — <span style={{ fontWeight: 600, color: "#2563EB" }}>Bs. {e.price}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-gray-400" style={{ fontSize: 11 }}>{e.time}</span>
                        {!e.converted ? (
                          <button onClick={() => convertEntry(e.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-white"
                            style={{ background: "#059669", fontSize: 11.5, fontWeight: 500 }}>
                            <ShoppingCart size={11} />
                            Pedido
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                            style={{ background: "#ECFDF5", color: "#059669", fontSize: 11.5, fontWeight: 500 }}>
                            <Check size={11} />
                            Convertido
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
