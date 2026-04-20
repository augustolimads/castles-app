/**
 * Utilitário para importar dados de exemplo para o localStorage
 * Use isso apenas para testes e desenvolvimento
 * 
 * Para usar:
 * 1. Abra o console do navegador em /fichas
 * 2. Cole e execute o código abaixo:
 * 
 * fetch('/sheets-example.json')
 *   .then(r => r.json())
 *   .then(data => {
 *     localStorage.setItem('castles-character-sheets', JSON.stringify(data));
 *     window.location.reload();
 *   });
 * 
 * Isso irá carregar 8 fichas de exemplo (3 personagens, 2 NPCs, 3 monstros)
 */

export function importExampleSheets() {
  if (typeof window === 'undefined') return;
  
  fetch('/sheets-example.json')
    .then(r => r.json())
    .then(data => {
      localStorage.setItem('castles-character-sheets', JSON.stringify(data));
      window.dispatchEvent(new Event('sheets-updated'));
      console.log('✅ Fichas de exemplo importadas com sucesso!');
    })
    .catch(err => {
      console.error('❌ Erro ao importar fichas:', err);
    });
}

export function clearAllSheets() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('castles-character-sheets');
  window.dispatchEvent(new Event('sheets-updated'));
  console.log('🗑️ Todas as fichas foram removidas');
}

export function exportSheets() {
  if (typeof window === 'undefined') return;
  const sheets = localStorage.getItem('castles-character-sheets');
  if (!sheets) {
    console.log('⚠️ Nenhuma ficha para exportar');
    return;
  }
  
  const blob = new Blob([sheets], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fichas-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  console.log('💾 Fichas exportadas com sucesso!');
}
