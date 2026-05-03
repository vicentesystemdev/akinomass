import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LeadForm from './Partials';

export default function Create(props) {
  const form = useForm({ nombre_lea:'', alias_lea:'', telefono_lea:'', correo_lea:'', producto_interes_lea:'', observacion_lea:'', estado_lea: props.estados[0], fecha_seguimiento_lea:'', cod_canal_venta:'', cod_tipo_flujo_comercial:'', cod_usuario_responsable:'' });
  return <AuthenticatedLayout><Head title="Crear lead" /><div className="p-6"><h1>Crear lead</h1><LeadForm {...props} form={form} submit={() => form.post(route('leads.store'))} /><Link href={route('leads.index')}>Volver</Link></div></AuthenticatedLayout>;
}
