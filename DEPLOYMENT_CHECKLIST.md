# 🚀 CHECKLIST DE DEPLOY - Elevare AI NeuroVendas

**Status Atual:** ✅ Pronto para Deploy com configurações pendentes  
**Data:** Dezembro 2025  
**Versão:** 1.1.0

---

## ✅ CORREÇÕES IMPLEMENTADAS (Concluído)

### 1. Bugs Críticos Corrigidos
- ✅ **TypeScript Errors**: Corrigido erro de template literal em `Home.tsx`
- ✅ **Stripe Invoice Type**: Corrigido tipo do invoice.subscription com type assertion
- ✅ **CORS Types**: Adicionado @types/cors
- ✅ **HTML Build Error**: Removidas variáveis de ambiente mal formatadas do index.html
- ✅ **Build Success**: Aplicação compila com sucesso (vite build + esbuild)

### 2. Dependências Atualizadas
- ✅ pnpm-lock.yaml atualizado
- ✅ @types/cors instalado
- ✅ Todas as dependências resolvidas

---

## 📋 CHECKLIST PARA DEPLOY

### ⚠️ CONFIGURAÇÕES OBRIGATÓRIAS

#### 1. Variáveis de Ambiente (.env)
```bash
# CRIE um arquivo .env na raiz do projeto com:

# Database (OBRIGATÓRIO)
DATABASE_URL=mysql://user:password@host:3306/elevare_db

# OAuth Manus (OBRIGATÓRIO)
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=seu_app_id_aqui
OWNER_OPEN_ID=seu_owner_openid_aqui

# JWT (OBRIGATÓRIO - mínimo 32 caracteres)
JWT_SECRET=gere_uma_chave_forte_aqui_32_caracteres_minimo

# Stripe (OBRIGATÓRIO para monetização)
STRIPE_SECRET_KEY=sk_live_ou_sk_test_sua_chave
STRIPE_PRO_PRICE_ID=price_id_do_plano_pro
STRIPE_PRO_PLUS_PRICE_ID=price_id_do_plano_pro_plus
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# Forge API - IA (OBRIGATÓRIO)
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=sua_forge_api_key

# Opcional
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://seu-dominio.com
```

#### 2. Banco de Dados MySQL

**Opções:**
- [ ] PlanetScale (Recomendado - MySQL serverless)
- [ ] Railway (MySQL + Hosting)
- [ ] AWS RDS (MySQL gerenciado)
- [ ] Outro provedor MySQL 8+

**Passos:**
1. Criar banco de dados MySQL
2. Obter connection string
3. Adicionar ao .env como DATABASE_URL
4. Executar migrations: `pnpm db:push`

#### 3. Stripe Configuration

**Setup:**
1. [ ] Criar conta no [Stripe](https://stripe.com)
2. [ ] Criar produtos:
   - Elevare PRO: R$ 29/mês (recorrente)
   - Elevare PRO+: R$ 79/mês (recorrente)
3. [ ] Copiar Price IDs para .env
4. [ ] Configurar webhook:
   - URL: `https://seu-dominio.com/api/stripe/webhook`
   - Eventos: 
     * checkout.session.completed
     * customer.subscription.updated
     * customer.subscription.deleted
     * invoice.payment_succeeded
     * invoice.payment_failed
5. [ ] Copiar Webhook Secret para .env

#### 4. OAuth Manus

**Setup:**
1. [ ] Acessar dashboard Manus
2. [ ] Criar aplicação OAuth
3. [ ] Configurar:
   - Redirect URL: `https://seu-dominio.com/api/oauth/callback`
   - Allowed Origins: `https://seu-dominio.com`
4. [ ] Copiar App ID e Owner OpenID para .env

#### 5. Forge API (IA)

**Setup:**
1. [ ] Obter API Key no dashboard Manus
2. [ ] Adicionar ao .env: BUILT_IN_FORGE_API_KEY

---

## 🔧 TAREFAS PRÉ-DEPLOY

### Build e Testes
- ✅ `pnpm install` - Dependências instaladas
- ✅ `pnpm check` - TypeScript sem erros
- ✅ `pnpm build` - Build com sucesso
- [ ] `pnpm db:push` - Migrations aplicadas (requer DATABASE_URL)
- [ ] Testar em ambiente local com todas as env vars

### Segurança
- [ ] JWT_SECRET com 32+ caracteres
- [ ] HTTPS configurado no servidor
- [ ] CORS configurado corretamente (ALLOWED_ORIGINS)
- [ ] Stripe webhook secret configurado
- [ ] Arquivo .env NÃO commitado (verificar .gitignore)

### Performance
- ✅ Build otimizado (chunks gerados)
- [ ] CDN configurado para assets estáticos (opcional)
- [ ] Database indexes criados (migrations fazem isso)
- [ ] Rate limiting ativo (já implementado no código)

---

## 🌐 OPÇÕES DE HOSPEDAGEM

### Opção 1: Vercel (Recomendado)
**Prós:** Fácil deploy, CI/CD automático, HTTPS grátis  
**Passos:**
```bash
npm i -g vercel
cd /path/to/project
vercel
# Configurar env vars no dashboard
vercel --prod
```

### Opção 2: Railway
**Prós:** MySQL incluído, deploy automático via Git  
**Passos:**
1. Conectar repositório no Railway
2. Adicionar serviço MySQL
3. Configurar env vars
4. Deploy automático

### Opção 3: Render
**Prós:** Free tier disponível, fácil configuração  
**Passos:**
1. Criar Web Service
2. Build Command: `pnpm install && pnpm build`
3. Start Command: `pnpm start`
4. Configurar env vars

### Opção 4: VPS (DigitalOcean, AWS, etc)
**Prós:** Controle total  
**Passos:**
1. Instalar Node.js 22+, pnpm, MySQL
2. Clonar repositório
3. Configurar .env
4. `pnpm install && pnpm build`
5. Usar PM2 para gerenciar processo: `pm2 start dist/index.js --name elevare`

---

## 🧪 TESTES EM PRODUÇÃO

### 1. Testar Autenticação
- [ ] Acessar site
- [ ] Clicar em "Entrar"
- [ ] Completar OAuth flow
- [ ] Verificar dashboard carregado

### 2. Testar Radar de Bio
- [ ] Acessar "Radar de Bio"
- [ ] Inserir @ do Instagram
- [ ] Verificar análise gerada
- [ ] Testar captura de lead (email/WhatsApp)

### 3. Testar Monetização (Stripe)
- [ ] Acessar página de pricing
- [ ] Selecionar plano PRO
- [ ] Completar checkout (usar cartão de teste em test mode)
- [ ] Verificar webhook recebido
- [ ] Confirmar créditos adicionados

### 4. Testar Geração de Conteúdo
- [ ] E-books: testar geração
- [ ] Prompts: testar criação
- [ ] Anúncios: verificar copy gerada

---

## 📊 MONITORAMENTO

### Logs
```bash
# Vercel
vercel logs

# Railway
# Acessar dashboard → Logs

# PM2
pm2 logs elevare
pm2 monit
```

### Métricas Importantes
- [ ] Taxa de erro < 1%
- [ ] Tempo de resposta < 2s
- [ ] Uptime > 99%
- [ ] Conversão Radar → Assinatura

---

## 🔒 SEGURANÇA FINAL

### Checklist de Segurança
- [ ] HTTPS habilitado e funcionando
- [ ] Variáveis sensíveis em .env (não no código)
- [ ] CORS restrito a domínios confiáveis
- [ ] Rate limiting ativo (10 req/15min para não-autenticados)
- [ ] Webhook do Stripe validado (signature check)
- [ ] JWT secret forte (64+ caracteres recomendado)
- [ ] Logs de segurança habilitados
- [ ] Backup do banco de dados configurado

---

## 📁 ARQUIVOS IMPORTANTES

### Documentação
- ✅ `README.md` - Visão geral do projeto
- ✅ `DEPLOY.md` - Guia de deploy detalhado
- ✅ `INSTRUCOES_IMPLEMENTACAO.md` - Instruções técnicas
- ✅ `CHANGELOG_AUDITORIA.md` - Correções implementadas
- ✅ `.env.example` - Template de variáveis de ambiente

### Código
- ✅ `server/_core/index.ts` - Servidor principal
- ✅ `server/_core/env.ts` - Validação de env vars
- ✅ `server/_core/logger.ts` - Sistema de logging
- ✅ `drizzle/schema.ts` - Schema do banco de dados

---

## ❗ PROBLEMAS CONHECIDOS

### Warnings (Não Críticos)
1. **Console.log em alguns arquivos**: 15 ocorrências encontradas em arquivos de debug/desenvolvimento
   - Não afetam produção (são em arquivos como voiceTranscription.ts, sdk.ts)
   - Podem ser ignorados ou substituídos por logger

2. **Chunks grandes (>500KB)**: Alguns chunks são grandes
   - Não impede deploy
   - Pode ser otimizado depois com code splitting

3. **Peer dependency warning**: zod@^3.23.8 vs zod@4.1.12
   - OpenAI SDK espera zod v3, mas usamos v4
   - Não causa problemas práticos

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY

### Imediato (Primeira Semana)
1. [ ] Monitorar logs para erros
2. [ ] Verificar todos os webhooks do Stripe
3. [ ] Testar fluxo completo de usuário
4. [ ] Configurar backup automático do DB

### Curto Prazo (Primeiro Mês)
1. [ ] Implementar analytics de conversão
2. [ ] Adicionar more test coverage
3. [ ] Otimizar queries de banco de dados
4. [ ] Implementar email notifications

### Médio Prazo (Próximos 3 Meses)
1. [ ] Implementar automação de blogs (Fase 6 do todo.md)
2. [ ] Adicionar área de membros
3. [ ] Criar dashboard de analytics
4. [ ] Implementar suporte a múltiplos idiomas

---

## ✅ CHECKLIST FINAL PRÉ-LAUNCH

Antes de ir para produção, verificar:

- [ ] ✅ Todas as correções de bugs implementadas
- [ ] ✅ Build funciona sem erros
- [ ] ✅ TypeScript sem erros
- [ ] ❌ Arquivo .env criado e configurado (PENDENTE)
- [ ] ❌ Banco de dados MySQL configurado (PENDENTE)
- [ ] ❌ Migrations aplicadas (PENDENTE - requer DB)
- [ ] ❌ Stripe configurado (produtos + webhook) (PENDENTE)
- [ ] ❌ OAuth Manus configurado (PENDENTE)
- [ ] ❌ Forge API key obtida (PENDENTE)
- [ ] ❌ Testado em ambiente de staging (PENDENTE)
- [ ] ❌ HTTPS configurado (PENDENTE - parte do host)
- [ ] ❌ Domínio configurado (PENDENTE)
- [ ] ❌ Backups configurados (PENDENTE)

---

## 📞 SUPORTE E RECURSOS

### Documentação Externa
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Drizzle ORM](https://orm.drizzle.team/)
- [tRPC](https://trpc.io/)
- [Vite](https://vitejs.dev/)

### Contatos
- Email: carinefisio@hotmail.com
- Repositório: GitHub

---

## 🎉 RESUMO DO STATUS

### ✅ Pronto
- Código corrigido e funcionando
- Build passando
- TypeScript sem erros
- Documentação completa
- Estrutura de deploy preparada

### ⚠️ Pendente (Configurações Externas)
- Criação do arquivo .env
- Configuração do banco de dados
- Setup do Stripe
- Configuração do OAuth Manus
- Obtenção da Forge API key
- Deploy em servidor de produção

### 🎯 Próximo Passo
1. **CRIAR .env** seguindo o template em `.env.example`
2. **CONFIGURAR BANCO DE DADOS** MySQL
3. **EXECUTAR MIGRATIONS** com `pnpm db:push`
4. **TESTAR LOCALMENTE** com `pnpm dev`
5. **FAZER DEPLOY** na plataforma escolhida

---

**Status Final:** ✅ Código pronto para deploy. Aguardando configurações de infraestrutura.

**Tempo Estimado para Deploy Completo:** 2-4 horas (incluindo configurações externas)
