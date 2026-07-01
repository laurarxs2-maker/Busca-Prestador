import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, SearchX } from 'lucide-react';
import { Hero, type View } from './components/Hero';
import { Filters } from './components/Filters';
import { PrestadorCard } from './components/PrestadorCard';
import { NovoPrestadorForm } from './components/NovoPrestadorForm';
import { getPrestadores } from './services/prestadores';
import {
  EMPTY_FILTERS,
  applyFilters,
  facetOptions,
  type FilterState,
} from './lib/filtering';
import type { Prestador } from './types/prestador';

export default function App() {
  const [view, setView] = useState<View>('buscar');
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return getPrestadores()
      .then((data) => setPrestadores(data))
      .catch(() => setError('Não foi possível carregar os prestadores.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleChange = (patch: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const handleClear = () => setFilters(EMPTY_FILTERS);

  const options = useMemo(
    () => ({
      uf: facetOptions(prestadores, filters, 'uf'),
      especialidade: facetOptions(prestadores, filters, 'especialidade'),
      tipoAtendimento: facetOptions(prestadores, filters, 'tipoAtendimento'),
      unidade: facetOptions(prestadores, filters, 'unidade'),
    }),
    [prestadores, filters],
  );

  const resultados = useMemo(() => applyFilters(prestadores, filters), [prestadores, filters]);

  const activeCount = useMemo(
    () =>
      (['uf', 'especialidade', 'tipoAtendimento', 'unidade'] as const).filter(
        (key) => filters[key] !== '',
      ).length,
    [filters],
  );

  return (
    <div className="min-h-screen pb-16">
      <Hero
        view={view}
        onViewChange={setView}
        search={filters.search}
        onSearchChange={(v) => handleChange({ search: v })}
      />

      {view === 'novo' ? (
        <NovoPrestadorForm onSaved={() => void load()} />
      ) : (
        <main className="mx-auto mt-8 max-w-5xl px-4">
        <Filters
          filters={filters}
          options={options}
          activeCount={activeCount}
          onChange={handleChange}
          onClear={handleClear}
        />

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {loading
              ? 'Carregando...'
              : `${resultados.length} ${resultados.length === 1 ? 'prestador encontrado' : 'prestadores encontrados'}`}
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Buscando prestadores...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && resultados.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-navy-700 py-20 text-center">
            <SearchX className="h-10 w-10 text-slate-500" />
            <p className="text-base font-medium text-slate-200">Nenhum prestador encontrado</p>
            <p className="max-w-xs text-sm text-slate-400">
              Tente ajustar a busca ou remover alguns filtros.
            </p>
          </div>
        )}

          {!loading && !error && resultados.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {resultados.map((p) => (
                <PrestadorCard key={p.id} prestador={p} />
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
