import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [touched, setTouched] = useState({});

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const clientErrors = useMemo(() => ({
        name: !data.name.trim() ? 'El nombre es obligatorio.' : '',
        email: !data.email ? 'El correo es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? 'Ingresa un correo valido.' : '',
    }), [data.name, data.email]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const submit = (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true });
        if (isInvalid) return;

        patch(route('profile.update'));
    };

    return (
        <form onSubmit={submit} className="space-y-5" noValidate>
            <ProfileInput id="name" label="Nombre" value={data.name} error={(touched.name && clientErrors.name) || errors.name} onChange={(value) => setData('name', value)} onBlur={() => setTouched((value) => ({ ...value, name: true }))} autoComplete="name" focused />
            <ProfileInput id="email" label="Correo electronico" type="email" value={data.email} error={(touched.email && clientErrors.email) || errors.email} onChange={(value) => setData('email', value)} onBlur={() => setTouched((value) => ({ ...value, email: true }))} autoComplete="username" />

            {mustVerifyEmail && user.email_verified_at === null && (
                <div className="rounded-2xl border border-akin-warning/20 bg-akin-warningSoft p-4">
                    <p className="text-sm font-semibold text-akin-warning">
                        Tu correo aun no esta verificado.{' '}
                        <Link href={route('verification.send')} method="post" as="button" className="underline underline-offset-4">
                            Reenviar verificacion
                        </Link>
                    </p>
                    {status === 'verification-link-sent' && (
                        <p className="mt-2 text-sm font-semibold text-akin-success">Enlace de verificacion reenviado.</p>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton disabled={processing || isInvalid}>
                    {processing ? 'Guardando...' : 'Guardar cambios'}
                </PrimaryButton>

                <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in-out" leaveTo="opacity-0">
                    <p className="text-sm font-semibold text-akin-success">Cambios guardados.</p>
                </Transition>
            </div>
        </form>
    );
}

function ProfileInput({ id, label, type = 'text', value, error, onChange, onBlur, autoComplete, focused = false }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required />
            <TextInput
                id={id}
                type={type}
                value={value}
                className="mt-1 block w-full px-4 py-3"
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                invalid={Boolean(error)}
                isFocused={focused}
                autoComplete={autoComplete}
            />
            <InputError className="mt-2" message={error} />
        </div>
    );
}
