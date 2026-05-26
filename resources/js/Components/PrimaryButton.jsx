export default function PrimaryButton({
    type = 'submit',
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
                `akin-btn-primary px-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-akin-accent/25 disabled:pointer-events-none disabled:opacity-55 ${
                    disabled ? 'opacity-55' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
