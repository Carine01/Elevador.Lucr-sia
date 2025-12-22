# 🚀 GUIA RÁPIDO DE SETUP - Elevare AI NeuroVendas

Este guia permite colocar o app rodando em **4-6 horas** para MVP interno.

---

## ✅ PRÉ-REQUISITOS

- Node.js 20+ instalado
- MySQL 8+ instalado e rodando
- pnpm 10+ instalado
- Terminal com acesso ao repositório

---

## 📦 PASSO 1: INSTALAR DEPENDÊNCIAS (5 min)

```bash
# Navegar para o diretório do projeto
cd /caminho/para/Elevador.Lucr-sia

# Instalar pnpm globalmente (se não tiver)
npm install -g pnpm@10.4.1

# Instalar dependências do projeto
pnpm install
```

**Validação:**
```bash
pnpm --version  # Deve mostrar 10.4.1 ou superior
```

---

## 🔧 PASSO 2: CONFIGURAR VARIÁVEIS DE AMBIENTE (15 min)

### Criar arquivo .env

```bash
cp .env.example .env
```

### Editar .env com configurações mínimas

```env
# ====================================
# CONFIGURAÇÃO MÍNIMA PARA DEV
# ====================================

# Database - AJUSTAR com suas credenciais MySQL
DATABASE_URL=mysql://root:sua_senha@localhost:3306/elevare_db

# OAuth Manus (necessário, mas pode usar valores de teste)
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=dev_test_app_id_for_local_development_only
OWNER_OPEN_ID=dev_owner_test_for_local_only

# JWT Secret (OBRIGATÓRIO - mínimo 32 caracteres)
JWT_SECRET=desenvolvimento_jwt_secret_key_minimo_32_caracteres_requerido_aqui

# Stripe (OPCIONAL para desenvolvimento - deixar vazio)
STRIPE_SECRET_KEY=
STRIPE_ESSENCIAL_PRICE_ID=
STRIPE_PROFISSIONAL_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# Forge API (OPCIONAL inicialmente - necessário para funcionalidades IA)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=

# Environment
NODE_ENV=development
PORT=3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 🗄️ PASSO 3: CONFIGURAR BANCO DE DADOS (30 min)

### Opção A: MySQL Local

```bash
# 1. Iniciar MySQL (Ubuntu/Debian)
sudo systemctl start mysql

# 2. Acessar MySQL
mysql -u root -p

# 3. Executar comandos SQL
```

```sql
-- Criar database
CREATE DATABASE elevare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário (OPCIONAL - pode usar root)
CREATE USER 'elevare_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON elevare_db.* TO 'elevare_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES LIKE 'elevare%';
EXIT;
```

```bash
# 4. Atualizar .env com credenciais
# DATABASE_URL=mysql://elevare_user:sua_senha_segura@localhost:3306/elevare_db
```

### Opção B: Docker (Alternativa Rápida)

```bash
# Iniciar MySQL em container Docker
docker run --name elevare-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=elevare_db \
  -p 3306:3306 \
  -d mysql:8

# Usar no .env:
# DATABASE_URL=mysql://root:root@localhost:3306/elevare_db
```

### Aplicar Migrations

```bash
pnpm db:push
```

**Saída esperada:**
```
✓ Applying migrations...
✓ 4 migrations applied successfully
```

---

## 🚀 PASSO 4: INICIAR SERVIDOR (5 min)

```bash
pnpm dev
```

**Saída esperada:**
```
✅ Todas as variáveis de ambiente obrigatórias foram validadas
[OAuth] Initialized with baseURL: https://oauth.manus.im
[INFO] Server running on http://localhost:3000/
```

### Abrir no navegador

```
http://localhost:3000/
```

**Você deve ver:**
- ✅ Landing page carregando
- ✅ Sem erros no console do navegador
- ✅ Sem erros no terminal do servidor

---

## 🧪 PASSO 5: CRIAR USUÁRIO DE TESTE (15 min)

Como OAuth requer configuração externa, criar usuário manualmente no banco:

```bash
mysql -u root -p elevare_db
```

```sql
-- Inserir usuário de teste
INSERT INTO users (openId, name, email, loginMethod, role) 
VALUES (
  'dev_test_user_001', 
  'Admin Teste', 
  'admin@elevare.test', 
  'manual', 
  'admin'
);

-- Verificar ID do usuário criado
SELECT id, name, email FROM users;

-- Criar assinatura profissional (créditos ilimitados)
INSERT INTO subscription (userId, plan, status, creditsRemaining, monthlyCreditsLimit)
VALUES (LAST_INSERT_ID(), 'profissional', 'active', -1, -1);

-- Confirmar
SELECT u.name, s.plan, s.creditsRemaining 
FROM users u 
JOIN subscription s ON u.id = s.userId;

EXIT;
```

---

## 🔐 PASSO 6: CRIAR SESSÃO MANUAL (15 min)

### Opção A: Usando Cookie Editor (Recomendado)

1. Instalar extensão "EditThisCookie" ou "Cookie Editor"
2. Abrir `http://localhost:3000/dashboard`
3. Adicionar cookie:
   - **Nome:** `elevare_session`
   - **Valor:** `mock_session_dev_test_user_001`
   - **Domain:** `localhost`
   - **Path:** `/`
4. Recarregar página

### Opção B: Desabilitar Proteção Temporariamente

**⚠️ APENAS PARA DESENVOLVIMENTO**

Editar `client/src/App.tsx`:

```typescript
// TEMPORÁRIO - Comentar proteção
function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      
      {/* TEMPORÁRIO: Remover checagem isAuthenticated */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/radar-bio" component={RadarBio} />
      <Route path="/dashboard/ebooks" component={EbookGenerator} />
      <Route path="/dashboard/robo-produtor" component={RoboProdutor} />
      
      <Route component={NotFound} />
    </Switch>
  );
}
```

**🔴 LEMBRAR:** Reverter antes de produção!

---

## 🤖 PASSO 7: CONFIGURAR FORGE API (30 min - OPCIONAL)

Para funcionalidades de IA (Radar Bio, E-books, Robô Produtor):

### 7.1: Obter API Key

1. Acessar `https://api.forge.manus.im`
2. Criar conta ou fazer login
3. Gerar API key no dashboard

### 7.2: Configurar .env

```env
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api_aqui
```

### 7.3: Reiniciar servidor

```bash
# Ctrl+C para parar
pnpm dev
```

### 7.4: Testar Radar Bio

```bash
curl -X POST http://localhost:3000/api/trpc/bioRadar.analyze \
  -H "Content-Type: application/json" \
  -d '{"instagramHandle":"teste"}'
```

---

## 💳 PASSO 8: CONFIGURAR STRIPE (OPCIONAL)

### Para Testes de Monetização (30 min):

1. **Criar conta Stripe**
   - https://dashboard.stripe.com/register
   - Ativar modo de teste

2. **Criar produtos**
   ```
   Produto 1: Plano Essencial
   Preço: R$ 57,00/mês recorrente
   → Copiar Price ID
   
   Produto 2: Plano Profissional
   Preço: R$ 97,00/mês recorrente
   → Copiar Price ID
   ```

3. **Obter chaves**
   ```
   Dashboard → Developers → API Keys
   → Copiar Secret Key (sk_test_...)
   ```

4. **Atualizar .env**
   ```env
   STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
   STRIPE_ESSENCIAL_PRICE_ID=price_id_essencial
   STRIPE_PROFISSIONAL_PRICE_ID=price_id_profissional
   ```

5. **Reiniciar servidor**
   ```bash
   pnpm dev
   ```

---

## ✅ VALIDAÇÃO FINAL (30 min)

### Checklist de Funcionalidades

```bash
# 1. Servidor rodando
curl http://localhost:3000/
# ✅ Deve retornar HTML da landing page

# 2. API tRPC respondendo
curl http://localhost:3000/api/trpc/auth.me
# ✅ Deve retornar JSON (mesmo que vazio/erro)

# 3. Database conectado
mysql -u root -p elevare_db -e "SELECT COUNT(*) FROM users;"
# ✅ Deve mostrar número de usuários

# 4. Páginas acessíveis
# Abrir no navegador:
# ✅ http://localhost:3000/ (Landing)
# ✅ http://localhost:3000/pricing (Preços)
# ✅ http://localhost:3000/dashboard (Dashboard - pode redirecionar)

# 5. Frontend compilando
# ✅ Vite deve mostrar "ready in X ms" sem erros
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Can't connect to MySQL"

```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Se não estiver, iniciar
sudo systemctl start mysql

# Verificar se database existe
mysql -u root -p -e "SHOW DATABASES LIKE 'elevare%';"
```

### Erro: "Port 3000 is already in use"

```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar outra porta
PORT=3001 pnpm dev
```

### Erro: "Stripe not configured"

**Isso é normal!** Se não precisar de pagamentos:
- ✅ Ignorar mensagem
- ✅ Stripe é opcional para desenvolvimento

Se precisar:
- Adicionar `STRIPE_SECRET_KEY` no .env
- Reiniciar servidor

### Erro: "Forge API not configured"

**Normal!** Para funcionalidades IA:
- Obter key em `https://api.forge.manus.im`
- Adicionar no .env
- Reiniciar servidor

---

## 📚 PRÓXIMOS PASSOS

Após setup básico funcionando:

1. **OAuth Real** (4h)
   - Registrar app em oauth.manus.im
   - Obter credenciais reais
   - Testar login flow

2. **Stripe Completo** (4h)
   - Configurar webhook
   - Testar checkout
   - Validar renovações

3. **Deploy Staging** (4-8h)
   - Escolher plataforma (Vercel/Railway/Render)
   - Configurar CI/CD
   - Deploy e smoke tests

4. **Produção** (1-2 semanas)
   - Monitoring
   - Analytics
   - Performance tuning
   - Documentação

---

## 📞 SUPORTE

**Problemas?** Verificar:

1. **Logs do servidor** - Terminal onde rodou `pnpm dev`
2. **Console do navegador** - F12 → Console
3. **Database logs** - `mysql -u root -p elevare_db`

**Arquivos importantes:**
- `.env` - Configuração
- `server/_core/logger.ts` - Logs
- `AUDITORIA_TECNICA_COMPLETA.md` - Relatório detalhado

---

**Última atualização:** 22/12/2024  
**Versão:** MVP Interno v1.0
