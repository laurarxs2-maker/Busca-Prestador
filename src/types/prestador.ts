export interface Prestador {
  id: string;
  nome: string;
  uf: string;
  telefones: string[];
  whatsapp: string | null;
  tiposAtendimento: string[];
  especialidades: string[];
  unidades: string[];
  obs: string | null;
}

/**
 * Formato "cru" como vem da planilha do Google Sheets (uma linha = um registro),
 * com os campos em texto livre. A normalização para `Prestador` acontece no service.
 */
export interface PrestadorRaw {
  nome: string;
  uf: string;
  telefones: string;
  whatsapp: string;
  tipoAtendimento: string;
  especialidade: string;
  unidade: string;
  obs: string;
}
