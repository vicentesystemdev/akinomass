export default function EmptyState({ title = 'Sin datos', description = 'Todavia no hay registros para mostrar.' }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF6F0] text-xl font-black text-[#D77A61] dark:bg-white/5 dark:text-[#F2B39F]">
                AK
            </div>
            <h3 className="mt-4 text-base font-black text-[#2B221E] dark:text-[#FDF6F0]">{title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#2B221E]/60 dark:text-[#FDF6F0]/55">{description}</p>
        </div>
    );
}
