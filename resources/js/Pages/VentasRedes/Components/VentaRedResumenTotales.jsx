import { formatBOB } from './VentaRedHelpers';

export default function VentaRedResumenTotales({ subtotal, descuento, total, onDescuentoChange, editable = false }) {
    return (
        <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3 rounded-xl bg-gray-50 p-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-cafe-700">{formatBOB(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-500">Descuento</span>
                    {editable ? (
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={descuento ?? 0}
                            onChange={(event) => onDescuentoChange?.(event.target.value)}
                            className="w-32 rounded-lg border-gray-300 px-2 py-1.5 text-right text-sm focus:border-terracota-500 focus:ring-terracota-500"
                        />
                    ) : (
                        <span className="font-medium text-cafe-700">{formatBOB(descuento)}</span>
                    )}
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="font-semibold text-cafe-900">Total</span>
                    <span className="text-lg font-bold text-terracota-600">{formatBOB(total)}</span>
                </div>
            </div>
        </div>
    );
}
