# 🚀 Elevare AI NeuroVendas

**Slogan:** "Venda como ciência, não como esperança."

**Descrição:** O pilar que une neurovendas, comportamento e engenharia de conversão.

Elevare Inteligência de Vendas é a camada lógica do faturamento: leitura de perfil, jornada emocional, gatilhos de decisão, ancoragem de preço, oferta irresistível e técnicas baseadas em neurociência aplicada ao consumo estético.

Não é manipulação — é comunicação profissional.

---

## 📋 Índice

- [⚡ Guia Rápido (5 min)](#-guia-rápido-5-min) - Para quem tem pressa!
- [🚀 Início Rápido para Iniciantes](#-início-rápido-para-iniciantes)
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Reference](#api-reference)
- [Deploy](#deploy)
- [Troubleshooting](#-troubleshooting)
- [Contribuição](#contribuição)
- [Guias para Iniciantes](#guias-para-iniciantes)

---

## ⚡ Guia Rápido (5 min)

**Quer começar AGORA?** 

```bash
# 1. Clone e instale
git clone https://github.com/Carine01/Elevador.Lucr-sia.git
cd Elevador.Lucr-sia
pnpm install

# 2. Configure banco
mysql -u root -p
CREATE DATABASE elevare_db;
exit;

# 3. Configure .env (copie .env.example e preencha)
cp .env.example .env
# Edite .env com suas credenciais

# 4. Rode!
pnpm db:push
pnpm dev
```

🎯 **Acesse:** http://localhost:3000

📖 **Detalhes completos:** [QUICK_START.md](QUICK_START.md)

---

## 🚀 Início Rápido para Iniciantes

**Novo no desenvolvimento? Comece aqui!** Este guia vai te levar do zero até ter o Elevare rodando no seu computador em ~15 minutos.

**⚡ Super Rápido?** Veja [QUICK_START.md](QUICK_START.md) para um resumo de 5 minutos!

### ✅ Pré-requisitos Mínimos

Antes de começar, instale no seu computador:

1. **Node.js 22+** (JavaScript runtime)
   - Download: https://nodejs.org/
   - Teste: `node --version` (deve mostrar v22.x.x)

2. **pnpm 10+** (Gerenciador de pacotes - mais rápido que npm)
   - Instale: `npm install -g pnpm`
   - Teste: `pnpm --version` (deve mostrar 10.x.x)

3. **MySQL 8+** (Banco de dados)
   - Windows/Mac: https://dev.mysql.com/downloads/mysql/
   - Linux: `sudo apt-get install mysql-server`
   - Teste: `mysql --version`

4. **Git** (Controle de versão)
   - Download: https://git-scm.com/
   - Teste: `git --version`

### 📦 Instalação em 5 Passos

#### Passo 1: Clone o Repositório

```bash
# Clone o projeto para seu computador
git clone https://github.com/Carine01/Elevador.Lucr-sia.git

# Entre na pasta do projeto
cd Elevador.Lucr-sia
```

#### Passo 2: Instale as Dependências

```bash
# Instala todas as bibliotecas necessárias (~2-3 minutos)
pnpm install
```

**O que acontece aqui?** O pnpm baixa todas as bibliotecas (pacotes) que o projeto precisa. É como baixar todos os "ingredientes" da receita.

#### Passo 3: Configure o Banco de Dados

```bash
# 1. Conecte ao MySQL (use sua senha)
mysql -u root -p

# 2. Dentro do MySQL, crie o banco de dados:
CREATE DATABASE elevare_db;

# 3. Saia do MySQL
exit;
```

#### Passo 4: Configure as Variáveis de Ambiente

```bash
# 1. Copie o arquivo de exemplo
cp .env.example .env

# 2. Abra o arquivo .env para editar
code .env
# ou
nano .env
```

**Configure no mínimo estas variáveis obrigatórias:**

```env
# Banco de dados (use SUA senha do MySQL)
DATABASE_URL=mysql://root:suasenha@localhost:3306/elevare_db

# Gere uma chave forte (rode este comando no terminal):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=cole_aqui_a_chave_gerada_com_32_caracteres

# OAuth Manus (obtenha em https://oauth.manus.im)
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=seu_app_id_aqui
OWNER_OPEN_ID=seu_owner_openid_aqui
```

**💡 Dica:** Para obter VITE_APP_ID e OWNER_OPEN_ID, você precisa criar uma conta em https://oauth.manus.im. Leia o guia completo em [ENV_GUIDE.md](ENV_GUIDE.md).

**🎯 MVP Rápido:** Se quiser apenas testar localmente, você pode deixar Stripe e Forge API em branco por enquanto. Configure depois quando precisar de pagamentos e IA.

#### Passo 5: Inicialize o Banco e Rode o Projeto

```bash
# 1. Crie as tabelas no banco de dados
pnpm db:push

# 2. Inicie o servidor de desenvolvimento
pnpm dev
```

**🎉 Pronto!** Acesse: http://localhost:3000

**O que esperar ver:**
- ✅ Servidor rodando na porta 3000
- ✅ Mensagem "✅ Todas as variáveis de ambiente obrigatórias foram validadas"
- ✅ Interface do Elevare carregando no navegador

### 🐛 Problemas Comuns?

**Erro: "Cannot connect to database"**
- ✅ Verifique se o MySQL está rodando: `sudo systemctl status mysql`
- ✅ Confirme usuário e senha no .env
- ✅ Teste a conexão: `mysql -u root -p`

**Erro: "Port 3000 already in use"**
- ✅ Mude a porta no .env: `PORT=3001`
- ✅ Ou pare o processo usando a porta 3000

**Erro: "JWT_SECRET must be at least 32 characters"**
- ✅ Gere uma nova chave: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- ✅ Cole no .env

**Mais problemas?** Consulte o [guia completo de troubleshooting](#troubleshooting).

### 📚 Próximos Passos

Agora que está rodando:

1. **Explore a interface** - Navegue pelas funcionalidades
2. **Leia a documentação** - [ENV_GUIDE.md](ENV_GUIDE.md) para entender as variáveis
3. **Configure pagamentos** - Quando quiser ativar o Stripe
4. **Configure IA** - Para usar geração de conteúdo
5. **Faça seu primeiro PR** - [FIRST_PR_GUIDE.md](FIRST_PR_GUIDE.md) te ensina como

### 🆘 Precisa de Ajuda?

- ⚡ **Guia Super Rápido:** [QUICK_START.md](QUICK_START.md)
- 📖 **Guia de Configuração .env:** [ENV_GUIDE.md](ENV_GUIDE.md)
- 🎯 **Primeiro PR:** [FIRST_PR_GUIDE.md](FIRST_PR_GUIDE.md)
- 🚀 **Deploy em Produção:** [DEPLOY.md](DEPLOY.md)
- 🔧 **Instruções Detalhadas:** [INSTRUCOES_IMPLEMENTACAO.md](INSTRUCOES_IMPLEMENTACAO.md)

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
- Node.js 22+
- pnpm 10+
- MySQL 8+

### Passos

1. **Clone o repositório**
```bash
git clone <repository-url>
cd elevare_ai_neurovendas
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

4. **Configure o banco de dados**
```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5000`

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/elevare_db

# OAuth
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=your_app_id
OWNER_OPEN_ID=your_owner_open_id

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_PRO_PLUS_PRICE_ID=price_your_pro_plus_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Forge API
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
```

### Configuração do Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Crie produtos e preços no dashboard
3. Configure o webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Copie as chaves e IDs para o `.env`

---

## 🚀 Uso

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Verificar tipos
pnpm check

# Formatar código
pnpm format
```

### Estrutura de Planos

| Plano | Preço | Créditos | Recursos |
|-------|-------|----------|----------|
| **Grátis** | R$ 0 | 1/mês | Radar de Bio básico |
| **PRO** | R$ 67,00/mês | 10/mês | E-books, Prompts, Anúncios |
| **PRO+** | R$ 117,00/mês | Ilimitado | Todos os recursos + Suporte VIP |

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

## 📚 Guias para Iniciantes

Documentação adicional para facilitar sua jornada:

### ⚡ Guia Rápido (5 min)
- **[QUICK_START.md](QUICK_START.md)** - Setup mínimo em 5 minutos
  - Comandos essenciais
  - Cola de comandos úteis
  - Troubleshooting rápido
  - Checklist de início

### 🔐 Configuração de Ambiente
- **[ENV_GUIDE.md](ENV_GUIDE.md)** - Guia completo de configuração do arquivo .env
  - Explicação detalhada de cada variável
  - Como obter chaves e credenciais
  - Boas práticas de segurança e LGPD
  - Troubleshooting de problemas comuns

### 🎯 Primeiro Pull Request
- **[FIRST_PR_GUIDE.md](FIRST_PR_GUIDE.md)** - Como fazer seu primeiro PR
  - Passo a passo para iniciantes em Git
  - Comandos essenciais explicados
  - Como usar GitHub Copilot
  - Templates e boas práticas

### 🚀 Deploy em Produção
- **[DEPLOY.md](DEPLOY.md)** - Guia completo de deploy
  - Configuração de servidores
  - Stripe, banco de dados e APIs
  - Monitoramento e escalabilidade

### 🔧 Implementação Técnica
- **[INSTRUCOES_IMPLEMENTACAO.md](INSTRUCOES_IMPLEMENTACAO.md)** - Detalhes técnicos
  - Configurações avançadas
  - Testes e validações
  - Troubleshooting técnico

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

#### ❌ Erro: "Cannot connect to database"

**Sintoma:** Aplicação não inicia e mostra erro de conexão com banco de dados.

**Soluções:**

1. **Verifique se o MySQL está rodando:**
   ```bash
   # Linux/Mac
   sudo systemctl status mysql
   # ou
   brew services list | grep mysql
   
   # Iniciar se necessário
   sudo systemctl start mysql
   # ou
   brew services start mysql
   ```

2. **Teste a conexão manualmente:**
   ```bash
   mysql -u root -p
   # Digite sua senha quando solicitado
   ```

3. **Verifique a DATABASE_URL no .env:**
   ```env
   # Formato correto:
   DATABASE_URL=mysql://usuario:senha@localhost:3306/elevare_db
   
   # Comum em produção (com SSL):
   DATABASE_URL=mysql://user:pass@host.psdb.cloud/elevare_db?ssl={"rejectUnauthorized":true}
   ```

4. **Crie o banco se não existir:**
   ```bash
   mysql -u root -p
   CREATE DATABASE elevare_db;
   exit;
   ```

5. **Execute as migrations:**
   ```bash
   pnpm db:push
   ```

---

#### ❌ Erro: "JWT_SECRET must be at least 32 characters"

**Sintoma:** Servidor não inicia e reclama do tamanho do JWT_SECRET.

**Solução:**

```bash
# Gere uma chave forte de 64 bytes (128 caracteres hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copie o resultado e cole no .env:
JWT_SECRET=resultado_aqui_vai_ter_pelo_menos_32_caracteres
```

**Exemplo de chave válida:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

#### ❌ Erro: "Port 3000 is already in use"

**Sintoma:** Não consegue iniciar o servidor porque a porta já está ocupada.

**Soluções:**

1. **Mude a porta no .env:**
   ```env
   PORT=3001
   # ou qualquer outra porta livre
   ```

2. **Ou pare o processo usando a porta 3000:**
   ```bash
   # Linux/Mac - encontre o processo
   lsof -i :3000
   
   # Mate o processo (use o PID do comando acima)
   kill -9 <PID>
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

---

#### ❌ Erro de autenticação OAuth

**Sintoma:** Login não funciona ou retorna erro "Invalid redirect_uri" ou "Invalid client_id".

**Soluções:**

1. **Verifique as variáveis no .env:**
   ```env
   OAUTH_SERVER_URL=https://oauth.manus.im  # Não altere!
   VITE_APP_ID=seu_app_id_aqui              # Do Dashboard Manus
   OWNER_OPEN_ID=seu_owner_openid_aqui      # Do Dashboard Manus
   ```

2. **Confirme se o app está registrado:**
   - Acesse https://oauth.manus.im
   - Verifique se sua aplicação existe
   - Confirme a URL de callback está correta

3. **URL de callback correta:**
   - Desenvolvimento: `http://localhost:3000/api/oauth/callback`
   - Produção: `https://seudominio.com/api/oauth/callback`

---

#### ❌ Erro no Stripe (Pagamentos)

**Sintomas:** 
- "No such price: 'price_...'"
- "Invalid API key"
- "Webhook signature verification failed"

**Soluções:**

1. **Verifique se está usando chaves do mesmo ambiente:**
   ```env
   # Desenvolvimento (TESTE)
   STRIPE_SECRET_KEY=sk_test_...
   
   # Produção (LIVE)
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. **Confirme os Price IDs:**
   - Dashboard Stripe → Products
   - Copie exatamente o "Price ID" de cada produto
   - Cole no .env:
   ```env
   STRIPE_PRO_PRICE_ID=price_1Abc123...
   STRIPE_PRO_PLUS_PRICE_ID=price_2Xyz789...
   ```

3. **Webhook em desenvolvimento:**
   ```bash
   # Instale Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Autentique
   stripe login
   
   # Escute webhooks localmente
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # Copie o "whsec_..." que aparece e cole no .env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Webhook em produção:**
   - Dashboard Stripe → Developers → Webhooks
   - Add endpoint: `https://seudominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`
   - Copie o "Signing secret"

5. **Teste com cartão de teste:**
   ```
   Número: 4242 4242 4242 4242
   Data: Qualquer data futura
   CVC: Qualquer 3 dígitos
   CEP: Qualquer CEP
   ```

---

#### ❌ Erro: "OPENAI_API_KEY is not configured" ou erro de IA

**Sintoma:** Funcionalidades de IA (e-books, prompts, anúncios) não funcionam.

**Solução:**

1. **Configure as variáveis do Forge API:**
   ```env
   BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
   BUILT_IN_FORGE_API_KEY=sua_forge_api_key
   ```

2. **Obtenha a API Key:**
   - Acesse Dashboard Manus
   - Vá em "API Keys" ou "Forge API"
   - Gere uma nova chave ou copie existente
   - Cole no .env

3. **Verifique se a chave é válida:**
   ```bash
   # Teste básico (substitua pela sua chave)
   curl -H "Authorization: Bearer sua_forge_api_key" \
        https://api.forge.manus.im/health
   ```

---

#### ❌ Erro: "CORS blocked" ou "Access-Control-Allow-Origin"

**Sintoma:** Frontend não consegue chamar a API, erro de CORS no console do navegador.

**Solução:**

1. **Adicione sua origem em ALLOWED_ORIGINS:**
   ```env
   # Desenvolvimento
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   
   # Produção (sem espaços!)
   ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
   ```

2. **Verifique se não há espaços:**
   ```env
   # ❌ ERRADO (tem espaços)
   ALLOWED_ORIGINS=http://localhost:3000, http://localhost:5173
   
   # ✅ CORRETO (sem espaços)
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

3. **Reinicie o servidor após mudar:**
   ```bash
   # Pare o servidor (Ctrl+C)
   # Inicie novamente
   pnpm dev
   ```

---

#### ❌ Erro: "pnpm: command not found"

**Sintoma:** Comando pnpm não é reconhecido.

**Solução:**

```bash
# Instale o pnpm globalmente
npm install -g pnpm

# Verifique a instalação
pnpm --version
```

---

#### ❌ Erro: Build falha ou "Module not found"

**Sintoma:** Build não completa ou mostra erros de módulos faltando.

**Soluções:**

1. **Limpe e reinstale dependências:**
   ```bash
   # Remova node_modules e lock file
   rm -rf node_modules pnpm-lock.yaml
   
   # Limpe cache
   pnpm store prune
   
   # Reinstale
   pnpm install
   ```

2. **Verifique a versão do Node:**
   ```bash
   node --version
   # Deve ser v22.x.x ou superior
   ```

3. **Use a versão correta do Node:**
   ```bash
   # Com nvm (recomendado)
   nvm install 22
   nvm use 22
   ```

---

#### ❌ Erro: "Too many requests" ou Rate Limit

**Sintoma:** API retorna erro 429 após várias requisições.

**O que é:** Proteção contra abuso - limite de requisições por IP/usuário.

**Solução:**

- ✅ Aguarde 15 minutos (limite reseta automaticamente)
- ✅ Faça login (usuários autenticados têm limites maiores)
- ✅ Em desenvolvimento, você pode desabilitar temporariamente (não recomendado)

**Limites padrão:**
- Anônimos: 10 req/15min
- Autenticados: 100 req/15min

---

### 🆘 Ainda com Problemas?

Se nenhuma solução acima funcionou:

1. **Verifique os logs do servidor**
   ```bash
   # Logs aparecem no terminal onde rodou `pnpm dev`
   # Procure por mensagens de erro em vermelho
   ```

2. **Consulte guias detalhados:**
   - [ENV_GUIDE.md](ENV_GUIDE.md) - Problemas de configuração
   - [DEPLOY.md](DEPLOY.md) - Problemas de deploy
   - [INSTRUCOES_IMPLEMENTACAO.md](INSTRUCOES_IMPLEMENTACAO.md) - Troubleshooting técnico

3. **Limpe tudo e comece do zero:**
   ```bash
   # Última solução - reset completo
   git clean -fdx
   pnpm install
   cp .env.example .env
   # Configure o .env novamente
   pnpm db:push
   pnpm dev
   ```

4. **Abra uma Issue no GitHub:**
   - Descreva o problema detalhadamente
   - Inclua mensagens de erro completas
   - Informe seu sistema operacional e versões (Node, pnpm, MySQL)

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

- **Elevare Team** - Inteligência de Vendas para Estética.

---

## 🙏 Agradecimentos

- Comunidade de profissionais de estética
- Carine Marques- Fisioterapeuta autante na Estética há mais de 20 anos.
- Contribuidores open source

---

**Elevare AI NeuroVendas** - Venda como ciência, não como esperança. 🚀
