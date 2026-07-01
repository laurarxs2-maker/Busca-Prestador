import rawData from '../data/prestadores.json';
import type { Prestador, PrestadorRaw } from '../types/prestador';
import { splitMulti, uniqueByNormalized } from '../lib/utils';
import { fetchSheetRows, isSheetsConfigured } from './googleSheets';

/**
 * Converte uma linha "crua" da planilha no modelo normalizado usado pela UI.
 * Campos multivalor (telefones, unidades, etc.) são divididos e deduplicados.
 */
function normalizeRaw(raw: PrestadorRaw, index: number): Prestador {
  const trim = (v: string) => (v ?? '').trim();
  return {
    id: `${index}-${trim(raw.nome).toLowerCase().replace(/\s+/g, '-')}`,
    nome: trim(raw.nome),
    uf: trim(raw.uf).toUpperCase(),
    telefones: splitMulti(raw.telefones),
    whatsapp: trim(raw.whatsapp) || null,
    tiposAtendimento: uniqueByNormalized(splitMulti(raw.tipoAtendimento)),
    especialidades: uniqueByNormalized(splitMulti(raw.especialidade)),
    unidades: uniqueByNormalized(splitMulti(raw.unidade)),
    obs: trim(raw.obs) || null,
  };
}

/**
 * Fonte de dados da aplicação.
 *
 * Quando as variáveis `VITE_SHEETS_*` estão configuradas, lê em tempo real da
 * planilha "BD prestadores" no Google Sheets (atualizar a planilha reflete no
 * app sem novo deploy). Caso contrário, cai no mock local — útil em dev sem chave.
 *
 * A assinatura (`Promise<Prestador[]>`) é o ponto único de acoplamento: a UI não
 * muda independentemente da origem dos dados.
 */
export async function getPrestadores(): Promise<Prestador[]> {
  if (isSheetsConfigured()) {
    const rows = await fetchSheetRows();
    return rows.map(normalizeRaw);
  }

  const data = rawData as PrestadorRaw[];
  // Simula latência de rede para a UI já lidar com estado de carregamento.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return data.map(normalizeRaw);
}
