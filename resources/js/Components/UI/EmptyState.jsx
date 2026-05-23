export default function EmptyState({ title = 'Sin datos', description = 'Todavia no hay registros para mostrar.' }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-akin-surface-soft text-xl font-black text-akin-accent dark:bg-white/5">
                AK
            </div>
            <h3 className="mt-4 text-base font-black text-akin-text">{title}</h3>
            <p className="akin-muted mt-2 max-w-sm text-sm leading-6">{description}</p>
        </div>
    );
}
