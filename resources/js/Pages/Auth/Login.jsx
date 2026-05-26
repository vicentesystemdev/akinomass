import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [touched, setTouched] = useState({});
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const clientErrors = useMemo(() => ({
        email: !data.email ? 'El correo es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? 'Ingresa un correo valido.' : '',
        password: !data.password ? 'La contrasena es obligatoria.' : '',
    }), [data.email, data.password]);

    const isInvalid = Boolean(clientErrors.email || clientErrors.password);

    const submit = (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (isInvalid) return;

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesion" />

            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-akin-accent">Acceso seguro</p>
                <h1 className="mt-2 text-2xl font-black text-akin-text">Bienvenido a AKINOMASS</h1>
                <p className="mt-2 text-sm font-medium leading-6 text-akin-muted">
                    Gestiona clientes, pedidos, inventario y pagos desde una experiencia comercial unificada.
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl border border-akin-success/20 bg-akin-successSoft p-4 text-sm font-semibold text-akin-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6" noValidate>
                <div>
                    <InputLabel htmlFor="email" value="Correo electronico" className="mb-1.5 ml-1 text-akin-primary" required />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full px-4 py-3"
                        autoComplete="username"
                        isFocused
                        onChange={(e) => setData('email', e.target.value)}
                        onBlur={() => setTouched((value) => ({ ...value, email: true }))}
                        invalid={Boolean((touched.email && clientErrors.email) || errors.email)}
                    />
                    <InputError message={(touched.email && clientErrors.email) || errors.email} className="mt-2 ml-1" />
                </div>

                <div>
                    <div className="mb-1.5 ml-1 flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Contrasena" className="text-akin-primary" required />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-akin-accent transition-colors duration-200 hover:text-akin-primary"
                            >
                                Olvidaste tu clave?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full px-4 py-3"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        onBlur={() => setTouched((value) => ({ ...value, password: true }))}
                        invalid={Boolean((touched.password && clientErrors.password) || errors.password)}
                    />
                    <InputError message={(touched.password && clientErrors.password) || errors.password} className="mt-2 ml-1" />
                </div>

                <label className="group flex cursor-pointer items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm font-medium text-akin-muted transition-colors duration-200 group-hover:text-akin-text">
                        Recordarme
                    </span>
                </label>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full py-4 text-base shadow-[0_10px_20px_rgba(215,122,97,0.3)]"
                        disabled={processing || isInvalid}
                        title={isInvalid ? 'Completa correo y contrasena para continuar.' : undefined}
                    >
                        {processing ? 'Ingresando...' : 'Ingresar al sistema'}
                    </PrimaryButton>
                    {isInvalid && (
                        <p className="mt-3 text-center text-xs font-semibold text-akin-muted">
                            Completa los campos obligatorios para habilitar el ingreso.
                        </p>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-sm text-akin-muted">
                        No tienes una cuenta?{' '}
                        <Link href={route('register')} className="font-bold text-akin-accent transition-all hover:underline">
                            Registrate aqui
                        </Link>
                    </p>
                </div>
            </form>

            <div className="mt-10 border-t border-akin-border pt-6">
                <div className="flex flex-col gap-2 rounded-2xl bg-akin-surfaceSoft p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-akin-muted">Acceso rapido demo</span>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-akin-muted">Email:</span>
                            <code className="break-all font-mono font-bold text-akin-primary">admin.demo@akinomass.test</code>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-akin-muted">Clave:</span>
                            <code className="font-mono font-bold text-akin-primary">password</code>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
