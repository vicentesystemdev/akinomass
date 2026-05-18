import { useState } from "react";
import { Plus, Edit2, Trash2, UserCheck, UserX, Search, X, Shield, ShieldCheck } from "lucide-react";

const USERS = [
  { id: 1, name: "Administrador AKINOMASS", email: "admin@akinomass.bo", role: "admin", status: "activo", createdAt: "2026-01-10", lastLogin: "2026-05-03 08:30", avatar: "A" },
  { id: 2, name: "Carla Encinas Cano", email: "carla@akinomass.bo", role: "vendedor", status: "activo", createdAt: "2026-01-15", lastLogin: "2026-05-03 09:45", avatar: "CE" },
  { id: 3, name: "Victor Asturizaga", email: "victor@akinomass.bo", role: "vendedor", status: "activo", createdAt: "2026-02-01", lastLogin: "2026-05-02 14:20", avatar: "VA" },
  { id: 4, name: "Vicente Claros", email: "vicente@akinomass.bo", role: "vendedor", status: "inactivo", createdAt: "2026-02-15", lastLogin: "2026-04-20 11:00", avatar: "VC" },
  { id: 5, name: "María Pérez (Cliente)", email: "mperez@gmail.com", role: "cliente", status: "activo", createdAt: "2026-03-05", lastLogin: "2026-05-01 20:15", avatar: "MP" },
  { id: 6, name: "Carlos Mamani (Cliente)", email: "cmamani@yahoo.com", role: "cliente", status: "activo", createdAt: "2026-03-12", lastLogin: "2026-04-28 16:40", avatar: "CM" },
];

const ROLE_CONFIG: Record<string, { label: string; bg: string; text: string; icon: typeof Shield }> = {
  admin: { label: "Administrador", bg: "#FEF3C7", text: "#D97706", icon: ShieldCheck },
  vendedor: { label: "Vendedor", bg: "#EFF6FF", text: "#2563EB", icon: Shield },
  cliente: { label: "Cliente", bg: "#F5F3FF", text: "#7C3AED", icon: Shield },
};

const PERMISSIONS: Record<string, { admin: boolean; vendedor: boolean }> = {
  "Ver Dashboard": { admin: true, vendedor: true },
  "Gestionar Clientes (CRM)": { admin: true, vendedor: true },
  "Ver Inventario": { admin: true, vendedor: true },
  "Editar Inventario": { admin: true, vendedor: false },
  "Gestionar Pedidos": { admin: true, vendedor: true },
  "Validar Pagos": { admin: true, vendedor: true },
  "Ver Ventas": { admin: true, vendedor: true },
  "Exportar Reportes": { admin: true, vendedor: false },
  "Ver Analítica ML": { admin: true, vendedor: false },
  "Gestionar Usuarios": { admin: true, vendedor: false },
  "Ventas en Vivo": { admin: true, vendedor: true },
  "Interacciones Sociales": { admin: true, vendedor: true },
};

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [activeTab, setActiveTab] = useState<"usuarios" | "permisos">("usuarios");
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "vendedor", password: "" });

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase();
    const ms = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const mr = roleFilter === "todos" || u.role === roleFilter;
    return ms && mr;
  });

  const stats = {
    admin: USERS.filter((u) => u.role === "admin").length,
    vendedor: USERS.filter((u) => u.role === "vendedor").length,
    cliente: USERS.filter((u) => u.role === "cliente").length,
    inactivo: USERS.filter((u) => u.status === "inactivo").length,
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Gestión de Usuarios</h1>
          <p className="text-gray-500" style={{ fontSize: 13.5 }}>
            Administración de roles y permisos del sistema
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 13.5, fontWeight: 500 }}>
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Administradores", value: stats.admin, color: "#D97706", bg: "#FEF3C7" },
          { label: "Vendedores", value: stats.vendedor, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Clientes", value: stats.cliente, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Inactivos", value: stats.inactivo, color: "#6B7280", bg: "#F3F4F6" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-gray-500" style={{ fontSize: 12 }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "usuarios", label: "Lista de Usuarios" },
          { key: "permisos", label: "Matriz de Permisos" },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
            className="px-4 py-2 rounded-xl transition-all"
            style={{
              fontSize: 13.5, fontWeight: 500,
              background: activeTab === t.key ? "#2563EB" : "white",
              color: activeTab === t.key ? "white" : "#6B7280",
              border: "1px solid",
              borderColor: activeTab === t.key ? "#2563EB" : "#E5E7EB",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "usuarios" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3"
            style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <Search size={15} className="text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar usuario..."
                className="bg-transparent outline-none flex-1" style={{ fontSize: 13.5 }} />
            </div>
            <div className="flex items-center gap-2">
              {["todos", "admin", "vendedor", "cliente"].map((r) => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className="px-3 py-1.5 rounded-lg capitalize transition-all"
                  style={{
                    fontSize: 12.5, fontWeight: 500,
                    background: roleFilter === r ? "#2563EB" : "#F3F4F6",
                    color: roleFilter === r ? "white" : "#6B7280",
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Users table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    {["Usuario", "Email", "Rol", "Estado", "Creado", "Último acceso", "Acciones"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500"
                        style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const rc = ROLE_CONFIG[u.role];
                    const Icon = rc.icon;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors"
                        style={{ borderBottom: "1px solid #F9FAFB" }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
                              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 11, fontWeight: 700 }}>
                              {u.avatar}
                            </div>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500" style={{ fontSize: 12.5 }}>{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 w-fit"
                            style={{ fontSize: 11.5, fontWeight: 500, background: rc.bg, color: rc.text, padding: "3px 10px", borderRadius: 20 }}>
                            <Icon size={11} />
                            {rc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{
                            fontSize: 11.5, fontWeight: 500,
                            background: u.status === "activo" ? "#ECFDF5" : "#F3F4F6",
                            color: u.status === "activo" ? "#059669" : "#6B7280",
                            padding: "2px 8px", borderRadius: 20
                          }}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500" style={{ fontSize: 12 }}>{u.createdAt}</td>
                        <td className="px-4 py-3 text-gray-500" style={{ fontSize: 12 }}>{u.lastLogin}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-blue-50" style={{ color: "#2563EB" }}>
                              <Edit2 size={14} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-amber-50" style={{ color: "#D97706" }}
                              title={u.status === "activo" ? "Desactivar" : "Activar"}>
                              {u.status === "activo" ? <UserX size={14} /> : <UserCheck size={14} />}
                            </button>
                            {u.role !== "admin" && (
                              <button className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: "#EF4444" }}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Permissions matrix */}
      {activeTab === "permisos" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="p-4 border-b" style={{ borderColor: "#F3F4F6" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Matriz de Permisos por Rol</h3>
            <p className="text-gray-400" style={{ fontSize: 12.5, marginTop: 2 }}>
              La seguridad real se maneja en el backend. Esta vista es solo referencial.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <th className="text-left px-5 py-3 text-gray-500" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>
                    Permiso
                  </th>
                  {["Administrador", "Vendedor", "Cliente"].map((r) => (
                    <th key={r} className="px-5 py-3 text-center text-gray-500"
                      style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(PERMISSIONS).map(([perm, roles]) => (
                  <tr key={perm} className="hover:bg-gray-50" style={{ borderBottom: "1px solid #F9FAFB" }}>
                    <td className="px-5 py-3" style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>
                      {perm}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {roles.admin ? (
                        <span className="w-6 h-6 rounded-full flex items-center justify-center mx-auto"
                          style={{ background: "#ECFDF5" }}>
                          <span style={{ color: "#059669", fontSize: 16 }}>✓</span>
                        </span>
                      ) : (
                        <span className="text-gray-300 text-lg">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {roles.vendedor ? (
                        <span className="w-6 h-6 rounded-full flex items-center justify-center mx-auto"
                          style={{ background: "#EFF6FF" }}>
                          <span style={{ color: "#2563EB", fontSize: 16 }}>✓</span>
                        </span>
                      ) : (
                        <span className="text-gray-300 text-lg">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-gray-300 text-lg">—</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Nuevo Usuario</h3>
              <button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Nombre completo *", key: "name", placeholder: "Ej: Carla Encinas" },
                { label: "Correo electrónico *", key: "email", placeholder: "Ej: carla@akinomass.bo" },
                { label: "Contraseña inicial *", key: "password", placeholder: "Mínimo 8 caracteres", type: "password" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type || "text"} value={newUser[f.key as keyof typeof newUser]}
                    onChange={(e) => setNewUser((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-xl outline-none"
                    style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5 }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 500 }}>Rol *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["admin", "vendedor", "cliente"] as const).map((r) => {
                    const rc = ROLE_CONFIG[r];
                    return (
                      <button key={r} onClick={() => setNewUser((p) => ({ ...p, role: r }))}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                        style={{
                          border: "2px solid",
                          borderColor: newUser.role === r ? rc.text : "#E5E7EB",
                          background: newUser.role === r ? rc.bg : "white",
                        }}>
                        <rc.icon size={18} style={{ color: rc.text }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: rc.text }}>{rc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border text-gray-700"
                  style={{ fontSize: 14, borderColor: "#E5E7EB" }}>Cancelar</button>
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontSize: 14, fontWeight: 500 }}>
                  Crear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
