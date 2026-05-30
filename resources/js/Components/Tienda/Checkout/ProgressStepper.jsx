import { ShoppingCart, FileText, CreditCard, CheckCircle, Check } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Carrito', sublabel: 'Revisión', icon: ShoppingCart },
    { id: 2, label: 'Datos', sublabel: 'Facturación', icon: FileText },
    { id: 3, label: 'Pago', sublabel: 'Método', icon: CreditCard },
    { id: 4, label: 'Confirmado', sublabel: '¡Listo!', icon: CheckCircle },
];

export default function ProgressStepper({ current }) {
    return (
        <div className="w-full px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between relative">
                    <div
                        className="absolute top-5 left-0 right-0 h-0.5 mx-8"
                        style={{ background: '#E5E7EB', zIndex: 0 }}
                    />
                    <div
                        className="absolute top-5 left-0 h-0.5 mx-8 transition-all duration-500"
                        style={{
                            background: 'linear-gradient(90deg, #3C473A, #D77A61)',
                            zIndex: 1,
                            right: `${100 - ((current - 1) / 3) * 100}%`,
                        }}
                    />

                    {STEPS.map((step) => {
                        const isCompleted = step.id < current;
                        const isActive = step.id === current;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center relative z-10 gap-2">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                    style={{
                                        background: isCompleted
                                            ? 'linear-gradient(135deg, #059669, #10B981)'
                                            : isActive
                                            ? 'linear-gradient(135deg, #3C473A, #4e5849)'
                                            : 'white',
                                        border: isCompleted || isActive ? 'none' : '2px solid #E5E7EB',
                                        boxShadow: isActive ? '0 0 0 4px rgba(60,71,58,0.15)' : 'none',
                                    }}
                                >
                                    {isCompleted ? (
                                        <Check size={16} color="white" strokeWidth={3} />
                                    ) : (
                                        <Icon size={16} style={{ color: isActive ? 'white' : '#9CA3AF' }} />
                                    )}
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#3C473A' : isCompleted ? '#059669' : '#9CA3AF' }}>
                                        {step.label}
                                    </p>
                                    <p style={{ fontSize: 10, color: '#C4C4CC' }}>{step.sublabel}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center mt-4 sm:hidden" style={{ fontSize: 13, fontWeight: 600, color: '#3C473A' }}>
                    Paso {current} de 4: {STEPS[current - 1].label}
                </p>
            </div>
        </div>
    );
}
