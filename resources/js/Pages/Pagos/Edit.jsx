import { useForm } from '@inertiajs/react';

export default function Edit({ pago, metodosPago }) {
  const { data, setData, put, processing, errors } = useForm({ metodo_pago_pag: pago.metodo_pago_pag, monto_pag: pago.monto_pag, referencia_pag: pago.referencia_pag ?? '', fecha_pago_pag: pago.fecha_pago_pag?.slice(0,10) ?? '', observacion_pag: pago.observacion_pag ?? '' });
  const submit = (e) => { e.preventDefault(); put(route('pagos.update', pago.cod_pago)); };
  return <form className="p-6 space-y-3" onSubmit={submit}><h1 className="text-xl">Editar pago #{pago.cod_pago}</h1>
    <select value={data.metodo_pago_pag} onChange={e=>setData('metodo_pago_pag',e.target.value)}>{metodosPago.map(m=><option key={m} value={m}>{m}</option>)}</select>
    <input value={data.monto_pag} onChange={e=>setData('monto_pag',e.target.value)} />
    <input value={data.referencia_pag} onChange={e=>setData('referencia_pag',e.target.value)} />
    <input type="date" value={data.fecha_pago_pag} onChange={e=>setData('fecha_pago_pag',e.target.value)} />
    <textarea value={data.observacion_pag} onChange={e=>setData('observacion_pag',e.target.value)} />
    {Object.values(errors).map((er, i) => <p className="text-red-600" key={i}>{er}</p>)}
    <button disabled={processing}>Actualizar</button></form>;
}
