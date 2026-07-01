# AGENT.md — Prestadores Saúde

Registro de decisões técnicas do projeto.

### 2026-06-27 - Fonte de dados: Google Sheets "BD prestadores"

**Decisão:** Os dados vêm em tempo real da planilha "BD prestadores" (Google Sheets API v4), lidos no navegador via API key. Sem banco de dados. Mock local (`src/data/prestadores.json`) fica apenas como fallback de desenvolvimento.

**Contexto:** App é uma SPA estática (deploy previsto no GitHub Pages), sem backend. A planilha está compartilhada como "qualquer pessoa com o link: Leitor", o que permite leitura por API key. Atualizar a planilha reflete no app sem novo deploy; `cache: 'no-store'` + parâmetro anti-cache garantem dados frescos.

**Arquitetura:**
- `src/services/googleSheets.ts` — fetch paginado por range fixo (`Página1!A2:H`), mapeia colunas por posição para `PrestadorRaw`.
- `src/services/prestadores.ts` — usa Sheets se `VITE_SHEETS_*` configurado; senão, mock.
- Config via `.env` (git-ignored) / `.env.example`. Colunas: NOME, UF, TELEFONES, WHATSAPP, TIPO DE ATENDIMENTO, ESPECIALIDADE, UNIDADE, OBS.

**Alternativas descartadas:** Airtable (escolhido antes, descartado quando surgiu a API key do Google); Apps Script (atrito de CORS); JSON hospedado (menos amigável para edição não-técnica).

**Impacto / risco:** A API key fica visível no bundle estático (limitação de site estático). Mitigação obrigatória no Google Cloud Console: restringir a chave a "Google Sheets API" + referenciador HTTP do domínio do Pages. Como a chave foi exposta em texto, gerar uma nova após restringir. A planilha precisa permanecer pública (somente leitura); se a política da conta empresarial revogar o compartilhamento, a leitura para de funcionar.
