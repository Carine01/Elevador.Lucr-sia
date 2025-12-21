# 🔐 Guia do Arquivo .env - Para Iniciantes

## O que é o arquivo .env?

O arquivo `.env` é simplesmente uma lista de **configurações e senhas** que o sistema precisa para funcionar. 

Pense nele como um caderno de anotações onde você guarda:
- Senhas do banco de dados
- Chaves de APIs (como Stripe, Google, etc)
- Configurações básicas

**Importante:** Este arquivo **nunca** deve ser compartilhado publicamente, pois contém informações sensíveis.

---

## 📝 Como criar o arquivo .env

### Passo 1: Copiar o modelo

Na pasta do projeto, já existe um arquivo chamado `.env.example` que serve de modelo.

Para criar seu próprio `.env`:

```bash
# No terminal, dentro da pasta do projeto, execute:
cp .env.example .env
```

Ou simplesmente:
1. Abra a pasta do projeto
2. Crie um novo arquivo chamado `.env` (com o ponto na frente)
3. Cole o conteúdo do modelo abaixo

---

## 🎯 Modelo Mínimo para MVP (Começar Rápido)

Este é o mínimo que você precisa para começar a testar:

```env
# Ambiente
NODE_ENV=development
PORT=3000

# Banco de dados
DATABASE_URL=mysql://root:suasenha@localhost:3306/elevare_db

# JWT (Segurança)
JWT_SECRET=sua_chave_secreta_aqui_minimo_32_caracteres_muito_importante

# Stripe (Pagamentos - MODO TESTE)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxx
STRIPE_PRO_PLUS_PRICE_ID=price_xxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx

# OAuth (Autenticação)
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=seu_app_id
OWNER_OPEN_ID=seu_owner_open_id

# APIs de IA
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
BUILT_IN_FORGE_API_KEY=sua_forge_api_key
```

---

## 📖 Explicação de Cada Variável (Linguagem Simples)

### 🌍 Configurações do Ambiente

#### `NODE_ENV`
**O que é:** Diz ao sistema se você está testando ou em produção.

**Valores possíveis:**
- `development` - Para quando você está testando/desenvolvendo
- `production` - Para quando o site está no ar, rodando de verdade

**Exemplo:**
```env
NODE_ENV=development
```

#### `PORT`
**O que é:** A "porta" onde o sistema vai rodar no seu computador.

**Valor padrão:** `3000`

**Exemplo:**
```env
PORT=3000
```
Depois você acessa o sistema em: `http://localhost:3000`

---

### 🗄️ Banco de Dados

#### `DATABASE_URL`
**O que é:** O endereço e senha para acessar seu banco de dados MySQL.

**Formato:**
```
mysql://usuário:senha@servidor:porta/nome_do_banco
```

**Exemplo para desenvolvimento local:**
```env
DATABASE_URL=mysql://root:minhasenha123@localhost:3306/elevare_db
```

**Explicando cada parte:**
- `root` - usuário do MySQL (geralmente é "root" no seu computador)
- `minhasenha123` - a senha que você configurou no MySQL
- `localhost` - significa "meu próprio computador"
- `3306` - porta padrão do MySQL
- `elevare_db` - nome do banco de dados que você vai criar

**Como criar o banco:**
```bash
# No terminal do MySQL:
CREATE DATABASE elevare_db;
```

---

### 🔐 JWT Secret (Segurança)

#### `JWT_SECRET`
**O que é:** Uma chave secreta usada para proteger as senhas e sessões dos usuários.

**IMPORTANTE:** Precisa ter **no mínimo 32 caracteres**!

**Como gerar uma chave segura:**
```bash
# No terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Exemplo:**
```env
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

⚠️ **Nunca use senhas simples como "123456" ou "senha"!**

---

### 💳 Stripe (Sistema de Pagamentos)

O Stripe é o sistema que processa pagamentos com cartão de crédito.

#### `STRIPE_SECRET_KEY`
**O que é:** Sua chave secreta do Stripe.

**Como obter:**
1. Crie uma conta em [stripe.com](https://stripe.com)
2. Vá em "Developers" → "API Keys"
3. Copie a "Secret key"

**Exemplo (modo teste):**
```env
STRIPE_SECRET_KEY=sk_test_51AbCdEf...
```

**Exemplo (modo produção):**
```env
STRIPE_SECRET_KEY=sk_live_51AbCdEf...
```

⚠️ **Use `sk_test_` enquanto estiver testando!**

#### `STRIPE_PRO_PRICE_ID` e `STRIPE_PRO_PLUS_PRICE_ID`
**O que são:** IDs dos planos de assinatura que você criou no Stripe.

**Como obter:**
1. No Stripe, vá em "Products"
2. Crie seus produtos (Plano PRO e PRO+)
3. Copie o "Price ID" de cada um

**Exemplo:**
```env
STRIPE_PRO_PRICE_ID=price_1ABCD123
STRIPE_PRO_PLUS_PRICE_ID=price_1WXYZ789
```

#### `STRIPE_WEBHOOK_SECRET`
**O que é:** Um código secreto para validar notificações do Stripe.

**Como obter (desenvolvimento):**
```bash
# Instale o Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copie o código que aparecer (começa com whsec_)
```

**Como obter (produção):**
1. No Stripe, vá em "Developers" → "Webhooks"
2. Adicione endpoint: `https://seusite.com/api/stripe/webhook`
3. Copie o "Signing secret"

**Exemplo:**
```env
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

---

### 🔑 OAuth (Sistema de Login)

#### `OAUTH_SERVER_URL`
**O que é:** URL do servidor de autenticação (login).

**Valor padrão:**
```env
OAUTH_SERVER_URL=https://oauth.manus.im
```

#### `VITE_APP_ID`
**O que é:** ID do seu aplicativo registrado no sistema OAuth.

**Como obter:**
1. Acesse o painel Manus
2. Registre um novo app
3. Copie o "App ID"

**Exemplo:**
```env
VITE_APP_ID=app_abc123xyz789
```

#### `OWNER_OPEN_ID`
**O que é:** Seu ID de proprietário no sistema OAuth.

**Como obter:**
1. No painel Manus, vá em perfil
2. Copie seu "Open ID"

**Exemplo:**
```env
OWNER_OPEN_ID=user_xyz789abc123
```

---

### 🤖 APIs de Inteligência Artificial

#### `BUILT_IN_FORGE_API_URL`
**O que é:** URL da API que fornece serviços de IA (geração de texto, imagens, etc).

**Valor padrão:**
```env
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
```

#### `BUILT_IN_FORGE_API_KEY`
**O que é:** Sua chave de acesso à API de IA.

**Como obter:**
1. No painel Manus, vá em "API Keys"
2. Crie uma nova chave
3. Copie o valor

**Exemplo:**
```env
BUILT_IN_FORGE_API_KEY=forge_abc123xyz789
```

---

### 🌐 Configurações Extras (Opcional)

#### `ALLOWED_ORIGINS`
**O que é:** Lista de sites permitidos a acessar sua API (segurança CORS).

**Para desenvolvimento:**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Para produção:**
```env
ALLOWED_ORIGINS=https://seusite.com,https://www.seusite.com
```

---

## ✅ Checklist: Está tudo pronto?

Antes de tentar rodar o sistema, verifique:

- [ ] Arquivo `.env` criado na pasta raiz do projeto
- [ ] `DATABASE_URL` configurado com banco MySQL existente
- [ ] `JWT_SECRET` com no mínimo 32 caracteres
- [ ] `STRIPE_SECRET_KEY` começa com `sk_test_` (para testes)
- [ ] Todos os IDs do Stripe foram copiados corretamente
- [ ] Configurações OAuth (`VITE_APP_ID` e `OWNER_OPEN_ID`) preenchidas
- [ ] `BUILT_IN_FORGE_API_KEY` configurado

---

## 🚨 Erros Comuns e Soluções

### Erro: "DATABASE_URL is not defined"
**Solução:** Você não configurou a variável `DATABASE_URL` ou esqueceu de criar o arquivo `.env`

### Erro: "JWT_SECRET must be at least 32 characters"
**Solução:** Sua chave JWT é muito curta. Use o comando para gerar uma nova:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Erro: "Invalid Stripe key"
**Solução:** 
- Verifique se copiou a chave correta do Stripe
- Certifique-se de usar `sk_test_` para testes
- Não inclua espaços antes ou depois da chave

### Erro: "Cannot connect to database"
**Solução:**
- Verifique se o MySQL está rodando
- Confirme usuário e senha no `DATABASE_URL`
- Certifique-se de que o banco de dados foi criado

---

## 🎓 Próximos Passos

Depois de configurar o `.env`:

1. **Instalar dependências:**
   ```bash
   pnpm install
   ```

2. **Configurar banco de dados:**
   ```bash
   pnpm db:push
   ```

3. **Iniciar sistema:**
   ```bash
   pnpm dev
   ```

4. **Acessar no navegador:**
   ```
   http://localhost:3000
   ```

---

## 💡 Dicas de Segurança

1. ❌ **NUNCA** compartilhe seu arquivo `.env` 
2. ❌ **NUNCA** faça commit do `.env` no Git
3. ✅ Use `.env.example` como modelo (sem valores reais)
4. ✅ Em produção, use chaves diferentes das de desenvolvimento
5. ✅ Gere senhas fortes e aleatórias

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:

1. Revise este guia passo a passo
2. Verifique se todas as variáveis estão preenchidas
3. Consulte `INSTRUCOES_IMPLEMENTACAO.md` para mais detalhes
4. Veja erros no terminal para identificar o problema

---

**Lembre-se:** O arquivo `.env` é como um cofre de senhas. Mantenha-o seguro! 🔐
