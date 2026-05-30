import React from 'react';
import { Head } from '@inertiajs/react';

export default function FacturaShow({ factura, pedido }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Factura ${factura.numero_factura_fac}`} />

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">AKINOMASS</h1>
                                <p className="text-blue-100 text-sm mt-1">Comprobante de Venta</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold">{factura.numero_factura_fac}</p>
                                <p className="text-blue-100 text-sm">
                                    {new Date(factura.fecha_emision_fac).toLocaleDateString('es-BO')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Datos cliente */}
                    <div className="p-6 border-b">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Datos del Cliente</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Nombre / Razón Social</p>
                                <p className="font-medium">{factura.razon_social_cliente_fac}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Documento</p>
                                <p className="font-medium">{factura.documento_cliente_fac}</p>
                            </div>
                            {factura.direccion_fiscal_fac && (
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Dirección</p>
                                    <p className="font-medium">{factura.direccion_fiscal_fac}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detalle */}
                    <div className="p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Detalle</h2>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 text-sm text-gray-500">Descripción</th>
                                    <th className="text-right py-2 text-sm text-gray-500">Cant.</th>
                                    <th className="text-right py-2 text-sm text-gray-500">P. Unit.</th>
                                    <th className="text-right py-2 text-sm text-gray-500">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {factura.detalles.map((detalle, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-3">{detalle.descripcion_dfa}</td>
                                        <td className="text-right py-3">{detalle.cantidad_dfa}</td>
                                        <td className="text-right py-3">
                                            {Number(detalle.precio_unitario_dfa).toFixed(2)} {factura.moneda_fac}
                                        </td>
                                        <td className="text-right py-3">
                                            {Number(detalle.subtotal_dfa).toFixed(2)} {factura.moneda_fac}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totales */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-64">
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Subtotal:</span>
                                    <span>{Number(factura.subtotal_fac).toFixed(2)} {factura.moneda_fac}</span>
                                </div>
                                {factura.descuento_fac > 0 && (
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Descuento:</span>
                                        <span className="text-red-500">
                                            -{Number(factura.descuento_fac).toFixed(2)} {factura.moneda_fac}
                                        </span>
                                    </div>
                                )}
                                {factura.impuesto_fac > 0 && (
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Impuesto:</span>
                                        <span>{Number(factura.impuesto_fac).toFixed(2)} {factura.moneda_fac}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 border-t-2 border-gray-800 font-bold text-lg">
                                    <span>TOTAL:</span>
                                    <span>{Number(factura.total_fac).toFixed(2)} {factura.moneda_fac}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-6 border-t">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Estado: <span className="font-medium text-gray-700 capitalize">{factura.estado_fac}</span>
                                </p>
                                {factura.observacion_fac && (
                                    <p className="text-sm text-gray-500 mt-1">{factura.observacion_fac}</p>
                                )}
                            </div>
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg print:hidden"
                            >
                                Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
