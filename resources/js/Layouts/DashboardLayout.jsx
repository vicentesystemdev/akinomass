import Header from '@/Components/Dashboard/Header';
import Sidebar from '@/Components/Dashboard/Sidebar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function DashboardLayout({ user, children }) {
    const page = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUser = user || page.props?.auth?.user;

    const safeRoute = (routeName, fallback = '#') => {
        try {
            if (typeof route === 'function') {
                const router = route();

                if (router?.has) {
                    return router.has(routeName) ? route(routeName) : fallback;
                }

                return route(routeName);
            }
        } catch (error) {
            return fallback;
        }

        return fallback;
    };

    const isActive = (routeName, path) => {
        try {
            if (typeof route === 'function') {
                const router = route();

                if (router?.current && router.current(routeName)) {
                    return true;
                }
            }
        } catch (error) {
            // Fallback por pathname cuando Ziggy no esta disponible.
        }

        if (typeof window === 'undefined' || path === '#') {
            return false;
        }

        return window.location.pathname === path || window.location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                safeRoute={safeRoute}
                isActive={isActive}
            />

            <div className="min-h-screen lg:pl-72">
                <Header
                    user={currentUser}
                    onMenuClick={() => setSidebarOpen(true)}
                    safeRoute={safeRoute}
                />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
