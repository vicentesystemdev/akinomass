export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-akin-border bg-akin-surface text-akin-accent shadow-sm transition focus:ring-akin-accent disabled:cursor-not-allowed disabled:opacity-60 ' +
                className
            }
        />
    );
}
