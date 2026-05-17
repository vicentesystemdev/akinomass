import { forwardRef } from 'react';

const SelectInput = forwardRef(function SelectInput({
    label,
    error,
    className = '',
    children,
    ...props
}, ref) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={`
                    block w-full rounded-lg border-gray-300 shadow-sm
                    focus:border-primary-500 focus:ring-primary-500
                    ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}
                    py-2.5 px-3 text-sm
                `}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p className="mt-1 text-sm text-danger">{error}</p>
            )}
        </div>
    );
});

export default SelectInput;