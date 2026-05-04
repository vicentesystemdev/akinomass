import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#FDF6F0] selection:bg-[#D77A61] selection:text-white sm:justify-center sm:pt-0">
            <div className="mb-8 transform transition hover:scale-105 duration-300">
                <Link href="/">
                    <ApplicationLogo className="w-auto" />
                </Link>
            </div>

            <div className="relative w-full overflow-hidden bg-white px-10 py-12 shadow-[0_20px_50px_rgba(43,34,30,0.05)] sm:max-w-[440px] sm:rounded-[2rem] border border-[#3C473A]/5">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-[#D77A61]/5"></div>
                
                <div className="relative z-10">
                    {children}
                </div>
            </div>
            
            <p className="mt-8 text-sm font-medium text-[#3C473A]/40">
                &copy; {new Date().getFullYear()} AKINOMASS System. Todos los derechos reservados.
            </p>
        </div>
    );
}

