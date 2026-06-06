const accionBadges = {
    insert: 'bg-estado-exito/10 text-estado-exito border-estado-exito/20',
    update: 'bg-estado-info/10 text-estado-info border-estado-info/20',
    delete: 'bg-estado-error/10 text-estado-error border-estado-error/20',
    login: 'bg-oliva-100 text-oliva-700 border-oliva-200',
    logout: 'bg-gray-100 text-gray-600 border-gray-200',
    cancelacion: 'bg-amber-100 text-amber-700 border-amber-200',
    anulacion: 'bg-estado-error/10 text-estado-error border-estado-error/20',
    cambio_estado: 'bg-terracota-100 text-terracota-700 border-terracota-200',
};

const accionLabels = {
    insert: 'Creación',
    update: 'Modificación',
    delete: 'Eliminación',
    login: 'Inicio sesión',
    logout: 'Cierre sesión',
    cancelacion: 'Cancelación',
    anulacion: 'Anulación',
    cambio_estado: 'Cambio estado',
};

export { accionBadges, accionLabels };
