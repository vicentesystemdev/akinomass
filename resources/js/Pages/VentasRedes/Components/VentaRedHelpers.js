export const estadoLabels = {
    borrador: 'Borrador',
    pendiente_confirmacion: 'Pendiente confirmacion',
    confirmada: 'Confirmada',
    convertida_checkout: 'Convertida checkout',
    convertida_pedido: 'Convertida pedido',
    cancelada: 'Cancelada',
};

export const tipoInteraccionLabels = {
    mensaje_privado: 'Mensaje privado',
    comentario: 'Comentario',
    publicacion: 'Publicacion',
    historia: 'Historia',
    whatsapp: 'WhatsApp',
    marketplace: 'Marketplace',
    presencial: 'Presencial',
    otro: 'Otro',
};

export const formatBOB = (value) => {
    const num = parseFloat(value) || 0;
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const contactoNombre = (venta) => {
    if (venta?.cliente) return venta.cliente.nombre_cli;
    if (venta?.lead) return venta.lead.nombre_lea;
    return 'Sin contacto';
};

export const productoPrecio = (producto, varianteId = null) => {
    const variante = producto?.variantes?.find((v) => String(v.cod_variante_producto) === String(varianteId));
    return parseFloat(variante?.precio_venta_variante ?? producto?.precio_venta_pro ?? 0);
};
