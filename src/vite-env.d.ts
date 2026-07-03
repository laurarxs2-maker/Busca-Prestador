/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Chave de API do Google Cloud (Sheets API). Fica visível no bundle estático. */
  readonly VITE_SHEETS_API_KEY?: string;
  /** ID da planilha (parte da URL entre /d/ e /edit). Obrigatório junto com a API key. */
  readonly VITE_SHEETS_ID?: string;
  /** Nome da aba/guia. Default: "Página1". */
  readonly VITE_SHEETS_TAB?: string;
  /** URL do Apps Script Web App (/exec) usado para gravar novos prestadores. */
  readonly VITE_SHEETS_WEBAPP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
