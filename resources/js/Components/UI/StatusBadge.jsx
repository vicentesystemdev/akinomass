const styles = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
    warning: 'bg-[#D77A61]/10 text-[#9d4d39] ring-[#D77A61]/25 dark:bg-[#D77A61]/15 dark:text-[#f2b39f] dark:ring-[#D77A61]/30',
    info: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/25',
    danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/25',
    neutral: 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-white/5 dark:text-stone-300 dark:ring-white/10',
};

const statusTone = {
    Activo: 'success',
    Pagado: 'success',
    Confirmado: 'success',
    Entregado: 'success',
    Completado: 'success',
    Positivo: 'success',
    Pendiente: 'warning',
    'En preparacion': 'warning',
    'En preparación': 'warning',
    Observado: 'warning',
    Enviado: 'info',
    'En proceso': 'info',
    Informativo: 'info',
    Cancelado: 'danger',
    Rechazado: 'danger',
    Agotado: 'danger',
    Error: 'danger',
    Critico: 'danger',
    Borrador: 'neutral',
    Inactivo: 'neutral',
};

export default function StatusBadge({ children, tone, className = '' }) {
    const resolvedTone = tone || statusTone[children] || 'neutral';

    return (
        <span
            className={[
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset',
                styles[resolvedTone] || styles.neutral,
                className,
            ].join(' ')}
        >
            {children}
        </span>
    );
}
