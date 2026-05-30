import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import StatusBadge from '@/Components/UI/StatusBadge';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import { Head, Link } from '@inertiajs/react';

export default function Index({ categorias = { data: [] } }) {
    const categoriasData = categorias.data || [];
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
                                            <p className="font-medium text-cafe-900">{categoria.nombre_cat}</p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <p className="text-sm text-gray-500 max-w-xs truncate">
                                                {categoria.descripcion_cat || '-'}
                                            </p>
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell>
                                            <StatusBadge status={categoria.activo_cat ? 'activo' : 'inactivo'} />
                                        </TableWrapper.Cell>
                                        <TableWrapper.Cell align="right">
                                            <Link
                                                href={route('categorias-producto.edit', categoria.cod_categoria_producto)}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-terracota-600 hover:text-terracota-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                            </Link>
                                        </TableWrapper.Cell>
                                    </TableWrapper.Row>
                                ))}
                            </TableWrapper.Body>
                        </TableWrapper>
                    ) : (
                        <EmptyState
                            title="No hay categorías registradas"
                            description="Crea tu primera categoría para organizar tu catálogo de productos."
                            action={
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
                            }
                        />
                    )}

                    <Pagination links={categorias.links} meta={categorias.meta} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}
