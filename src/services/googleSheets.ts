import type { PrestadorRaw } from '../types/prestador';

const API_KEY = import.meta.env.VITE_SHEETS_API_KEY?.trim();
const SHEET_ID = import.meta.env.VITE_SHEETS_ID?.trim();
const TAB = import.meta.env.VITE_SHEETS_TAB?.trim();

// Lê da linha 2 em diante (a linha 1 é o cabeçalho) até a coluna H.
// Sem nome de aba, a API usa a primeira aba — evita problemas com acentos (ex.: "Página1").
const RANGE = TAB ? `${TAB}!A2:H` : 'A2:H';

/** Indica se chave e ID da planilha estão presentes (obrigatórios para ler). */
export function isSheetsConfigured(): boolean {
  return Boolean(API_KEY && SHEET_ID);
}

interface SheetsValuesResponse {
  values?: string[][];
}

function cell(row: string[], index: number): string {
  return (row[index] ?? '').trim();
}

/**
 * Mapeia uma linha da planilha (ordem fixa de colunas) para o formato cru.
 * Ordem: NOME, UF, TELEFONES, WHATSAPP, TIPO DE ATENDIMENTO, ESPECIALIDADE, UNIDADE, OBS.
 */
function rowToRaw(row: string[]): PrestadorRaw {
  return {
    nome: cell(row, 0),
    uf: cell(row, 1),
    telefones: cell(row, 2),
    whatsapp: cell(row, 3),
    tipoAtendimento: cell(row, 4),
    especialidade: cell(row, 5),
    unidade: cell(row, 6),
    obs: cell(row, 7),
  };
}

/**
 * Busca as linhas da planilha "BD prestadores" via Google Sheets API v4.
 * - `cache: 'no-store'` + parâmetro anti-cache garantem dados sempre frescos.
 * - Linhas sem nome (vazias) são descartadas.
 * Lança erro se a API responder com status != 2xx (a UI trata via estado de erro).
 */
export async function fetchSheetRows(): Promise<PrestadorRaw[]> {
  if (!isSheetsConfigured()) return [];

  // A Sheets API rejeita query params desconhecidos, então o frescor vem só de `no-store`.
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
    `/values/${encodeURIComponent(RANGE)}` +
    `?key=${API_KEY}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Google Sheets respondeu ${res.status}. ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as SheetsValuesResponse;
  const rows = json.values ?? [];

  return rows.filter((row) => cell(row, 0) !== '').map(rowToRaw);
}
