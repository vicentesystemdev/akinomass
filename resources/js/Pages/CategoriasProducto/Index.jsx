import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Package, Database, Search, AlertTriangle } from 'lucide-react';

export default function Index({ categorias = { data: [] }, filters = {}, tieneDuplicados = false, tallas = [] }) {
    const [search, setSearch] = useState(filters.q || '');
    const [activoCat, setActivoCat] = useState(filters.activo_cat !== undefined ? filters.activo_cat : '');
    const [codTalla, setCodTalla] = useState(filters.cod_talla_producto || '');

    const categoriasData = categorias.data || [];

    const applyFilters = (newParams = {}) => {
        const params = {
            q: search,
            activo_cat: activoCat,
            cod_talla_producto: codTalla,
            ...newParams,
        };

        // clean empty params
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get(route('categorias-producto.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setActivoCat('');
        setCodTalla('');
        router.get(route('categorias-producto.index'));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Categorías de Producto"
                    subtitle="Organiza tus productos por categorías"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Categorías' },
                    ]}
                    actions={
                        <Link href={route('categorias-producto.create')}>
                            <PrimaryActionButton
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Nueva Categoría
                            </PrimaryActionButton>
                        </Link>
                    }
                />
            }
        >
            <Head title="Categorías de Producto" />

            <div className="space-y-6">
                {/* Alerta de duplicados */}
                {tieneDuplicados && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-start gap-3 shadow-sm transition-all duration-200">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-sm">Advertencia administrativa</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Se detectaron nombres de categorías duplicados en el sistema (ej: BLUSAS). Por favor, revise y regularice estas categorías para evitar inconsistencias en el catálogo comercial.
                            </p>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <SectionCard>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-medium text-cafe-600 mb-1">Buscar por Nombre</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') applyFilters();
                                    }}
                                    placeholder="Buscar por nombre..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-300 text-sm focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-xs font-medium text-cafe-600 mb-1">Estado</label>
                            <select
                                value={activoCat}
                                onChange={(e) => {
                                    setActivoCat(e.target.value);
                                    applyFilters({ activo_cat: e.target.value });
                                }}
                                className="w-full rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200"
                            >
                                <option value="">Todos</option>
                                <option value="1">Activa</option>
                                <option value="0">Inactiva</option>
                            </select>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="block text-xs font-medium text-cafe-600 mb-1">Talla Asociada</label>
                            <select
                                value={codTalla}
                                onChange={(e) => {
                                    setCodTalla(e.target.value);
                                    applyFilters({ cod_talla_producto: e.target.value });
                                }}
                                className="w-full rounded-xl border-gray-300 text-sm py-2.5 px-3 focus:border-terracota-500 focus:ring-terracota-500 transition-all duration-200"
                            >
                                <option value="">Todas</option>
                                {tallas.map((t) => (
                                    <option key={t.cod_talla_producto} value={t.cod_talla_producto}>
                                        {t.nom_talla_producto} ({t.codigo_talla_producto})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors duration-200 w-full md:w-auto"
                            >
                                Limpiar
                            </button>
                            <button
                                onClick={() => applyFilters()}
                                className="px-5 py-2.5 bg-terracota-600 hover:bg-terracota-750 text-white rounded-xl text-sm font-medium transition-colors duration-200 w-full md:w-auto"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
                </SectionCard>

                {/* Tabla de Categorías */}
                <SectionCard noPadding>
                    {categoriasData.length > 0 ? (
                        <TableWrapper>
                            <TableWrapper.Header>
                                <TableWrapper.HeaderCell>Nombre</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Descripción</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell>Estado</TableWrapper.HeaderCell>
                                <TableWrapper.HeaderCell align="right">Acciones</TableWrapper.HeaderCell>
                            </TableWrapper.Header>
                            <TableWrapper.Body>
                                {categoriasData.map((categoria) => (
                                    <TableWrapper.Row key={categoria.cod_categoria_producto}>
                                        <TableWrapper.Cell>
                                            <p className="font-semibold text-cafe-900">{categoria.nombre_cat}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-gray-500 max-w-sm truncate">
                                                {categoria.descripcion_cat || '-'}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <StatusBadge status={categoria.activo_cat ? 'activo' : 'inactivo'} />
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <div className="flex justify-end gap-1.5">
                                                <Link
                                                    href={route('categorias-producto.show', categoria.cod_categoria_producto)}
                                                    title="Ver Detalle"
                                                    className="p-2 text-cafe-600 hover:text-cafe-900 bg-cafe-50 hover:bg-cafe-100 rounded-lg transition-colors duration-150"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('categorias-producto.edit', categoria.cod_categoria_producto)}
                                                    title="Editar"
                                                    className="p-2 text-terracota-600 hover:text-terracota-950 bg-terracota-50 hover:bg-terracota-100 rounded-lg transition-colors duration-150"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('productos.index', { cod_categoria_producto: categoria.cod_categoria_producto })}
                                                    title="Productos"
                                                    className="p-2 text-oliva-700 hover:text-oliva-950 bg-oliva-50 hover:bg-oliva-100 rounded-lg transition-colors duration-150"
                                                >
                                                    <Package className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('inventario.index', { cod_categoria_producto: categoria.cod_categoria_producto })}
                                                    title="Ajustar Inventario"
                                                    className="p-2 text-amber-700 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors duration-150"
                                                >
                                                    <Database className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title={search || activoCat || codTalla ? 'No se encontraron resultados' : 'No hay categorías registradas'}
                            description={
                                search || activoCat || codTalla
                                    ? 'Intente modificar los filtros aplicados para obtener resultados.'
                                    : 'Crea tu primera categoría para organizar tu catálogo de productos.'
                            }
                            action={
                                !search && !activoCat && !codTalla ? (
                                    <Link href={route('categorias-producto.create')}>
                                        <PrimaryActionButton
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            }
                                        >
                                            Crear Categoría
                                        </PrimaryActionButton>
                                    </Link>
                                ) : null
                            }
                        />
                    )}

                    <Pagination links={categorias.links} meta={categorias.meta} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
