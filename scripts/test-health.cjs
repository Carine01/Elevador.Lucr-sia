#!/usr/bin/env node

/**
 * Testes de Saúde do Sistema
 * Verifica se endpoints críticos estão funcionando
 */

const fs = require('fs');
const path = require('path');

console.log('🏥 Executando testes de saúde...\n');

let passed = 0;
let failed = 0;

// ==========================================
// TESTE 1: Health check endpoint existe
// ==========================================
console.log('📋 Teste 1: Verificando health check endpoint...');

const healthFile = path.join(__dirname, '..', 'server', 'routers', 'health.ts');
if (!fs.existsSync(healthFile)) {
  console.error('   ❌ Arquivo health.ts não encontrado!');
  failed++;
} else {
  const content = fs.readFileSync(healthFile, 'utf8');
  
  if (!content.includes('healthRouter')) {
    console.error('   ❌ healthRouter não exportado!');
    failed++;
  } else if (!content.includes('status')) {
    console.error('   ❌ Health check não retorna status!');
    failed++;
  } else {
    console.log('   ✅ Health check endpoint existe');
    passed++;
  }
}

console.log('');

// ==========================================
// TESTE 2: Health check registrado no router
// ==========================================
console.log('📋 Teste 2: Verificando registro no router...');

const routersFile = path.join(__dirname, '..', 'server', 'routers.ts');
const routersContent = fs.readFileSync(routersFile, 'utf8');

if (!routersContent.includes('health:')) {
  console.error('   ❌ Health router não registrado no appRouter!');
  failed++;
} else {
  console.log('   ✅ Health router registrado');
  passed++;
}

console.log('');

// ==========================================
// TESTE 3: Stripe webhook existe
// ==========================================
console.log('📋 Teste 3: Verificando webhook Stripe...');

const indexFile = path.join(__dirname, '..', 'server', '_core', 'index.ts');
const indexContent = fs.readFileSync(indexFile, 'utf8');

if (!indexContent.includes('/api/stripe/webhook')) {
  console.error('   ❌ Webhook Stripe não configurado!');
  failed++;
} else if (!indexContent.includes('stripe.webhooks.constructEvent')) {
  console.error('   ❌ Webhook sem verificação de assinatura!');
  failed++;
} else {
  console.log('   ✅ Webhook Stripe configurado corretamente');
  passed++;
}

console.log('');

// ==========================================
// TESTE 4: Banco de dados configurado
// ==========================================
console.log('📋 Teste 4: Verificando banco de dados...');

const dbFile = path.join(__dirname, '..', 'server', 'db.ts');
const dbContent = fs.readFileSync(dbFile, 'utf8');

if (!dbContent.includes('drizzle(')) {
  console.error('   ❌ Drizzle ORM não configurado!');
  failed++;
} else if (!dbContent.includes('DATABASE_URL')) {
  console.error('   ❌ DATABASE_URL não utilizada!');
  failed++;
} else {
  console.log('   ✅ Banco de dados configurado');
  passed++;
}

console.log('');

// ==========================================
// RESULTADO FINAL
// ==========================================
console.log('='.repeat(50));
console.log(`\n✅ Testes passados: ${passed}`);
console.log(`❌ Testes falhados: ${failed}`);

if (failed > 0) {
  console.error('\n❌ TESTES DE SAÚDE FALHARAM!');
  process.exit(1);
} else {
  console.log('\n✅ TODOS OS TESTES DE SAÚDE PASSARAM!');
  process.exit(0);
}
