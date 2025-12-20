# ⚡ Guia Rápido - Elevare MVP em 5 Minutos

**Para quem tem pressa!** Este é um resumo super rápido. Para detalhes completos, veja os guias linkados.

---

## 🎯 Setup Mínimo (MVP)

### 1️⃣ Instale as Ferramentas

```bash
# Node.js 22+ (baixe em: nodejs.org)
node --version  # deve ser v22.x.x

# pnpm (gerenciador de pacotes)
npm install -g pnpm

# MySQL 8+ (baixe em: dev.mysql.com)
mysql --version
```

---

### 2️⃣ Clone e Instale

```bash
git clone https://github.com/Carine01/Elevador.Lucr-sia.git
cd Elevador.Lucr-sia
pnpm install
```

---

### 3️⃣ Configure o Banco

```bash
mysql -u root -p
```

```sql
CREATE DATABASE elevare_db;
exit;
```

---

### 4️⃣ Configure o .env

```bash
cp .env.example .env
nano .env  # ou code .env
```

**Mínimo necessário:**

```env
DATABASE_URL=mysql://root:SUASENHA@localhost:3306/elevare_db

# Gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=cole_aqui_32_caracteres_aleatorios_gerados

OAUTH_SERVER_URL=https://oauth.manus.im
VITE_APP_ID=obtenha_em_oauth.manus.im
OWNER_OPEN_ID=obtenha_em_oauth.manus.im
```

📖 **Onde obter OAuth?** Crie conta em https://oauth.manus.im → Criar Aplicação

🔐 **Mais detalhes:** [ENV_GUIDE.md](ENV_GUIDE.md)

---

### 5️⃣ Rode o Projeto

```bash
pnpm db:push  # Cria tabelas
pnpm dev      # Inicia servidor
```

✅ **Acesse:** http://localhost:3000

---

## 🆘 Problemas?

### "Cannot connect to database"
```bash
sudo systemctl start mysql  # Linux
brew services start mysql   # Mac
```

### "JWT_SECRET must be 32+ characters"
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Cole o resultado no .env
```

### "Port 3000 in use"
```env
# No .env, mude para:
PORT=3001
```

### Mais soluções
📖 Veja seção [Troubleshooting no README.md](README.md#-troubleshooting)

---

## 🎯 Próximos Passos Opcionais

### Ativar Pagamentos (Stripe)

1. Crie conta: https://stripe.com
2. Dashboard → Products → Crie 2 produtos
3. Copie Price IDs para o .env
4. Configure webhook

📖 [Guia completo de Stripe no DEPLOY.md](DEPLOY.md#-configuração-do-stripe)

---

### Ativar IA (Forge API)

1. Dashboard Manus → API Keys
2. Gere Forge API key
3. Adicione ao .env:

```env
BUILT_IN_FORGE_API_URL=https://api.forge.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_aqui
```

---

## 📝 Fazer seu Primeiro PR

```bash
# 1. Crie uma branch
git checkout -b docs/minha-alteracao

# 2. Faça mudanças
# (edite arquivos)

# 3. Commit
git add .
git commit -m "docs: descrição clara da mudança"

# 4. Push
git push origin docs/minha-alteracao

# 5. Abra PR no GitHub
```

📖 [Guia completo em FIRST_PR_GUIDE.md](FIRST_PR_GUIDE.md)

---

## 📋 Comandos Úteis (Cola)

```bash
# Desenvolvimento
pnpm dev           # Iniciar servidor
pnpm build         # Build para produção
pnpm start         # Rodar produção
pnpm check         # Verificar tipos TypeScript
pnpm format        # Formatar código

# Banco de Dados
pnpm db:push       # Aplicar migrations

# Git
git status         # Ver mudanças
git add .          # Adicionar tudo
git commit -m ""   # Commitar
git push           # Enviar para GitHub
git pull           # Atualizar local
```

---

## 🏗️ Estrutura Básica

```
Elevador.Lucr-sia/
├── .env                    # ⚠️ Configurações (NÃO commitar!)
├── .env.example            # Template do .env
├── README.md               # Documentação principal
├── ENV_GUIDE.md            # 📖 Guia do .env
├── FIRST_PR_GUIDE.md       # 📖 Guia de PR
├── DEPLOY.md               # 📖 Guia de deploy
│
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas
│   │   └── components/    # Componentes
│
├── server/                 # Backend Node.js
│   ├── _core/             # Core
│   └── routers/           # APIs
│
└── drizzle/               # Banco de dados
    └── schema.ts          # Schema
```

---

## 🔒 Segurança - Checklist Rápido

- [ ] `.env` no `.gitignore` (já está!)
- [ ] JWT_SECRET com 32+ caracteres
- [ ] Senhas fortes no banco
- [ ] HTTPS em produção
- [ ] Diferentes credenciais dev/prod
- [ ] NEVER commit senhas/chaves

---

## 📚 Guias Completos

| Precisa de... | Leia... |
|---------------|---------|
| 🔐 Configurar .env | [ENV_GUIDE.md](ENV_GUIDE.md) |
| 🎯 Fazer primeiro PR | [FIRST_PR_GUIDE.md](FIRST_PR_GUIDE.md) |
| 🚀 Deploy produção | [DEPLOY.md](DEPLOY.md) |
| 🔧 Detalhes técnicos | [INSTRUCOES_IMPLEMENTACAO.md](INSTRUCOES_IMPLEMENTACAO.md) |
| 📖 Documentação completa | [README.md](README.md) |

---

## 🎓 Planos de Preço

| Plano | Preço | Créditos | O que faz |
|-------|-------|----------|-----------|
| **Grátis** | R$ 0 | 1/mês | Radar de Bio básico |
| **PRO** | R$ 67/mês | 10/mês | + E-books, Prompts, Anúncios |
| **PRO+** | R$ 117/mês | Ilimitado | Tudo + Suporte VIP |

---

## 🎯 Funcionalidades Principais

1. **Radar de Bio** 🎯
   - Analisa bio do Instagram com IA
   - Gera diagnóstico e recomendações
   - Captura leads

2. **Gerador de E-books** 📚
   - Cria e-books automáticos
   - Customiza tom e público
   - Gera capas com IA

3. **Robô Produtor** 🤖
   - Gera prompts (Midjourney/DALL-E)
   - Cria anúncios (Instagram/Facebook)
   - Baseado em neurovendas

4. **Sistema de Pagamentos** 💳
   - Assinaturas via Stripe
   - Gerenciamento de créditos
   - Portal do cliente

---

## 💡 Dicas Pro

### Para Iniciantes
- Comece APENAS com as variáveis obrigatórias
- Stripe e IA podem vir depois
- Leia os guias com calma
- Peça ajuda quando precisar

### Para Deploy
- Use chaves de teste em dev
- Sempre teste antes de produção
- Configure backup do banco
- Monitore logs

### Para PRs
- Um PR = um propósito
- Commits pequenos e frequentes
- Mensagens claras
- Teste antes de enviar

---

## 🆘 SOS Rápido

| Erro | Solução Rápida |
|------|----------------|
| Database | `sudo systemctl start mysql` |
| JWT short | Regere com 32+ chars |
| Port busy | Mude PORT no .env |
| CORS | Adicione URL no ALLOWED_ORIGINS |
| Stripe | Use chaves de teste primeiro |

---

## 🎉 Checklist de Início

- [ ] Node.js 22+ instalado
- [ ] pnpm instalado
- [ ] MySQL instalado e rodando
- [ ] Repositório clonado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Banco criado (`CREATE DATABASE elevare_db`)
- [ ] .env configurado (mínimo 5 variáveis)
- [ ] Migrations aplicadas (`pnpm db:push`)
- [ ] Servidor rodando (`pnpm dev`)
- [ ] Acesso no navegador (localhost:3000)

---

## 🚀 Agora é com Você!

1. ✅ Siga os 5 passos acima
2. 📖 Consulte os guias quando tiver dúvidas
3. 💬 Abra issues se encontrar problemas
4. 🎯 Faça seu primeiro PR!

**Lembre-se:** Todo expert foi iniciante um dia. Você consegue! 💪

---

**Elevare AI NeuroVendas** - De zero ao MVP em minutos! ⚡
