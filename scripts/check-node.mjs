// Preflight: garante Node >= 20 ANTES de instalar/rodar.
// Converte o erro críptico de compilação do better-sqlite3 (Python/gyp) em
// uma mensagem clara e acionável — requisito para rodar no Windows sem dor.
const REQUIRED_MAJOR = 20;
const current = process.versions.node;
const major = Number(current.split('.')[0]);

if (Number.isNaN(major) || major < REQUIRED_MAJOR) {
  const line = '='.repeat(64);
  console.error(`\n${line}`);
  console.error(`  ERRO: este projeto requer Node.js >= ${REQUIRED_MAJOR}.`);
  console.error(`  Versão detectada: ${current}`);
  console.error('');
  console.error('  Instale uma versão LTS (>= 20) em https://nodejs.org');
  console.error('  e rode novamente:  npm install  &&  npm run dev');
  console.error('');
  console.error('  (Com Node < 20 o better-sqlite3 tentaria compilar do zero,');
  console.error('   exigindo Python e ferramentas de build do Windows.)');
  console.error(`${line}\n`);
  process.exit(1);
}
