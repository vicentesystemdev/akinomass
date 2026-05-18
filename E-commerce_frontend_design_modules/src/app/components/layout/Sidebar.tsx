import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Share2,
  Radio,
  BarChart3,
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";
import { useAuth } from "../AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles: string[];
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["admin", "vendedor"] },
  { label: "CRM Clientes", path: "/crm", icon: Users, roles: ["admin", "vendedor"] },
  { label: "Inventario", path: "/inventory", icon: Package, roles: ["admin", "vendedor"] },
  { label: "Pedidos", path: "/orders", icon: ShoppingCart, roles: ["admin", "vendedor"], badge: 5 },
  { label: "Pagos", path: "/payments", icon: CreditCard, roles: ["admin", "vendedor"], badge: 3 },
  { label: "Ventas", path: "/sales", icon: TrendingUp, roles: ["admin", "vendedor"] },
  { label: "Interacciones Sociales", path: "/social", icon: Share2, roles: ["admin", "vendedor"] },
  { label: "Ventas en Vivo", path: "/live-sales", icon: Radio, roles: ["admin", "vendedor"] },
  { label: "Reportes", path: "/reports", icon: BarChart3, roles: ["admin"] },
  { label: "Gestión Usuarios", path: "/users", icon: UserCog, roles: ["admin"] },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5 border-b border-white/10"
        style={{ minHeight: 64 }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
            <Zap size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold leading-tight" style={{ fontFamily: "Poppins, sans-serif", fontSize: 15 }}>
                AKI NO MASS
              </p>
              <p style={{ color: "#A5B4FC", fontSize: 11 }}>Social Commerce</p>
            </div>
          )}
        </div>
        {/* Mobile close */}
        {mobileOpen !== undefined && onMobileClose && (
          <button
            onClick={onMobileClose}
            className="text-white/60 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 group ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-[#A5B4FC] hover:bg-white/8 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? "text-[#60A5FA]" : "text-[#818CF8] group-hover:text-[#A5B4FC]"
                  }`}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate" style={{ fontSize: 13.5, fontFamily: "Inter, sans-serif" }}>
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                        style={{ background: "#7C3AED", color: "white", fontSize: 10 }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 13 }}>
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{user.name}</p>
              <p style={{ color: "#818CF8", fontSize: 10.5, textTransform: "capitalize" }}>{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all hover:bg-red-500/15 text-red-400 hover:text-red-300"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span style={{ fontSize: 13 }}>Cerrar Sesión</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all text-[#A5B4FC] hover:text-white hover:bg-white/8"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span style={{ fontSize: 13 }}>Contraer menú</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: "linear-gradient(180deg, #1E1B4B 0%, #2D2A6E 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onMobileClose}
          />
          <aside
            className="relative flex flex-col h-full w-64 z-10"
            style={{ background: "linear-gradient(180deg, #1E1B4B 0%, #2D2A6E 100%)" }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Spacer for desktop */}
      <div
        className="hidden lg:block flex-shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 64 : 240 }}
      />
    </>
  );
}
