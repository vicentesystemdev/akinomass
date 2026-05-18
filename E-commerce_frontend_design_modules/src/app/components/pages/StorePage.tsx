import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShoppingCart, Search, Heart, Star, X, Plus, Minus,
  Truck, Shield, RefreshCw, Sparkles, ChevronRight, Instagram,
  Menu, ArrowRight
} from "lucide-react";
import { useCart } from "../store/CartContext";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: string[];
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
}

const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vestido Rojo Elegante",
    category: "Vestidos",
    price: 280,
    originalPrice: 350,
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80",
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviews: 124,
    badge: "OFERTA",
    badgeColor: "#EF4444",
  },
  {
    id: 2,
    name: "Vestido Lila Romántico",
    category: "Vestidos",
    price: 320,
    image: "https://images.unsplash.com/photo-1626818590159-04cb9274a5e0?w=400&q=80",
    sizes: ["XS", "S", "M", "L"],
    rating: 4.9,
    reviews: 98,
    badge: "TOP VENTAS",
    badgeColor: "#7C3AED",
  },
  {
    id: 3,
    name: "Vestido Negro Noche",
    category: "Vestidos",
    price: 250,
    image: "https://images.unsplash.com/photo-1562894369-193bedce28e3?w=400&q=80",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 87,
  },
  {
    id: 4,
    name: "Vestido Floral Primavera",
    category: "Vestidos",
    price: 295,
    image: "https://images.unsplash.com/photo-1614098097306-c67b8020c04e?w=400&q=80",
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviews: 61,
    badge: "NUEVO",
    badgeColor: "#059669",
  },
  {
    id: 5,
    name: "Vestido de Pasarela",
    category: "Vestidos",
    price: 420,
    image: "https://images.unsplash.com/photo-1554882195-8cf792f9a571?w=400&q=80",
    sizes: ["XS", "S", "M"],
    rating: 5.0,
    reviews: 42,
    badge: "EXCLUSIVO",
    badgeColor: "#F59E0B",
  },
  {
    id: 6,
    name: "Blusa Cuadros Azul",
    category: "Blusas",
    price: 120,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 73,
  },
  {
    id: 7,
    name: "Camisa Escocesa",
    category: "Blusas",
    price: 140,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1625517527468-a6f1e2b124be?w=400&q=80",
    sizes: ["XS", "S", "M", "L"],
    rating: 4.4,
    reviews: 55,
    badge: "OFERTA",
    badgeColor: "#EF4444",
  },
  {
    id: 8,
    name: "Conjunto Morado",
    category: "Conjuntos",
    price: 380,
    image: "https://images.unsplash.com/photo-1760287363699-a08d553fb8a9?w=400&q=80",
    sizes: ["S", "M", "L"],
    rating: 4.8,
    reviews: 36,
    badge: "NUEVO",
    badgeColor: "#059669",
  },
  {
    id: 9,
    name: "Vestido Azul Formal",
    category: "Vestidos",
    price: 310,
    image: "https://images.unsplash.com/photo-1760287363750-1c888c75578f?w=400&q=80",
    sizes: ["XS", "S", "M"],
    rating: 4.7,
    reviews: 29,
  },
  {
    id: 10,
    name: "Vestido Lentejuelas",
    category: "Vestidos",
    price: 450,
    image: "https://images.unsplash.com/photo-1551113006-731674fbb3ff?w=400&q=80",
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviews: 18,
    badge: "PREMIUM",
    badgeColor: "#4F46E5",
  },
  {
    id: 11,
    name: "Colección Colorida",
    category: "Conjuntos",
    price: 290,
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80",
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviews: 44,
  },
  {
    id: 12,
    name: "Blusa Casual Ligera",
    category: "Blusas",
    price: 95,
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&q=80",
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.3,
    reviews: 91,
  },
];

const CATEGORIES = ["Todos", "Vestidos", "Blusas", "Conjuntos"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          style={{
            fill: s <= Math.round(rating) ? "#F59E0B" : "none",
            color: s <= Math.round(rating) ? "#F59E0B" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product, size: string) => void }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden group"
      style={{ border: "1px solid rgba(0,0,0,0.07)", transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(37,99,235,0.13)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#F8F8FA" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ transition: "transform 0.4s ease" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.06)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
        />

        {/* Badge */}
        {product.badge && (
          <div
            className="absolute top-3 left-3 px-2 py-0.5 rounded-lg"
            style={{ background: product.badgeColor, fontSize: 10, fontWeight: 700, color: "white", letterSpacing: "0.5px" }}
          >
            {product.badge}
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <div
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#EF4444", fontSize: 10, fontWeight: 800, color: "white" }}
          >
            -{discount}%
          </div>
        )}

        {/* Heart */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: liked ? "#FFF1F2" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(4px)",
            border: liked ? "1px solid #FECDD3" : "1px solid rgba(0,0,0,0.08)",
            transition: "all 0.2s",
          }}
        >
          <Heart
            size={14}
            style={{ fill: liked ? "#EF4444" : "none", color: liked ? "#EF4444" : "#9CA3AF" }}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p style={{ fontSize: 11, color: "#7C3AED", fontWeight: 600, marginBottom: 2 }}>{product.category}</p>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", lineHeight: 1.3, marginBottom: 6 }}>
          {product.name}
        </p>

        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>({product.reviews})</span>
        </div>

        {/* Sizes */}
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className="px-2 py-0.5 rounded-md transition-all"
              style={{
                fontSize: 11,
                fontWeight: 600,
                border: "1.5px solid",
                borderColor: selectedSize === size ? "#2563EB" : "#E5E7EB",
                color: selectedSize === size ? "#2563EB" : "#6B7280",
                background: selectedSize === size ? "#EFF6FF" : "white",
              }}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>Bs. {product.price}</span>
            {product.originalPrice && (
              <span className="ml-1.5 line-through" style={{ fontSize: 12, color: "#9CA3AF" }}>
                Bs. {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className="w-full mt-3 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
          style={{
            background: added
              ? "linear-gradient(135deg, #059669, #10B981)"
              : "linear-gradient(135deg, #7C3AED, #2563EB)",
            color: "white",
            fontSize: 12.5,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          {added ? (
            <>✓ Añadido al carrito</>
          ) : (
            <>
              <ShoppingCart size={13} />
              Añadir al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const { cartItems, removeFromCart, updateQuantity, itemCount, total } = useCart();
  const shipping = total > 0 ? (total >= 300 ? 0 : 25) : 0;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "white",
          zIndex: 50,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #F3F4F6" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
            >
              <ShoppingCart size={15} color="white" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Mi Carrito</p>
              <p style={{ fontSize: 11.5, color: "#9CA3AF" }}>{itemCount} {itemCount === 1 ? "producto" : "productos"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={16} color="#6B7280" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "#F5F3FF" }}
              >
                <ShoppingCart size={32} style={{ color: "#7C3AED" }} />
              </div>
              <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
                Tu carrito está vacío.<br />
                <span style={{ color: "#2563EB", fontWeight: 500 }}>¡Explora nuestra colección!</span>
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-3 p-3 rounded-xl"
                style={{ background: "#FAFAFA", border: "1px solid #F3F4F6" }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-lg object-cover flex-shrink-0"
                  style={{ width: 64, height: 80 }}
                />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>{item.name}</p>
                  <p style={{ fontSize: 11.5, color: "#7C3AED", marginTop: 2 }}>Talla: {item.size}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>
                      Bs. {item.price * item.quantity}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                        style={{ background: "#F3F4F6" }}
                      >
                        <Minus size={11} />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                        style={{ background: "#F3F4F6" }}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="self-start hover:text-red-500 transition-colors"
                  style={{ color: "#D1D5DB" }}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-5 py-4" style={{ borderTop: "1px solid #F3F4F6" }}>
            {/* Shipping notice */}
            {shipping === 0 ? (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
                style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
              >
                <Truck size={13} style={{ color: "#059669" }} />
                <span style={{ fontSize: 12, color: "#059669", fontWeight: 500 }}>
                  ¡Envío gratis incluido!
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
                style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
              >
                <Truck size={13} style={{ color: "#2563EB" }} />
                <span style={{ fontSize: 12, color: "#2563EB" }}>
                  Te faltan Bs. {300 - total} para envío gratis
                </span>
              </div>
            )}

            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: "#6B7280" }}>Subtotal</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {total}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: "#6B7280" }}>Envío</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: shipping === 0 ? "#059669" : "#111827" }}>
                  {shipping === 0 ? "Gratis" : `Bs. ${shipping}`}
                </span>
              </div>
              <div
                className="flex justify-between pt-2 mt-1"
                style={{ borderTop: "1px solid #F3F4F6" }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Total</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#2563EB" }}>
                  Bs. {total + shipping}
                </span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Proceder al Pago
              <ChevronRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Shield size={11} style={{ color: "#9CA3AF" }} />
                <span style={{ fontSize: 10.5, color: "#9CA3AF" }}>Pago seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw size={11} style={{ color: "#9CA3AF" }} />
                <span style={{ fontSize: 10.5, color: "#9CA3AF" }}>Devolución 30 días</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function StorePage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevancia");
  const { addToCart, itemCount } = useCart();
  const navigate = useNavigate();

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "precio-asc") return a.price - b.price;
    if (sortBy === "precio-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  function handleAddToCart(product: Product, size: string) {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, size, category: product.category });
    setCartOpen(true);
  }

  function handleCheckout() {
    setCartOpen(false);
    navigate("/checkout");
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: "#FAFBFF" }}>
      {/* ── NAVBAR ── */}
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
          gap: 16,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
          >
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg, #7C3AED, #2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AKINOMASS
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Buscar prendas, estilos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl"
            style={{
              background: "#F3F4F6",
              border: "1.5px solid transparent",
              outline: "none",
              fontSize: 13.5,
              color: "#374151",
            }}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "#7C3AED")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "transparent")}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all hover:bg-gray-50"
            style={{ fontSize: 13, fontWeight: 500, color: "#374151", border: "1px solid #E5E7EB" }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            <ShoppingCart size={15} />
            <span className="hidden md:inline">Carrito</span>
            {itemCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#EF4444", fontSize: 10, fontWeight: 800, color: "white", border: "2px solid white" }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80"
          alt="AKINOMASS Store"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.88) 0%, rgba(37,99,235,0.82) 50%, rgba(0,0,0,0.5) 100%)" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 py-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}
          >
            <Sparkles size={13} color="white" />
            <span style={{ fontSize: 12.5, color: "white", fontWeight: 600 }}>Colección Primavera 2026</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 16, maxWidth: 600 }}>
            Moda Boliviana<br />con Estilo Propio
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", maxWidth: 460, lineHeight: 1.6, marginBottom: 28 }}>
            Descubre nuestra colección exclusiva de prendas diseñadas para la mujer boliviana moderna. Elegancia, calidad y estilo en cada pieza.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-90"
              style={{ background: "white", color: "#7C3AED", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              Ver Colección
              <ArrowRight size={15} />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p style={{ fontSize: 20, fontWeight: 800, color: "white" }}>+500</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Productos</p>
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)" }} />
              <div className="text-center">
                <p style={{ fontSize: 20, fontWeight: 800, color: "white" }}>4.9★</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Valoración</p>
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)" }} />
              <div className="text-center">
                <p style={{ fontSize: 20, fontWeight: 800, color: "white" }}>+2k</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Clientes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ── */}
      <div
        className="px-4 md:px-8 py-4"
        style={{ background: "white", borderBottom: "1px solid #F3F4F6" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: "Envío gratis", sub: "En pedidos +Bs. 300", color: "#2563EB", bg: "#EFF6FF" },
            { icon: Shield, label: "Pago seguro", sub: "100% protegido", color: "#7C3AED", bg: "#F5F3FF" },
            { icon: RefreshCw, label: "Devoluciones", sub: "30 días sin costo", color: "#059669", bg: "#ECFDF5" },
            { icon: Sparkles, label: "Calidad premium", sub: "Prendas originales", color: "#F59E0B", bg: "#FFFBEB" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: b.bg }}>
                <b.icon size={16} style={{ color: b.color }} />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{b.label}</p>
                <p style={{ fontSize: 11, color: "#9CA3AF" }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS SECTION ── */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Nuestra Colección</h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
              {filtered.length} productos encontrados
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category chips */}
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-xl transition-all"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: activeCategory === cat
                    ? "linear-gradient(135deg, #7C3AED, #2563EB)"
                    : "white",
                  color: activeCategory === cat ? "white" : "#6B7280",
                  border: activeCategory === cat ? "none" : "1px solid #E5E7EB",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl"
              style={{
                fontSize: 12.5,
                color: "#374151",
                background: "white",
                border: "1px solid #E5E7EB",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden relative mb-5">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Buscar prendas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl"
            style={{ background: "#F3F4F6", border: "none", outline: "none", fontSize: 13.5 }}
          />
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search size={40} style={{ color: "#D1D5DB" }} />
            <p style={{ fontSize: 15, color: "#9CA3AF" }}>No encontramos productos con ese criterio</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("Todos"); }}
              style={{ fontSize: 13, color: "#2563EB", fontWeight: 500 }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="mt-8 px-4 md:px-8 py-8"
        style={{ background: "#111827", color: "white" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
            >
              <Sparkles size={13} color="white" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800 }}>AKINOMASS</span>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>
            © 2026 AKINOMASS · Moda Boliviana · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-3">
            <a href="#" style={{ fontSize: 12, color: "#9CA3AF" }}>WhatsApp</a>
            <a href="#" style={{ fontSize: 12, color: "#9CA3AF" }}>Instagram</a>
            <a href="#" style={{ fontSize: 12, color: "#9CA3AF" }}>TikTok</a>
          </div>
        </div>
      </footer>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
    </div>
  );
}
