export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'akin-fade-in text-sm font-semibold text-akin-danger ' + className}
        >
            {message}
        </p>
    ) : null;
}
