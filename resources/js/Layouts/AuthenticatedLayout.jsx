import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const permissions = auth?.permissions ?? [];

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const hasPermission = (permission) => permissions.includes(permission);

    const navigationItems = useMemo(
        () => [
            { label: 'Dashboard', routeName: 'dashboard', icon: 'ChartBarIcon', canView: hasPermission('dashboard.ver') },
            { label: 'CRM', isHeader: true },
            { label: 'Clientes', routeName: 'clientes.index', icon: 'UserGroupIcon', canView: hasPermission('clientes.ver') },
            { label: 'Leads', routeName: 'leads.index', icon: 'UserPlusIcon', canView: hasPermission('leads.ver') },
            { label: 'Plantillas', routeName: 'plantillas-mensaje.index', icon: 'ChatBubbleLeftEllipsisIcon', canView: hasPermission('leads.ver') },
            { label: 'CATÁLOGO', isHeader: true },
            { label: 'Categorías', routeName: 'categorias-producto.index', icon: 'TagIcon', canView: hasPermission('productos.ver') },
            { label: 'Productos', routeName: 'productos.index', icon: 'ShoppingBagIcon', canView: hasPermission('productos.ver') },
            { label: 'INVENTARIO', isHeader: true },
            { label: 'Stock', routeName: 'inventario.index', icon: 'Square3Stack3DIcon', canView: hasPermission('inventario.ver') },
            { label: 'Movimientos', routeName: 'inventario.movimientos', icon: 'ArrowsRightLeftIcon', canView: hasPermission('inventario.movimientos') },
            { label: 'OPERACIONES', isHeader: true },
            { label: 'Pedidos', routeName: 'pedidos.index', icon: 'ClipboardDocumentListIcon', canView: hasPermission('pedidos.ver') },
            { label: 'Pagos', routeName: 'pagos.index', icon: 'CreditCardIcon', canView: hasPermission('pagos.ver') },
            { label: 'LiveSales', routeName: 'live-sales.index', icon: 'VideoCameraIcon', canView: hasPermission('pedidos.ver') || hasPermission('leads.ver') },
            { label: 'SISTEMA', isHeader: true },
            { label: 'Reportes', routeName: 'reportes.index', icon: 'PresentationChartLineIcon', canView: hasPermission('reportes.ver') },
        ],
        [permissions],
    );

    const visibleNavigationItems = navigationItems.filter((item) => item.isHeader || item.canView);

    const getIcon = (iconName, isActive) => {
        const icons = {
            ChartBarIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
            UserGroupIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
            UserPlusIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5l-2.25 2.25L14.5 7.5m0 7.5l2.25-2.25 2.25 2.25M12 13.5a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.135a6.375 6.375 0 0111.964-3.07" />,
            ChatBubbleLeftEllipsisIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />,
            TagIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.159 3.659A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z" />,
            ShoppingBagIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
            Square3Stack3DIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0l4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25m0 0l5.571 3 5.571-3" />,
            ArrowsRightLeftIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />,
            ClipboardDocumentListIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .415.162.798.425 1.081.263.283.627.426 1.025.426 1.025 0 1.9-.875 1.9-1.9 0-.231-.035-.454-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25c1.032 0 1.884.693 2.147 1.636m-7.447 0a48.426 48.426 0 00-1.123.08C5.945 4.01 5.1 4.973 5.1 6.108V19.5a2.25 2.25 0 002.25 2.25h6.75" />,
            CreditCardIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-8.25a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25V6.75z" />,
            VideoCameraIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />,
            PresentationChartLineIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0V13.5m0-10.5L12 14.25 7.5 9.75" />,
        };
        return icons[iconName] || <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />;
    };

    return (
        <div className="min-h-screen bg-[#FDF6F0]">
            {/* Sidebar Desktop */}
            <aside 
                className={`fixed left-0 top-0 z-40 h-screen transition-all duration-500 ease-in-out border-r border-olive/10 ${
                    isSidebarOpen ? 'w-72' : 'w-20'
                } bg-[#3C473A] overflow-hidden hidden lg:block shadow-2xl`}
            >
                <div className="flex h-full flex-col px-4 py-8">
                    {/* Logo Section */}
                    <div className={`flex items-center gap-4 px-2 mb-10 overflow-hidden ${!isSidebarOpen && 'justify-center'}`}>
                        <Link href="/" className="flex-shrink-0">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                                <span className="text-xl font-black text-olive">A</span>
                            </div>
                        </Link>
                        {isSidebarOpen && (
                            <span className="text-xl font-black text-[#FDF6F0] tracking-tighter uppercase">
                                AKINO<span className="text-terracotta">MASS</span>
                            </span>
                        )}
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                        {visibleNavigationItems.map((item, index) => {
                            if (item.isHeader) {
                                return isSidebarOpen ? (
                                    <h3 key={`header-${index}`} className="px-4 mt-8 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FDF6F0]/30">
                                        {item.label}
                                    </h3>
                                ) : (
                                    <div key={`header-${index}`} className="h-px bg-white/10 my-4 mx-4"></div>
                                );
                            }

                            const isActive = route().current(item.routeName) || route().current()?.startsWith(item.routeName.split('.')[0]);
                            return (
                                <Link
                                    key={item.routeName}
                                    href={route(item.routeName)}
                                    className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                                        isActive 
                                        ? 'bg-terracotta text-white shadow-lg shadow-terracotta/20' 
                                        : 'text-[#FDF6F0]/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <div className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${!isSidebarOpen && 'mx-auto'}`}>
                                        <div className="h-5 w-5">
                                            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                                                {getIcon(item.icon, isActive)}
                                            </svg>
                                        </div>
                                    </div>
                                    {isSidebarOpen && (
                                        <span className={`text-sm font-bold tracking-tight ${isActive ? 'translate-x-1' : ''} transition-transform duration-300`}>
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && isSidebarOpen && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Summary */}
                    {isSidebarOpen && (
                        <div className="mt-8 rounded-3xl bg-white/5 p-4 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-terracotta flex items-center justify-center font-bold text-white uppercase shadow-lg">
                                    {user?.name?.[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white truncate max-w-[120px]">{user?.name}</span>
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Premium</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>


            {/* Main Content Area */}
            <div className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-olive/5 bg-[#FDF6F0]/80 backdrop-blur-xl px-8">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-white text-olive shadow-sm border border-olive/5 hover:bg-olive hover:text-white transition-all duration-300"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        
                        <div className="flex flex-col">
                            <h2 className="text-sm font-black text-olive/40 uppercase tracking-[0.2em] leading-none mb-1">AKINOMASS</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-coffee">{header || 'Sistema Comercial'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Mockup */}
                        <div className="hidden md:flex relative group">
                            <input 
                                type="text" 
                                placeholder="Buscar pedidos..." 
                                className="h-11 w-64 rounded-xl border-olive/5 bg-white pl-10 pr-4 text-sm focus:border-terracotta focus:ring-0 transition-all duration-300 group-hover:shadow-md"
                            />
                            <div className="absolute left-3.5 top-3.5 text-olive/30">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>

                        {/* Notifications */}
                        <button className="relative h-11 w-11 flex items-center justify-center rounded-xl bg-white text-olive border border-olive/5 shadow-sm hover:shadow-md transition-all">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-terracotta border-2 border-white"></span>
                        </button>

                        {/* User Profile Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 h-11 px-3 rounded-xl bg-white border border-olive/5 shadow-sm hover:shadow-md transition-all">
                                    <div className="h-7 w-7 rounded-lg bg-olive/10 flex items-center justify-center text-[10px] font-black text-olive uppercase">
                                        {user?.name?.[0]}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-bold text-coffee pr-1">{user?.name}</span>
                                    <svg className="h-4 w-4 text-olive/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Mi Perfil</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Cerrar Sesión</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    <div className="mx-auto max-w-[1600px]">
                        {children}
                    </div>
                </main>

                <footer className="px-8 py-8 mt-12 border-t border-olive/5 text-center">
                    <p className="text-xs font-bold text-olive/20 uppercase tracking-widest">
                        AKINOMASS System v1.0 &bull; Developed for Modern Retail
                    </p>
                </footer>
            </div>
        </div>
    );
}

