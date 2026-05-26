import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar correo" />

            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-akin-accent">Verificacion</p>
                <h1 className="mt-2 text-2xl font-black text-akin-text">Verifica tu correo</h1>
                <p className="mt-2 text-sm leading-6 text-akin-muted">
                    Antes de continuar, revisa el enlace que enviamos a tu correo. Si no llego, puedes solicitar uno nuevo.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-xl border border-akin-success/20 bg-akin-successSoft p-4 text-sm font-semibold text-akin-success">
                    Enviamos un nuevo enlace de verificacion a tu correo.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Enviando...' : 'Reenviar correo'}
                    </PrimaryButton>

                    <Link href={route('logout')} method="post" as="button">
                        <SecondaryButton type="button">Cerrar sesion</SecondaryButton>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
