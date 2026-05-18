export default function StatusBadge({ 
    status, 
    label = '', 
    size = 'md',
    className = '' 
}) {
    const statusConfig = {
        // Estados generales
        activo: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Activo' },
        inactivo: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Inactivo' },
        borrador: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Borrador' },
        
        // Estados de procesamiento
        pendiente: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Pendiente' },
        en_proceso: { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: 'bg-cyan-500', label: 'En proceso' },
        en_preparacion: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'En preparación' },
        observado: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Observado' },
        
        // Estados de éxito
        confirmado: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Confirmado' },
        pagado: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Pagado' },
        entregado: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Entregado' },
        completado: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Completado' },
        convertido: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Convertido' },
        
        // Estados de envío
        enviado: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Enviado' },
        
        // Estados de error/cancelación
        cancelado: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Cancelado' },
        rechazado: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Rechazado' },
        agotado: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Agotado' },
        error: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Error' },
        perdido: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Perdido' },
        descartado: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Descartado' },
        devuelto: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Devuelto' },
        reembolsado: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Reembolsado' },
        descontinuado: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Descontinuado' },
        
        // Estados de leads
        nuevo: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Nuevo' },
        contactado: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Contactado' },
        interesado: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Interesado' },
        pendiente_pago: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Pendiente pago' },
        
        // Estados de LiveSales
        programada: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Programada' },
        en_vivo: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'En vivo' },
        finalizada: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Finalizada' },
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    const config = statusConfig[status] || statusConfig.borrador;
    const displayLabel = label || config.label;

    return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200 ${config.bg} ${config.text} ${sizes[size]} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {displayLabel}
        </span>
    );
}
