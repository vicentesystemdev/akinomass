import { useState } from "react";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { useAuth } from "../AuthContext";

interface TopBarProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

const NOTIFICATIONS = [
  { id: 1, text: "Nuevo pedido #P-0081 de María Pérez", time: "5 min", type: "order" },
  { id: 2, text: "Comprobante de pago pendiente de validar", time: "12 min", type: "payment" },
  { id: 3, text: "Stock bajo: Blusa floral talla S (3 unid.)", time: "1 h", type: "alert" },
  { id: 4, text: "Interacción desde TikTok LIVE: @user_987", time: "2 h", type: "social" },
];

export function TopBar({ onMenuToggle, pageTitle }: TopBarProps) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-6 bg-white border-b"
      style={{ height: 60, borderColor: "rgba(0,0,0,0.08)" }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      {pageTitle && (
        <h2 className="hidden md:block text-gray-800" style={{ fontSize: 16, fontWeight: 600 }}>
          {pageTitle}
        </h2>
      )}

      {/* Search */}
      <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: "#F3F4F6" }}>
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
          style={{ fontSize: 13.5 }}
        />
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Bell size={19} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#7C3AED" }}
            />
          </button>
          {showNotif && (
            <div
              className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border overflow-hidden z-50"
              style={{ borderColor: "rgba(0,0,0,0.1)" }}
            >
              <div className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notificaciones</span>
                <span className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ background: "#7C3AED" }}>
                  {NOTIFICATIONS.length}
                </span>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                  <p className="text-gray-700" style={{ fontSize: 12.5 }}>{n.text}</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 11 }}>{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 12 }}
            >
              {user?.avatar}
            </div>
            <span className="hidden md:block text-gray-700" style={{ fontSize: 13, fontWeight: 500 }}>
              {user?.name?.split(" ")[0]}
            </span>
            <ChevronDown size={14} className="text-gray-500 hidden md:block" />
          </button>
          {showProfile && (
            <div
              className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border overflow-hidden z-50"
              style={{ borderColor: "rgba(0,0,0,0.1)" }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                <p style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</p>
                <p className="text-gray-500" style={{ fontSize: 11, textTransform: "capitalize" }}>{user?.role}</p>
              </div>
              <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                style={{ fontSize: 13 }}>
                Mi Perfil
              </button>
              <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                style={{ fontSize: 13 }}>
                Configuración
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(showNotif || showProfile) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotif(false); setShowProfile(false); }} />
      )}
    </header>
  );
}
