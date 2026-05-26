import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function ResetPassword({ token, email }) {
    const [touched, setTouched] = useState({});
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const clientErrors = useMemo(() => ({
        email: !data.email ? 'El correo es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? 'Ingresa un correo valido.' : '',
        password: !data.password ? 'La nueva contrasena es obligatoria.' : data.password.length < 8 ? 'Debe tener al menos 8 caracteres.' : '',
        password_confirmation: data.password_confirmation !== data.password ? 'La confirmacion no coincide.' : '',
    }), [data]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const submit = (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true, password_confirmation: true });
        if (isInvalid) return;

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer contrasena" />

            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-akin-accent">Seguridad</p>
                <h1 className="mt-2 text-2xl font-black text-akin-text">Restablecer contrasena</h1>
                <p className="mt-2 text-sm leading-6 text-akin-muted">Define una clave nueva para continuar con tu cuenta.</p>
            </div>

            <form onSubmit={submit} className="space-y-5" noValidate>
                <PasswordInput id="email" label="Correo electronico" type="email" value={data.email} error={(touched.email && clientErrors.email) || errors.email} onChange={(value) => setData('email', value)} onBlur={() => setTouched((value) => ({ ...value, email: true }))} autoComplete="username" />
                <PasswordInput id="password" label="Nueva contrasena" type="password" value={data.password} error={(touched.password && clientErrors.password) || errors.password} onChange={(value) => setData('password', value)} onBlur={() => setTouched((value) => ({ ...value, password: true }))} autoComplete="new-password" focused />
                <PasswordInput id="password_confirmation" label="Confirmar contrasena" type="password" value={data.password_confirmation} error={(touched.password_confirmation && clientErrors.password_confirmation) || errors.password_confirmation} onChange={(value) => setData('password_confirmation', value)} onBlur={() => setTouched((value) => ({ ...value, password_confirmation: true }))} autoComplete="new-password" />

                <PrimaryButton className="w-full py-4" disabled={processing || isInvalid}>
                    {processing ? 'Actualizando...' : 'Restablecer contrasena'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}

function PasswordInput({ id, label, type, value, error, onChange, onBlur, autoComplete, focused = false }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required />
            <TextInput
                id={id}
                type={type}
                name={id}
                value={value}
                className="mt-1 block w-full px-4 py-3"
                autoComplete={autoComplete}
                isFocused={focused}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                invalid={Boolean(error)}
            />
            <InputError message={error} className="mt-2" />
        </div>
    );
}
