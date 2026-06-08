import { confianzaLabels, labelOf, recomendacionLabels, riesgoLabels, valueOf } from './formatters';

const styles = {
    alta: 'bg-red-50 text-red-700 border-red-100',
    alto: 'bg-red-50 text-red-700 border-red-100',
    media: 'bg-amber-50 text-amber-700 border-amber-100',
    medio: 'bg-amber-50 text-amber-700 border-amber-100',
    baja: 'bg-green-50 text-green-700 border-green-100',
    bajo: 'bg-green-50 text-green-700 border-green-100',
    sin_riesgo: 'bg-gray-50 text-gray-700 border-gray-100',
    no_abastecer: 'bg-gray-50 text-gray-700 border-gray-100',
};

function Badge({ value, labels }) {
    const raw = valueOf(value);

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[raw] ?? 'bg-oliva-50 text-oliva-700 border-oliva-100'}`}>
            {labelOf(raw, labels)}
        </span>
    );
}

export const RiesgoBadge = ({ value }) => <Badge value={value} labels={riesgoLabels} />;
export const RecomendacionBadge = ({ value }) => <Badge value={value} labels={recomendacionLabels} />;
export const ConfidenceBadge = ({ value }) => <Badge value={value} labels={confianzaLabels} />;
