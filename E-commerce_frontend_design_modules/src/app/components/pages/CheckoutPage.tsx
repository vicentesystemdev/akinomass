import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShoppingCart, CheckCircle, ChevronLeft, ChevronRight,
  Sparkles, Package, CreditCard, FileText, Truck,
  MapPin, Phone, Mail, User, Shield, Copy, Check,
  Home, RefreshCw, Star, QrCode, Building2, AlertCircle
} from "lucide-react";
import { useCart } from "../store/CartContext";

// ── TYPES ──────────────────────────────────────────────────────────────────────
interface BillingData {
  nombre: string;
  apellido: string;
  documento: string;
  tipoDoc: "CI" | "NIT";
  tipoFactura: "personal" | "empresa";
  telefono: string;
  email: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  razonSocial: string;
}

const INITIAL_BILLING: BillingData = {
  nombre: "",
  apellido: "",
  documento: "",
  tipoDoc: "CI",
  tipoFactura: "personal",
  telefono: "",
  email: "",
  departamento: "La Paz",
  ciudad: "",
  direccion: "",
  referencia: "",
  razonSocial: "",
};

const DEPARTAMENTOS = ["La Paz", "Cochabamba", "Santa Cruz", "Oruro", "Potosí", "Chuquisaca", "Tarija", "Beni", "Pando"];

type PaymentMethod = "qr" | "transfer" | "card";

// ── PROGRESS STEPPER ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Carrito", sublabel: "Revisión", icon: ShoppingCart },
  { id: 2, label: "Datos", sublabel: "Facturación", icon: FileText },
  { id: 3, label: "Pago", sublabel: "Método", icon: CreditCard },
  { id: 4, label: "Confirmado", sublabel: "¡Listo!", icon: CheckCircle },
];

function ProgressStepper({ current }: { current: number }) {
  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting lines */}
          <div
            className="absolute top-5 left-0 right-0 h-0.5 mx-8"
            style={{ background: "#E5E7EB", zIndex: 0 }}
          />
          <div
            className="absolute top-5 left-0 h-0.5 mx-8 transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #7C3AED, #2563EB)",
              zIndex: 1,
              right: `${100 - ((current - 1) / 3) * 100}%`,
            }}
          />

          {STEPS.map((step) => {
            const isCompleted = step.id < current;
            const isActive = step.id === current;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isCompleted
                      ? "linear-gradient(135deg, #059669, #10B981)"
                      : isActive
                      ? "linear-gradient(135deg, #7C3AED, #2563EB)"
                      : "white",
                    border: isCompleted || isActive
                      ? "none"
                      : "2px solid #E5E7EB",
                    boxShadow: isActive
                      ? "0 0 0 4px rgba(124,58,237,0.15)"
                      : "none",
                  }}
                >
                  {isCompleted ? (
                    <Check size={16} color="white" strokeWidth={3} />
                  ) : (
                    <Icon
                      size={16}
                      style={{ color: isActive ? "white" : "#9CA3AF" }}
                    />
                  )}
                </div>
                <div className="text-center hidden sm:block">
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#7C3AED" : isCompleted ? "#059669" : "#9CA3AF",
                    }}
                  >
                    {step.label}
                  </p>
                  <p style={{ fontSize: 10, color: "#C4C4CC" }}>{step.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step label for mobile */}
        <p className="text-center mt-4 sm:hidden" style={{ fontSize: 13, fontWeight: 600, color: "#7C3AED" }}>
          Paso {current} de 4: {STEPS[current - 1].label}
        </p>
      </div>
    </div>
  );
}

// ── STEP 1: CART REVIEW ───────────────────────────────────────────────────────
function CartStep({ onNext }: { onNext: () => void }) {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();
  const shipping = total >= 300 ? 0 : 25;
  const iva = Math.round(total * 0.13);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "#F5F3FF" }}>
          <ShoppingCart size={32} style={{ color: "#7C3AED" }} />
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>Tu carrito está vacío</p>
        <button
          onClick={() => navigate("/store")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", color: "white", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Explorar tienda
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Items list */}
      <div className="lg:col-span-2 space-y-3">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
          Productos en tu carrito ({cartItems.length})
        </h3>
        {cartItems.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex gap-4 p-4 rounded-2xl bg-white"
            style={{ border: "1px solid rgba(0,0,0,0.07)" }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="rounded-xl object-cover flex-shrink-0"
              style={{ width: 80, height: 100 }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: "#7C3AED", marginTop: 2 }}>{item.category}</p>
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md mt-1.5"
                    style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
                  >
                    <span style={{ fontSize: 11, color: "#2563EB", fontWeight: 600 }}>Talla: {item.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                  style={{ color: "#D1D5DB" }}
                >
                  ×
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 rounded-xl p-1" style={{ background: "#F3F4F6" }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                    style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", minWidth: 24, textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                    style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#2563EB" }}>
                    Bs. {item.price * item.quantity}
                  </p>
                  {item.quantity > 1 && (
                    <p style={{ fontSize: 11, color: "#9CA3AF" }}>Bs. {item.price} c/u</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/store")}
          className="flex items-center gap-1.5 mt-2 hover:underline"
          style={{ fontSize: 13, color: "#2563EB", fontWeight: 500 }}
        >
          <ChevronLeft size={14} />
          Seguir comprando
        </button>
      </div>

      {/* Order summary */}
      <div className="space-y-4">
        <div
          className="p-5 rounded-2xl bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.07)" }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
            Resumen del pedido
          </h3>
          <div className="space-y-2.5">
            {cartItems.map((item) => (
              <div key={`s-${item.id}-${item.size}`} className="flex justify-between">
                <span style={{ fontSize: 12.5, color: "#6B7280" }}>
                  {item.name} ({item.size}) × {item.quantity}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>
                  Bs. {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 space-y-2" style={{ borderTop: "1px solid #F3F4F6" }}>
            <div className="flex justify-between">
              <span style={{ fontSize: 13, color: "#6B7280" }}>Subtotal</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {total}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: 13, color: "#6B7280" }}>IVA (13%)</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {iva}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: 13, color: "#6B7280" }}>Envío</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: shipping === 0 ? "#059669" : "#111827" }}>
                {shipping === 0 ? "Gratis" : `Bs. ${shipping}`}
              </span>
            </div>
          </div>
          <div
            className="flex justify-between items-center mt-3 pt-3"
            style={{ borderTop: "2px solid #F3F4F6" }}
          >
            <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#2563EB" }}>
              Bs. {total + shipping}
            </span>
          </div>

          <button
            onClick={onNext}
            className="w-full mt-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Continuar
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Trust badges */}
        <div className="p-4 rounded-2xl" style={{ background: "#FAFAFA", border: "1px solid #F3F4F6" }}>
          <div className="space-y-2">
            {[
              { icon: Shield, text: "Pago 100% seguro y encriptado" },
              { icon: Truck, text: "Entrega en 2-3 días hábiles" },
              { icon: RefreshCw, text: "Devolución gratuita en 30 días" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2">
                <t.icon size={13} style={{ color: "#7C3AED", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#6B7280" }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STEP 2: BILLING DATA ──────────────────────────────────────────────────────
function DataStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: BillingData;
  onChange: (d: Partial<BillingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof BillingData, string>>>({});

  function validate() {
    const e: Partial<Record<keyof BillingData, string>> = {};
    if (!data.nombre.trim()) e.nombre = "Requerido";
    if (!data.apellido.trim()) e.apellido = "Requerido";
    if (!data.documento.trim()) e.documento = "Requerido";
    if (!data.telefono.trim()) e.telefono = "Requerido";
    if (!data.email.trim() || !data.email.includes("@")) e.email = "Email inválido";
    if (!data.ciudad.trim()) e.ciudad = "Requerido";
    if (!data.direccion.trim()) e.direccion = "Requerido";
    if (data.tipoFactura === "empresa" && !data.razonSocial.trim()) e.razonSocial = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  function inp(field: keyof BillingData) {
    return {
      value: data[field] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        onChange({ [field]: e.target.value }),
      style: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        border: `1.5px solid ${errors[field] ? "#EF4444" : "#E5E7EB"}`,
        background: "white",
        fontSize: 13.5,
        outline: "none",
        color: "#374151",
        transition: "border-color 0.2s",
      } as React.CSSProperties,
      onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        (e.target as HTMLElement).style.borderColor = "#7C3AED";
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        (e.target as HTMLElement).style.borderColor = errors[field] ? "#EF4444" : "#E5E7EB";
      },
    };
  }

  function Field({ label, field, type = "text", placeholder = "" }: { label: string; field: keyof BillingData; type?: string; placeholder?: string }) {
    return (
      <div>
        <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
          {label}
        </label>
        <input type={type} placeholder={placeholder} {...inp(field)} />
        {errors[field] && (
          <p style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors[field]}</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Tipo de factura */}
        <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
            Tipo de Facturación
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "personal", label: "Persona Natural", sub: "Con CI", icon: User },
              { value: "empresa", label: "Empresa", sub: "Con NIT", icon: Building2 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ tipoFactura: opt.value as "personal" | "empresa", tipoDoc: opt.value === "personal" ? "CI" : "NIT" })}
                className="flex items-center gap-3 p-3.5 rounded-xl transition-all text-left"
                style={{
                  border: `2px solid ${data.tipoFactura === opt.value ? "#7C3AED" : "#E5E7EB"}`,
                  background: data.tipoFactura === opt.value ? "#F5F3FF" : "white",
                  cursor: "pointer",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: data.tipoFactura === opt.value ? "#7C3AED" : "#F3F4F6" }}
                >
                  <opt.icon size={16} color={data.tipoFactura === opt.value ? "white" : "#9CA3AF"} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{opt.label}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>{opt.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Personal info */}
        <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
            Datos Personales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre *" field="nombre" placeholder="Ej: María" />
            <Field label="Apellido *" field="apellido" placeholder="Ej: Quispe" />
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                {data.tipoDoc} *
              </label>
              <input
                type="text"
                placeholder={data.tipoDoc === "CI" ? "Ej: 12345678" : "Ej: 123456789"}
                {...inp("documento")}
              />
              {errors.documento && <p style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors.documento}</p>}
            </div>
            {data.tipoFactura === "empresa" && (
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                  Razón Social *
                </label>
                <input type="text" placeholder="Nombre de la empresa" {...inp("razonSocial")} />
                {errors.razonSocial && <p style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors.razonSocial}</p>}
              </div>
            )}
            <Field label="Teléfono / WhatsApp *" field="telefono" type="tel" placeholder="+591 7XXXXXXX" />
            <Field label="Email *" field="email" type="email" placeholder="correo@ejemplo.com" />
          </div>
        </div>

        {/* Delivery address */}
        <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
            Dirección de Entrega
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Departamento *
              </label>
              <select {...inp("departamento")}>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <Field label="Ciudad / Municipio *" field="ciudad" placeholder="Ej: La Paz" />
            <div className="sm:col-span-2">
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Dirección completa *
              </label>
              <input type="text" placeholder="Ej: Av. 6 de Agosto #1234, Sopocachi" {...inp("direccion")} />
              {errors.direccion && <p style={{ fontSize: 11, color: "#EF4444", marginTop: 3 }}>{errors.direccion}</p>}
            </div>
            <div className="sm:col-span-2">
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Referencia
              </label>
              <input type="text" placeholder="Ej: Frente al parque, edificio color azul" {...inp("referencia")} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary sidebar */}
      <OrderSummarySidebar onBack={onBack} onNext={handleNext} nextLabel="Ir al Pago" />
    </div>
  );
}

// ── STEP 3: PAYMENT ───────────────────────────────────────────────────────────
function PaymentStep({
  method,
  onMethod,
  onNext,
  onBack,
}: {
  method: PaymentMethod;
  onMethod: (m: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyAccount() {
    navigator.clipboard.writeText("1234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Elige tu método de pago
        </h3>

        {/* Payment options */}
        {[
          {
            id: "qr" as PaymentMethod,
            label: "Código QR Bolivia",
            sub: "Pago instantáneo con tu app bancaria",
            icon: QrCode,
            color: "#7C3AED",
            bg: "#F5F3FF",
            badge: "Recomendado",
            badgeColor: "#7C3AED",
          },
          {
            id: "transfer" as PaymentMethod,
            label: "Transferencia Bancaria",
            sub: "BCP, BISA, BNB, Banco Fassil y más",
            icon: Building2,
            color: "#2563EB",
            bg: "#EFF6FF",
          },
          {
            id: "card" as PaymentMethod,
            label: "Tarjeta de Crédito / Débito",
            sub: "Visa, Mastercard, American Express",
            icon: CreditCard,
            color: "#059669",
            bg: "#ECFDF5",
          },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onMethod(opt.id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
            style={{
              border: `2px solid ${method === opt.id ? opt.color : "#E5E7EB"}`,
              background: method === opt.id ? opt.bg : "white",
              cursor: "pointer",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: method === opt.id ? opt.color : "#F3F4F6" }}
            >
              <opt.icon size={20} color={method === opt.id ? "white" : "#9CA3AF"} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{opt.label}</p>
                {opt.badge && (
                  <span
                    className="px-2 py-0.5 rounded-md"
                    style={{ fontSize: 10, fontWeight: 700, background: opt.badgeColor + "20", color: opt.badgeColor }}
                  >
                    {opt.badge}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: "#6B7280" }}>{opt.sub}</p>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: method === opt.id ? opt.color : "#D1D5DB" }}
            >
              {method === opt.id && (
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: opt.color }} />
              )}
            </div>
          </button>
        ))}

        {/* Payment details */}
        <div className="p-5 rounded-2xl" style={{ background: "#FAFAFA", border: "1px solid #F3F4F6" }}>
          {method === "qr" && (
            <div className="flex flex-col items-center gap-4">
              <p style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
                Escanea con tu app bancaria
              </p>
              {/* Mock QR */}
              <div
                className="rounded-2xl p-4 flex items-center justify-center"
                style={{ background: "white", border: "2px solid #7C3AED", width: 160, height: 160 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 16,
                        height: 16,
                        background: Math.random() > 0.5 ? "#111827" : "white",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}
              >
                <AlertCircle size={13} style={{ color: "#7C3AED" }} />
                <span style={{ fontSize: 12, color: "#7C3AED" }}>El QR es válido por 15 minutos</span>
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
                Compatible con: Tigo Money, BCP Móvil, BISA Móvil, BNB App y más
              </p>
            </div>
          )}

          {method === "transfer" && (
            <div className="space-y-3">
              <p style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
                Datos para transferencia
              </p>
              {[
                { label: "Banco", value: "Banco de Crédito BCP" },
                { label: "Titular", value: "AKINOMASS S.R.L." },
                { label: "Cuenta Corriente", value: "1234567890", copy: true },
                { label: "NIT", value: "987654321" },
                { label: "Concepto", value: "Pedido AKNO-" + Math.floor(Math.random() * 9000 + 1000) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "white", border: "1px solid #E5E7EB" }}
                >
                  <div>
                    <p style={{ fontSize: 11, color: "#9CA3AF" }}>{row.label}</p>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{row.value}</p>
                  </div>
                  {row.copy && (
                    <button
                      onClick={copyAccount}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all"
                      style={{ background: copied ? "#ECFDF5" : "#EFF6FF", color: copied ? "#059669" : "#2563EB", fontSize: 12, fontWeight: 500 }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copiado" : "Copiar"}
                    </button>
                  )}
                </div>
              ))}
              <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: "#FFFBEB", border: "1px solid #FCD34D" }}
              >
                <AlertCircle size={13} style={{ color: "#D97706", marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
                  Envía el comprobante de pago por WhatsApp al +591 78901234 o a ventas@akinomass.bo para confirmar tu pedido.
                </p>
              </div>
            </div>
          )}

          {method === "card" && (
            <div className="space-y-4">
              <p style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Datos de tu tarjeta</p>
              <div className="space-y-3">
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                    Número de tarjeta
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13.5, outline: "none" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13.5, outline: "none" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13.5, outline: "none" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                    Nombre en la tarjeta
                  </label>
                  <input
                    type="text"
                    placeholder="Como aparece en tu tarjeta"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13.5, outline: "none" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={13} style={{ color: "#059669" }} />
                <span style={{ fontSize: 11.5, color: "#6B7280" }}>
                  Conexión SSL encriptada. Tus datos están protegidos.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <OrderSummarySidebar onBack={onBack} onNext={onNext} nextLabel="Confirmar Pedido" confirmStyle />
    </div>
  );
}

// ── ORDER SUMMARY SIDEBAR (shared) ────────────────────────────────────────────
function OrderSummarySidebar({
  onBack,
  onNext,
  nextLabel,
  confirmStyle,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  confirmStyle?: boolean;
}) {
  const { cartItems, total } = useCart();
  const shipping = total >= 300 ? 0 : 25;
  const iva = Math.round(total * 0.13);

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
          Tu pedido
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div key={`sum-${item.id}-${item.size}`} className="flex items-center gap-2.5">
              <img src={item.image} alt={item.name} className="w-10 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151" }} className="truncate">{item.name}</p>
                <p style={{ fontSize: 11, color: "#9CA3AF" }}>T: {item.size} · ×{item.quantity}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>Bs. {item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 space-y-1.5" style={{ borderTop: "1px solid #F3F4F6" }}>
          <div className="flex justify-between">
            <span style={{ fontSize: 12.5, color: "#6B7280" }}>Subtotal</span>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Bs. {total}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ fontSize: 12.5, color: "#6B7280" }}>IVA 13%</span>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Bs. {iva}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ fontSize: 12.5, color: "#6B7280" }}>Envío</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: shipping === 0 ? "#059669" : "#111827" }}>
              {shipping === 0 ? "Gratis" : `Bs. ${shipping}`}
            </span>
          </div>
          <div className="flex justify-between pt-2 mt-1" style={{ borderTop: "1px solid #F3F4F6" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#2563EB" }}>Bs. {total + shipping}</span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full mt-4 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{
            background: confirmStyle
              ? "linear-gradient(135deg, #059669, #10B981)"
              : "linear-gradient(135deg, #7C3AED, #2563EB)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          {confirmStyle && <Shield size={15} />}
          {nextLabel}
          {!confirmStyle && <ChevronRight size={16} />}
        </button>
        <button
          onClick={onBack}
          className="w-full mt-2 py-2.5 rounded-xl flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
          style={{ fontSize: 13, color: "#6B7280", border: "1px solid #E5E7EB", background: "white", cursor: "pointer" }}
        >
          <ChevronLeft size={13} />
          Volver
        </button>
      </div>
    </div>
  );
}

// ── STEP 4: CONFIRMATION ──────────────────────────────────────────────────────
function ConfirmationStep({ billing, paymentMethod }: { billing: BillingData; paymentMethod: PaymentMethod }) {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = total >= 300 ? 0 : 25;
  const iva = Math.round(total * 0.13);
  const orderNum = `AKNO-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleDateString("es-BO", { year: "numeric", month: "long", day: "numeric" });

  const paymentLabels: Record<PaymentMethod, string> = {
    qr: "Código QR Bolivia",
    transfer: "Transferencia Bancaria",
    card: "Tarjeta de Crédito/Débito",
  };

  function handleFinish() {
    clearCart();
    navigate("/store");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success banner */}
      <div
        className="flex flex-col items-center text-center p-8 rounded-3xl"
        style={{ background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)", border: "2px solid #DDD6FE" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", boxShadow: "0 0 0 8px rgba(124,58,237,0.12)" }}
        >
          <CheckCircle size={36} color="white" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#111827", marginBottom: 8 }}>
          ¡Pedido Confirmado!
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, maxWidth: 380 }}>
          Tu pedido ha sido recibido correctamente. Te enviaremos una confirmación a tu correo electrónico.
        </p>
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl mt-4"
          style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
        >
          <Package size={14} color="white" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Pedido {orderNum}</span>
        </div>
      </div>

      {/* Invoice */}
      <div className="bg-white rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.09)" }}>
        {/* Invoice header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} color="white" />
              <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>AKINOMASS</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Moda Boliviana · ventas@akinomass.bo</p>
          </div>
          <div className="text-right">
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>FACTURA</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{orderNum}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{date}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                Facturado a
              </p>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>
                {billing.nombre} {billing.apellido}
              </p>
              {billing.razonSocial && (
                <p style={{ fontSize: 12.5, color: "#374151" }}>{billing.razonSocial}</p>
              )}
              <p style={{ fontSize: 12.5, color: "#6B7280" }}>{billing.tipoDoc}: {billing.documento || "—"}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280" }}>{billing.email || "—"}</p>
              <p style={{ fontSize: 12.5, color: "#6B7280" }}>{billing.telefono || "—"}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                Entrega en
              </p>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>
                {billing.departamento}{billing.ciudad ? `, ${billing.ciudad}` : ""}
              </p>
              <p style={{ fontSize: 12.5, color: "#6B7280" }}>{billing.direccion || "—"}</p>
              {billing.referencia && (
                <p style={{ fontSize: 12.5, color: "#6B7280" }}>{billing.referencia}</p>
              )}
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md mt-1"
                style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
              >
                <Truck size={10} style={{ color: "#059669" }} />
                <span style={{ fontSize: 11, color: "#059669", fontWeight: 500 }}>
                  Estimado: 2-3 días hábiles
                </span>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div>
            <div
              className="grid px-3 py-2 rounded-xl mb-2"
              style={{ gridTemplateColumns: "1fr auto auto", background: "#F8F9FF", gap: 8 }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Producto</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Cant.</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Total</span>
            </div>
            {cartItems.map((item) => (
              <div
                key={`inv-${item.id}-${item.size}`}
                className="grid px-3 py-2.5"
                style={{ gridTemplateColumns: "1fr auto auto", gap: 8, borderBottom: "1px solid #F3F4F6" }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>Talla: {item.size} · Bs. {item.price} c/u</p>
                </div>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, textAlign: "center" }}>{item.quantity}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", textAlign: "right" }}>
                  Bs. {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ fontSize: 13, color: "#6B7280" }}>Subtotal</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {total}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: 13, color: "#6B7280" }}>IVA (13%)</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {iva}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: 13, color: "#6B7280" }}>Envío</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: shipping === 0 ? "#059669" : "#111827" }}>
                {shipping === 0 ? "Gratis" : `Bs. ${shipping}`}
              </span>
            </div>
            <div
              className="flex justify-between items-center pt-3 mt-1"
              style={{ borderTop: "2px solid #F3F4F6" }}
            >
              <span style={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>TOTAL PAGADO</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Bs. {total + shipping}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: 12.5, color: "#9CA3AF" }}>Método de pago</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{paymentLabels[paymentMethod]}</span>
            </div>
          </div>

          {/* Delivery timeline */}
          <div
            className="p-4 rounded-2xl"
            style={{ background: "#F8F9FF", border: "1px solid #E0E7FF" }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>
              Estado de tu pedido
            </p>
            <div className="flex items-center gap-0 overflow-x-auto">
              {[
                { label: "Pedido recibido", sub: "Ahora", done: true },
                { label: "Procesando", sub: "1-2 hs", done: false },
                { label: "En camino", sub: "1-2 días", done: false },
                { label: "Entregado", sub: "2-3 días", done: false },
              ].map((st, i) => (
                <div key={st.label} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: st.done ? "linear-gradient(135deg, #059669, #10B981)" : "#E5E7EB" }}
                    >
                      {st.done ? (
                        <Check size={13} color="white" strokeWidth={3} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <p style={{ fontSize: 10.5, fontWeight: st.done ? 700 : 400, color: st.done ? "#059669" : "#9CA3AF", whiteSpace: "nowrap" }}>
                      {st.label}
                    </p>
                    <p style={{ fontSize: 9.5, color: "#C4C4CC", whiteSpace: "nowrap" }}>{st.sub}</p>
                  </div>
                  {i < 3 && (
                    <div
                      className="flex-1 h-0.5 mx-1 mb-7"
                      style={{ background: "#E5E7EB", minWidth: 12 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleFinish}
          className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #2563EB)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          <Home size={15} />
          Seguir comprando
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          style={{ fontSize: 14, fontWeight: 600, color: "#374151", border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer" }}
        >
          <FileText size={15} />
          Descargar factura
        </button>
      </div>

      {/* Rating prompt */}
      <div
        className="flex items-center justify-between p-4 rounded-2xl"
        style={{ background: "#FFFBEB", border: "1px solid #FCD34D" }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>¿Cómo fue tu experiencia?</p>
          <p style={{ fontSize: 12, color: "#B45309" }}>Tu opinión nos ayuda a mejorar</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={22} style={{ color: "#F59E0B", cursor: "pointer", fill: "#F59E0B" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN CHECKOUT PAGE ────────────────────────────────────────────────────────
export function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState<BillingData>(INITIAL_BILLING);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qr");
  const navigate = useNavigate();

  function updateBilling(d: Partial<BillingData>) {
    setBilling((prev) => ({ ...prev, ...d }));
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: "#FAFBFF" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-30 px-4 md:px-8"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate("/store"))}
          className="flex items-center gap-1.5 hover:text-purple-600 transition-colors"
          style={{ fontSize: 13.5, color: "#6B7280", fontWeight: 500 }}
        >
          <ChevronLeft size={16} />
          {step > 1 ? "Paso anterior" : "Volver a la tienda"}
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
          >
            <Sparkles size={13} color="white" />
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AKINOMASS
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Shield size={13} style={{ color: "#059669" }} />
          <span style={{ fontSize: 12, color: "#6B7280" }}>Pago seguro</span>
        </div>
      </nav>

      {/* Progress stepper */}
      <div className="bg-white" style={{ borderBottom: "1px solid #F3F4F6" }}>
        <ProgressStepper current={step} />
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {step === 1 && <CartStep onNext={() => setStep(2)} />}
        {step === 2 && (
          <DataStep
            data={billing}
            onChange={updateBilling}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <PaymentStep
            method={paymentMethod}
            onMethod={setPaymentMethod}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <ConfirmationStep billing={billing} paymentMethod={paymentMethod} />
        )}
      </main>
    </div>
  );
}
