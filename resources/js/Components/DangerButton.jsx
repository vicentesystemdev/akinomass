export default function DangerButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-akin-danger px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-akin-danger/25 active:translate-y-0 disabled:pointer-events-none disabled:opacity-55 dark:text-akin-bg ${
                    disabled ? 'opacity-55' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
