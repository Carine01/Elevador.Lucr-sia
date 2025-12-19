# 🤖 Scripts de Automação - Elevare AI NeuroVendas

Este diretório contém scripts de automação para facilitar o setup e deploy da aplicação.

---

## 📜 Scripts Disponíveis

### `setup-complete-auto.sh`

Script de setup automático completo que automatiza todo o processo de configuração, do ambiente local ao deploy em produção.

#### 🎯 Funcionalidades

1. **Verificação de Ambiente:**
   - ✅ Verifica se está na pasta correta (package.json existe)
   - ✅ Verifica Node.js >= 18
   - ✅ Verifica pnpm instalado (instala se necessário)

2. **Limpeza e Reinstalação:**
   - 🧹 Remove `node_modules`
   - 🧹 Remove `pnpm-lock.yaml`
   - 📦 Instala dependências com `pnpm install`

3. **Commit Automático:**
   - 📝 Adiciona `pnpm-lock.yaml` ao git
   - 💾 Commit com mensagem "fix: atualizar pnpm-lock.yaml"
   - 🚀 Push para branch principal (main/master)

4. **Configuração de Banco (Railway):**
   - 🛤️ Instala Railway CLI se não estiver instalado
   - 🔐 Faz login no Railway
   - 🆕 Cria projeto (railway init)
   - 🗄️ Adiciona MySQL (railway add --plugin mysql)
   - 🔗 Obtém DATABASE_URL automaticamente

5. **Configuração de Secrets no GitHub:**
   - 🐙 Verifica gh CLI instalado
   - 🔑 Adiciona DATABASE_URL_PROD
   - 🔐 Gera e adiciona JWT_SECRET (64 caracteres)
   - 📋 Lista secrets configurados

6. **Deploy Vercel:**
   - ▲ Instala Vercel CLI se não estiver instalado
   - 🔐 Faz login na Vercel
   - 🚀 Deploy para produção (vercel --prod --yes)

7. **Logs Coloridos:**
   - 🟢 Verde para sucesso
   - 🟡 Amarelo para avisos
   - 🔴 Vermelho para erros
   - 🔵 Azul para informações

8. **Tratamento de Erros:**
   - ⚠️ Para execução em caso de erro crítico
   - 📝 Mostra mensagens claras de erro
   - 💡 Sugere soluções

#### 📋 Pré-requisitos

- **Obrigatórios:**
  - Node.js >= 18
  - Git instalado
  - Estar na raiz do projeto

- **Opcionais (instalados automaticamente se necessário):**
  - pnpm
  - Railway CLI
  - GitHub CLI (gh)
  - Vercel CLI

#### 🚀 Como Usar

1. **Permissão de execução:**
   ```bash
   chmod +x scripts/setup-complete-auto.sh
   ```

2. **Executar o script:**
   ```bash
   ./scripts/setup-complete-auto.sh
   ```

3. **Responder as perguntas interativas:**
   - Configurar Railway? [y/N]
   - Configurar GitHub secrets? [y/N]
   - Fazer deploy na Vercel? [y/N]

#### 🔄 Idempotência

O script é **idempotente** e pode ser executado múltiplas vezes com segurança:
- ✅ Não cria recursos duplicados
- ✅ Detecta configurações existentes
- ✅ Pula etapas já concluídas
- ✅ Atualiza apenas o necessário

#### 📝 Arquivos Temporários

O script pode criar arquivos temporários (já configurados no `.gitignore`):
- `.railway-db-url.tmp` - DATABASE_URL do Railway
- `.jwt-secret.tmp` - JWT_SECRET gerado

**⚠️ Importante:** Copie o JWT_SECRET do arquivo `.jwt-secret.tmp` para seu `.env` e depois delete o arquivo.

#### 🎨 Exemplos de Saída

```bash
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. VERIFICAÇÃO DE AMBIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ package.json encontrado - pasta correta
✅ Node.js v20.19.6 ✓
✅ pnpm v10.4.1 ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. LIMPEZA E REINSTALAÇÃO DE DEPENDÊNCIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️  Removendo node_modules...
ℹ️  Instalando dependências com pnpm...
✅ Dependências instaladas com sucesso
```

#### 🆘 Solução de Problemas

**Erro: "package.json não encontrado"**
- Solução: Execute o script na raiz do projeto (onde está o package.json)

**Erro: "Node.js versão muito antiga"**
- Solução: Atualize para Node.js 18 ou superior em https://nodejs.org

**Erro: "Falha ao instalar pnpm"**
- Solução: Execute manualmente: `npm install -g pnpm`

**Erro: "Falha no login do Railway/Vercel"**
- Solução: Verifique sua conexão com internet e tente novamente

**Erro: "Push falhou"**
- Solução: Você pode precisar fazer push manual ou configurar permissões git

#### 📚 Recursos Adicionais

- [Documentação Railway](https://docs.railway.app)
- [Documentação Vercel](https://vercel.com/docs)
- [GitHub CLI](https://cli.github.com)
- [pnpm](https://pnpm.io)

---

## 🤝 Contribuindo

Para adicionar novos scripts de automação:
1. Crie o script em `scripts/`
2. Adicione permissão de execução: `chmod +x scripts/seu-script.sh`
3. Documente neste README
4. Use as mesmas cores e padrões de log para consistência

---

## 📄 Licença

MIT - Veja LICENSE na raiz do projeto
