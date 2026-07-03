import { useState } from 'react';
import {
  MapPin,
  Stethoscope,
  ClipboardList,
  Building2,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-white/10 bg-navy-700 p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <SlidersHorizontal className="h-4 w-4 text-brand-400" />
          Filtros avançados
          {activeCount > 0 && (
            <span className="rounded-full bg-brand-600/30 px-2 py-0.5 text-xs font-medium text-brand-200">
              {activeCount}
            </span>
          )}
        </h2>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            {open ? (
              <>
                Fechar
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Abrir
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
      )}
    </section>
  );
}
