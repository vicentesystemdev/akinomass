export default function TableWrapper({ 
    children, 
    className = '',
    compact = false 
}) {
    return (
        <div className={`bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {children}
                </table>
            </div>
        </div>
    );
}

TableWrapper.Header = function TableHeader({ children, className = '' }) {
    return (
        <thead className={`bg-oliva-50 ${className}`}>
            <tr>
                {children}
            </tr>
        </thead>
    );
};

TableWrapper.HeaderCell = function TableHeaderCell({ children, className = '', align = 'left' }) {
    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    return (
        <th className={`px-6 py-3 text-xs font-semibold text-oliva-800 uppercase tracking-wider ${alignClasses[align]} ${className}`}>
            {children}
        </th>
    );
};

TableWrapper.Body = function TableBody({ children, className = '' }) {
    return (
        <tbody className={`divide-y divide-gray-100 ${className}`}>
            {children}
        </tbody>
    );
};

TableWrapper.Row = function TableRow({ children, className = '', hover = true }) {
    return (
        <tr className={`transition-colors duration-150 ${hover ? 'hover:bg-crema-100' : ''} ${className}`}>
            {children}
        </tr>
    );
};

TableWrapper.Cell = function TableCell({ children, className = '', align = 'left' }) {
    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    return (
        <td className={`px-6 py-4 text-sm text-cafe-700 whitespace-nowrap ${alignClasses[align]} ${className}`}>
            {children}
        </td>
    );
};

TableWrapper.EmptyRow = function TableEmptyRow({ colSpan, message = 'No hay registros para mostrar' }) {
    return (
        <TableWrapper.Row hover={false}>
            <td colSpan={colSpan} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
            </td>
        </TableWrapper.Row>
    );
};
