export function formatBOB(value) {
    if (value === null || value === undefined) return 'Bs 0.00';
    const num = parseFloat(value);
    if (Number.isNaN(num)) return 'Bs 0.00';
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCompactBOB(value) {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return 'Bs 0';
    if (num >= 1000000) return `Bs ${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `Bs ${(num / 1000).toFixed(1)}k`;
    return `Bs ${num.toFixed(0)}`;
}

export function formatNumber(value) {
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return '0';
    return num.toLocaleString('es-BO');
}

export function formatPercent(value, decimals = 1) {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return '0%';
    return `${num.toFixed(decimals)}%`;
}

export function formatDateBO(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function formatDateTimeBO(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-BO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}
