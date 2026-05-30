import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export default function StorefrontFooter() {
    return (
        <footer style={{ background: '#1a1f19', color: 'white' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)' }}
                            >
                                <ShoppingCart size={14} color="white" />
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 800 }}>AKINOMASS</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                            Moda boliviana con estilo propio. Prendas exclusivas diseñadas para la mujer moderna.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'rgba(255,255,255,0.9)' }}>Tienda</h4>
                        <div className="space-y-2">
                            <Link href="/tienda/catalogo" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'block' }}>
                                Catálogo
                            </Link>
                            <Link href="/tienda/carrito" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'block' }}>
                                Mi Carrito
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'rgba(255,255,255,0.9)' }}>Contacto</h4>
                        <div className="space-y-2">
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>ventas@akinomass.bo</p>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>+591 78901234</p>
                            <div className="flex items-center gap-3 mt-3">
                                <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>WhatsApp</a>
                                <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Instagram</a>
                                <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>TikTok</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                        © 2026 AKINOMASS · Moda Boliviana · Todos los derechos reservados
                    </p>
                </div>
            </div>
        </footer>
    );
}
