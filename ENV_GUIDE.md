# 🔐 Guia Completo de Configuração - Variáveis de Ambiente (.env)

## 📖 O que é o arquivo .env?

O arquivo `.env` é onde você guarda as "senhas" e configurações secretas da sua aplicação. Pense nele como um cofre digital que contém informações sensíveis que **nunca** devem ser compartilhadas publicamente.

**⚠️ IMPORTANTE:** O arquivo `.env` NUNCA deve ser enviado para o GitHub ou compartilhado publicamente!

---

## 🚀 Configuração Rápida (3 passos)

### Passo 1: Criar o arquivo .env

```bash
# Na pasta raiz do projeto, copie o arquivo de exemplo:
cp .env.example .env
```

### Passo 2: Abrir e editar

```bash
# Abra o arquivo com seu editor favorito:
nano .env
# ou
code .env
# ou
vim .env
```

### Passo 3: Preencher as variáveis (veja detalhes abaixo)

---

## 📝 Variáveis Obrigatórias (MVP Mínimo)

### 1. 🗄️ DATABASE_URL (Banco de Dados)

**O que é:** Endereço do banco de dados MySQL onde todos os dados da plataforma são armazenados.

**Formato:**
```env
DATABASE_URL=mysql://usuario:senha@servidor:porta/nome_banco
```

**Exemplo para desenvolvimento local:**
```env
DATABASE_URL=mysql://root:minhasenha@localhost:3306/elevare_db
```

**Explicação dos componentes:**
- `mysql://` = Tipo do banco de dados
- `root` = Nome do usuário do MySQL
- `minhasenha` = Senha do MySQL
- `localhost` = Servidor (localhost = seu computador)
- `3306` = Porta padrão do MySQL
- `elevare_db` = Nome do banco de dados

**Como obter:**
1. **Desenvolvimento Local:**
   - Instale MySQL no seu computador
   - Crie um banco: `CREATE DATABASE elevare_db;`
   - Use: `mysql://root:suasenha@localhost:3306/elevare_db`

2. **Produção (recomendado):**
   - Use PlanetScale (gratuito): https://planetscale.com
   - Ou Railway: https://railway.app
   - Copie a connection string fornecida

**⚠️ Segurança LGPD:**
- Sempre use senhas fortes (mínimo 12 caracteres)
- Nunca compartilhe esta informação
- Em produção, use SSL: adicione `?ssl={"rejectUnauthorized":true}` no final

---

### 2. 🔑 JWT_SECRET (Chave de Segurança)

**O que é:** Uma senha super secreta usada para proteger os tokens de autenticação dos usuários.

**Formato:**
```env
JWT_SECRET=sua_chave_secreta_aqui_minimo_32_caracteres
```

**Como gerar uma chave forte:**

**Opção 1 - No terminal (recomendado):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Opção 2 - Online (use apenas em desenvolvimento):**
- Acesse: https://generate-secret.vercel.app/32
- Copie a chave gerada

**Opção 3 - Manual:**
```env
JWT_SECRET=A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6
```

**⚠️ Requisitos OBRIGATÓRIOS:**
- Mínimo 32 caracteres
- Use letras, números e símbolos misturados
- Diferente entre desenvolvimento e produção
- Nunca compartilhe ou commite no Git

**💡 Dica:** Quanto mais longa e aleatória, mais segura!

---

### 3. 🌐 VITE_APP_ID (ID da Aplicação)

**O que é:** Identificador único da sua aplicação no sistema de autenticação OAuth da Manus.

**Formato:**
```env
VITE_APP_ID=seu_app_id_aqui
```

**Como obter:**
1. Acesse o Dashboard Manus OAuth
2. Crie uma nova aplicação
3. Copie o "App ID" gerado
4. Cole no `.env`

**Exemplo:**
```env
VITE_APP_ID=elevare_prod_abc123
```

**⚠️ Importante:** 
- Este ID é único para sua aplicação
- Diferente entre desenvolvimento e produção
- Necessário para autenticação de usuários

---

### 4. 🔐 OWNER_OPEN_ID (ID do Proprietário)

**O que é:** Seu identificador pessoal como dono da aplicação no sistema Manus.

**Formato:**
```env
OWNER_OPEN_ID=seu_openid_aqui
```

**Como obter:**
1. Faça login no Dashboard Manus
2. Vá em "Meu Perfil" ou "Configurações"
3. Copie seu "OpenID"
4. Cole no `.env`

**Exemplo:**
```env
OWNER_OPEN_ID=user_12345abc67890def
```

---

### 5. 🌍 OAUTH_SERVER_URL (Servidor OAuth)

**O que é:** URL do servidor de autenticação.

**Formato:**
```env
OAUTH_SERVER_URL=https://oauth.manus.im
```

**⚠️ Nota:** Normalmente este valor NÃO precisa ser alterado. Use o padrão: `https://oauth.manus.im`

---

## 💳 Variáveis do Stripe (Monetização)

### Para começar em modo desenvolvimento, você pode deixar estas vazias:

```env
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_PRO_PLUS_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

### Quando estiver pronto para ativar pagamentos:

#### 6. STRIPE_SECRET_KEY

**O que é:** Chave secreta da API do Stripe para processar pagamentos.

**Como obter:**
1. Crie conta em https://stripe.com
2. Acesse o Dashboard
3. Vá em "Developers" → "API Keys"
4. Copie a "Secret key"

**Desenvolvimento (teste):**
```env
STRIPE_SECRET_KEY=sk_test_51Abc...xyz
```

**Produção:**
```env
STRIPE_SECRET_KEY=sk_live_51Abc...xyz
```

**⚠️ CRÍTICO:** 
- NUNCA compartilhe esta chave
- Use chaves de teste (`sk_test_`) em desenvolvimento
- Troque para chaves reais (`sk_live_`) apenas em produção

---

#### 7. STRIPE_PRO_PRICE_ID

**O que é:** ID do produto/preço do Plano PRO no Stripe.

**Como obter:**
1. No Dashboard Stripe, vá em "Products"
2. Crie o produto "Elevare PRO" - R$ 67,00/mês
3. Copie o "Price ID"

**Exemplo:**
```env
STRIPE_PRO_PRICE_ID=price_1Abc123xyz789
```

---

#### 8. STRIPE_PRO_PLUS_PRICE_ID

**O que é:** ID do produto/preço do Plano PRO+ no Stripe.

**Como obter:**
1. No Dashboard Stripe, vá em "Products"
2. Crie o produto "Elevare PRO+" - R$ 117,00/mês
3. Copie o "Price ID"

**Exemplo:**
```env
STRIPE_PRO_PLUS_PRICE_ID=price_1Def456uvw012
```

---

#### 9. STRIPE_WEBHOOK_SECRET

**O que é:** Chave para validar que os eventos do Stripe são autênticos.

**Como obter em desenvolvimento:**
```bash
# 1. Instale a CLI do Stripe
brew install stripe/stripe-cli/stripe

# 2. Autentique
stripe login

# 3. Escute webhooks localmente
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 4. Copie o "whsec_..." que aparece
```

**Como obter em produção:**
1. Dashboard Stripe → "Developers" → "Webhooks"
2. Clique em "Add endpoint"
3. URL: `https://seudominio.com/api/stripe/webhook`
4. Selecione eventos
5. Copie o "Signing secret"

**Exemplo:**
```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz789
```

---

## 🤖 Variáveis de IA (Forge API)

### Para desenvolvimento inicial, pode usar valores vazios:

```env
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
```

### Quando ativar funcionalidades de IA:

#### 10. BUILT_IN_FORGE_API_URL

**O que é:** URL da API de IA da Manus para gerar conteúdo.

**Formato:**
```env
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
```

**⚠️ Nota:** Use o valor padrão acima.

---

#### 11. BUILT_IN_FORGE_API_KEY

**O que é:** Chave de acesso à API de IA.

**Como obter:**
1. Acesse Dashboard Manus
2. Vá em "API Keys" ou "Forge API"
3. Gere uma nova chave
4. Copie e cole

**Exemplo:**
```env
BUILT_IN_FORGE_API_KEY=forge_abc123xyz789
```

---

## 🎛️ Variáveis Opcionais

#### NODE_ENV (Ambiente)

**O que é:** Define se está em desenvolvimento ou produção.

```env
NODE_ENV=development
```

**Valores possíveis:**
- `development` = Desenvolvimento (padrão)
- `production` = Produção

**⚠️ Em produção, SEMPRE defina:**
```env
NODE_ENV=production
```

---

#### PORT (Porta do Servidor)

**O que é:** Porta onde o servidor vai rodar.

```env
PORT=3000
```

**Padrão:** 3000

**Quando alterar:** Se já tiver algo rodando na porta 3000, use outra (ex: 3001, 8080, etc)

---

#### ALLOWED_ORIGINS (CORS - Segurança)

**O que é:** Lista de sites permitidos a acessar sua API.

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Formato:** URLs separadas por vírgula (SEM espaços)

**Desenvolvimento:**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Produção:**
```env
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
```

**⚠️ Segurança:** Adicione APENAS domínios que você controla!

---

## 📋 Arquivo .env Completo (Template)

### Para Desenvolvimento Local:

```env
# ========================================
# BANCO DE DADOS (OBRIGATÓRIO)
# ========================================
DATABASE_URL=mysql://root:suasenha@localhost:3306/elevare_db

# ========================================
# SEGURANÇA (OBRIGATÓRIO)
# ========================================
# Gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=coloque_aqui_32_caracteres_minimo_aleatorios

# ========================================
# AUTENTICAÇÃO OAUTH (OBRIGATÓRIO)
# ========================================
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=seu_app_id_aqui
OWNER_OPEN_ID=seu_owner_openid_aqui

# ========================================
# STRIPE - PAGAMENTOS (OPCIONAL EM DEV)
# ========================================
STRIPE_SECRET_KEY=sk_test_sua_chave_de_teste
STRIPE_PRO_PRICE_ID=price_id_plano_pro
STRIPE_PRO_PLUS_PRICE_ID=price_id_plano_pro_plus
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# ========================================
# IA - FORGE API (OPCIONAL EM DEV)
# ========================================
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
BUILT_IN_FORGE_API_KEY=sua_forge_api_key

# ========================================
# CONFIGURAÇÕES GERAIS (OPCIONAL)
# ========================================
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## ✅ Checklist de Validação

Antes de rodar a aplicação, verifique:

### Obrigatórias (MVP Mínimo):
- [ ] `DATABASE_URL` configurada e testada
- [ ] `JWT_SECRET` com no mínimo 32 caracteres
- [ ] `VITE_APP_ID` obtido do Dashboard Manus
- [ ] `OWNER_OPEN_ID` obtido do Dashboard Manus
- [ ] `OAUTH_SERVER_URL` definida

### Para Pagamentos (quando ativar):
- [ ] Conta Stripe criada
- [ ] `STRIPE_SECRET_KEY` configurada (teste ou live)
- [ ] Produtos criados no Stripe
- [ ] `STRIPE_PRO_PRICE_ID` configurado
- [ ] `STRIPE_PRO_PLUS_PRICE_ID` configurado
- [ ] Webhook configurado
- [ ] `STRIPE_WEBHOOK_SECRET` configurado

### Para IA (quando ativar):
- [ ] `BUILT_IN_FORGE_API_URL` configurada
- [ ] `BUILT_IN_FORGE_API_KEY` válida

---

## 🔒 Boas Práticas de Segurança e LGPD

### ✅ O que FAZER:

1. **Senhas Fortes:**
   - Use geradores de senha aleatória
   - Mínimo 32 caracteres para JWT_SECRET
   - Combine letras, números e símbolos

2. **Nunca Compartilhe:**
   - Arquivo `.env` nunca vai pro Git (já está no `.gitignore`)
   - Não tire prints de tela com senhas
   - Não compartilhe em grupos/chats

3. **Diferentes Ambientes:**
   - Use credenciais DIFERENTES em dev e produção
   - Stripe: teste (`sk_test_`) em dev, live (`sk_live_`) em prod
   - JWT_SECRET diferente em cada ambiente

4. **Backup Seguro:**
   - Guarde cópias do `.env` em local seguro (ex: gerenciador de senhas)
   - Nunca no Google Drive, Dropbox público, etc

5. **LGPD - Proteção de Dados:**
   - Database deve usar SSL em produção
   - Senhas de usuários são hasheadas (automático)
   - Backups encriptados
   - Logs não devem conter dados sensíveis

### ❌ O que NÃO FAZER:

1. ❌ Nunca faça commit do arquivo `.env`
2. ❌ Não use senhas fracas tipo "123456" ou "senha"
3. ❌ Não compartilhe chaves de produção em ambientes de teste
4. ❌ Não coloque credenciais em código-fonte
5. ❌ Não use a mesma JWT_SECRET em dev e produção
6. ❌ Não exponha APIs sem rate limiting (já incluído)

---

## 🐛 Solução de Problemas Comuns

### Erro: "Variável de ambiente obrigatória não está definida"

**Problema:** Uma variável necessária está faltando no `.env`

**Solução:**
1. Verifique qual variável está faltando na mensagem de erro
2. Adicione ela no arquivo `.env`
3. Salve o arquivo
4. Reinicie o servidor

---

### Erro: "JWT_SECRET deve ter no mínimo 32 caracteres"

**Problema:** Sua chave JWT é muito curta

**Solução:**
```bash
# Gere uma nova chave forte:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copie o resultado e cole no .env:
JWT_SECRET=resultado_do_comando_acima
```

---

### Erro: "Database connection failed"

**Problemas possíveis:**

1. **MySQL não está rodando**
   ```bash
   # Verifique se o MySQL está ativo:
   sudo systemctl status mysql
   
   # Se não estiver, inicie:
   sudo systemctl start mysql
   ```

2. **Senha incorreta**
   - Verifique usuário e senha no `DATABASE_URL`
   - Teste manualmente: `mysql -u root -p`

3. **Banco não existe**
   ```bash
   # Conecte ao MySQL e crie:
   mysql -u root -p
   CREATE DATABASE elevare_db;
   ```

---

### Erro: "CORS blocked"

**Problema:** Site não autorizado tentando acessar a API

**Solução:**
Adicione a URL permitida em `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://seusite.com
```

---

### Erro: "Stripe webhook signature verification failed"

**Problema:** Webhook secret incorreto ou desatualizado

**Solução:**

**Em desenvolvimento:**
```bash
# Execute o comando e copie o novo secret:
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Em produção:**
1. Vá no Dashboard Stripe → Webhooks
2. Clique no seu endpoint
3. Copie o "Signing secret" (whsec_...)
4. Atualize no `.env`

---

## 📚 Recursos Adicionais

- **Documentação MySQL:** https://dev.mysql.com/doc/
- **Documentação Stripe:** https://stripe.com/docs
- **Segurança de Variáveis:** https://12factor.net/config
- **LGPD e Proteção de Dados:** https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd

---

## 🎯 Próximos Passos

Depois de configurar o `.env`:

1. **Instale as dependências:**
   ```bash
   pnpm install
   ```

2. **Configure o banco de dados:**
   ```bash
   pnpm db:push
   ```

3. **Inicie o servidor:**
   ```bash
   pnpm dev
   ```

4. **Acesse:** http://localhost:3000

---

## 💬 Precisa de Ajuda?

Se você é iniciante e está com dificuldades:

1. Leia este guia novamente com calma
2. Verifique cada variável uma por uma
3. Confira os exemplos fornecidos
4. Use os comandos de troubleshooting
5. Consulte a documentação adicional

**Dica:** É normal ter dúvidas no início. Com prática, vai ficar mais fácil! 💪

---

**Elevare AI NeuroVendas** - Configuração segura e profissional. 🚀
