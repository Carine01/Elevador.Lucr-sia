# 🔐 Guia de Secrets - Elevador.Lucr-sia

Este guia lista todos os secrets necessários para o projeto e como obtê-los.

## 📋 Índice

1. [Secrets Obrigatórios](#secrets-obrigatórios)
2. [Onde Configurar](#onde-configurar)
3. [Como Obter Cada Secret](#como-obter-cada-secret)
4. [Configuração via GitHub CLI](#configuração-via-github-cli)
5. [Ordem Recomendada](#ordem-recomendada)
6. [Troubleshooting](#troubleshooting)

---

## 🔑 Secrets Obrigatórios

### 1. Database (Railway/PlanetScale)

```
DATABASE_URL=mysql://user:password@host:3306/database_name
```

**Descrição:** URL de conexão com o banco de dados MySQL.

---

### 2. OAuth (Manus.im)

```
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=your_app_id
OWNER_OPEN_ID=your_owner_open_id
```

**Descrição:** Credenciais para autenticação OAuth via Manus.

---

### 3. JWT

```
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
```

**Descrição:** Chave secreta para assinar tokens JWT (mínimo 32 caracteres).

---

### 4. Stripe (Pagamentos)

```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_PRO_PLUS_PRICE_ID=price_your_pro_plus_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Descrição:** Credenciais para processamento de pagamentos via Stripe.

---

### 5. Forge API (IA)

```
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
```

**Descrição:** API para geração de conteúdo com IA (LLM e geração de imagens).

---

### 6. Environment

```
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://your-domain.com
```

**Descrição:** Configurações gerais do ambiente.

---

## 🎯 Onde Configurar

### GitHub Actions (CI/CD)

1. Acesse: `https://github.com/Carine01/Elevador.Lucr-sia/settings/secrets/actions`
2. Clique em "New repository secret"
3. Adicione cada secret da lista acima

### Vercel (Deploy)

1. Acesse: `https://vercel.com/[seu-username]/[seu-projeto]/settings/environment-variables`
2. Adicione as variáveis de ambiente
3. Selecione os ambientes (Production, Preview, Development)

### Railway (Database + Backend)

1. Acesse seu projeto no Railway
2. Vá em "Variables"
3. Adicione as variáveis necessárias

---

## 🔍 Como Obter Cada Secret

### DATABASE_URL (Railway)

**Opção 1: Railway Dashboard**

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Adicione um banco MySQL
4. Copie a URL de conexão em "Connect"

**Opção 2: Railway CLI**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Criar projeto
railway init

# Adicionar MySQL
railway add mysql

# Obter URL
railway variables
```

---

### OAUTH Credentials (Manus.im)

1. Acesse o painel Manus: `https://oauth.manus.im`
2. Crie uma nova aplicação
3. Anote o `APP_ID` e `OWNER_OPEN_ID`
4. Configure as URLs de callback

---

### JWT_SECRET

**Gerar localmente:**

```bash
# Opção 1: OpenSSL (recomendado)
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Online (use com cuidado)
# https://www.random.org/strings/
```

⚠️ **IMPORTANTE:** Use caracteres seguros (mínimo 32 caracteres).

---

### STRIPE Credentials

**1. Criar Conta Stripe:**

1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta (ou faça login)
3. Vá para o Dashboard

**2. Obter Secret Key:**

1. Dashboard → Developers → API Keys
2. Copie a "Secret key" (começa com `sk_live_` ou `sk_test_`)

**3. Criar Produtos e Prices:**

```bash
# Criar produto PRO
stripe products create \
  --name "Elevare PRO" \
  --description "Plano PRO com 10 créditos/mês"

# Criar price do PRO
stripe prices create \
  --product prod_XXX \
  --unit-amount 2900 \
  --currency brl \
  --recurring interval=month

# Criar produto PRO+
stripe products create \
  --name "Elevare PRO+" \
  --description "Plano PRO+ com créditos ilimitados"

# Criar price do PRO+
stripe prices create \
  --product prod_YYY \
  --unit-amount 7900 \
  --currency brl \
  --recurring interval=month
```

**4. Configurar Webhook:**

1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copie o "Signing secret" (começa com `whsec_`)

---

### FORGE_API Credentials (Manus.im)

1. Acesse o painel Manus
2. Solicite acesso à Forge API
3. Anote a `API_KEY` fornecida
4. Use a URL: `https://api.forge.manus.im`

---

## 🚀 Configuração via GitHub CLI

```bash
# Instalar GitHub CLI (se necessário)
brew install gh  # macOS
# ou
sudo apt install gh  # Linux

# Login
gh auth login

# Configurar todos os secrets de uma vez
gh secret set DATABASE_URL -b "mysql://user:pass@host:3306/db"
gh secret set OAUTH_SERVER_URL -b "https://oauth.manus.im"
gh secret set VITE_APP_ID -b "your_app_id"
gh secret set OWNER_OPEN_ID -b "your_owner_open_id"
gh secret set JWT_SECRET -b "$(openssl rand -base64 32)"
gh secret set STRIPE_SECRET_KEY -b "sk_live_..."
gh secret set STRIPE_PRO_PRICE_ID -b "price_..."
gh secret set STRIPE_PRO_PLUS_PRICE_ID -b "price_..."
gh secret set STRIPE_WEBHOOK_SECRET -b "whsec_..."
gh secret set BUILT_IN_FORGE_API_URL -b "https://api.forge.manus.im"
gh secret set BUILT_IN_FORGE_API_KEY -b "your_forge_api_key"
gh secret set NODE_ENV -b "production"
gh secret set ALLOWED_ORIGINS -b "https://your-domain.com"
```

---

## 📌 Ordem Recomendada de Configuração

### 1️⃣ Primeiro: Database (Railway)

- É a base para tudo funcionar
- Sem banco, a aplicação não inicia

### 2️⃣ Segundo: OAuth + JWT

- Necessários para autenticação
- JWT pode ser gerado localmente

### 3️⃣ Terceiro: Stripe (Modo Test)

- Use chaves de teste primeiro (`sk_test_`)
- Teste o fluxo de pagamento
- Depois migre para produção (`sk_live_`)

### 4️⃣ Quarto: Forge API

- Necessário para funcionalidades de IA
- Pode ser o último se não usar IA imediatamente

### 5️⃣ Quinto: Environment

- Configure `NODE_ENV` e `ALLOWED_ORIGINS`
- Ajuste conforme seu domínio

---

## 🆘 Troubleshooting

### Erro: "Database connection failed"

**Causa:** `DATABASE_URL` incorreto ou banco inacessível.

**Solução:**

```bash
# Testar conexão
mysql -h host -u user -p database_name

# Verificar se Railway está rodando
railway status
```

---

### Erro: "Invalid JWT_SECRET"

**Causa:** JWT_SECRET tem menos de 32 caracteres.

**Solução:**

```bash
# Gerar novo JWT_SECRET válido
openssl rand -base64 32
```

---

### Erro: "Stripe webhook signature verification failed"

**Causa:** `STRIPE_WEBHOOK_SECRET` incorreto ou endpoint mal configurado.

**Solução:**

1. Verifique se o endpoint está correto
2. Copie novamente o Webhook Secret do Stripe
3. Teste localmente com Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

### Erro: "OAuth authentication failed"

**Causa:** `VITE_APP_ID` ou `OWNER_OPEN_ID` incorretos.

**Solução:**

1. Verifique as credenciais no painel Manus
2. Confirme que as URLs de callback estão corretas
3. Teste com `curl`:

```bash
curl -X POST https://oauth.manus.im/verify \
  -H "Content-Type: application/json" \
  -d '{"app_id": "your_app_id"}'
```

---

## 📚 Recursos Úteis

- **Railway Docs:** https://docs.railway.app
- **Stripe Docs:** https://stripe.com/docs
- **Manus Docs:** (solicitar acesso)
- **GitHub Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

## ✅ Checklist Final

Antes de fazer deploy, confirme:

- [ ] Todos os secrets configurados no GitHub
- [ ] Variáveis de ambiente configuradas no Vercel/Railway
- [ ] Database acessível e populado
- [ ] Stripe em modo test funcionando
- [ ] OAuth configurado corretamente
- [ ] JWT_SECRET com 32+ caracteres
- [ ] Webhook do Stripe testado
- [ ] Build local passou sem erros
- [ ] Testes passando

---

**Dúvidas?** Abra uma issue no GitHub ou consulte a documentação oficial de cada serviço.
