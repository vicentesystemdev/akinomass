import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-akin-bg px-4 py-8 selection:bg-akin-accent selection:text-white sm:px-6">
            <div className="mb-8 transform transition duration-300 hover:scale-105">
                <Link href="/">
                    <ApplicationLogo className="w-auto" />
                </Link>
            </div>

            <div className="akin-card relative w-full overflow-hidden px-6 py-8 shadow-[0_20px_50px_rgba(43,34,30,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:max-w-[460px] sm:px-10 sm:py-10">
                <div className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-akin-primary via-akin-accent to-akin-primary" />

                <div className="relative z-10">
                    {children}
                </div>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-akin-muted/70">
                &copy; {new Date().getFullYear()} AKINOMASS System. Todos los derechos reservados.
            </p>
        </div>
    );
}
