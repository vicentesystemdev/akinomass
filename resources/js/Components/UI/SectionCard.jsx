export default function SectionCard({ title, description, action, children, className = '' }) {
    return (
        <section
            className={[
                'akin-card shadow-sm dark:shadow-black/20',
                className,
            ].join(' ')}
        >
            {(title || description || action) && (
                <div className="akin-divider flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {title && (
                            <h2 className="akin-section-title text-lg font-black">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="akin-muted mt-1 text-sm leading-5">
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
