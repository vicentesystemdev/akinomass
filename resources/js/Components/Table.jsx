import { useState, useMemo } from 'react';
import SearchInput from './SearchInput';
import Badge from './Badge';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function Table({
    columns,
    data = [],
    searchPlaceholder = 'Buscar...',
    searchable = true,
    searchKeys = [],
    loading = false,
    onRowClick = null,
    emptyMessage = 'No hay datos para mostrar',
    pagination = true,
    pageSize = 10,
}) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(pageSize);

    const filteredData = useMemo(() => {
        if (!search || searchKeys.length === 0) return data;

        const lowerSearch = search.toLowerCase();
        return data.filter(item =>
            searchKeys.some(key => {
                const value = key.split('.').reduce((obj, k) => obj?.[k], item);
                return value?.toString().toLowerCase().includes(lowerSearch);
            })
        );
    }, [data, search, searchKeys]);

    const totalPages = Math.ceil(filteredData.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = pagination
        ? filteredData.slice(startIndex, startIndex + perPage)
        : filteredData;

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {searchable && (
                <div className="flex justify-between items-center gap-4">
                    <div className="w-full max-w-md">
                        <SearchInput
                            value={search}
                            onChange={handleSearch}
                            placeholder={searchPlaceholder}
                        />
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ width: col.width }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIdx) => (
                                <tr
                                    key={rowIdx}
                                    className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-12">
                                    <EmptyState message={emptyMessage} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && filteredData.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + perPage, filteredData.length)} de {filteredData.length} resultados
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={perPage}
                            onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}