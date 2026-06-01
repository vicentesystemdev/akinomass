import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart, MapPin, Phone, Mail, Clock, CreditCard, Truck, Shield, RefreshCw, ChevronRight, Send } from 'lucide-react';

const WhatsAppIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const InstagramIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
);

const TikTokIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
);

const FacebookIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const socialLinks = [
    { icon: WhatsAppIcon, href: 'https://wa.me/59178901234', label: 'WhatsApp', color: '#25D366' },
    { icon: InstagramIcon, href: '#', label: 'Instagram', color: '#E4405F' },
    { icon: TikTokIcon, href: '#', label: 'TikTok', color: '#ffffff' },
    { icon: FacebookIcon, href: '#', label: 'Facebook', color: '#1877F2' },
];

const footerLinks = {
    tienda: {
        title: 'Tienda',
        links: [
            { label: 'Catálogo', href: '/tienda/catalogo' },
            { label: 'Novedades', href: '/tienda/catalogo?orden=recientes' },
            { label: 'Más vendidos', href: '/tienda/catalogo?orden=precio_desc' },
            { label: 'Ofertas', href: '/tienda/catalogo?solo_disponibles=1' },
        ],
    },
    ayuda: {
        title: 'Ayuda',
        links: [
            { label: 'Envíos y entregas', href: '#' },
            { label: 'Devoluciones', href: '#' },
            { label: 'Preguntas frecuentes', href: '#' },
            { label: 'Términos y condiciones', href: '#' },
            { label: 'Política de privacidad', href: '#' },
        ],
    },
    cuenta: {
        title: 'Mi Cuenta',
        links: [
            { label: 'Iniciar sesión', href: '/tienda/login' },
            { label: 'Registrarse', href: '/tienda/registro' },
            { label: 'Mis pedidos', href: '/tienda/mis-pedidos' },
            { label: 'Mis direcciones', href: '/tienda/mis-direcciones' },
        ],
    },
};

export default function StorefrontFooter() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer style={{ background: '#1a1f19', color: 'white', fontFamily: 'Figtree, sans-serif' }}>
            <div
                style={{
                    background: 'linear-gradient(135deg, #3C473A 0%, #2b3229 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>
                                Suscríbete y obtén 10% OFF
                            </h3>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                                Recibe novedades, ofertas exclusivas y lanzamientos antes que nadie.
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
                            <div className="relative flex-1 md:w-72">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl"
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        outline: 'none',
                                        fontSize: 13,
                                        color: 'white',
                                    }}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all hover:opacity-90 flex-shrink-0"
                                style={{
                                    background: 'linear-gradient(135deg, #D77A61, #c56950)',
                                    color: 'white',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {subscribed ? (
                                    <>
                                        <Send size={14} />
                                        ¡Listo!
                                    </>
                                ) : (
                                    <>
                                        Suscribirse
                                        <ChevronRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)' }}
                            >
                                <ShoppingCart size={18} color="white" />
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>AKINOMASS</span>
                        </div>
                        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 20, maxWidth: 320 }}>
                            Moda y equipamiento boliviano con estilo propio. Prendas exclusivas diseñadas para quienes valoran la calidad y el diseño auténtico.
                        </p>

                        <div className="flex items-center gap-3 mb-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.6)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = social.color;
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderColor = social.color;
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <social.icon size={17} />
                                </a>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <MapPin size={14} style={{ color: '#D77A61' }} />
                                </div>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>La Paz, Bolivia</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <Phone size={14} style={{ color: '#D77A61' }} />
                                </div>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>+591 78901234</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <Mail size={14} style={{ color: '#D77A61' }} />
                                </div>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>ventas@akinomass.bo</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <Clock size={14} style={{ color: '#D77A61' }} />
                                </div>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Lun - Sáb: 9:00 - 19:00</span>
                            </div>
                        </div>
                    </div>

                    {Object.values(footerLinks).map((section) => (
                        <div key={section.title}>
                            <h4
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    marginBottom: 16,
                                    color: 'rgba(255,255,255,0.9)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {section.title}
                            </h4>
                            <div className="space-y-3">
                                {section.links.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="flex items-center gap-1.5 transition-colors"
                                        style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#D77A61';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Truck, label: 'Envío a todo Bolivia' },
                                { icon: Shield, label: 'Pago seguro' },
                                { icon: RefreshCw, label: 'Devoluciones fáciles' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-1.5">
                                    <item.icon size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
                                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <CreditCard size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                            <div className="flex items-center gap-2">
                                {['QR', 'Transferencia', 'Depósito', 'Efectivo'].map((method) => (
                                    <span
                                        key={method}
                                        className="px-2 py-1 rounded-md"
                                        style={{
                                            fontSize: 10.5,
                                            fontWeight: 600,
                                            color: 'rgba(255,255,255,0.4)',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                        }}
                                    >
                                        {method}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.25)' }}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                            © 2026 AKINOMASS. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-4">
                            {['Términos', 'Privacidad', 'Cookies'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="transition-colors"
                                    style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
                                    }}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
