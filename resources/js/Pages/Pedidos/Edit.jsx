import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/UI/StatusBadge';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { PedidoLayout, TextAreaField } from './Create';

export default function Edit({ pedido, estadoBorrador }) {
    const [touched, setTouched] = useState(false);
    const { data, setData, put, processing, errors } = useForm({ ...pedido, detalles: pedido.detalles ?? [] });
    const editable = pedido.estado_ped === estadoBorrador;
    const clientError = useMemo(() => (!editable ? 'Este pedido no esta editable por su estado actual.' : ''), [editable]);

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (clientError) return;
        put(route('pedidos.update', pedido.cod_pedido));
    };

    return (
        <PedidoLayout title={`Editar pedido ${pedido.numero_pedido_ped}`} subtitle="Actualiza observaciones del pedido cuando el estado lo permite.">
            <Head title={`Editar pedido ${pedido.numero_pedido_ped}`} />
            <form onSubmit={submit} className="space-y-5" noValidate>
                <div className="rounded-2xl border border-akin-border bg-akin-surfaceSoft p-5">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-akin-muted">Estado actual</p>
                    <div className="mt-3 flex items-center gap-3">
                        <StatusBadge>{formatStatus(pedido.estado_ped)}</StatusBadge>
                        {!editable && <span className="text-sm font-semibold text-akin-warning">Pedido no editable.</span>}
                    </div>
                </div>

                <TextAreaField id="observacion_ped" label="Observacion" value={data.observacion_ped ?? ''} error={errors.observacion_ped || (touched && clientError)} onChange={(value) => setData('observacion_ped', value)} />

                <div className="flex flex-col gap-3 border-t border-akin-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-akin-muted">{clientError || 'Listo para actualizar.'}</p>
                    <div className="flex gap-3">
                        <Link href={route('pedidos.show', pedido.cod_pedido)}><SecondaryButton>Cancelar</SecondaryButton></Link>
                        <PrimaryButton disabled={processing || !editable}>{processing ? 'Actualizando...' : 'Actualizar pedido'}</PrimaryButton>
                    </div>
                </div>
            </form>
        </PedidoLayout>
    );
}

function formatStatus(value) {
    if (!value) return 'Borrador';
    return String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
