import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass = (field) =>
        `w-full rounded-xl border shadow-sm py-3 px-4 text-sm text-cafe-700 transition-all duration-200 focus:ring-2 focus:ring-terracota-500 focus:border-terracota-500 ${errors[field] ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 bg-white'}`;

    return (
        <GuestLayout title="Nueva Contraseña" subtitle="Elige una nueva contraseña segura">
            <Head title="Nueva Contraseña" />

            <form onSubmit={submit} className="space-y-4">
                {/* Email (read-only) */}
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
                            className={`w-full rounded-xl border shadow-sm py-3 pl-10 pr-4 text-sm text-cafe-700 bg-gray-50 border-gray-200`}
                            readOnly
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-cafe-700 mb-1.5">
                        Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        autoComplete="new-password"
                        autoFocus
                        required
                        className={inputClass('password')}
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Confirmar */}
                <div>
                    <label className="block text-sm font-medium text-cafe-700 mb-1.5">
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        required
                        className={inputClass('password_confirmation')}
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
                    style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)' }}
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Guardando...
                        </span>
                    ) : 'Restablecer Contraseña'}
                </button>
            </form>
        </GuestLayout>
    );
}
