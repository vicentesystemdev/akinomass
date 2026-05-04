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
                <h1 className="text-2xl font-bold text-[#2B221E]">Bienvenido</h1>
                <p className="text-sm font-medium text-[#3C473A]/60">
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
                        className="text-[#3C473A] font-semibold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-[#3C473A]/10 bg-[#FDF6F0]/30 focus:border-[#D77A61] focus:ring-[#D77A61] rounded-xl px-4 py-3 shadow-none transition-all duration-200"
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
                            className="text-[#3C473A] font-semibold"
                        />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-[#D77A61] hover:text-[#3C473A] transition-colors duration-200"
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
                        className="mt-1 block w-full border-[#3C473A]/10 bg-[#FDF6F0]/30 focus:border-[#D77A61] focus:ring-[#D77A61] rounded-xl px-4 py-3 shadow-none transition-all duration-200"
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
                            className="rounded border-[#3C473A]/20 text-[#D77A61] focus:ring-[#D77A61]"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm font-medium text-[#3C473A]/70 group-hover:text-[#3C473A] transition-colors duration-200">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full flex justify-center py-4 bg-[#D77A61] hover:bg-[#3C473A] active:bg-[#2B221E] rounded-xl text-white font-bold text-base shadow-[0_10px_20px_rgba(215,122,97,0.3)] hover:shadow-none transition-all duration-300 uppercase tracking-widest disabled:opacity-50" 
                        disabled={processing}
                    >
                        Ingresar al Sistema
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#3C473A]/60">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            href={route('register')}
                            className="font-bold text-[#D77A61] hover:underline transition-all"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </form>

            <div className="mt-10 pt-6 border-t border-[#3C473A]/5">
                <div className="rounded-2xl bg-[#3C473A]/5 p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3C473A]/50">Acceso Rápido (Demo)</span>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[#3C473A]/60 font-medium">Email:</span>
                            <code className="text-[#3C473A] font-mono font-bold">admin.demo@akinomass.test</code>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#3C473A]/60 font-medium">Clave:</span>
                            <code className="text-[#3C473A] font-mono font-bold">password</code>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}


