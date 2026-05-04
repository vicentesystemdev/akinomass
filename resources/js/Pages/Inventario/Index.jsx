import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ inventarios, stockBajo }) {
    return (
        <AuthenticatedLayout header="Inventarios">
            <Head title="Inventario" />
            <div className="p-6">
                <h1 className="text-xl font-bold">Inventarios</h1>
                <div className="my-3 flex gap-2">
                    <Link href={route('inventario.entrada.form')}>Entrada</Link>
                    <Link href={route('inventario.salida.form')}>Salida</Link>
                    <Link href={route('inventario.ajuste.form')}>Ajuste</Link>
                    <Link href={route('inventario.movimientos')}>Movimientos</Link>
                </div>
                <p>Stock bajo: {stockBajo.length}</p>
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Mínimo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventarios.map((inv) => (
                            <tr key={inv.cod_inventario}>
                                <td>{inv.producto?.nombre_pro}</td>
                                <td>{inv.stock_actual_inv}</td>
                                <td>{inv.stock_minimo_inv}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}

