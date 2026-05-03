export default function LeadForm({ form, submit, canales, tiposFlujo, usuarios, estados }) {
  const onChange = (e) => form.setData(e.target.name, e.target.value);
  return <form onSubmit={(e)=>{e.preventDefault();submit();}} className="space-y-2">{['nombre_lea','alias_lea','telefono_lea','correo_lea','producto_interes_lea','observacion_lea','fecha_seguimiento_lea'].map((f)=><input key={f} name={f} value={form.data[f] ?? ''} onChange={onChange} placeholder={f} className="block w-full" />)}
    <select name="estado_lea" value={form.data.estado_lea} onChange={onChange}>{estados.map((e)=><option key={e}>{e}</option>)}</select>
    <select name="cod_canal_venta" value={form.data.cod_canal_venta} onChange={onChange}><option value="">Canal</option>{canales.map((c)=><option key={c.cod_canal_venta} value={c.cod_canal_venta}>{c.nombre_can}</option>)}</select>
    <select name="cod_tipo_flujo_comercial" value={form.data.cod_tipo_flujo_comercial} onChange={onChange}><option value="">Flujo</option>{tiposFlujo.map((t)=><option key={t.cod_tipo_flujo_comercial} value={t.cod_tipo_flujo_comercial}>{t.nombre_tip}</option>)}</select>
    <select name="cod_usuario_responsable" value={form.data.cod_usuario_responsable ?? ''} onChange={onChange}><option value="">Responsable</option>{usuarios.map((u)=><option key={u.id} value={u.id}>{u.name}</option>)}</select>
    <button type="submit">Guardar</button></form>;
}
