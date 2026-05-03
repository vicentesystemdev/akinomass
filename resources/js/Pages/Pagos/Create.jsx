import { useForm } from '@inertiajs/react';

export default function Create({ pedidos, metodosPago }) {
  const { data, setData, post, processing, errors } = useForm({ cod_pedido: '', metodo_pago_pag: '', monto_pag: '', referencia_pag: '', fecha_pago_pag: '', observacion_pag: '' });
  const submit = (e) => { e.preventDefault(); post(route('pagos.store')); };
  return <form className="p-6 space-y-3" onSubmit={submit}><h1 className="text-xl">Registrar pago</h1>
    <select value={data.cod_pedido} onChange={e=>setData('cod_pedido',e.target.value)}>{<option value="">Pedido</option>}{pedidos.map(p=><option key={p.cod_pedido} value={p.cod_pedido}>{p.numero_pedido_ped}</option>)}</select>
    <select value={data.metodo_pago_pag} onChange={e=>setData('metodo_pago_pag',e.target.value)}>{<option value="">Método</option>}{metodosPago.map(m=><option key={m} value={m}>{m}</option>)}</select>
    <input placeholder="Monto" value={data.monto_pag} onChange={e=>setData('monto_pag',e.target.value)} />
    <input placeholder="Referencia" value={data.referencia_pag} onChange={e=>setData('referencia_pag',e.target.value)} />
    <input type="date" value={data.fecha_pago_pag} onChange={e=>setData('fecha_pago_pag',e.target.value)} />
    <textarea placeholder="Observación" value={data.observacion_pag} onChange={e=>setData('observacion_pag',e.target.value)} />
    {Object.values(errors).map((er, i) => <p className="text-red-600" key={i}>{er}</p>)}
    <button disabled={processing}>Guardar</button></form>;
}
