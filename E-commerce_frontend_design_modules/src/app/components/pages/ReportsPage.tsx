import { useState } from "react";
import { Download, TrendingUp, Users, BarChart3, Brain } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ReferenceLine
} from "recharts";

const salesTrend = [
  { mes: "Ene", real: 8200, prediccion: null },
  { mes: "Feb", real: 11400, prediccion: null },
  { mes: "Mar", real: 9800, prediccion: null },
  { mes: "Abr", real: 15200, prediccion: null },
  { mes: "May", real: 13600, prediccion: null },
  { mes: "Jun", real: 18900, prediccion: null },
  { mes: "Jul", real: 16400, prediccion: null },
  { mes: "Ago", real: 21000, prediccion: null },
  { mes: "Sep", real: 19300, prediccion: null },
  { mes: "Oct", real: 24800, prediccion: null },
  { mes: "Nov", real: null, prediccion: 27500 },
  { mes: "Dic", real: null, prediccion: 31200 },
];

const clusters = [
  { label: "VIP / Alta frecuencia", clientes: 38, color: "#7C3AED", ticket: 420, frecuencia: 8, descripcion: "Compran +5 veces al mes, ticket alto" },
  { label: "Regular / Media frecuencia", clientes: 54, color: "#2563EB", ticket: 220, frecuencia: 4, descripcion: "Compran 2-4 veces al mes, precio moderado" },
  { label: "Ocasionales / Baja frecuencia", clientes: 36, color: "#0EA5E9", ticket: 180, frecuencia: 2, descripcion: "Compran 1-2 veces, típicamente por Live" },
];

const weeklyData = [
  { dia: "Lun", ventas: 3200 },
  { dia: "Mar", ventas: 4800 },
  { dia: "Mié", ventas: 3900 },
  { dia: "Jue", ventas: 5200 },
  { dia: "Vie", ventas: 7800 },
  { dia: "Sáb", ventas: 12400 },
  { dia: "Dom", ventas: 9600 },
];

const topProducts = [
  { name: "Blusa floral talla M", ventas: 42, ingresos: 5040, color: "#7C3AED" },
  { name: "Conjunto deportivo", ventas: 35, ingresos: 15750, color: "#2563EB" },
  { name: "Pantalón jeans slim", ventas: 28, ingresos: 7000, color: "#0EA5E9" },
  { name: "Vestido casual negro", ventas: 24, ingresos: 5280, color: "#4F46E5" },
  { name: "Chaqueta cuero negro", ventas: 18, ingresos: 10440, color: "#7C3AED" },
];

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState("ventas");

  const REPORTS = [
    { key: "ventas", label: "Tendencia de Ventas", icon: TrendingUp },
    { key: "clientes", label: "Segmentación ML", icon: Users },
    { key: "productos", label: "Top Productos", icon: BarChart3 },
    { key: "prediccion", label: "Predicción (IA)", icon: Brain },
  ];

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Reportes y Analítica</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>
            Inteligencia de negocios con Machine Learning · AKINOMASS 2026
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #059669, #0EA5E9)", fontSize: 13.5, fontWeight: 500 }}>
          <Download size={16} /> Exportar Reporte
        </button>
      </div>

      {/* Report selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {REPORTS.map((r) => (
          <button key={r.key} onClick={() => setActiveReport(r.key)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
            style={{
              background: activeReport === r.key ? "linear-gradient(135deg, #1E1B4B, #7C3AED)" : "white",
              border: "1px solid",
              borderColor: activeReport === r.key ? "#7C3AED" : "rgba(0,0,0,0.06)",
              boxShadow: activeReport === r.key ? "0 8px 24px rgba(124,58,237,0.3)" : "none",
            }}>
            <r.icon size={22} style={{ color: activeReport === r.key ? "white" : "#7C3AED" }} />
            <span style={{
              fontSize: 12.5, fontWeight: 600,
              color: activeReport === r.key ? "white" : "#374151",
              textAlign: "center"
            }}>
              {r.label}
            </span>
          </button>
        ))}
      </div>

      {/* Ventas trend */}
      {activeReport === "ventas" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Ingresos totales", value: "Bs. 198,600", color: "#2563EB" },
              { label: "Pedidos totales", value: "967", color: "#7C3AED" },
              { label: "Crecimiento anual", value: "+42.3%", color: "#059669" },
              { label: "Mejor mes", value: "Octubre", color: "#D97706" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Ventas Anuales 2026</h3>
            <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>Ingresos mensuales en Bolivianos (Bs.)</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `Bs.${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  formatter={(v, name) => [`Bs. ${Number(v).toLocaleString()}`, name === "real" ? "Ventas reales" : "Predicción"]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="real" stroke="#2563EB" strokeWidth={2.5}
                  fill="url(#blueGrad)" name="Ventas reales" connectNulls={false} dot={{ r: 4, fill: "#2563EB" }} />
                <Area type="monotone" dataKey="prediccion" stroke="#7C3AED" strokeWidth={2.5} strokeDasharray="6 3"
                  fill="url(#purpleGrad)" name="Predicción" connectNulls={false} dot={{ r: 4, fill: "#7C3AED" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Ventas por día de la semana</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `Bs.${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  formatter={(v) => [`Bs. ${v.toLocaleString()}`, "Ventas"]} />
                <Bar dataKey="ventas" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((d) => (
                    <Cell key={d.dia}
                      fill={d.dia === "Sáb" || d.dia === "Dom" ? "#7C3AED" : "#2563EB"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Segmentación ML (Clustering) */}
      {activeReport === "clientes" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl flex items-start gap-3"
            style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
            <Brain size={20} style={{ color: "#7C3AED", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#5B21B6" }}>
                Segmentación por Clustering (K-Means) — 3 clusters identificados
              </p>
              <p style={{ fontSize: 12.5, color: "#6D28D9", marginTop: 2 }}>
                Basado en historial de compras, frecuencia y ticket promedio. Datos de 128 clientes analizados.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clusters.map((c) => (
              <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm"
                style={{ border: `2px solid ${c.color}20` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${c.color}15` }}>
                  <Users size={22} style={{ color: c.color }} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{c.label}</h3>
                <p className="text-gray-500 mt-1" style={{ fontSize: 12.5 }}>{c.descripcion}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-xl" style={{ background: `${c.color}10` }}>
                    <p className="text-gray-500" style={{ fontSize: 11 }}>Clientes</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: c.color }}>{c.clientes}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: `${c.color}10` }}>
                    <p className="text-gray-500" style={{ fontSize: 11 }}>Ticket prom.</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: c.color }}>Bs. {c.ticket}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400" style={{ fontSize: 11 }}>Participación</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: c.color }}>
                      {Math.round((c.clientes / 128) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "#F3F4F6" }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${Math.round((c.clientes / 128) * 100)}%`, background: c.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Distribución de Clientes por Segmento</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={clusters} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="clientes" radius={[6, 6, 0, 0]} name="Clientes">
                  {clusters.map((c) => <Cell key={c.label} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Productos */}
      {activeReport === "productos" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Top 5 Productos más vendidos</h3>
            <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>Por unidades vendidas y total de ingresos</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={140} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="ventas" radius={[0, 6, 6, 0]} name="Unidades vendidas">
                  {topProducts.map((p) => <Cell key={p.name} fill={p.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ background: p.color, fontSize: 14 }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{p.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="h-1.5 flex-1 rounded-full" style={{ background: "#F3F4F6" }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${(p.ventas / topProducts[0].ventas) * 100}%`, background: p.color }} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.ventas} uds</p>
                  <p className="text-gray-500" style={{ fontSize: 12 }}>Bs. {p.ingresos.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predicción IA */}
      {activeReport === "prediccion" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl flex items-start gap-3"
            style={{ background: "linear-gradient(135deg, #EDE9FE, #EFF6FF)", border: "1px solid #C4B5FD" }}>
            <Brain size={22} style={{ color: "#7C3AED", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 14.5, fontWeight: 700, color: "#4C1D95" }}>
                Predicción de ventas — Regresión Lineal
              </p>
              <p style={{ fontSize: 12.5, color: "#6D28D9", marginTop: 2 }}>
                Modelo entrenado con datos históricos de 10 meses. Proyección para Nov-Dic 2026.
                <strong> Los resultados son estimaciones de apoyo a decisiones estratégicas.</strong>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Predicción Nov.", value: "Bs. 27,500", note: "+10.1% vs Oct.", color: "#7C3AED" },
              { label: "Predicción Dic.", value: "Bs. 31,200", note: "+13.5% vs Nov.", color: "#2563EB" },
              { label: "Confianza modelo", value: "87.4%", note: "R² = 0.874", color: "#059669" },
              { label: "Crecimiento proyec.", value: "+38.2%", note: "Dic vs Ene 2026", color: "#D97706" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{s.note}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Tendencia + Proyección (Regresión Lineal)</h3>
            <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>
              Línea sólida = datos reales · Línea punteada = predicción del modelo
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `Bs.${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  formatter={(v, n) => [`Bs. ${Number(v).toLocaleString()}`, n === "real" ? "Ventas reales" : "Predicción ML"]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine x="Oct" stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "Hoy", fontSize: 11, fill: "#F59E0B" }} />
                <Line type="monotone" dataKey="real" stroke="#2563EB" strokeWidth={3}
                  dot={{ r: 5, fill: "#2563EB" }} name="Ventas reales" connectNulls={false} />
                <Line type="monotone" dataKey="prediccion" stroke="#7C3AED" strokeWidth={3} strokeDasharray="8 4"
                  dot={{ r: 5, fill: "#7C3AED", strokeDasharray: "none" }} name="Predicción ML" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
