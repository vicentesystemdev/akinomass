export default function SectionCard({ title, description, action, children, className = '' }) {
    return (
        <section
            className={[
                'rounded-2xl border border-[#EADFD6] bg-white/90 shadow-sm shadow-[#3C473A]/5 dark:border-white/10 dark:bg-[#211E1A]/90 dark:shadow-black/20',
                className,
            ].join(' ')}
        >
            {(title || description || action) && (
                <div className="flex flex-col gap-3 border-b border-[#EADFD6]/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                    <div>
                        {title && (
                            <h2 className="text-lg font-black text-[#2B221E] dark:text-[#FDF6F0]">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-1 text-sm leading-5 text-[#2B221E]/60 dark:text-[#FDF6F0]/55">
                                {description}
                            </p>
                        )}
                    </div>
                    {action}
                </div>
            )}

            {children}
        </section>
    );
}
