import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-akin-text">Bienvenido</h1>
                <p className="text-sm font-medium text-akin-muted">
                    Sistema comercial multicanal
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-600 border border-green-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel 
                        htmlFor="email" 
                        value="Correo Electrónico" 
                        className="text-akin-primary font-semibold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-akin-primary/10 bg-akin-bg/30 focus:border-akin-accent focus:ring-akin-accent rounded-xl px-4 py-3 shadow-none transition-all duration-200"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5 ml-1">
                        <InputLabel 
                            htmlFor="password" 
                            value="Contraseña" 
                            className="text-akin-primary font-semibold"
                        />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-akin-accent hover:text-akin-primary transition-colors duration-200"
                            >
                                ¿Olvidaste tu clave?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-akin-primary/10 bg-akin-bg/30 focus:border-akin-accent focus:ring-akin-accent rounded-xl px-4 py-3 shadow-none transition-all duration-200"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-akin-primary/20 text-akin-accent focus:ring-akin-accent"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm font-medium text-akin-primary/70 group-hover:text-akin-primary transition-colors duration-200">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full flex justify-center py-4 bg-akin-accent hover:bg-akin-primary active:bg-akin-text rounded-xl text-white font-bold text-base shadow-[0_10px_20px_rgba(215,122,97,0.3)] hover:shadow-none transition-all duration-300 uppercase tracking-widest disabled:opacity-50" 
                        disabled={processing}
                    >
                        Ingresar al Sistema
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-akin-muted">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            href={route('register')}
                            className="font-bold text-akin-accent hover:underline transition-all"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </form>

            <div className="mt-10 pt-6 border-t border-akin-border">
                <div className="rounded-2xl bg-akin-primary/5 p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-akin-primary/50">Acceso Rápido (Demo)</span>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-akin-muted font-medium">Email:</span>
                            <code className="text-akin-primary font-mono font-bold">admin.demo@akinomass.test</code>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-akin-muted font-medium">Clave:</span>
                            <code className="text-akin-primary font-mono font-bold">password</code>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}


