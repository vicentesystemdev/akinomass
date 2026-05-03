import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ClienteForm from './Partials';
export default function Create(props) {
  const form = useForm({ nombre_cli:'', telefono_cli:'', correo_cli:'', direccion_cli:'', documento_cli:'', observacion_cli:'', estado_cli: props.estados[0], cod_canal_venta:'', cod_tipo_flujo_comercial:''});
  return <AuthenticatedLayout><Head title="Crear cliente" /><div className="p-6"><h1>Crear cliente</h1><ClienteForm {...props} form={form} submit={() => form.post(route('clientes.store'))} /><Link href={route('clientes.index')}>Volver</Link></div></AuthenticatedLayout>;
}
