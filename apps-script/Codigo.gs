/**
 * Apps Script para gravar novos prestadores na planilha "BD prestadores".
 *
 * COMO PUBLICAR:
 * 1. Abra a planilha "BD prestadores" no Google Sheets.
 * 2. Menu: Extensões > Apps Script.
 * 3. Apague o conteúdo padrão e cole TODO este arquivo.
 * 4. (Opcional) Ajuste SHEET_NAME para uma aba de revisão, ex.: "Pendentes".
 * 5. Implantar > Nova implantação > Tipo: "App da Web".
 *      - Executar como: Eu (dono da planilha)
 *      - Quem pode acessar: "Qualquer pessoa"
 * 6. Copie a URL que termina em /exec e coloque em VITE_SHEETS_WEBAPP_URL (.env).
 *
 * Para testar a publicação, abra a URL /exec no navegador: deve responder {"ok":true,"status":"online"}.
 */

// Vazio = primeira aba. Para moderar, use o nome de uma aba separada, ex.: 'Pendentes'.
var SHEET_NAME = '';

// Ordem das colunas na planilha (A..H).
var COLUNAS = ['nome', 'uf', 'telefones', 'whatsapp', 'tipoAtendimento', 'especialidade', 'unidade', 'obs'];

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return _json({ ok: true, status: 'online' });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (!data.nome || !data.uf) {
      return _json({ ok: false, error: 'Nome e UF são obrigatórios.' });
    }

    var linha = COLUNAS.map(function (campo) {
      return (data[campo] || '').toString().trim();
    });

    _sheet().appendRow(linha);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}
