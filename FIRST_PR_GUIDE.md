# 🎯 Guia do Primeiro PR - GitHub Copilot & Elevare

## 📖 O que é um PR (Pull Request)?

Um **Pull Request** (ou PR) é como você propõe mudanças no código do projeto. Pense nele como:
- 📝 Uma "proposta de alteração"
- 🔍 Um pedido para revisar seu código
- ✅ Um documento que mostra o que você fez

**Analogia simples:** É como entregar um trabalho para o professor revisar antes de considerar aprovado!

---

## 🚀 Passo a Passo - Seu Primeiro PR Simples

### ✅ Pré-requisitos

Antes de começar, certifique-se que tem:
- [ ] Git instalado (`git --version`)
- [ ] Acesso ao repositório no GitHub
- [ ] Projeto clonado no seu computador
- [ ] GitHub Copilot configurado (opcional, mas recomendado)

---

## 📝 Cenário 1: Corrigir um Typo Simples

**Objetivo:** Fazer seu primeiro PR corrigindo um erro de digitação.

### Passo 1: Criar uma Branch (Ramificação)

```bash
# 1. Certifique-se que está na branch principal atualizada
git checkout main
git pull origin main

# 2. Crie uma nova branch para sua mudança
git checkout -b fix/corrigir-typo-readme

# 3. Verifique que está na nova branch
git branch
# Deve aparecer * ao lado de "fix/corrigir-typo-readme"
```

**💡 Dica:** Nome da branch deve ser descritivo:
- `fix/` = Correção de bug
- `feat/` = Nova funcionalidade
- `docs/` = Documentação
- `chore/` = Tarefas gerais

**Exemplos:**
- `fix/corrigir-link-quebrado`
- `feat/adicionar-botao-whatsapp`
- `docs/melhorar-instalacao`

---

### Passo 2: Fazer a Mudança

```bash
# 1. Abra o arquivo que quer editar
code README.md
# ou
nano README.md

# 2. Faça a correção (exemplo: trocar "funcionaliades" por "funcionalidades")

# 3. Salve o arquivo (Ctrl+S no VS Code, Ctrl+X no nano)
```

**Mudança exemplo:**
```diff
- ## ✨ Funcionaliades  (ERRADO)
+ ## ✨ Funcionalidades  (CORRETO)
```

---

### Passo 3: Ver o que Mudou

```bash
# Ver quais arquivos foram alterados
git status

# Ver exatamente o que mudou
git diff
```

**Saída esperada:**
```
modified:   README.md
```

---

### Passo 4: Adicionar e Commitar

```bash
# 1. Adicionar o arquivo modificado
git add README.md

# 2. Fazer o commit com mensagem descritiva
git commit -m "docs: corrigir typo em funcionalidades no README"
```

**💡 Formato de mensagem de commit:**
```
tipo: descrição curta

Tipos comuns:
- docs: Mudanças em documentação
- feat: Nova funcionalidade
- fix: Correção de bug
- style: Formatação (não muda lógica)
- refactor: Refatoração de código
- test: Adicionar ou corrigir testes
- chore: Tarefas de manutenção
```

**Exemplos de boas mensagens:**
- ✅ `docs: corrigir typo em funcionalidades no README`
- ✅ `fix: corrigir link quebrado na documentação`
- ✅ `feat: adicionar seção de troubleshooting`
- ❌ `mudanças` (muito vaga)
- ❌ `fix` (não diz o que foi corrigido)

---

### Passo 5: Enviar para o GitHub

```bash
# Enviar sua branch para o GitHub
git push origin fix/corrigir-typo-readme
```

**Saída esperada:**
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
...
To github.com:Carine01/Elevador.Lucr-sia.git
 * [new branch]      fix/corrigir-typo-readme -> fix/corrigir-typo-readme
```

---

### Passo 6: Criar o PR no GitHub

1. **Acesse o GitHub:**
   - Vá para: https://github.com/Carine01/Elevador.Lucr-sia

2. **Aparecerá um banner amarelo:**
   ```
   fix/corrigir-typo-readme had recent pushes
   [Compare & pull request]
   ```

3. **Clique em "Compare & pull request"**

4. **Preencha o PR:**

   **Título (seja claro e direto):**
   ```
   docs: Corrigir typo "funcionaliades" → "funcionalidades"
   ```

   **Descrição (explique o que e por quê):**
   ```markdown
   ## 📝 Mudanças
   
   Corrigido erro de digitação no README.md:
   - "funcionaliades" → "funcionalidades"
   
   ## 🎯 Motivação
   
   Melhorar a clareza e profissionalismo da documentação.
   
   ## ✅ Checklist
   
   - [x] Mudança testada localmente
   - [x] Mensagem de commit clara
   - [x] Apenas arquivos necessários modificados
   ```

5. **Clique em "Create pull request"**

**🎉 Pronto! Seu primeiro PR foi criado!**

---

## 📝 Cenário 2: Adicionar uma Nova Seção de Documentação

**Objetivo:** Adicionar uma seção útil na documentação.

### Passo 1: Criar Branch

```bash
git checkout main
git pull origin main
git checkout -b docs/adicionar-secao-troubleshooting
```

---

### Passo 2: Fazer as Mudanças

```bash
# Abra o arquivo
code README.md

# Adicione a nova seção, por exemplo:
```

```markdown
## 🐛 Problemas Comuns

### Erro: "Cannot connect to database"
**Solução:** Verifique se o MySQL está rodando e se a DATABASE_URL está correta no .env
```

---

### Passo 3: Testar Localmente

```bash
# Veja como ficou
cat README.md | grep -A 5 "Problemas Comuns"

# Ou abra em um visualizador de Markdown
```

---

### Passo 4: Commit e Push

```bash
git add README.md
git commit -m "docs: adicionar seção de problemas comuns no README"
git push origin docs/adicionar-secao-troubleshooting
```

---

### Passo 5: Criar PR no GitHub

- Título: `docs: Adicionar seção de problemas comuns`
- Descrição:
  ```markdown
  ## 📝 Mudanças
  
  Adicionada nova seção "Problemas Comuns" com:
  - Erro de conexão com banco de dados
  - Solução passo a passo
  
  ## 🎯 Motivação
  
  Ajudar iniciantes a resolver problemas frequentes mais rapidamente.
  
  ## 📸 Screenshot
  
  (Opcional: adicione uma imagem da seção)
  ```

---

## 🤖 Usando GitHub Copilot para Melhorar seu PR

### 1. Escrever Descrição de PR

No VS Code com Copilot:

```
// Digite um comentário e deixe o Copilot sugerir:
// Descrição do PR: Corrigir typo no README

// O Copilot pode sugerir:
## Mudanças
- Corrigido erro de digitação "funcionaliades" → "funcionalidades"

## Impacto
- Melhora a clareza da documentação
- Sem impacto no código funcional
```

---

### 2. Gerar Mensagens de Commit

O Copilot pode sugerir boas mensagens baseadas em suas mudanças:

```bash
# Comece digitando:
git commit -m "

# Copilot sugere:
git commit -m "docs: corrigir typo em funcionalidades do README

Corrige erro de digitação na seção de funcionalidades
para melhorar a clareza da documentação."
```

---

### 3. Revisar Código com Copilot

```
// Peça ao Copilot para revisar:
// TODO: Revisar esta seção para clareza

// Copilot pode sugerir melhorias na escrita
```

---

## 📋 Template de PR Profissional

Use este template para todos os seus PRs:

```markdown
## 📝 Descrição

(Explique claramente o que você mudou e por quê)

## 🎯 Tipo de Mudança

- [ ] 🐛 Bug fix (correção de bug)
- [ ] ✨ Nova funcionalidade
- [ ] 📝 Documentação
- [ ] 🎨 Estilo/formatação
- [ ] ♻️ Refatoração
- [ ] 🧪 Testes

## 🔍 Como Testar

1. Faça checkout desta branch: `git checkout nome-da-branch`
2. (Passos para testar a mudança)
3. Verifique que...

## 📸 Screenshots (se aplicável)

(Adicione prints se mudou a interface)

## ✅ Checklist

- [ ] Código testado localmente
- [ ] Documentação atualizada (se necessário)
- [ ] Commits seguem padrão de mensagem
- [ ] Sem conflitos com a branch principal
- [ ] README atualizado (se necessário)

## 📝 Notas Adicionais

(Qualquer informação extra relevante)
```

---

## 🎓 Comandos Git Essenciais (Cola)

### Comandos Básicos

```bash
# Ver status dos arquivos
git status

# Ver diferenças
git diff

# Adicionar arquivo específico
git add nome-do-arquivo.md

# Adicionar todos os arquivos modificados
git add .

# Fazer commit
git commit -m "tipo: descrição"

# Enviar para GitHub
git push origin nome-da-branch

# Atualizar branch local
git pull origin main

# Ver histórico de commits
git log --oneline
```

---

### Gerenciar Branches

```bash
# Ver todas as branches
git branch

# Criar nova branch
git checkout -b nome-da-branch

# Trocar de branch
git checkout nome-da-branch

# Deletar branch local (após merge)
git branch -d nome-da-branch

# Atualizar lista de branches remotas
git fetch --prune
```

---

### Desfazer Mudanças

```bash
# Desfazer mudanças em arquivo (antes de add)
git checkout -- nome-do-arquivo

# Desfazer git add (unstage)
git reset HEAD nome-do-arquivo

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Ver o que mudou em commit específico
git show <commit-hash>
```

---

## 🚨 Erros Comuns e Soluções

### Erro 1: "Your branch is behind"

**Problema:** Sua branch está desatualizada

**Solução:**
```bash
git checkout main
git pull origin main
git checkout sua-branch
git merge main
```

---

### Erro 2: "Conflict in file"

**Problema:** Há conflitos para resolver

**Solução:**
```bash
# 1. Abra o arquivo com conflito
code arquivo-com-conflito.md

# 2. Procure por:
<<<<<<< HEAD
seu código
=======
código de outra pessoa
>>>>>>> main

# 3. Escolha qual versão manter ou combine as duas

# 4. Remova os marcadores (<<<, ===, >>>)

# 5. Adicione e commite
git add arquivo-com-conflito.md
git commit -m "fix: resolver conflito em arquivo X"
```

---

### Erro 3: "Permission denied (publickey)"

**Problema:** GitHub não reconhece sua identidade

**Solução:**
```bash
# Configure SSH ou use HTTPS
git remote set-url origin https://github.com/Carine01/Elevador.Lucr-sia.git

# Ou configure SSH key:
ssh-keygen -t ed25519 -C "seu-email@example.com"
# Adicione a chave em: GitHub Settings > SSH Keys
```

---

### Erro 4: "Nothing to commit"

**Problema:** Esqueceu de salvar o arquivo

**Solução:**
```bash
# 1. Salve o arquivo no editor (Ctrl+S)
# 2. Verifique novamente
git status
# 3. Adicione e commite
git add .
git commit -m "tipo: descrição"
```

---

## ✅ Boas Práticas para PRs

### ✅ FAZER:

1. **Um PR = Um Propósito**
   - Não misture correção de typo com nova funcionalidade
   - Cada PR deve ter foco único

2. **Mensagens Claras**
   - Título descritivo
   - Descrição completa
   - Explique o "porquê", não só o "o quê"

3. **Commits Pequenos**
   - Commits frequentes e focados
   - Mais fácil de revisar e desfazer

4. **Testar Antes**
   - Sempre teste localmente
   - Verifique que não quebrou nada

5. **Pedir Feedback**
   - Marque pessoas para revisar
   - Esteja aberto a sugestões

---

### ❌ EVITAR:

1. ❌ PRs gigantes (100+ arquivos)
2. ❌ Mensagens vagas ("fix", "update")
3. ❌ Commitar arquivos sensíveis (.env, senhas)
4. ❌ Não testar antes de abrir o PR
5. ❌ Ignorar comentários dos revisores

---

## 🎯 Fluxo Completo Resumido

```bash
# 1. PREPARAR
git checkout main
git pull origin main
git checkout -b tipo/nome-descritivo

# 2. FAZER MUDANÇAS
# (edite os arquivos)

# 3. REVISAR
git status
git diff

# 4. COMMITAR
git add .
git commit -m "tipo: descrição clara"

# 5. ENVIAR
git push origin tipo/nome-descritivo

# 6. CRIAR PR NO GITHUB
# (via interface web)

# 7. AGUARDAR REVISÃO
# (responda comentários, faça ajustes)

# 8. MERGE
# (após aprovação, faça o merge)

# 9. LIMPAR
git checkout main
git pull origin main
git branch -d tipo/nome-descritivo
```

---

## 🎓 Exercícios Práticos

### Exercício 1: PR de Documentação

**Objetivo:** Adicionar seu nome na lista de contribuidores

1. Crie branch: `docs/adicionar-meu-nome`
2. Edite README.md
3. Adicione seu nome na seção de contribuidores
4. Commit: `docs: adicionar [seu nome] aos contribuidores`
5. Push e crie PR

---

### Exercício 2: PR de Melhoria

**Objetivo:** Melhorar a descrição de uma variável no .env.example

1. Crie branch: `docs/melhorar-descricao-env`
2. Edite .env.example
3. Melhore a descrição de uma variável
4. Commit: `docs: melhorar descrição da variável X`
5. Push e crie PR

---

### Exercício 3: PR de Correção

**Objetivo:** Corrigir um link quebrado (se houver)

1. Crie branch: `fix/corrigir-link-documentacao`
2. Encontre e corrija o link
3. Commit: `fix: corrigir link quebrado na seção X`
4. Push e crie PR

---

## 🏆 Próximos Passos

Depois de fazer seu primeiro PR:

1. **Aprenda sobre Code Review**
   - Como revisar PRs de outros
   - Como responder a feedback

2. **PRs mais Complexos**
   - Mudanças em código (não só docs)
   - Adicionar testes
   - Refatorações

3. **Automação**
   - CI/CD
   - Testes automáticos
   - Deploy automático

4. **Git Avançado**
   - Rebase
   - Cherry-pick
   - Bisect

---

## 📚 Recursos de Aprendizado

### Tutoriais Git

- **Git Básico:** https://git-scm.com/book/pt-br/v2
- **GitHub Flow:** https://guides.github.com/introduction/flow/
- **Commits Semânticos:** https://www.conventionalcommits.org/

### GitHub Copilot

- **Documentação:** https://docs.github.com/copilot
- **Boas Práticas:** https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/

### Vídeos Recomendados

- Git e GitHub para Iniciantes
- Como fazer um Pull Request
- GitHub Copilot: Guia Completo

---

## 💬 Perguntas Frequentes (FAQ)

### Q: Posso fazer PR direto na main?

**R:** ❌ Não! Sempre crie uma branch separada. Isso mantém o código organizado e permite revisão.

---

### Q: Meu PR foi rejeitado, e agora?

**R:** ✅ Normal! Leia os comentários, faça os ajustes na mesma branch, e faça push novamente. O PR será atualizado automaticamente.

---

### Q: Posso fazer vários commits em um PR?

**R:** ✅ Sim! É até recomendado. Commits pequenos e frequentes são mais fáceis de revisar.

---

### Q: Como sei se devo fazer um PR?

**R:** ✅ Se você quer que sua mudança seja incorporada ao projeto, faça um PR! Mesmo mudanças pequenas são bem-vindas.

---

### Q: E se eu cometer um erro?

**R:** ✅ Tranquilo! Git permite desfazer quase tudo. E todos cometem erros, faz parte do aprendizado!

---

## 🎉 Parabéns!

Você agora sabe:
- ✅ O que é um PR
- ✅ Como criar branches
- ✅ Como fazer commits
- ✅ Como enviar para o GitHub
- ✅ Como criar um PR profissional
- ✅ Como usar GitHub Copilot para ajudar

**Seu próximo passo:** Faça seu primeiro PR agora! Comece com algo simples, como corrigir um typo ou melhorar a documentação.

**Lembre-se:** Todo desenvolvedor experiente já foi iniciante. A prática leva à perfeição! 💪

---

**Elevare AI NeuroVendas** - Seu primeiro PR começa aqui! 🚀
