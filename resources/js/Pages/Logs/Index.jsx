import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import TableWrapper from '@/Components/UI/TableWrapper';
import EmptyState from '@/Components/UI/EmptyState';
import LiveSyncBadge from '@/Components/UI/LiveSyncBadge';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const levelConfig = {
    info: {
        label: 'Info',
        bg: 'bg-cyan-100',
        text: 'text-cyan-800',
        dot: 'bg-cyan-500',
    },
    warning: {
        label: 'Warning',
        bg: 'bg-terracota-100',
        text: 'text-terracota-800',
        dot: 'bg-terracota-500',
    },
    error: {
        label: 'Error',
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
    },
    critical: {
        label: 'Critical',
        bg: 'bg-red-200',
        text: 'text-red-950',
        dot: 'bg-red-700',
    },
    debug: {
        label: 'Debug',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        dot: 'bg-gray-500',
    },
};

const summaryCards = [
    { key: 'total', label: 'Total de eventos', tone: 'text-cafe-900', accent: 'bg-oliva-100 text-oliva-800' },
    { key: 'errors', label: 'Errores', tone: 'text-red-700', accent: 'bg-red-100 text-red-800' },
    { key: 'warnings', label: 'Advertencias', tone: 'text-terracota-700', accent: 'bg-terracota-100 text-terracota-800' },
    { key: 'info', label: 'Informativos', tone: 'text-cyan-700', accent: 'bg-cyan-100 text-cyan-800' },
];

const formatDate = (value) => {
    if (!value) return '-';

    const date = new Date(value.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const LevelBadge = ({ level }) => {
    const config = levelConfig[level] || levelConfig.debug;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

export default function Index({ logs = [], summary = {}, filters = {} }) {
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('Todos');
    const [module, setModule] = useState('Todos');
    const [selectedId, setSelectedId] = useState(logs[0]?.id ?? null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const levels = filters.levels || ['Todos', 'Info', 'Warning', 'Error', 'Critical', 'Debug'];
    const modules = ['Todos', ...(filters.modules || [])];

    const filteredLogs = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        const selectedLevel = level.toLowerCase();

        return logs.filter((log) => {
            const matchesSearch = !normalizedSearch
                || [log.event, log.message, log.context, log.module, log.user, log.ip]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedSearch);
            const matchesLevel = level === 'Todos' || log.level === selectedLevel;
            const matchesModule = module === 'Todos' || log.module === module;

            return matchesSearch && matchesLevel && matchesModule;
        });
    }, [logs, search, level, module]);

    const selectedLog = filteredLogs.find((log) => log.id === selectedId) || filteredLogs[0] || null;

    const refresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['logs', 'summary'],
            onFinish: () => setIsRefreshing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Logs del sistema"
                    subtitle="Registro visual de eventos, errores y actividad tecnica del sistema."
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Logs' },
                    ]}
                    actions={<LiveSyncBadge isRefreshing={isRefreshing} lastUpdated={new Date().toISOString()} onRefresh={refresh} />}
                />
            }
        >
            <Head title="Logs del sistema" />

            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <SectionCard key={card.key} className="min-h-[122px]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                                    <p className={`mt-3 text-3xl font-bold ${card.tone}`}>
                                        {summary?.[card.key] ?? 0}
                                    </p>
                                </div>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${card.accent}`}>
                                    Logs
                                </span>
                            </div>
                        </SectionCard>
                    ))}
                </div>

                <SectionCard title="Filtros" subtitle="Busca eventos por texto, nivel o modulo operativo.">
                    <div className="grid gap-4 lg:grid-cols-[1fr_220px_240px]">
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-cafe-700">Buscar por texto</span>
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                type="search"
                                className="block w-full rounded-xl border-gray-200 bg-white text-sm text-cafe-700 shadow-sm focus:border-terracota-500 focus:ring-terracota-500"
                                placeholder="Evento, contexto, usuario o IP"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-cafe-700">Nivel</span>
                            <select
                                value={level}
                                onChange={(event) => setLevel(event.target.value)}
                                className="block w-full rounded-xl border-gray-200 bg-white text-sm text-cafe-700 shadow-sm focus:border-terracota-500 focus:ring-terracota-500"
                            >
                                {levels.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-cafe-700">Modulo</span>
                            <select
                                value={module}
                                onChange={(event) => setModule(event.target.value)}
                                className="block w-full rounded-xl border-gray-200 bg-white text-sm text-cafe-700 shadow-sm focus:border-terracota-500 focus:ring-terracota-500"
                            >
                                {modules.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </SectionCard>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <SectionCard title="Eventos recientes" subtitle="Ultimos registros visibles y sanitizados." noPadding>
                        {filteredLogs.length > 0 ? (
                            <TableWrapper>
                                <TableWrapper.Header>
                                    <TableWrapper.HeaderCell>Fecha/Hora</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>Nivel</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>Modulo</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>Evento</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>Usuario</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell>IP</TableWrapper.HeaderCell>
                                    <TableWrapper.HeaderCell align="right">Accion</TableWrapper.HeaderCell>
                                </TableWrapper.Header>
                                <TableWrapper.Body>
                                    {filteredLogs.map((log) => (
                                        <TableWrapper.Row
                                            key={log.id}
                                            className={selectedLog?.id === log.id ? 'bg-crema-100' : ''}
                                        >
                                            <TableWrapper.Cell>
                                                <span className="text-xs text-cafe-700">{formatDate(log.datetime)}</span>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>
                                                <LevelBadge level={log.level} />
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>
                                                <span className="font-medium text-cafe-800">{log.module}</span>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell className="max-w-[320px] whitespace-normal">
                                                <span className="text-truncate-2 text-cafe-700">{log.event}</span>
                                            </TableWrapper.Cell>
                                            <TableWrapper.Cell>{log.user || 'Sistema'}</TableWrapper.Cell>
                                            <TableWrapper.Cell>{log.ip || '-'}</TableWrapper.Cell>
                                            <TableWrapper.Cell align="right">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedId(log.id)}
                                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-terracota-700 transition-colors hover:bg-terracota-50"
                                                >
                                                    {log.action || 'Revisar'}
                                                </button>
                                            </TableWrapper.Cell>
                                        </TableWrapper.Row>
                                    ))}
                                </TableWrapper.Body>
                            </TableWrapper>
                        ) : (
                            <EmptyState
                                title="No hay logs para mostrar"
                                description="Ajusta los filtros o actualiza la pantalla para consultar eventos recientes."
                            />
                        )}
                    </SectionCard>

                    <SectionCard title="Detalle" subtitle="Informacion segura del evento seleccionado.">
                        {selectedLog ? (
                            <div className="space-y-5">
                                <div className="flex items-center justify-between gap-3">
                                    <LevelBadge level={selectedLog.level} />
                                    <span className="text-xs font-medium text-gray-500">{formatDate(selectedLog.datetime)}</span>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Mensaje completo</p>
                                    <p className="mt-2 rounded-xl bg-crema-100 p-3 text-sm leading-6 text-cafe-800">
                                        {selectedLog.message}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Contexto</p>
                                    <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-cafe-950 p-3 text-xs leading-5 text-crema-100">
                                        {selectedLog.context || 'Sin contexto adicional visible.'}
                                    </pre>
                                </div>

                                <dl className="grid gap-3 text-sm">
                                    <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
                                        <dt className="text-gray-500">Modulo</dt>
                                        <dd className="font-medium text-cafe-800">{selectedLog.module}</dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
                                        <dt className="text-gray-500">Usuario</dt>
                                        <dd className="font-medium text-cafe-800">{selectedLog.user || 'Sistema'}</dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
                                        <dt className="text-gray-500">Fuente</dt>
                                        <dd className="font-medium text-cafe-800">{selectedLog.source || 'storage/logs'}</dd>
                                    </div>
                                </dl>
                            </div>
                        ) : (
                            <EmptyState
                                title="Selecciona un evento"
                                description="El detalle del log aparecera aqui cuando elijas un registro."
                                className="py-8"
                            />
                        )}
                    </SectionCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
