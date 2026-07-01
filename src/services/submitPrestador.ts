import type { PrestadorRaw } from '../types/prestador';

const WEBAPP_URL = import.meta.env.VITE_SHEETS_WEBAPP_URL?.trim();

/** Indica se o endpoint de gravação (Apps Script Web App) está configurado. */
export function isSubmitConfigured(): boolean {
  return Boolean(WEBAPP_URL);
}

interface SubmitResponse {
  ok: boolean;
  error?: string;
}

/**
 * Envia um novo prestador para o Apps Script Web App, que adiciona a linha na planilha.
 * Usa Content-Type "text/plain" de propósito: evita o preflight CORS do navegador,
 * que o endpoint do Apps Script não responde bem.
 */
export async function submitPrestador(data: PrestadorRaw): Promise<void> {
  if (!WEBAPP_URL) {
    throw new Error('Cadastro indisponível: endpoint de gravação não configurado.');
  }

  let res: Response;
  try {
    res = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error('Falha de conexão ao enviar. Verifique sua internet e tente novamente.');
  }

  if (!res.ok) {
    throw new Error(`O servidor recusou o envio (HTTP ${res.status}).`);
  }

  const json = (await res.json().catch(() => null)) as SubmitResponse | null;
  if (!json || !json.ok) {
    throw new Error(json?.error ?? 'Não foi possível salvar o prestador.');
  }
}
