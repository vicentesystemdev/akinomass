import { useEffect } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function Modal({ show, onClose, title, children, footer = null, size = 'md' }) {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizes[size]} w-full`}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        {title && (
                            <div className="mb-4 pb-3 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            </div>
                        )}
                        <div className="mt-2">
                            {children}
                        </div>
                    </div>

                    {footer && (
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end gap-2">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ConfirmModal({ show, onClose, onConfirm, title = 'Confirmar', message = '¿Estás seguro?', confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger' }) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <SecondaryButton onClick={onClose}>{cancelText}</SecondaryButton>
                    <PrimaryButton
                        className={variant === 'danger' ? '!bg-danger hover:!bg-red-600' : ''}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </PrimaryButton>
                </>
            }
        >
            <p className="text-gray-600">{message}</p>
        </Modal>
    );
}