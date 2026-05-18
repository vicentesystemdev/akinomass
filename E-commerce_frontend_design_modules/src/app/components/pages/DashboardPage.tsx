import { useState } from "react";
import {
  TrendingUp, Users, ShoppingCart, Package, ArrowUpRight, ArrowDownRight,
  Radio, Eye, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const salesData = [
  { mes: "Ene", ventas: 8200, pedidos: 48 },
  { mes: "Feb", ventas: 11400, pedidos: 63 },
  { mes: "Mar", ventas: 9800, pedidos: 54 },
  { mes: "Abr", ventas: 15200, pedidos: 82 },
  { mes: "May", ventas: 13600, pedidos: 74 },
  { mes: "Jun", ventas: 18900, pedidos: 95 },
  { mes: "Jul", ventas: 16400, pedidos: 88 },
  { mes: "Ago", ventas: 21000, pedidos: 112 },
  { mes: "Sep", ventas: 19300, pedidos: 101 },
  { mes: "Oct", ventas: 24800, pedidos: 128 },
  { mes: "Nov", ventas: 28400, pedidos: 145 },
  { mes: "Dic", ventas: 32100, pedidos: 167 },
];

const channelData = [
  { name: "TikTok LIVE", value: 38, color: "#7C3AED" },
  { name: "Instagram", value: 24, color: "#2563EB" },
  { name: "Facebook", value: 18, color: "#4F46E5" },
  { name: "WhatsApp", value: 12, color: "#0EA5E9" },
  { name: "Otros", value: 8, color: "#A855F7" },
];

const recentOrders = [
  { id: "#P-0089", client: "María Pérez", product: "Blusa floral + Jean slim", amount: 370, channel: "TikTok LIVE", status: "pendiente" },
  { id: "#P-0088", client: "Carlos Mamani", product: "Vestido casual negro", amount: 220, channel: "WhatsApp", status: "procesando" },
  { id: "#P-0087", client: "Ana García", product: "Conjunto deportivo", amount: 450, channel: "Instagram", status: "completado" },
  { id: "#P-0086", client: "Luis Flores", product: "Camisa cuadros azul", amount: 180, channel: "Facebook", status: "completado" },
  { id: "#P-0085", client: "Paola Quispe", product: "Falda plisada rosa", amount: 150, channel: "TikTok LIVE", status: "pendiente" },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pendiente: { bg: "#FEF3C7", text: "#D97706", label: "Pendiente" },
  procesando: { bg: "#EFF6FF", text: "#2563EB", label: "Procesando" },
  completado: { bg: "#ECFDF5", text: "#059669", label: "Completado" },
};

const channelColors: Record<string, string> = {
  "TikTok LIVE": "#7C3AED",
  "Instagram": "#EC4899",
  "Facebook": "#2563EB",
  "WhatsApp": "#16A34A",
};

interface KPICard {
  title: string;
  value: string;
  change: number;
  icon: typeof TrendingUp;
  color: string;
  lightColor: string;
}

const kpis: KPICard[] = [
  { title: "Ventas Totales", value: "Bs. 45,230", change: 18.4, icon: TrendingUp, color: "#2563EB", lightColor: "#EFF6FF" },
  { title: "Clientes Activos", value: "128", change: 12.1, icon: Users, color: "#7C3AED", lightColor: "#F5F3FF" },
  { title: "Pedidos Pendientes", value: "14", change: -5.2, icon: ShoppingCart, color: "#F59E0B", lightColor: "#FFFBEB" },
  { title: "Stock Bajo", value: "5 productos", change: -2.1, icon: Package, color: "#EF4444", lightColor: "#FEF2F2" },
];

export function DashboardPage() {
  const [period, setPeriod] = useState("año");

  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Panel Principal</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>
            Resumen general de AKINOMASS · Mayo 2026
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["semana", "mes", "año"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg transition-all capitalize"
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                background: period === p ? "#2563EB" : "white",
                color: period === p ? "white" : "#6B7280",
                border: "1px solid",
                borderColor: period === p ? "#2563EB" : "#E5E7EB",
              }}
            >
              {p}
            </button>
          ))}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", fontSize: 12.5, fontWeight: 500 }}
          >
            <Radio size={13} />
            Iniciar Live
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-2xl p-5 shadow-sm"
            style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500" style={{ fontSize: 12.5, fontWeight: 500 }}>{kpi.title}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 4, lineHeight: 1.2 }}>
                  {kpi.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: kpi.lightColor }}>
                <kpi.icon size={18} style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              {kpi.change >= 0 ? (
                <ArrowUpRight size={14} style={{ color: "#10B981" }} />
              ) : (
                <ArrowDownRight size={14} style={{ color: "#EF4444" }} />
              )}
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: kpi.change >= 0 ? "#10B981" : "#EF4444"
              }}>
                {Math.abs(kpi.change)}%
              </span>
              <span className="text-gray-400" style={{ fontSize: 12 }}>vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Area Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Tendencia de Ventas</h3>
              <p className="text-gray-400" style={{ fontSize: 12 }}>Ingresos en Bolivianos (Bs.)</p>
            </div>
            <span style={{ fontSize: 11, color: "#10B981", background: "#ECFDF5", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
              +23.8% este año
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pedidosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `Bs.${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val, name) => [
                  name === "ventas" ? `Bs. ${val.toLocaleString()}` : val,
                  name === "ventas" ? "Ventas" : "Pedidos",
                ]}
                contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
              <Area type="monotone" dataKey="ventas" stroke="#2563EB" strokeWidth={2.5}
                fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Canal de Origen</h3>
          <p className="text-gray-400" style={{ fontSize: 12, marginBottom: 16 }}>Distribución de ventas por canal</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="value" paddingAngle={3}>
                {channelData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val}%`, "Participación"]}
                contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {channelData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span style={{ fontSize: 12, color: "#374151" }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly bar chart + recent orders */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Bar chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Pedidos por Mes</h3>
          <p className="text-gray-400" style={{ fontSize: 12, marginBottom: 16 }}>Volumen de pedidos mensuales</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData.slice(-6)} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="pedidos" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Pedidos" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Pedidos Recientes</h3>
              <p className="text-gray-400" style={{ fontSize: 12 }}>Últimas transacciones</p>
            </div>
            <button className="flex items-center gap-1 hover:underline"
              style={{ fontSize: 12.5, color: "#2563EB", fontWeight: 500 }}>
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const s = statusColors[order.status];
              return (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#EFF6FF" }}>
                    <ShoppingCart size={15} style={{ color: "#2563EB" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{order.id}</span>
                      <span style={{ fontSize: 11, color: channelColors[order.channel] || "#6B7280",
                        background: `${channelColors[order.channel]}15` || "#F3F4F6",
                        padding: "1px 6px", borderRadius: 10, fontWeight: 500 }}>
                        {order.channel}
                      </span>
                    </div>
                    <p className="text-gray-500 truncate" style={{ fontSize: 12 }}>
                      {order.client} · {order.product}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Bs. {order.amount}</p>
                    <span style={{ fontSize: 11, background: s.bg, color: s.text,
                      padding: "1px 7px", borderRadius: 10, fontWeight: 500 }}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Nuevo Pedido", icon: ShoppingCart, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Registrar Cliente", icon: Users, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Iniciar Live", icon: Radio, color: "#E11D48", bg: "#FFF1F2" },
          { label: "Ver Reportes", icon: Eye, color: "#059669", bg: "#ECFDF5" },
        ].map((a) => (
          <button key={a.label}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-all"
            style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: a.bg }}>
              <a.icon size={18} style={{ color: a.color }} />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: "#374151" }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
