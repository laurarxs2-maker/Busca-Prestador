/** Remove acentos e baixa caixa, para busca e comparação tolerantes. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Divide um campo de texto que pode conter múltiplos valores.
 * Ex.: "Rochaverá, Ponte Estaiada, Itaim" -> ["Rochaverá", "Ponte Estaiada", "Itaim"]
 * Aceita vírgula, ponto-e-vírgula, barra e " e " como separadores.
 */
export function splitMulti(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\s*(?:,|;|\/|\se\s)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Limpa um número de telefone para uso em links tel:/wa.me (apenas dígitos). */
export function onlyDigits(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

/**
 * Monta o número internacional para o WhatsApp (wa.me espera só dígitos com DDI).
 * Assume Brasil (55) quando o número não traz DDI.
 */
export function toWhatsappNumber(value: string | null | undefined): string | null {
  const digits = onlyDigits(value);
  if (digits.length < 10) return null;
  return digits.startsWith('55') ? digits : `55${digits}`;
}

/** Ordena strings de forma estável e localizada (pt-BR). */
export function sortPtBr(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
}

/** Retorna valores únicos preservando o primeiro rótulo encontrado (case-insensitive). */
export function uniqueByNormalized(values: string[]): string[] {
  const seen = new Map<string, string>();
  for (const value of values) {
    const key = normalize(value);
    if (key && !seen.has(key)) seen.set(key, value);
  }
  return [...seen.values()];
}
