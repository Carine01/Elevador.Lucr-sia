# 🚀 Elevare AI NeuroVendas

**Slogan:** "Venda como ciência, não como esperança."

**Descrição:** O pilar que une neurovendas, comportamento e engenharia de conversão.

Elevare Inteligência de Vendas é a camada lógica do faturamento: leitura de perfil, jornada emocional, gatilhos de decisão, ancoragem de preço, oferta irresistível e técnicas baseadas em neurociência aplicada ao consumo estético.

Não é manipulação — é comunicação profissional.

---

## 📋 Índice

- [🚀 Quick Start](#-quick-start)
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [API Reference](#api-reference)
- [Deploy](#deploy)
- [Troubleshooting](#-troubleshooting)
- [Contribuição](#contribuição)

---

## 🚀 Quick Start

**Para começar rapidamente:**

```bash
# 1. Clone e entre no diretório
git clone <repository-url>
cd elevare_ai_neurovendas

# 2. Execute o setup automático
./scripts/setup.sh

# 3. Configure suas credenciais no .env
nano .env

# 4. Valide a configuração
./scripts/check-env.sh

# 5. Execute as migrations
pnpm db:push

# 6. Inicie o servidor
pnpm dev
```

Pronto! Acesse http://localhost:3000

> **Primeira vez?** Leia a seção [Instalação](#-instalação) completa abaixo.

---

## 🎯 Visão Geral

Elevare AI NeuroVendas é uma plataforma SaaS completa para profissionais de estética que desejam melhorar suas vendas através de técnicas de neurovendas e inteligência artificial.

### Manifesto

- **Vender é traduzir valor, não baixar preço.**
- **É conduzir, não pressionar.**
- **É mostrar o caminho da transformação que a cliente já deseja.**

### Pitch

A cliente não compra o procedimento — compra a promessa.
Elevare Inteligência de Vendas ensina você a entregar exatamente essa promessa.

---

## ✨ Funcionalidades

### 1. Radar de Bio (Lead Magnet) ✅
- Análise de bio do Instagram com IA
- Diagnóstico personalizado com pontuação
- Recomendações práticas
- Captura de leads (email/WhatsApp)
- Integração com Gemini API

### 2. Sistema de Monetização (Stripe) ✅
- 3 planos: Grátis, PRO (R$ 29/mês), PRO+ (R$ 79/mês)
- Checkout seguro com Stripe
- Gerenciamento de assinaturas
- Sistema de créditos
- Portal do cliente

### 3. Gerador de E-books ✅
- Criação automática de e-books com IA
- Customização de tom e público-alvo
- Geração de capas com IA
- Export para PDF (em desenvolvimento)
- Biblioteca de e-books

### 4. Robô Produtor ✅
- **Gerador de Prompts:** Cria prompts otimizados para Midjourney/DALL-E/Stable Diffusion
- **Gerador de Anúncios:** Copy de anúncios para Instagram/Facebook/Google
- Baseado em técnicas de neurovendas
- Múltiplas variações

### 5. Dashboard Completo ✅
- Estatísticas em tempo real
- Gerenciamento de créditos
- Acesso rápido a todas as funcionalidades
- Interface moderna e responsiva

---

## 🛠 Tecnologias

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes
- **tRPC** - Type-safe API
- **Wouter** - Routing
- **React Query** - Data fetching

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **tRPC** - API framework
- **Drizzle ORM** - Database ORM
- **MySQL** - Database
- **Stripe** - Pagamentos
- **OpenAI/Gemini** - IA

### DevOps
- **Vite** - Build tool
- **pnpm** - Package manager
- **ESBuild** - Bundler

---

## 📦 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm 10+** - Será instalado automaticamente se necessário
- **MySQL 8+** - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

### Instalação Rápida (Recomendado)

Use nosso script de setup automatizado:

```bash
# 1. Clone o repositório
git clone <repository-url>
cd elevare_ai_neurovendas

# 2. Execute o script de setup (Linux/Mac)
./scripts/setup.sh

# O script irá:
# - Verificar pré-requisitos (Node.js, pnpm, MySQL)
# - Instalar dependências automaticamente
# - Criar arquivo .env a partir do template
# - Gerar JWT_SECRET seguro
# - Oferecer executar migrations do banco
```

### Instalação Manual

Se preferir fazer manualmente:

```bash
# 1. Clone o repositório
git clone <repository-url>
cd elevare_ai_neurovendas

# 2. Instale pnpm (se não tiver)
npm install -g pnpm

# 3. Instale as dependências
pnpm install

# 4. Configure as variáveis de ambiente
cp .env.example .env

# 5. Edite o arquivo .env com suas credenciais
nano .env  # ou use seu editor preferido

# 6. Gere um JWT_SECRET seguro (mínimo 32 caracteres)
openssl rand -base64 48

# 7. Valide as variáveis de ambiente
./scripts/check-env.sh

# 8. Execute as migrations do banco de dados
pnpm db:push

# 9. Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

> **Nota:** Se a porta 3000 estiver ocupada, o servidor buscará automaticamente uma porta disponível.

---

## ⚙️ Configuração

### Variáveis de Ambiente

O projeto usa um arquivo `.env` para configuração. Todas as variáveis estão documentadas em `.env.example`.

#### Variáveis Obrigatórias

```env
# Database (MySQL)
DATABASE_URL=mysql://user:password@localhost:3306/elevare_db

# OAuth (Manus)
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=your_app_id
OWNER_OPEN_ID=your_owner_open_id

# JWT (mínimo 32 caracteres)
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters

# Ambiente
NODE_ENV=development
```

#### Variáveis do Stripe (Obrigatórias para Monetização)

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_xxx  # Use sk_test_ em dev, sk_live_ em prod
STRIPE_PRO_PRICE_ID=price_xxx   # ID do produto PRO (R$ 29/mês)
STRIPE_PRO_PLUS_PRICE_ID=price_xxx  # ID do produto PRO+ (R$ 79/mês)
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Secret do webhook
```

#### Variáveis da Forge API (Obrigatórias para IA)

```env
# Forge API (para LLM e geração de imagens)
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
```

#### Validação de Variáveis

Use nosso script de validação:

```bash
./scripts/check-env.sh
```

O script verifica:
- ✓ Variáveis obrigatórias estão definidas
- ✓ JWT_SECRET tem tamanho mínimo (32 chars)
- ✓ Formato correto de URLs e chaves
- ✓ Diferenciação entre desenvolvimento e produção

### Configuração do MySQL

1. **Instale o MySQL 8+**
   ```bash
   # Ubuntu/Debian
   sudo apt install mysql-server
   
   # macOS (Homebrew)
   brew install mysql
   ```

2. **Crie o banco de dados**
   ```sql
   CREATE DATABASE elevare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'elevare_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
   GRANT ALL PRIVILEGES ON elevare_db.* TO 'elevare_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Atualize o DATABASE_URL no .env**
   ```env
   DATABASE_URL=mysql://elevare_user:sua_senha_segura@localhost:3306/elevare_db
   ```

4. **Execute as migrations**
   ```bash
   pnpm db:push
   ```

### Configuração do Stripe

#### 1. Criar Conta e Produtos

1. Crie uma conta no [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Ative o modo de teste (toggle no canto superior direito)
3. Vá em **Products** → **Add Product**

**Criar Produto PRO:**
- Nome: `Elevare PRO`
- Descrição: `Plano PRO - 10 créditos/mês`
- Preço: `R$ 29,00 BRL`
- Tipo: `Recurring (Mensal)`
- Copie o **Price ID** (formato: `price_xxxxx`)

**Criar Produto PRO+:**
- Nome: `Elevare PRO+`
- Descrição: `Plano PRO+ - Créditos ilimitados`
- Preço: `R$ 79,00 BRL`
- Tipo: `Recurring (Mensal)`
- Copie o **Price ID**

#### 2. Configurar Webhook

1. Vá em **Developers** → **Webhooks**
2. Click em **Add endpoint**
3. **Endpoint URL:** `https://seu-dominio.com/api/stripe/webhook`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o **Signing secret** (formato: `whsec_xxxxx`)

#### 3. Testar Webhook Localmente

Use o Stripe CLI para testar webhooks em desenvolvimento:

```bash
# Instale o Stripe CLI (se ainda não tiver)
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe

# Use nosso script de teste
./scripts/test-webhook.sh

# Ou manualmente
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

#### 4. Atualizar .env

Adicione as chaves ao `.env`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PRO_PLUS_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### Configuração do OAuth (Manus)

1. Acesse [Manus Apps](https://manus.im/apps)
2. Crie uma nova aplicação
3. Configure as URLs de callback
4. Copie o **App ID** e **Owner Open ID**
5. Atualize o `.env`:
   ```env
   VITE_APP_ID=seu_app_id
   OWNER_OPEN_ID=seu_owner_open_id
   OAUTH_SERVER_URL=https://oauth.manus.im
   ```

### Configuração da Forge API

1. Acesse [Manus Forge](https://manus.im/forge)
2. Gere uma chave de API
3. Atualize o `.env`:
   ```env
   BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
   BUILT_IN_FORGE_API_KEY=sua_chave_api
   ```

---

## 🚀 Uso

### Comandos de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev
# Servidor: http://localhost:3000
# Hot-reload ativado

# Build para produção
pnpm build
# Gera arquivos otimizados em /dist

# Iniciar servidor de produção
pnpm start
# Requer build anterior

# Verificar tipos TypeScript
pnpm check
# Valida tipos sem gerar código

# Formatar código
pnpm format
# Aplica Prettier em todos os arquivos

# Executar testes
pnpm test
# Roda suite de testes com Vitest

# Migrations do banco de dados
pnpm db:push
# Aplica schema Drizzle no MySQL
```

### 📜 Scripts Disponíveis

Além dos comandos do package.json, temos scripts bash úteis:

```bash
# Setup completo automatizado
./scripts/setup.sh
# - Verifica Node.js, pnpm, MySQL
# - Instala dependências
# - Cria .env com JWT_SECRET gerado
# - Opção de executar migrations

# Validação de ambiente
./scripts/check-env.sh
# - Valida todas as variáveis obrigatórias
# - Diferencia dev vs produção
# - Output colorido com status

# Teste de webhook Stripe
./scripts/test-webhook.sh
# - Verifica Stripe CLI
# - Inicia listener de webhooks
# - Encaminha para localhost
```

### Estrutura de Planos

| Plano | Preço | Créditos | Recursos |
|-------|-------|----------|----------|
| **Grátis** | R$ 0 | 1/mês | Radar de Bio básico |
| **PRO** | R$ 29/mês | 10/mês | E-books, Prompts, Anúncios |
| **PRO+** | R$ 79/mês | Ilimitado | Todos os recursos + Suporte VIP |

### Fluxo de Checkout

1. Usuário seleciona plano na página `/pricing`
2. Redirecionado para Stripe Checkout
3. Após pagamento:
   - **Sucesso:** `/checkout/success` → Auto-redirect para dashboard
   - **Cancelado:** `/checkout/cancelled` → Opções de voltar
4. Webhook do Stripe atualiza assinatura no banco
5. Créditos são ativados automaticamente

---

## 📁 Estrutura do Projeto

```
elevare_ai_neurovendas/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários
│   └── index.html
├── server/                # Backend Node.js
│   ├── _core/            # Core do servidor
│   ├── routers/          # Routers tRPC
│   │   ├── subscription.ts
│   │   ├── bioRadar.ts
│   │   └── content.ts
│   └── db.ts
├── drizzle/              # Schema e migrations
│   └── schema.ts
├── shared/               # Código compartilhado
└── package.json
```

---

## 🔌 API Reference

### Subscription Router

```typescript
// Obter planos disponíveis
trpc.subscription.getPlans.useQuery()

// Obter assinatura do usuário
trpc.subscription.getSubscription.useQuery()

// Criar checkout
trpc.subscription.createCheckout.useMutation({
  plan: "pro",
  successUrl: "/dashboard",
  cancelUrl: "/pricing"
})

// Cancelar assinatura
trpc.subscription.cancelSubscription.useMutation()
```

### BioRadar Router

```typescript
// Analisar bio
trpc.bioRadar.analyze.useMutation({
  instagramHandle: "usuario"
})

// Salvar lead
trpc.bioRadar.saveLead.useMutation({
  diagnosisId: 1,
  email: "email@example.com",
  whatsapp: "11999999999"
})
```

### Content Router

```typescript
// Gerar e-book
trpc.content.generateEbook.useMutation({
  topic: "Harmonização Facial",
  tone: "professional",
  chapters: 5
})

// Gerar prompt
trpc.content.generatePrompt.useMutation({
  description: "Clínica moderna",
  style: "professional",
  platform: "dalle"
})

// Gerar anúncio
trpc.content.generateAd.useMutation({
  product: "Botox",
  platform: "instagram",
  objective: "conversion"
})
```

---

## 🌐 Deploy

### Preparação

1. **Build do projeto**
```bash
pnpm build
```

2. **Configure variáveis de ambiente de produção**

3. **Configure o banco de dados**
```bash
pnpm db:push
```

### Plataformas Recomendadas

- **Frontend + Backend:** Vercel, Railway, Render
- **Database:** PlanetScale, Railway, AWS RDS
- **Storage:** AWS S3, Cloudflare R2

---

## 🎨 Customização

### Temas e Cores

As cores principais estão definidas em `client/src/index.css`:

- **Primary:** Amber/Orange (gradient)
- **Secondary:** Purple/Pink
- **Accent:** Blue/Cyan

### Branding

Atualize os seguintes arquivos:
- `client/public/favicon.ico`
- `client/index.html` (meta tags)
- Componentes com logo/marca

---

## 🐛 Troubleshooting

### Problemas Comuns e Soluções

#### ❌ Erro: "JWT_SECRET must be at least 32 characters"

**Causa:** JWT_SECRET muito curto ou não definido.

**Solução:**
```bash
# Gere um JWT_SECRET seguro
openssl rand -base64 48

# Ou use o script de setup
./scripts/setup.sh
```

#### ❌ Erro de conexão com banco de dados

**Sintomas:**
- `Error: connect ECONNREFUSED`
- `ER_ACCESS_DENIED_ERROR`

**Soluções:**
1. Verifique se o MySQL está rodando:
   ```bash
   # Linux
   sudo systemctl status mysql
   
   # macOS
   brew services list
   ```

2. Teste a conexão:
   ```bash
   mysql -u elevare_user -p elevare_db
   ```

3. Verifique o DATABASE_URL no `.env`:
   ```env
   DATABASE_URL=mysql://usuario:senha@localhost:3306/nome_banco
   ```

4. Re-execute as migrations:
   ```bash
   pnpm db:push
   ```

#### ❌ Erro de autenticação OAuth

**Sintomas:**
- Redirect loop ao fazer login
- Erro "Invalid app ID"

**Soluções:**
1. Verifique as variáveis no `.env`:
   ```env
   VITE_APP_ID=seu_app_id_correto
   OAUTH_SERVER_URL=https://oauth.manus.im
   OWNER_OPEN_ID=seu_owner_id
   ```

2. Confirme se o app está registrado em [Manus Apps](https://manus.im/apps)

3. Verifique se as URLs de callback estão configuradas corretamente

#### ❌ Erro no Stripe

**Sintomas:**
- Checkout não funciona
- Webhook não recebe eventos
- "Invalid API key"

**Soluções:**

1. **Chaves inválidas:**
   ```bash
   # Verifique se está usando chaves corretas
   # Teste: sk_test_xxx
   # Produção: sk_live_xxx
   ```

2. **Price IDs incorretos:**
   ```bash
   # Verifique no Stripe Dashboard se os IDs estão corretos
   # Formato: price_xxxxxxxxxxxxx
   ```

3. **Webhook não funciona:**
   - Em desenvolvimento, use o Stripe CLI:
     ```bash
     ./scripts/test-webhook.sh
     ```
   - Verifique os logs do servidor para erros de validação
   - Confirme se o STRIPE_WEBHOOK_SECRET está correto

4. **Validar configuração:**
   ```bash
   # Use nosso validador
   ./scripts/check-env.sh
   ```

#### ❌ Porta já em uso

**Sintoma:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solução:**
O servidor busca automaticamente uma porta disponível, mas você pode:
1. Matar o processo na porta:
   ```bash
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Ou mudar a porta no `.env`:
   ```env
   PORT=3001
   ```

#### ❌ Erro no build

**Sintoma:** `pnpm build` falha

**Soluções:**
1. Limpe o cache e reinstale:
   ```bash
   rm -rf node_modules dist
   pnpm install
   ```

2. Verifique erros de TypeScript:
   ```bash
   pnpm check
   ```

3. Verifique se todas as variáveis de ambiente estão definidas

#### ❌ Problemas com pnpm

**Sintoma:** `pnpm: command not found`

**Solução:**
```bash
npm install -g pnpm@10.4.1
```

#### 🔍 Debug Avançado

**Ativar logs detalhados:**
```bash
# No .env
NODE_ENV=development

# Ver logs do servidor
pnpm dev
```

**Verificar saúde do sistema:**
```bash
# Verificar Node.js
node --version  # Deve ser 18+

# Verificar pnpm
pnpm --version  # Deve ser 10+

# Verificar MySQL
mysql --version  # Deve ser 8+

# Verificar todas as variáveis de ambiente
./scripts/check-env.sh

# Testar webhook do Stripe
./scripts/test-webhook.sh
```

### Ainda com problemas?

1. **Consulte a documentação completa:** Veja `.env.example` e os comentários no código
2. **Issues no GitHub:** Abra uma issue com detalhes do erro
3. **Logs do servidor:** Sempre inclua os logs ao reportar problemas
4. **Suporte:** Entre em contato pelo email de suporte

### Logs Úteis

**Ver logs do servidor:**
```bash
# Modo desenvolvimento (verbose)
pnpm dev

# Ver apenas erros
pnpm dev 2>&1 | grep ERROR
```

**Ver logs do MySQL:**
```bash
# Linux
sudo tail -f /var/log/mysql/error.log

# macOS
tail -f /usr/local/var/mysql/*.err
```

**Ver logs do Stripe CLI:**
```bash
stripe logs tail
```

---

## 📝 Roadmap

### Fase 1 ✅
- [x] Dashboard Principal
- [x] Autenticação OAuth
- [x] Radar de Bio
- [x] Sistema de Monetização (Stripe)

### Fase 2 ✅
- [x] Gerador de E-books
- [x] Robô Produtor (Prompts + Anúncios)

### Fase 3 (Próximas)
- [ ] Automação de Blogs
- [ ] RobôChat (Assistente IA)
- [ ] Analytics avançado
- [ ] Integração com plataformas de blog
- [ ] Text-to-Speech para audiobooks
- [ ] Export PDF de e-books

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

- **Elevare Team** - Inteligência de Vendas para Estética

---

## 🙏 Agradecimentos

- Comunidade de profissionais de estética
- Equipe Manus
- Contribuidores open source

---

**Elevare AI NeuroVendas** - Venda como ciência, não como esperança. 🚀
