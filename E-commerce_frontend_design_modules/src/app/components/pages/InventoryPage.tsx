import { useState } from "react";
import { Search, Plus, Filter, AlertTriangle, Edit2, Trash2, X, Package } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const PRODUCTS = [
  { id: 1, name: "Blusa floral talla M", sku: "BLU-FL-M", category: "Blusas", price: 120, stock: 15, minStock: 5, status: "disponible", img: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=150&h=150&fit=crop" },
  { id: 2, name: "Pantalón jeans slim azul", sku: "PAN-JS-A", category: "Pantalones", price: 250, stock: 8, minStock: 5, status: "disponible", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&h=150&fit=crop" },
  { id: 3, name: "Vestido casual negro", sku: "VES-CA-N", category: "Vestidos", price: 220, stock: 3, minStock: 5, status: "bajo_stock", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=150&h=150&fit=crop" },
  { id: 4, name: "Conjunto deportivo rosa", sku: "CON-DE-R", category: "Conjuntos", price: 450, stock: 6, minStock: 3, status: "disponible", img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=150&h=150&fit=crop" },
  { id: 5, name: "Camisa cuadros roja", sku: "CAM-CU-R", category: "Camisas", price: 180, stock: 0, minStock: 3, status: "sin_stock", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop" },
  { id: 6, name: "Falda plisada rosa", sku: "FAL-PL-R", category: "Faldas", price: 150, stock: 12, minStock: 4, status: "disponible", img: "https://images.unsplash.com/photo-1583496661160-fb5218afa9a3?w=150&h=150&fit=crop" },
  { id: 7, name: "Chaqueta cuero negro", sku: "CHA-CU-N", category: "Chaquetas", price: 580, stock: 4, minStock: 3, status: "disponible", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop" },
  { id: 8, name: "Blusa elegante blanca", sku: "BLU-EL-B", category: "Blusas", price: 160, stock: 2, minStock: 5, status: "bajo_stock", img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=150&h=150&fit=crop" },
];

const CATEGORIES = ["Todas", "Blusas", "Pantalones", "Vestidos", "Conjuntos", "Camisas", "Faldas", "Chaquetas"];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  disponible: { label: "Disponible", bg: "#ECFDF5", text: "#059669" },
  bajo_stock: { label: "Stock bajo", bg: "#FEF3C7", text: "#D97706" },
  sin_stock: { label: "Sin stock", bg: "#FEF2F2", text: "#DC2626" },
};

export function InventoryPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todas");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showAdd, setShowAdd] = useState(false);
  const [newProd, setNewProd] = useState({ name: "", category: "", price: "", stock: "", minStock: "", sku: "" });

  const filtered = PRODUCTS.filter((p) => {
    const q = search.toLowerCase();
    const ms = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const mc = catFilter === "Todas" || p.category === catFilter;
    return ms && mc;
  });

  const stockAlerts = PRODUCTS.filter((p) => p.status !== "disponible");

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Inventario</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>{PRODUCTS.length} productos · {stockAlerts.length} alertas activas</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 13.5, fontWeight: 500 }}>
          <Plus size={16} /> Registrar Producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total productos", value: PRODUCTS.length.toString(), color: "#2563EB", bg: "#EFF6FF" },
          { label: "Disponibles", value: PRODUCTS.filter((p) => p.status === "disponible").length.toString(), color: "#059669", bg: "#ECFDF5" },
          { label: "Stock bajo", value: PRODUCTS.filter((p) => p.status === "bajo_stock").length.toString(), color: "#D97706", bg: "#FEF3C7" },
          { label: "Sin stock", value: PRODUCTS.filter((p) => p.status === "sin_stock").length.toString(), color: "#DC2626", bg: "#FEF2F2" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {stockAlerts.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <AlertTriangle size={18} style={{ color: "#D97706", flexShrink: 0 }} />
          <p style={{ fontSize: 13.5, color: "#92400E" }}>
            <strong>{stockAlerts.length} productos</strong> necesitan reposición de stock: {stockAlerts.map((p) => p.name).join(", ")}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="bg-transparent outline-none flex-1" style={{ fontSize: 13.5 }} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-gray-400" />
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className="px-3 py-1.5 rounded-lg transition-all text-sm"
              style={{ fontWeight: 500, fontSize: 12,
                background: catFilter === c ? "#2563EB" : "#F3F4F6",
                color: catFilter === c ? "white" : "#6B7280" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
          {(["grid", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-1.5 transition-all"
              style={{ background: view === v ? "#7C3AED" : "transparent", color: view === v ? "white" : "#6B7280", fontSize: 12 }}>
              {v === "grid" ? "Cuadrícula" : "Lista"}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const sc = statusConfig[p.status];
            return (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="relative h-44 overflow-hidden">
                  <ImageWithFallback src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 right-2">
                    <span style={{ fontSize: 11, fontWeight: 500, background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 20 }}>
                      {sc.label}
                    </span>
                  </div>
                  {p.status === "bajo_stock" && (
                    <div className="absolute top-2 left-2">
                      <AlertTriangle size={14} style={{ color: "#D97706" }} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.name}</p>
                  <p className="text-gray-400" style={{ fontSize: 11.5 }}>{p.sku} · {p.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#2563EB" }}>Bs. {p.price}</p>
                    <p style={{ fontSize: 12, color: p.stock <= p.minStock ? "#DC2626" : "#374151", fontWeight: 500 }}>
                      Stock: {p.stock}
                    </p>
                  </div>
                  {/* Stock bar */}
                  <div className="mt-2 h-1.5 rounded-full" style={{ background: "#F3F4F6" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (p.stock / 20) * 100)}%`,
                        background: p.stock === 0 ? "#EF4444" : p.stock <= p.minStock ? "#F59E0B" : "#10B981",
                      }} />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-1.5 rounded-lg text-center transition-all hover:opacity-80"
                      style={{ background: "#EFF6FF", color: "#2563EB", fontSize: 12, fontWeight: 500 }}>
                      <Edit2 size={12} className="inline mr-1" />Editar
                    </button>
                    <button className="py-1.5 px-2 rounded-lg transition-all hover:bg-red-50"
                      style={{ color: "#EF4444" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                  {["Producto", "SKU", "Categoría", "Precio", "Stock", "Stock mín.", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500"
                      style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const sc = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #F9FAFB" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500" style={{ fontSize: 12.5 }}>{p.sku}</td>
                      <td className="px-4 py-3 text-gray-600" style={{ fontSize: 12.5 }}>{p.category}</td>
                      <td className="px-4 py-3" style={{ fontSize: 13.5, fontWeight: 700, color: "#2563EB" }}>Bs. {p.price}</td>
                      <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: p.stock <= p.minStock ? "#DC2626" : "#111827" }}>{p.stock}</td>
                      <td className="px-4 py-3 text-gray-500" style={{ fontSize: 12.5 }}>{p.minStock}</td>
                      <td className="px-4 py-3">
                        <span style={{ fontSize: 11.5, fontWeight: 500, background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 20 }}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50" style={{ color: "#2563EB" }}><Edit2 size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: "#EF4444" }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Registrar Producto</h3>
              <button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Nombre del producto *", key: "name", placeholder: "Ej: Blusa floral talla M" },
                { label: "SKU (código)", key: "sku", placeholder: "Ej: BLU-FL-M" },
                { label: "Precio (Bs.) *", key: "price", placeholder: "Ej: 120", type: "number" },
                { label: "Stock inicial *", key: "stock", placeholder: "Ej: 15", type: "number" },
                { label: "Stock mínimo", key: "minStock", placeholder: "Ej: 5", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type || "text"} value={newProd[f.key as keyof typeof newProd]}
                    onChange={(e) => setNewProd((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl outline-none"
                    style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>Categoría</label>
                <select value={newProd.category}
                  onChange={(e) => setNewProd((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl outline-none"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}>
                  <option value="">Seleccionar...</option>
                  {CATEGORIES.filter((c) => c !== "Todas").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border text-gray-700"
                  style={{ fontSize: 14, borderColor: "#E5E7EB" }}>Cancelar</button>
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 14, fontWeight: 500 }}>
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
