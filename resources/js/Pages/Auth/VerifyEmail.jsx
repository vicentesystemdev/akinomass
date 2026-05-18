import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout title="Verificar Correo" subtitle="Confirma tu dirección de email">
            <Head title="Verificar Correo" />

            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-oliva-50">
                    <svg className="w-8 h-8 text-oliva-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>

            <p className="mb-5 text-sm text-cafe-600 leading-relaxed text-center">
                ¡Gracias por registrarte! Antes de comenzar, verifica tu dirección de correo
                electrónico haciendo clic en el enlace que te enviamos.
                Si no recibiste el correo, te enviaremos otro con gusto.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                    <p className="text-sm font-medium text-green-700 text-center">
                        Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
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
                    ) : 'Reenviar Correo de Verificación'}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="block w-full text-center text-sm font-medium text-gray-500 hover:text-cafe-700 transition-colors py-2"
                >
                    Cerrar Sesión
                </Link>
            </form>
        </GuestLayout>
    );
}
