export const toUpper = (value) => (value || '').toUpperCase();

export const filterLetters = (value) =>
    (value || '').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').toUpperCase();

export const filterPhone = (value) =>
    (value || '').replace(/[^\d+\-()\s]/g, '');

export const filterNumeric = (value) => {
    const filtered = (value || '').replace(/[^\d.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
    return filtered;
};

export const filterInteger = (value) =>
    (value || '').replace(/[^\d]/g, '');

export const filterLower = (value) =>
    (value || '').toLowerCase();
