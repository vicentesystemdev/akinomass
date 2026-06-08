export const valueOf = (value) => {
    if (value && typeof value === 'object' && 'value' in value) return value.value;
    return value ?? '';
};

export const labelOf = (value, labels = {}) => {
    const raw = valueOf(value);
    return labels[raw] ?? String(raw || '-').replaceAll('_', ' ');
};

export const formatBOB = (value) => {
    const number = Number.parseFloat(value);
    if (Number.isNaN(number)) return 'Bs 0';

    return `Bs ${number.toLocaleString('es-BO', {
        maximumFractionDigits: 0,
    })}`;
};

export const formatNumber = (value) => {
    const number = Number.parseInt(value, 10);
    if (Number.isNaN(number)) return '0';

    return number.toLocaleString('es-BO');
};

export const formatDecimal = (value, decimals = 2) => {
    const number = Number.parseFloat(value);
    if (Number.isNaN(number)) return '0';

    return number.toFixed(decimals);
};

export const formatPercent = (value, decimals = 1) => {
    const number = Number.parseFloat(value);
    if (Number.isNaN(number)) return '0%';

    return `${number.toFixed(decimals)}%`;
};

export const formatSignedPercent = (value, decimals = 1) => {
    const number = Number.parseFloat(value);
    if (Number.isNaN(number)) return '0%';

    return `${number > 0 ? '+' : ''}${number.toFixed(decimals)}%`;
};

export const formatDate = (value) => {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const demandaLabels = {
    baja: 'Demanda baja',
    media: 'Demanda media',
    alta: 'Demanda alta',
};

export const riesgoLabels = {
    alto: 'Riesgo alto',
    medio: 'Riesgo medio',
    bajo: 'Riesgo bajo',
    sin_riesgo: 'Sin riesgo',
};

export const recomendacionLabels = {
    alta: 'Alta prioridad',
    media: 'Prioridad media',
    baja: 'Baja prioridad',
    no_abastecer: 'No abastecer',
};

export const confianzaLabels = {
    alta: 'Confianza alta',
    media: 'Confianza media',
    baja: 'Confianza baja',
};

export const periodoLabels = {
    semanal: 'Semanal',
    mensual: 'Mensual',
    trimestral: 'Trimestral',
};

export const productoNombre = (item) => item?.producto?.nombre_pro ?? item?.codigo_prediccion ?? '-';
export const categoriaNombre = (item) => item?.categoria?.nombre_cat ?? '-';
export const canalNombre = (item) => item?.canal_venta?.nombre_can ?? item?.canalVenta?.nombre_can ?? item?.canal_dominante ?? '-';
export const varianteNombre = (item) => item?.variante?.nombre_variante ?? item?.variante?.talla?.nombre_tal ?? item?.talla?.nombre_tal ?? '-';
