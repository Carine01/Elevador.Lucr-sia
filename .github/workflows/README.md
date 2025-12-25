# GitHub Actions Workflows

Este projeto utiliza múltiplos workflows do GitHub Actions para garantir qualidade, segurança e disponibilidade do sistema.

## 📋 Workflows Disponíveis

### 1. `deploy.yml` - Deploy Completo
**Trigger:** Push ou PR para `main`

**Etapas:**
- 🧹 Limpeza do codebase
- 🔍 Auditoria de qualidade e segurança
- 🏗️ Build e testes
- 🚀 Deploy para Railway (apenas main)
- 🗄️ Migração de banco (se commit contém `[db]`)

### 2. `ci.yml` - CI/CD Pipeline
**Trigger:** Push ou PR para `main`

**Etapas:**
- 🔒 Testes de segurança (filtros de userId, admin, CORS, rate limiting)
- 🏥 Testes de saúde (health check, webhook, database)
- 🏗️ Build e testes
- ✅ Validação TypeScript

**Scripts executados:**
- `pnpm test:security` - Verifica configurações de segurança
- `pnpm test:health` - Verifica endpoints críticos
- `pnpm check` - Validação de tipos TypeScript
- `pnpm build` - Build do projeto
- `pnpm test` - Suite completa de testes

### 3. `health-check.yml` - Monitoramento de Produção
**Trigger:** A cada 5 minutos (cron) + manual

**Etapas:**
- 🏥 Testa endpoint `/api/trpc/health.check`
- 🔐 Verifica autenticação
- 🚦 Testa rate limiting
- ⏱️ Mede tempo de resposta
- 🚨 Cria issue se falhar
- ✅ Fecha issue quando recuperar

**URL monitorada:**
```
https://acceptable-elegance-production-0f9f.up.railway.app/api/trpc/health.check
```

## 🎯 Quando Cada Workflow Executa

| Evento | deploy.yml | ci.yml | health-check.yml |
|--------|------------|--------|------------------|
| Push para main | ✅ | ✅ | - |
| Pull Request | ✅ | ✅ | - |
| A cada 5 min | - | - | ✅ |
| Manual | - | - | ✅ |

## 📊 Status dos Workflows

Você pode ver o status de todos os workflows em:
```
https://github.com/Carine01/Elevador.Lucr-sia/actions
```

## 🔧 Configuração Necessária

### Secrets do GitHub:
- `RAILWAY_TOKEN` - Token de autenticação do Railway (para deploy.yml)
- `RAILWAY_SERVICE_ID` - ID do serviço no Railway (para deploy.yml)
- `DATABASE_URL` - URL do banco de dados (para migrations)

### Como adicionar secrets:
1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione cada secret necessário

## 🚨 Notificações

### Deploy Workflow
- Notifica no final do pipeline com resumo completo
- Cria summary no GitHub Actions

### CI Workflow
- Falha se algum teste de segurança ou saúde falhar
- Mostra logs detalhados de cada teste

### Health Check Workflow
- **Cria issue automaticamente** se sistema cair
- **Fecha issue automaticamente** quando sistema recuperar
- Issues recebem label `health-check-alert` e `urgent`

## 📚 Scripts Disponíveis

```bash
# Executar testes de segurança
pnpm test:security

# Executar testes de saúde
pnpm test:health

# Executar todos os testes automatizados
pnpm test:all

# Build do projeto
pnpm build

# Verificar tipos TypeScript
pnpm check
```

## 🏥 Health Check Endpoint

O endpoint de health check retorna:

```json
{
  "result": {
    "data": {
      "status": "healthy",
      "timestamp": "2025-12-25T22:00:00.000Z",
      "version": "1.0.0",
      "environment": "production",
      "database": "connected",
      "uptime": 3600,
      "memory": {
        "used": 256,
        "total": 512
      }
    }
  }
}
```

## 📖 Documentação Adicional

Para mais informações sobre monitoramento, veja:
- [docs/MONITORING.md](../../docs/MONITORING.md) - Guia completo de monitoramento
