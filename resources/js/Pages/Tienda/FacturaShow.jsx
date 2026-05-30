import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { ArrowLeft, Printer, FileText } from 'lucide-react';

export default function FacturaShow({ factura, pedido, auth }) {
    const handlePrint = () => window.print();

    return (
        <CustomerLayout auth={auth}>
            <Head title={`Factura ${factura.numero_factura_fac}`} />

            <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={pedido?.cod_pedido ? `/tienda/mis-pedidos/${pedido.cod_pedido}` : '/tienda/mis-pedidos'}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all hover:opacity-90"
                    style={{
                        background: 'linear-gradient(135deg, #3C473A, #4e5849)',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    <ArrowLeft size={15} />
                    Volver al pedido
                </Link>
                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all hover:opacity-90"
                    style={{
                        background: 'linear-gradient(135deg, #D77A61, #c56950)',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <Printer size={15} />
                    Imprimir
                </button>
            </div>

            <div
                className="bg-white rounded-3xl overflow-hidden shadow-sm print:shadow-none print:rounded-none"
                style={{ border: '1px solid rgba(0,0,0,0.09)' }}
            >
                <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)' }}>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>AKINOMASS</h1>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Comprobante de venta</p>
                        </div>
                        <div className="text-right">
                            <p style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>{factura.numero_factura_fac}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                                {new Date(factura.fecha_emision_fac).toLocaleDateString('es-BO', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b" style={{ borderColor: '#F3F4F6' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={16} style={{ color: '#D77A61' }} />
                        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>Datos del cliente</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p style={{ fontSize: 12, color: '#6B7280' }}>Nombre / Razón social</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#2B221E' }}>{factura.razon_social_cliente_fac}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 12, color: '#6B7280' }}>Documento</p>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#2B221E' }}>{factura.documento_cliente_fac}</p>
                        </div>
                        {factura.direccion_fiscal_fac && (
                            <div className="sm:col-span-2">
                                <p style={{ fontSize: 12, color: '#6B7280' }}>Dirección</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#2B221E' }}>{factura.direccion_fiscal_fac}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: '#2B221E', marginBottom: 12 }}>Detalle</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ fontSize: 13 }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                                    <th className="text-left py-2" style={{ color: '#6B7280', fontWeight: 600 }}>Descripción</th>
                                    <th className="text-right py-2" style={{ color: '#6B7280', fontWeight: 600 }}>Cant.</th>
                                    <th className="text-right py-2" style={{ color: '#6B7280', fontWeight: 600 }}>P. unit.</th>
                                    <th className="text-right py-2" style={{ color: '#6B7280', fontWeight: 600 }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {factura.detalles.map((detalle, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td className="py-3" style={{ color: '#2B221E' }}>{detalle.descripcion_dfa}</td>
                                        <td className="text-right py-3">{detalle.cantidad_dfa}</td>
                                        <td className="text-right py-3">
                                            {Number(detalle.precio_unitario_dfa).toFixed(2)} {factura.moneda_fac}
                                        </td>
                                        <td className="text-right py-3" style={{ fontWeight: 600 }}>
                                            {Number(detalle.subtotal_dfa).toFixed(2)} {factura.moneda_fac}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between">
                                <span style={{ color: '#6B7280', fontSize: 13 }}>Subtotal</span>
                                <span style={{ fontWeight: 600 }}>
                                    {Number(factura.subtotal_fac).toFixed(2)} {factura.moneda_fac}
                                </span>
                            </div>
                            {Number(factura.descuento_fac) > 0 && (
                                <div className="flex justify-between">
                                    <span style={{ color: '#6B7280', fontSize: 13 }}>Descuento</span>
                                    <span style={{ color: '#DC2626', fontWeight: 600 }}>
                                        -{Number(factura.descuento_fac).toFixed(2)} {factura.moneda_fac}
                                    </span>
                                </div>
                            )}
                            {Number(factura.impuesto_fac) > 0 && (
                                <div className="flex justify-between">
                                    <span style={{ color: '#6B7280', fontSize: 13 }}>Impuesto</span>
                                    <span style={{ fontWeight: 600 }}>
                                        {Number(factura.impuesto_fac).toFixed(2)} {factura.moneda_fac}
                                    </span>
                                </div>
                            )}
                            <div
                                className="flex justify-between pt-3 mt-2"
                                style={{ borderTop: '2px solid #3C473A', fontSize: 18, fontWeight: 800, color: '#D77A61' }}
                            >
                                <span>TOTAL</span>
                                <span>
                                    {Number(factura.total_fac).toFixed(2)} {factura.moneda_fac}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 print:hidden" style={{ background: '#FDF6F0', borderTop: '1px solid #F3F4F6' }}>
                    <p style={{ fontSize: 12, color: '#6B7280' }}>
                        Estado:{' '}
                        <span style={{ fontWeight: 600, color: '#544a45', textTransform: 'capitalize' }}>{factura.estado_fac}</span>
                    </p>
                    {factura.observacion_fac && (
                        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{factura.observacion_fac}</p>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
