import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function ForgotPassword({ status }) {
    const [touched, setTouched] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const emailError = useMemo(() => {
        if (!data.email) return 'El correo es obligatorio.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Ingresa un correo valido.';
        return '';
    }, [data.email]);

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (emailError) return;

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar contrasena" />

            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-akin-accent">Recuperacion</p>
                <h1 className="mt-2 text-2xl font-black text-akin-text">Recuperar contrasena</h1>
                <p className="mt-2 text-sm leading-6 text-akin-muted">
                    Ingresa tu correo y enviaremos un enlace para definir una nueva contrasena.
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl border border-akin-success/20 bg-akin-successSoft p-4 text-sm font-semibold text-akin-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5" noValidate>
                <div>
                    <InputLabel htmlFor="email" value="Correo electronico" required />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full px-4 py-3"
                        isFocused
                        onChange={(e) => setData('email', e.target.value)}
                        onBlur={() => setTouched(true)}
                        invalid={Boolean((touched && emailError) || errors.email)}
                    />
                    <InputError message={(touched && emailError) || errors.email} className="mt-2" />
                </div>

                <PrimaryButton className="w-full py-4" disabled={processing || Boolean(emailError)}>
                    {processing ? 'Enviando...' : 'Enviar enlace de recuperacion'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
