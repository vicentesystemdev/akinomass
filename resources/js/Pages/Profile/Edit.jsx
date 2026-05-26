import SectionCard from '@/Components/UI/SectionCard';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    return (
        <DashboardLayout>
            <Head title="Perfil" />

            <div className="space-y-6">
                <section className="akin-card overflow-hidden p-6 sm:p-8">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Cuenta de usuario</p>
                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-akin-text">Mi perfil</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-akin-muted">
                                Administra tus datos de acceso y la seguridad de tu cuenta AKINOMASS.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl bg-akin-surfaceSoft p-4">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-akin-accent text-sm font-black text-white dark:text-akin-bg">
                                {(user?.name || user?.email || 'A').slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                                <p className="font-black text-akin-text">{user?.name}</p>
                                <p className="text-sm text-akin-muted">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <SectionCard title="Informacion personal" description="Actualiza tu nombre visible y correo de acceso.">
                        <div className="p-5">
                            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                        </div>
                    </SectionCard>

                    <SectionCard title="Seguridad" description="Usa una contrasena fuerte para proteger la operacion comercial.">
                        <div className="p-5">
                            <UpdatePasswordForm />
                        </div>
                    </SectionCard>
                </div>

                <SectionCard title="Zona sensible" description="Esta accion afecta el acceso permanente de la cuenta.">
                    <div className="p-5">
                        <DeleteUserForm />
                    </div>
                </SectionCard>
            </div>
        </DashboardLayout>
    );
}
