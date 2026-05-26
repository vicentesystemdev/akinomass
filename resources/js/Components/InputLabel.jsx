export default function InputLabel({
    value,
    className = '',
    children,
    required = false,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-bold text-akin-text ` +
                className
            }
        >
            {value ? value : children}
            {required && <span className="ml-1 text-akin-danger">*</span>}
        </label>
    );
}
