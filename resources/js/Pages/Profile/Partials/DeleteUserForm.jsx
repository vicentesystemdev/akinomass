import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [touched, setTouched] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });
    const clientError = !data.password ? 'Confirma tu contrasena para eliminar la cuenta.' : '';

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        setTouched(true);
        if (clientError) return;

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setTouched(false);
        clearErrors();
        reset();
    };

    return (
        <section className="space-y-5">
            <div className="rounded-2xl border border-akin-danger/20 bg-akin-dangerSoft p-5">
                <h3 className="text-base font-black text-akin-danger">Eliminar cuenta</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                    Una vez eliminada la cuenta, sus datos de acceso dejaran de estar disponibles. Usa esta accion solo si estas seguro.
                </p>
            </div>

            <DangerButton onClick={confirmUserDeletion}>Eliminar cuenta</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6" noValidate>
                    <h2 className="text-xl font-black text-akin-text">Confirmar eliminacion</h2>
                    <p className="mt-2 text-sm leading-6 text-akin-muted">
                        Ingresa tu contrasena para confirmar que deseas eliminar permanentemente esta cuenta.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Contrasena" required />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            onBlur={() => setTouched(true)}
                            className="mt-1 block w-full px-4 py-3"
                            isFocused
                            invalid={Boolean((touched && clientError) || errors.password)}
                            placeholder="Contrasena"
                        />
                        <InputError message={(touched && clientError) || errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <DangerButton type="submit" disabled={processing || Boolean(clientError)}>
                            {processing ? 'Eliminando...' : 'Eliminar cuenta'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
