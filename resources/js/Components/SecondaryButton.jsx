export default function SecondaryButton({
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
                `akin-btn-secondary px-4 py-2 text-xs uppercase tracking-widest shadow-sm focus:outline-none focus:ring-4 focus:ring-akin-accent/20 disabled:pointer-events-none disabled:opacity-55 ${
                    disabled ? 'opacity-55' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
