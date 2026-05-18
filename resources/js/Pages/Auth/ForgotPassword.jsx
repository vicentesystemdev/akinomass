import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout title="Recuperar Contraseña" subtitle="Te enviaremos un enlace para restablecerla">
            <Head title="Recuperar Contraseña" />

            <p className="mb-5 text-sm text-cafe-600 leading-relaxed">
                ¿Olvidaste tu contraseña? No hay problema. Ingresa tu correo electrónico
                y te enviaremos un enlace para que puedas elegir una nueva.
            </p>

            {status && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                    <p className="text-sm font-medium text-green-700">{status}</p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-cafe-700 mb-1.5">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                            autoFocus
                            className={`w-full rounded-xl border shadow-sm py-3 pl-10 pr-4 text-sm text-cafe-700 transition-all duration-200 focus:ring-2 focus:ring-terracota-500 focus:border-terracota-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)' }}
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Enviando...
                        </span>
                    ) : 'Enviar Enlace de Recuperación'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link href={route('login')} className="text-sm font-medium text-terracota-600 hover:text-terracota-700 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al inicio de sesión
                </Link>
            </div>
        </GuestLayout>
    );
}
