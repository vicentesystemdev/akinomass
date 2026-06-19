import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { ArrowLeft, Printer } from 'lucide-react';

const EMPRESA = {
    nombre: 'AKINOMASS',
    nit: 'NIT: 123456789',
    direccion: 'Av. Principal #1234, Zona Sur, La Paz, Bolivia',
    telefono: 'Tel: +591 700012345',
    email: 'ventas@akinomass.com',
};

const METODO_PAGO_LABELS = {
    qr: 'Código QR',
    transferencia: 'Transferencia bancaria',
    efectivo: 'Efectivo',
    deposito: 'Depósito bancario',
    otro: 'Otro medio de pago',
};

function formatFecha(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatNumber(val) {
    return Number(val || 0).toFixed(2);
}

export default function FacturaShow({ factura, pedido, auth }) {
    const handlePrint = () => window.print();
    const esAnulada = factura.estado_fac === 'anulada';
    const esBorrador = factura.estado_fac === 'borrador';
    const pago = factura.pago || null;
    const metodoPago = pago?.metodo_pago_pag || null;
    const referenciaPago = pago?.referencia_pag || null;

    return (
        <CustomerLayout auth={auth}>
            <Head title={`Factura ${factura.numero_factura_fac}`} />

            {/* Barra de acciones — se oculta al imprimir */}
            <div className="print-hidden mb-6 flex flex-wrap items-center justify-between gap-3">
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
                    Imprimir factura
                </button>
            </div>

            {/* ========== DOCUMENTO DE FACTURA ========== */}
            <div className="factura-print-area" style={{ position: 'relative' }}>

                {/* Watermark de anulada */}
                {esAnulada && (
                    <div
                        className="factura-anulada-watermark"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-35deg)',
                            fontSize: 72,
                            fontWeight: 900,
                            color: 'rgba(220, 38, 38, 0.12)',
                            letterSpacing: 12,
                            textTransform: 'uppercase',
                            pointerEvents: 'none',
                            zIndex: 10,
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                        }}
                    >
                        ANULADA
                    </div>
                )}

                <div
                    style={{
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        overflow: 'hidden',
                    }}
                >
                    {/* ── Línea decorativa superior ── */}
                    <div
                        className="factura-header"
                        style={{
                            height: 5,
                            background: 'linear-gradient(90deg, #3C473A 0%, #4e5849 40%, #D77A61 100%)',
                        }}
                    />

                    {/* ── Encabezado: Empresa + Factura ── */}
                    <div className="factura-header" style={{ padding: '20px 28px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                            {/* Datos de la empresa */}
                            <div>
                                <h1
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 900,
                                        color: '#3C473A',
                                        letterSpacing: 1,
                                        margin: 0,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {EMPRESA.nombre}
                                </h1>
                                <p style={{ fontSize: 11, color: '#6B7280', margin: '4px 0 0' }}>{EMPRESA.nit}</p>
                                <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>{EMPRESA.direccion}</p>
                                <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>{EMPRESA.telefono}</p>
                                <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>{EMPRESA.email}</p>
                            </div>

                            {/* Datos de la factura */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '4px 14px',
                                        background: esAnulada ? '#FEE2E2' : esBorrador ? '#FEF3C7' : '#3C473A',
                                        color: esAnulada ? '#991B1B' : esBorrador ? '#92400E' : 'white',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        borderRadius: 4,
                                        letterSpacing: 1,
                                        textTransform: 'uppercase',
                                        marginBottom: 8,
                                    }}
                                >
                                    {factura.tipo_comprobante_fac === 'nota_credito' ? 'Nota de Crédito' : 'Comprobante de Venta'}
                                </div>
                                <p style={{ fontSize: 20, fontWeight: 800, color: '#2B221E', margin: '4px 0 0' }}>
                                    {factura.numero_factura_fac}
                                </p>
                                <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
                                    {formatFecha(factura.fecha_emision_fac)}
                                </p>
                                {pedido?.numero_pedido_ped && (
                                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>
                                        Pedido: #{pedido.numero_pedido_ped}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Línea separadora ── */}
                    <div style={{ height: 1, background: '#F3F4F6', margin: '0 28px' }} />

                    {/* ── Datos del cliente ── */}
                    <div className="factura-cliente" style={{ padding: '16px 28px' }}>
                        <p
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: '#D77A61',
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                margin: '0 0 10px',
                            }}
                        >
                            Datos del cliente
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                            <div>
                                <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Nombre / Razón social
                                </p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E', margin: '2px 0 0' }}>
                                    {factura.razon_social_cliente_fac || '—'}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Documento (CI/NIT)
                                </p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E', margin: '2px 0 0' }}>
                                    {factura.documento_cliente_fac || '—'}
                                </p>
                            </div>
                            {factura.direccion_fiscal_fac && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Dirección
                                    </p>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E', margin: '2px 0 0' }}>
                                        {factura.direccion_fiscal_fac}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    N° Pedido referenciado
                                </p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E', margin: '2px 0 0' }}>
                                    #{pedido?.cod_pedido || '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Línea separadora ── */}
                    <div style={{ height: 1, background: '#F3F4F6', margin: '0 28px' }} />

                    {/* ── Tabla de detalle ── */}
                    <div className="factura-detalle" style={{ padding: '16px 28px' }}>
                        <p
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: '#D77A61',
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                margin: '0 0 10px',
                            }}
                        >
                            Detalle de productos
                        </p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '8px 6px',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#6B7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            borderBottom: '2px solid #E5E7EB',
                                        }}
                                    >
                                        Descripción
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'center',
                                            padding: '8px 6px',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#6B7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            borderBottom: '2px solid #E5E7EB',
                                            width: 50,
                                        }}
                                    >
                                        Cant.
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'right',
                                            padding: '8px 6px',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#6B7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            borderBottom: '2px solid #E5E7EB',
                                            width: 90,
                                        }}
                                    >
                                        P. Unitario
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'right',
                                            padding: '8px 6px',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#6B7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            borderBottom: '2px solid #E5E7EB',
                                            width: 90,
                                        }}
                                    >
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {factura.detalles.map((detalle, index) => (
                                    <tr key={index}>
                                        <td
                                            style={{
                                                padding: '8px 6px',
                                                color: '#2B221E',
                                                borderBottom: '1px solid #F3F4F6',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {detalle.descripcion_dfa}
                                        </td>
                                        <td
                                            style={{
                                                padding: '8px 6px',
                                                textAlign: 'center',
                                                color: '#4B5563',
                                                borderBottom: '1px solid #F3F4F6',
                                            }}
                                        >
                                            {detalle.cantidad_dfa}
                                        </td>
                                        <td
                                            style={{
                                                padding: '8px 6px',
                                                textAlign: 'right',
                                                color: '#4B5563',
                                                borderBottom: '1px solid #F3F4F6',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            {formatNumber(detalle.precio_unitario_dfa)} {factura.moneda_fac}
                                        </td>
                                        <td
                                            style={{
                                                padding: '8px 6px',
                                                textAlign: 'right',
                                                color: '#2B221E',
                                                fontWeight: 600,
                                                borderBottom: '1px solid #F3F4F6',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            {formatNumber(detalle.subtotal_dfa)} {factura.moneda_fac}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Totales + Método de pago ── */}
                    <div
                        className="factura-totales"
                        style={{
                            padding: '16px 28px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 24,
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* Método de pago — lado izquierdo */}
                        <div style={{ minWidth: 200 }}>
                            {metodoPago && (
                                <>
                                    <p
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#D77A61',
                                            letterSpacing: 1.5,
                                            textTransform: 'uppercase',
                                            margin: '0 0 8px',
                                        }}
                                    >
                                        Método de pago
                                    </p>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            padding: '5px 12px',
                                            background: '#F0FDF4',
                                            border: '1px solid #BBF7D0',
                                            borderRadius: 6,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: '#166534',
                                        }}
                                    >
                                        {METODO_PAGO_LABELS[metodoPago] || metodoPago}
                                    </div>
                                    {referenciaPago && (
                                        <p style={{ fontSize: 11, color: '#6B7280', margin: '6px 0 0' }}>
                                            Ref: <span style={{ fontWeight: 600, color: '#4B5563' }}>{referenciaPago}</span>
                                        </p>
                                    )}
                                </>
                            )}
                            {!metodoPago && (
                                <>
                                    <p
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#D77A61',
                                            letterSpacing: 1.5,
                                            textTransform: 'uppercase',
                                            margin: '0 0 8px',
                                        }}
                                    >
                                        Método de pago
                                    </p>
                                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>No registrado</p>
                                </>
                            )}
                        </div>

                        {/* Totales — lado derecho */}
                        <div style={{ minWidth: 220, maxWidth: 280 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: '#6B7280' }}>Subtotal</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#2B221E', fontVariantNumeric: 'tabular-nums' }}>
                                    {formatNumber(factura.subtotal_fac)} {factura.moneda_fac}
                                </span>
                            </div>
                            {Number(factura.descuento_fac) > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: '#6B7280' }}>Descuento</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#DC2626', fontVariantNumeric: 'tabular-nums' }}>
                                        -{formatNumber(factura.descuento_fac)} {factura.moneda_fac}
                                    </span>
                                </div>
                            )}
                            {Number(factura.impuesto_fac) > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: '#6B7280' }}>Impuesto</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#2B221E', fontVariantNumeric: 'tabular-nums' }}>
                                        {formatNumber(factura.impuesto_fac)} {factura.moneda_fac}
                                    </span>
                                </div>
                            )}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: 8,
                                    marginTop: 4,
                                    borderTop: '2px solid #3C473A',
                                }}
                            >
                                <span style={{ fontSize: 15, fontWeight: 800, color: '#3C473A' }}>TOTAL</span>
                                <span style={{ fontSize: 15, fontWeight: 800, color: '#D77A61', fontVariantNumeric: 'tabular-nums' }}>
                                    {formatNumber(factura.total_fac)} {factura.moneda_fac}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Observaciones (si existen) ── */}
                    {factura.observacion_fac && (
                        <>
                            <div style={{ height: 1, background: '#F3F4F6', margin: '0 28px' }} />
                            <div style={{ padding: '12px 28px' }}>
                                <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Observaciones
                                </p>
                                <p style={{ fontSize: 12, color: '#4B5563', margin: '4px 0 0' }}>
                                    {factura.observacion_fac}
                                </p>
                            </div>
                        </>
                    )}

                    {/* ── Línea separadora ── */}
                    <div style={{ height: 1, background: '#F3F4F6', margin: '0 28px' }} />

                    {/* ── Términos y condiciones ── */}
                    <div className="factura-footer" style={{ padding: '14px 28px 18px' }}>
                        <p
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: '#D77A61',
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                margin: '0 0 6px',
                            }}
                        >
                            Términos y condiciones
                        </p>
                        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 10, color: '#9CA3AF', lineHeight: 1.7 }}>
                            <li>Este documento no es válido como factura fiscal. Sirve como comprobante de venta interno.</li>
                            <li>
                                Para solicitudes de cambio o devolución, presentar este comprobante dentro de las 48 horas
                                posteriores a la entrega del producto.
                            </li>
                            <li>Los productos se entregan bajo las condiciones y políticas de la tienda AKINOMASS.</li>
                            <li>
                                Cualquier reclamo debe incluir este comprobante y el número de pedido referenciado.
                            </li>
                        </ul>
                    </div>

                    {/* ── Línea decorativa inferior ── */}
                    <div
                        className="factura-header"
                        style={{
                            height: 4,
                            background: 'linear-gradient(90deg, #D77A61 0%, #4e5849 60%, #3C473A 100%)',
                        }}
                    />

                    {/* ── Pie de página ── */}
                    <div
                        className="factura-footer"
                        style={{
                            padding: '10px 28px',
                            textAlign: 'center',
                            background: '#FDF6F0',
                        }}
                    >
                        <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0 }}>
                            Gracias por su compra — <strong style={{ color: '#6B7280' }}>AKINOMASS</strong> · {EMPRESA.telefono}
                        </p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
