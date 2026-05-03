import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LeadForm from './Partials';

export default function Edit(props) {
  const form = useForm({ ...props.lead, fecha_seguimiento_lea: props.lead.fecha_seguimiento_lea ?? '' });
  return <AuthenticatedLayout><Head title="Editar lead" /><div className="p-6"><h1>Editar lead</h1><LeadForm {...props} form={form} submit={() => form.put(route('leads.update', props.lead.cod_lead))} /><Link href={route('leads.index')}>Volver</Link></div></AuthenticatedLayout>;
}
