import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, Zap, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("admin@akinomass.bo");
  const [password, setPassword] = useState("admin123");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 3) {
      setError("Cuenta bloqueada temporalmente por múltiples intentos fallidos.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password);
    if (ok) {
      navigate("/dashboard");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 3) {
        setError("Cuenta bloqueada temporalmente. Intente en unos minutos.");
      } else {
        setError(`Credenciales incorrectas. Intentos restantes: ${3 - next}`);
      }
    }
    setLoading(false);
  };

  const DEMO_USERS = [
    { label: "Admin", email: "admin@akinomass.bo", pass: "admin123" },
    { label: "Vendedor", email: "vendedor@akinomass.bo", pass: "vend123" },
    { label: "Cliente", email: "cliente@akinomass.bo", pass: "cli123" },
  ];

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #2D2A6E 40%, #2563EB 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "#7C3AED" }} />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: "#2563EB" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
          style={{ background: "#A855F7" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold" style={{ fontFamily: "Poppins, sans-serif", fontSize: 18 }}>
              AKI NO MASS
            </p>
            <p style={{ color: "#A5B4FC", fontSize: 12 }}>Social Commerce Platform</p>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-10">
          <div className="relative">
            <div className="w-72 h-72 rounded-3xl overflow-hidden shadow-2xl"
              style={{ border: "3px solid rgba(255,255,255,0.2)" }}>
              <img
                src="https://images.unsplash.com/photo-1566793772361-1d5d9cefbd12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjB3b21lbiUyMGJvbGl2aWFuJTIwc3R5bGV8ZW58MXx8fHwxNzc3ODgxNjYwfDA&ixlib=rb-4.1.0&q=80&w=400"
                alt="Fashion"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stat cards */}
            <div className="absolute -right-12 top-8 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-3">
              <p className="text-gray-500" style={{ fontSize: 11 }}>Ventas hoy</p>
              <p style={{ fontWeight: 700, fontSize: 20, color: "#2563EB" }}>Bs. 3,240</p>
            </div>
            <div className="absolute -left-10 bottom-12 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-3">
              <p className="text-gray-500" style={{ fontSize: 11 }}>Pedidos activos</p>
              <p style={{ fontWeight: 700, fontSize: 20, color: "#7C3AED" }}>14</p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative z-10">
          <h1 className="text-white" style={{ fontFamily: "Poppins, sans-serif", fontSize: 26, fontWeight: 700, lineHeight: 1.3 }}>
            Gestiona tu negocio digital
            <br />
            desde un solo lugar
          </h1>
          <p style={{ color: "#C7D2FE", marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>
            CRM · Inventario · Pedidos · Ventas en Vivo · Analítica con IA
          </p>
          <div className="flex items-center gap-2 mt-4">
            <ShieldCheck size={16} style={{ color: "#60A5FA" }} />
            <p style={{ color: "#93C5FD", fontSize: 12.5 }}>
              Plataforma segura para emprendimientos bolivianos
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12"
        style={{ background: "#FAFAFA" }}>
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
            <Zap size={18} className="text-white" />
          </div>
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "#1E1B4B" }}>
            AKI NO MASS
          </span>
        </div>

        <div className="w-full max-w-md">
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", fontFamily: "Poppins, sans-serif" }}>
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-500 mt-1" style={{ fontSize: 14 }}>
            Ingresa tus credenciales para acceder al sistema
          </p>

          {/* Demo credentials */}
          <div className="mt-5 p-3 rounded-xl" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <p style={{ fontSize: 12, color: "#1D4ED8", fontWeight: 600, marginBottom: 6 }}>
              Demo — Acceso rápido:
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.label}
                  onClick={() => { setEmail(u.email); setPassword(u.pass); }}
                  className="text-xs px-3 py-1 rounded-full transition-all hover:scale-105"
                  style={{ background: "#2563EB", color: "white", fontWeight: 500 }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13.5, fontWeight: 500 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@akinomass.bo"
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  border: "1.5px solid #E5E7EB",
                  fontSize: 14,
                  background: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13.5, fontWeight: 500 }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all pr-12"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 14, background: "white" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button type="button" className="hover:underline" style={{ fontSize: 12.5, color: "#2563EB" }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p style={{ fontSize: 13, color: "#DC2626" }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || attempts >= 3}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                fontSize: 15,
                marginTop: 8,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500" style={{ fontSize: 13.5 }}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" style={{ color: "#7C3AED", fontWeight: 600 }}>
              Regístrate aquí
            </Link>
          </p>

          {/* Attempt indicator */}
          {attempts > 0 && attempts < 3 && (
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: i < attempts ? "#DC2626" : "#D1D5DB" }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
