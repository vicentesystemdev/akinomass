import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Register() {
    const [touched, setTouched] = useState({});
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const clientErrors = useMemo(() => ({
        name: !data.name.trim() ? 'El nombre es obligatorio.' : '',
        email: !data.email ? 'El correo es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? 'Ingresa un correo valido.' : '',
        password: !data.password ? 'La contrasena es obligatoria.' : data.password.length < 8 ? 'Debe tener al menos 8 caracteres.' : '',
        password_confirmation: data.password_confirmation !== data.password ? 'La confirmacion no coincide.' : '',
    }), [data]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const submit = (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true, password_confirmation: true });
        if (isInvalid) return;

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Crear cuenta" />

            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-akin-accent">Nuevo acceso</p>
                <h1 className="mt-2 text-2xl font-black text-akin-text">Crear cuenta</h1>
                <p className="mt-2 text-sm font-medium text-akin-muted">
                    Unete al sistema comercial AKINOMASS.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5" noValidate>
                <AuthInput id="name" label="Nombre completo" value={data.name} error={(touched.name && clientErrors.name) || errors.name} onChange={(value) => setData('name', value)} onBlur={() => setTouched((value) => ({ ...value, name: true }))} autoComplete="name" focused />
                <AuthInput id="email" label="Correo electronico" type="email" value={data.email} error={(touched.email && clientErrors.email) || errors.email} onChange={(value) => setData('email', value)} onBlur={() => setTouched((value) => ({ ...value, email: true }))} autoComplete="username" />
                <AuthInput id="password" label="Contrasena" type="password" value={data.password} error={(touched.password && clientErrors.password) || errors.password} onChange={(value) => setData('password', value)} onBlur={() => setTouched((value) => ({ ...value, password: true }))} autoComplete="new-password" />
                <AuthInput id="password_confirmation" label="Confirmar contrasena" type="password" value={data.password_confirmation} error={(touched.password_confirmation && clientErrors.password_confirmation) || errors.password_confirmation} onChange={(value) => setData('password_confirmation', value)} onBlur={() => setTouched((value) => ({ ...value, password_confirmation: true }))} autoComplete="new-password" />

                <div className="flex flex-col gap-4 pt-4">
                    <PrimaryButton
                        className="w-full py-4 text-base shadow-[0_10px_20px_rgba(215,122,97,0.3)]"
                        disabled={processing || isInvalid}
                        title={isInvalid ? 'Completa los datos obligatorios para crear la cuenta.' : undefined}
                    >
                        {processing ? 'Creando...' : 'Crear mi cuenta'}
                    </PrimaryButton>

                    <Link href={route('login')} className="text-center text-sm font-bold text-akin-muted transition-colors duration-200 hover:text-akin-accent">
                        Ya tienes una cuenta? Inicia sesion
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

function AuthInput({ id, label, type = 'text', value, error, onChange, onBlur, autoComplete, focused = false }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} className="mb-1.5 ml-1 text-akin-primary" required />
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
                required
            />
            <InputError message={error} className="mt-2 ml-1" />
        </div>
    );
}
