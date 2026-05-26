import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { InputField, LiveLayout } from './Create';

export default function Edit({ sesion }) {
    const [touched, setTouched] = useState(false);
    const { data, setData, put, processing, errors } = useForm({ ...sesion });
    const titleError = useMemo(() => (!data.titulo_ses?.trim() ? 'El titulo es obligatorio.' : ''), [data.titulo_ses]);

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (titleError) return;
        put(route('live-sales.update', sesion.cod_sesion_live));
    };

    return (
        <LiveLayout title="Editar sesion LiveSales" subtitle="Ajusta el titulo de la sesion manteniendo el flujo existente.">
            <Head title="Editar sesion LiveSales" />
            <form onSubmit={submit} className="space-y-5" noValidate>
                <InputField id="titulo_ses" label="Titulo" value={data.titulo_ses || ''} error={(touched && titleError) || errors.titulo_ses} onChange={(value) => setData('titulo_ses', value)} onBlur={() => setTouched(true)} />

                <div className="flex flex-col gap-3 border-t border-akin-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-akin-muted">{titleError || 'Listo para actualizar.'}</p>
                    <div className="flex gap-3">
                        <Link href={route('live-sales.show', sesion.cod_sesion_live)}><SecondaryButton>Cancelar</SecondaryButton></Link>
                        <PrimaryButton disabled={processing || Boolean(titleError)}>{processing ? 'Actualizando...' : 'Actualizar sesion'}</PrimaryButton>
                    </div>
                </div>
            </form>
        </LiveLayout>
    );
}
