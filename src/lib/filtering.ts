import type { Prestador } from '../types/prestador';
import { normalize, sortPtBr, uniqueByNormalized } from './utils';

export interface FilterState {
  search: string;
  uf: string;
  especialidade: string;
  tipoAtendimento: string;
  unidade: string;
}

export const EMPTY_FILTERS: FilterState = {
  search: '',
  uf: '',
  especialidade: '',
  tipoAtendimento: '',
  unidade: '',
};

/** Chaves de faceta (todas exceto a busca textual global). */
export type FacetKey = 'uf' | 'especialidade' | 'tipoAtendimento' | 'unidade';

function includesNormalized(values: string[], target: string): boolean {
  const t = normalize(target);
  return values.some((v) => normalize(v) === t);
}

function matchesSearch(p: Prestador, search: string): boolean {
  const q = normalize(search);
  if (!q) return true;
  const haystack = [
    p.nome,
    p.uf,
    ...p.especialidades,
    ...p.tiposAtendimento,
    ...p.unidades,
  ]
    .map(normalize)
    .join(' | ');
  // Cada termo da busca precisa aparecer (AND), permitindo "cardiologia itaim".
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

/**
 * Testa se um prestador atende ao estado de filtros.
 * `ignore` permite desconsiderar uma faceta — essencial para calcular as
 * opções disponíveis de cada dropdown sem que ele "se anule" (busca facetada).
 */
export function matches(p: Prestador, state: FilterState, ignore?: FacetKey): boolean {
  if (!matchesSearch(p, state.search)) return false;
  if (ignore !== 'uf' && state.uf && normalize(p.uf) !== normalize(state.uf)) return false;
  if (ignore !== 'especialidade' && state.especialidade && !includesNormalized(p.especialidades, state.especialidade)) return false;
  if (ignore !== 'tipoAtendimento' && state.tipoAtendimento && !includesNormalized(p.tiposAtendimento, state.tipoAtendimento)) return false;
  if (ignore !== 'unidade' && state.unidade && !includesNormalized(p.unidades, state.unidade)) return false;
  return true;
}

export function applyFilters(list: Prestador[], state: FilterState): Prestador[] {
  return list.filter((p) => matches(p, state));
}

function valuesForFacet(p: Prestador, key: FacetKey): string[] {
  switch (key) {
    case 'uf':
      return [p.uf];
    case 'especialidade':
      return p.especialidades;
    case 'tipoAtendimento':
      return p.tiposAtendimento;
    case 'unidade':
      return p.unidades;
  }
}

/**
 * Opções disponíveis para uma faceta, considerando todos os outros filtros ativos.
 * É o que faz "um filtro respeitar o outro": ao escolher UF=SP, a lista de
 * especialidades passa a mostrar só as que existem em SP, e assim por diante.
 */
export function facetOptions(list: Prestador[], state: FilterState, key: FacetKey): string[] {
  const subset = list.filter((p) => matches(p, state, key));
  const values = subset.flatMap((p) => valuesForFacet(p, key));
  return sortPtBr(uniqueByNormalized(values.filter(Boolean)));
}
