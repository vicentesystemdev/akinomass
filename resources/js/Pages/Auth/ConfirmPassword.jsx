import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ConfirmPassword() {
    const [touched, setTouched] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const clientError = !data.password ? 'La contrasena es obligatoria.' : '';

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (clientError) return;

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar contrasena" />

            <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-akin-accent">Area protegida</p>
                <h1 className="mt-2 text-2xl font-black text-akin-text">Confirma tu contrasena</h1>
                <p className="mt-2 text-sm leading-6 text-akin-muted">Por seguridad, confirma tu clave antes de continuar.</p>
            </div>

            <form onSubmit={submit} className="space-y-5" noValidate>
                <div>
                    <InputLabel htmlFor="password" value="Contrasena" required />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full px-4 py-3"
                        isFocused
                        onChange={(e) => setData('password', e.target.value)}
                        onBlur={() => setTouched(true)}
                        invalid={Boolean((touched && clientError) || errors.password)}
                    />
                    <InputError message={(touched && clientError) || errors.password} className="mt-2" />
                </div>

                <PrimaryButton className="w-full py-4" disabled={processing || Boolean(clientError)}>
                    {processing ? 'Confirmando...' : 'Confirmar'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
