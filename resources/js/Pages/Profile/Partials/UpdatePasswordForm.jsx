import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [touched, setTouched] = useState({});

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const clientErrors = useMemo(() => ({
        current_password: !data.current_password ? 'La contrasena actual es obligatoria.' : '',
        password: !data.password ? 'La nueva contrasena es obligatoria.' : data.password.length < 8 ? 'Debe tener al menos 8 caracteres.' : '',
        password_confirmation: data.password_confirmation !== data.password ? 'La confirmacion no coincide.' : '',
    }), [data]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const updatePassword = (e) => {
        e.preventDefault();
        setTouched({ current_password: true, password: true, password_confirmation: true });
        if (isInvalid) return;

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setTouched({});
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className="space-y-5" noValidate>
            <PasswordInput id="current_password" label="Contrasena actual" refValue={currentPasswordInput} value={data.current_password} error={(touched.current_password && clientErrors.current_password) || errors.current_password} onChange={(value) => setData('current_password', value)} onBlur={() => setTouched((value) => ({ ...value, current_password: true }))} autoComplete="current-password" />
            <PasswordInput id="password" label="Nueva contrasena" refValue={passwordInput} value={data.password} error={(touched.password && clientErrors.password) || errors.password} onChange={(value) => setData('password', value)} onBlur={() => setTouched((value) => ({ ...value, password: true }))} autoComplete="new-password" />
            <PasswordInput id="password_confirmation" label="Confirmar contrasena" value={data.password_confirmation} error={(touched.password_confirmation && clientErrors.password_confirmation) || errors.password_confirmation} onChange={(value) => setData('password_confirmation', value)} onBlur={() => setTouched((value) => ({ ...value, password_confirmation: true }))} autoComplete="new-password" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton disabled={processing || isInvalid}>
                    {processing ? 'Actualizando...' : 'Actualizar contrasena'}
                </PrimaryButton>

                <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in-out" leaveTo="opacity-0">
                    <p className="text-sm font-semibold text-akin-success">Contrasena actualizada.</p>
                </Transition>
            </div>
        </form>
    );
}

function PasswordInput({ id, label, value, error, onChange, onBlur, autoComplete, refValue }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required />
            <TextInput
                id={id}
                ref={refValue}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                invalid={Boolean(error)}
                type="password"
                className="mt-1 block w-full px-4 py-3"
                autoComplete={autoComplete}
            />
            <InputError message={error} className="mt-2" />
        </div>
    );
}
