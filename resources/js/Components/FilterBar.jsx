import SelectInput from './SelectInput';

export default function FilterBar({ filters = [], onFilterChange, className = '' }) {
    if (filters.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-4 items-end ${className}`}>
            {filters.map((filter, idx) => (
                <div key={idx} className={filter.className || 'w-48'}>
                    <SelectInput
                        label={filter.label}
                        value={filter.value || ''}
                        onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    >
                        <option value="">{filter.placeholder || 'Todos'}</option>
                        {filter.options?.map((opt, i) => (
                            <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                    </SelectInput>
                </div>
            ))}
        </div>
    );
}