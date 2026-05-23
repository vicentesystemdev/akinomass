import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Crear Cuenta" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-akin-text">Crear Cuenta</h1>
                <p className="text-sm font-medium text-akin-muted">
                    Únete al sistema comercial AKINOMASS
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel 
                        htmlFor="name" 
                        value="Nombre Completo" 
                        className="text-akin-primary font-semibold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-akin-primary/10 bg-akin-bg/30 focus:border-akin-accent focus:ring-akin-accent rounded-xl px-4 py-3 shadow-none transition-all duration-200"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 ml-1" />
                </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel 
                        htmlFor="password" 
                        value="Contraseña" 
                        className="text-akin-primary font-semibold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-akin-primary/10 bg-akin-bg/30 focus:border-akin-accent focus:ring-akin-accent rounded-xl px-4 py-3 shadow-none transition-all duration-200"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                        className="text-akin-primary font-semibold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-akin-primary/10 bg-akin-bg/30 focus:border-akin-accent focus:ring-akin-accent rounded-xl px-4 py-3 shadow-none transition-all duration-200"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 ml-1"
                    />
                </div>

                <div className="pt-4 flex flex-col gap-4">
                    <PrimaryButton 
                        className="w-full flex justify-center py-4 bg-akin-accent hover:bg-akin-primary active:bg-akin-text rounded-xl text-white font-bold text-base shadow-[0_10px_20px_rgba(215,122,97,0.3)] hover:shadow-none transition-all duration-300 uppercase tracking-widest disabled:opacity-50" 
                        disabled={processing}
                    >
                        Crear Mi Cuenta
                    </PrimaryButton>

                    <Link
                        href={route('login')}
                        className="text-center text-sm font-bold text-akin-muted hover:text-akin-accent transition-colors duration-200"
                    >
                        ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

