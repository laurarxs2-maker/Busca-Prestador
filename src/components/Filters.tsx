import { MapPin, Stethoscope, ClipboardList, Building2, X, SlidersHorizontal } from 'lucide-react';
import { SelectFilter } from './SelectFilter';
import type { FilterState } from '../lib/filtering';

interface FacetOptions {
  uf: string[];
  especialidade: string[];
  tipoAtendimento: string[];
  unidade: string[];
}

interface FiltersProps {
  filters: FilterState;
  options: FacetOptions;
  activeCount: number;
  onChange: (patch: Partial<FilterState>) => void;
  onClear: () => void;
}

export function Filters({ filters, options, activeCount, onChange, onClear }: FiltersProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-navy-700 p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <SlidersHorizontal className="h-4 w-4 text-brand-400" />
          Filtros avançados
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
          >
            <X className="h-3.5 w-3.5" />
            Limpar ({activeCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectFilter
          label="UF"
          icon={<MapPin className="h-3.5 w-3.5" />}
          value={filters.uf}
          options={options.uf}
          onChange={(v) => onChange({ uf: v })}
          placeholder="Todas as UFs"
        />
        <SelectFilter
          label="Especialidade"
          icon={<Stethoscope className="h-3.5 w-3.5" />}
          value={filters.especialidade}
          options={options.especialidade}
          onChange={(v) => onChange({ especialidade: v })}
          placeholder="Todas"
        />
        <SelectFilter
          label="Tipo de Atendimento"
          icon={<ClipboardList className="h-3.5 w-3.5" />}
          value={filters.tipoAtendimento}
          options={options.tipoAtendimento}
          onChange={(v) => onChange({ tipoAtendimento: v })}
          placeholder="Todos"
        />
        <SelectFilter
          label="Unidade / Bairro"
          icon={<Building2 className="h-3.5 w-3.5" />}
          value={filters.unidade}
          options={options.unidade}
          onChange={(v) => onChange({ unidade: v })}
          placeholder="Todas"
        />
      </div>
    </section>
  );
}
