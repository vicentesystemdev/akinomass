import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ClienteForm from './Partials';
export default function Edit(props) {
  const form = useForm({ ...props.cliente });
  return <AuthenticatedLayout><Head title="Editar cliente" /><div className="p-6"><h1>Editar cliente</h1><ClienteForm {...props} form={form} submit={() => form.put(route('clientes.update', props.cliente.cod_cliente))} /><Link href={route('clientes.index')}>Volver</Link></div></AuthenticatedLayout>;
}
