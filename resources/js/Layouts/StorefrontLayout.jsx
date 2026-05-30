import StorefrontHeader from '@/Components/Tienda/StorefrontHeader';
import StorefrontFooter from '@/Components/Tienda/StorefrontFooter';

export default function StorefrontLayout({ children, auth, cartCount = 0 }) {
    return (
        <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Figtree, sans-serif', background: '#FDF6F0' }}>
            <StorefrontHeader auth={auth} cartCount={cartCount} />
            <main className="flex-1">
                {children}
            </main>
            <StorefrontFooter />
        </div>
    );
}
