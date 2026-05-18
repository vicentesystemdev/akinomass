import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Zap, User, Mail, Phone, Lock, CheckCircle2 } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    channel: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const channels = [
    "TikTok LIVE", "WhatsApp", "Instagram", "Facebook",
    "Telegram", "Marketplace", "Web", "Venta directa", "Otro"
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "El nombre es requerido";
    if (!form.email.includes("@")) e.email = "Email inválido";
    if (form.phone && !/^\d{7,8}$/.test(form.phone)) e.phone = "Teléfono inválido (7-8 dígitos)";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden";
    if (!form.terms) e.terms = "Debes aceptar los términos";
    return e;
  };

  const handleChange = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const ne = { ...e }; delete ne[k]; return ne; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1E1B4B, #2563EB)", fontFamily: "Inter, sans-serif" }}>
        <div className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-sm w-full mx-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#EDE9FE" }}>
            <CheckCircle2 size={40} style={{ color: "#7C3AED" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", fontFamily: "Poppins, sans-serif" }}>
            ¡Registro exitoso!
          </h2>
          <p className="text-gray-500 mt-2" style={{ fontSize: 14 }}>
            Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...
          </p>
          <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: "#EDE9FE" }}>
            <div className="h-full rounded-full animate-pulse" style={{ background: "#7C3AED", width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  const Field = ({
    label, name, type = "text", placeholder, icon: Icon, value, error,
  }: {
    label: string; name: string; type?: string; placeholder: string;
    icon: typeof User; value: string; error?: string;
  }) => (
    <div>
      <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => handleChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all"
          style={{
            border: `1.5px solid ${error ? "#FCA5A5" : "#E5E7EB"}`,
            fontSize: 13.5, background: error ? "#FEF2F2" : "white",
          }}
          onFocus={(e) => (e.target.style.borderColor = error ? "#EF4444" : "#7C3AED")}
          onBlur={(e) => (e.target.style.borderColor = error ? "#FCA5A5" : "#E5E7EB")}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[40%] flex-col justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1E1B4B 0%, #7C3AED 100%)" }}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#2563EB" }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-10"
          style={{ background: "#A855F7" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <Zap size={20} className="text-white" />
            </div>
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: "white" }}>
              AKI NO MASS
            </span>
          </div>
          <h1 className="text-white" style={{ fontFamily: "Poppins, sans-serif", fontSize: 28, fontWeight: 700, lineHeight: 1.3 }}>
            Únete a nuestra
            <br />
            comunidad digital
          </h1>
          <p style={{ color: "#C7D2FE", marginTop: 14, fontSize: 14, lineHeight: 1.7 }}>
            Registra tu cuenta para acceder al sistema de gestión multicanal más completo para tu emprendimiento.
          </p>
          <div className="mt-8 space-y-4">
            {["Gestión centralizada de pedidos", "Seguimiento de interacciones sociales", "Analítica e inteligencia de negocios"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <p style={{ color: "#E0E7FF", fontSize: 13.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 lg:p-10"
        style={{ background: "#FAFAFA" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
              <Zap size={16} className="text-white" />
            </div>
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 17, color: "#1E1B4B" }}>
              AKI NO MASS
            </span>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", fontFamily: "Poppins, sans-serif" }}>
            Crear cuenta
          </h2>
          <p className="text-gray-500 mt-1" style={{ fontSize: 13.5 }}>
            Completa el formulario para registrarte en el sistema
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Nombre completo *" name="name" placeholder="Ej: María Pérez Quispe"
              icon={User} value={form.name} error={errors.name} />

            <Field label="Correo electrónico *" name="email" type="email"
              placeholder="correo@ejemplo.com" icon={Mail} value={form.email} error={errors.email} />

            <Field label="Teléfono (opcional)" name="phone" placeholder="Ej: 74123456"
              icon={Phone} value={form.phone} error={errors.phone} />

            {/* Channel */}
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
                Canal de origen (¿cómo nos encontraste?)
              </label>
              <select
                value={form.channel}
                onChange={(e) => handleChange("channel", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl outline-none transition-all"
                style={{ border: "1.5px solid #E5E7EB", fontSize: 13.5, background: "white", color: form.channel ? "#111827" : "#9CA3AF" }}
              >
                <option value="">Selecciona un canal...</option>
                {channels.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
                Contraseña *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl outline-none"
                  style={{ border: `1.5px solid ${errors.password ? "#FCA5A5" : "#E5E7EB"}`, fontSize: 13.5 }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
                Confirmar contraseña *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => handleChange("confirm", e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none"
                  style={{ border: `1.5px solid ${errors.confirm ? "#FCA5A5" : "#E5E7EB"}`, fontSize: 13.5 }}
                />
              </div>
              {errors.confirm && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => handleChange("terms", e.target.checked)}
                  className="mt-0.5"
                />
                <span style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.5 }}>
                  Acepto los{" "}
                  <span style={{ color: "#7C3AED", fontWeight: 600, cursor: "pointer" }}>términos y condiciones</span>
                  {" "}y la{" "}
                  <span style={{ color: "#7C3AED", fontWeight: 600, cursor: "pointer" }}>política de privacidad</span>
                  {" "}de AKI NO MASS
                </span>
              </label>
              {errors.terms && <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", fontSize: 15, marginTop: 8 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center mt-5 text-gray-500" style={{ fontSize: 13.5 }}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: "#2563EB", fontWeight: 600 }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
