import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Principal",
  "/crm": "CRM — Gestión de Clientes",
  "/inventory": "Inventario de Productos",
  "/orders": "Gestión de Pedidos",
  "/payments": "Validación de Pagos",
  "/sales": "Consolidación de Ventas",
  "/social": "Interacciones Sociales",
  "/live-sales": "Ventas en Vivo",
  "/reports": "Reportes y Analítica",
  "/users": "Gestión de Usuarios",
};

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen" style={{ background: "#F1F5F9", fontFamily: "Inter, sans-serif" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuToggle={() => setMobileOpen(true)}
          pageTitle={PAGE_TITLES[location.pathname]}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
