#!/usr/bin/env node

/**
 * Testes de Segurança Automatizados
 * Verifica se todas as queries filtram por userId
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Executando testes de segurança...\n');

let errors = 0;
let warnings = 0;

// ==========================================
// TESTE 1: Verificar filtros de userId
// ==========================================
console.log('📋 Teste 1: Verificando filtros de userId...');

const routersDir = path.join(__dirname, '..', 'server', 'routers');
const files = fs.readdirSync(routersDir, { withFileTypes: true });

files.forEach(file => {
  if (file.isFile() && file.name.endsWith('.ts')) {
    const filePath = path.join(routersDir, file.name);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Pula arquivos admin e health (eles intencionalmente não filtram)
    if (file.name === 'admin.ts' || file.name === 'health.ts') return;
    
    // Verifica se tem protectedProcedure.query sem userId
    const hasProtectedQuery = content.includes('protectedProcedure.query') || 
                             content.includes('protectedProcedure.mutation');
    const hasUserIdFilter = content.includes('ctx.user.id') || 
                           (content.includes('eq(') && content.includes('userId'));
    
    if (hasProtectedQuery && !hasUserIdFilter) {
      console.error(`   ❌ ${file.name}: Query protegida SEM filtro de userId`);
      errors++;
    } else if (hasProtectedQuery) {
      console.log(`   ✅ ${file.name}: Filtros de segurança OK`);
    }
  }
});

console.log('');

// ==========================================
// TESTE 2: Verificar adminProcedure
// ==========================================
console.log('📋 Teste 2: Verificando proteção de rotas admin...');

const trpcFile = path.join(__dirname, '..', 'server', '_core', 'trpc.ts');
const trpcContent = fs.readFileSync(trpcFile, 'utf8');

if (!trpcContent.includes('adminProcedure')) {
  console.error('   ❌ adminProcedure não está definido!');
  errors++;
} else if (!trpcContent.includes("role !== 'admin'")) {
  console.error('   ❌ adminProcedure não verifica role!');
  errors++;
} else {
  console.log('   ✅ Proteção de admin OK');
}

console.log('');

// ==========================================
// TESTE 3: Verificar rate limiting
// ==========================================
console.log('📋 Teste 3: Verificando rate limiting...');

const indexFile = path.join(__dirname, '..', 'server', '_core', 'index.ts');
const indexContent = fs.readFileSync(indexFile, 'utf8');

if (!indexContent.includes('rateLimit')) {
  console.error('   ❌ Rate limiting não está configurado!');
  errors++;
} else {
  console.log('   ✅ Rate limiting configurado');
}

console.log('');

// ==========================================
// TESTE 4: Verificar CORS
// ==========================================
console.log('📋 Teste 4: Verificando CORS...');

if (!indexContent.includes('cors(')) {
  console.error('   ❌ CORS não está configurado!');
  errors++;
} else if (!indexContent.includes('allowedOrigins')) {
  console.warn('   ⚠️  CORS sem whitelist (aceita qualquer origem)');
  warnings++;
} else {
  console.log('   ✅ CORS configurado com whitelist');
}

console.log('');

// ==========================================
// TESTE 5: Verificar variáveis de ambiente
// ==========================================
console.log('📋 Teste 5: Verificando variáveis de ambiente...');

const envFile = path.join(__dirname, '..', 'server', '_core', 'env.ts');
const envContent = fs.readFileSync(envFile, 'utf8');

const requiredVars = ['JWT_SECRET', 'DATABASE_URL', 'STRIPE_SECRET_KEY'];
requiredVars.forEach(varName => {
  if (!envContent.includes(varName)) {
    console.error(`   ❌ Variável ${varName} não está sendo validada!`);
    errors++;
  } else {
    console.log(`   ✅ ${varName} validada`);
  }
});

console.log('');

// ==========================================
// RESULTADO FINAL
// ==========================================
console.log('='.repeat(50));
if (errors > 0) {
  console.error(`\n❌ TESTES FALHARAM: ${errors} erro(s) encontrado(s)`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`\n⚠️  TESTES PASSARAM COM AVISOS: ${warnings} aviso(s)`);
  process.exit(0);
} else {
  console.log('\n✅ TODOS OS TESTES DE SEGURANÇA PASSARAM!');
  process.exit(0);
}
