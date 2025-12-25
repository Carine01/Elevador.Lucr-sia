# 📊 GUIA COMPLETO DE MONITORAMENTO

Este guia ensina como configurar monitoramento 24/7 para o sistema Elevare usando ferramentas gratuitas e profissionais.

---

## 🎯 OBJETIVOS

1. ✅ Ser alertado se o sistema cair
2. ✅ Monitorar performance e uptime
3. ✅ Detectar erros antes dos clientes
4. ✅ Logs centralizados e análise

---

## 1️⃣ RAILWAY HEALTH CHECKS (Nativo - 2 minutos)

### Como Configurar:

1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Selecione seu projeto **Elevare**
3. Clique na service **elevare-production**
4. Vá em **Settings** → **Health Check**
5. Configure:
   ```
   Path: /api/trpc/health.check
   Timeout: 300 segundos
   Interval: 30 segundos
   ```
6. Clique em **Save**

### O que acontece:

- Railway verifica `/api/trpc/health.check` a cada 30 segundos
- Se falhar por 3 vezes seguidas → **reinicia automaticamente**
- Se continuar falhando → **te envia e-mail**

### Configurar Notificações:

1. **Settings** → **Notifications**
2. Adicione:
   - **Discord Webhook** (recomendado)
   - **Email** (seu email)
   - **Slack** (se tiver)

---

## 2️⃣ UPTIMEROBOT (Grátis - 5 minutos)

### Por que usar:

- ✅ **Grátis** para até 50 monitores
- ✅ Alerta via **email, SMS, Discord, Telegram, Slack**
- ✅ Página de status pública
- ✅ Histórico de uptime

### Como Configurar:

1. Acesse [uptimerobot.com](https://uptimerobot.com)
2. Crie conta gratuita
3. Clique em **Add New Monitor**
4. Configure:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: Elevare Health Check
   URL: https://acceptable-elegance-production-0f9f.up.railway.app/api/trpc/health.check
   Monitoring Interval: 5 minutes (grátis) ou 1 minute (pago)
   ```
5. Em **Alert Contacts**, adicione:
   - Seu email
   - Discord webhook (opcional)
   - Telegram (opcional)

### Criar Webhook Discord:

1. Abra seu servidor Discord
2. **Configurações do Canal** → **Integrações** → **Webhooks**
3. Clique em **Novo Webhook**
4. Copie a URL
5. Cole no UptimeRobot

### Testar:

- UptimeRobot vai fazer a primeira checagem em 5 minutos
- Você receberá email de confirmação
- Para testar alerta: mate o servidor por 10 minutos

---

## 3️⃣ BETTERSTACK (Profissional - Grátis até 10 serviços)

### Por que usar:

- ✅ Monitoramento mais avançado
- ✅ Logs centralizados
- ✅ APM (Application Performance Monitoring)
- ✅ Incident management

### Como Configurar:

1. Acesse [betterstack.com](https://betterstack.com)
2. Crie conta gratuita
3. **Uptime** → **Create Monitor**
4. Configure:
   ```
   URL: https://acceptable-elegance-production-0f9f.up.railway.app/api/trpc/health.check
   Check Frequency: 30 seconds
   Regions: São Paulo, US East
   ```
5. **Logs** → **Add Source** → **Railway**
6. Copie o token e adicione no Railway:
   ```
   BETTERSTACK_SOURCE_TOKEN=seu_token_aqui
   ```

---

## 4️⃣ GITHUB ACTIONS (Já Configurado Automaticamente)

### O que já está funcionando:

- ✅ **CI/CD automático** - Testa a cada push
- ✅ **Health check a cada 5 minutos** - Pinga produção
- ✅ **Testes de segurança** - Verifica filtros de userId
- ✅ **Notificações** - Cria issue se falhar

### Como Ver os Logs:

1. Vá em **Actions** no GitHub
2. Clique em **Production Health Check**
3. Veja os logs em tempo real

### Como Configurar Notificações:

1. **Settings** → **Notifications**
2. Ative:
   - ✅ **Actions failed**
   - ✅ **Workflow run failures**
3. Adicione email ou integração

### Workflows Configurados:

#### CI/CD Pipeline (`.github/workflows/ci.yml`)
- Executa em: push e pull_request no `main`
- **Security Tests**: Verifica filtros de userId e configurações
- **Build & Test**: Compila e testa o código
- **Deploy**: Notifica sucesso (Railway faz deploy automaticamente)

#### Production Health Check (`.github/workflows/health-check.yml`)
- Executa: A cada 5 minutos (cron)
- Testa: `/api/trpc/health.check`
- Testa: Autenticação
- Testa: Rate limiting
- Testa: Tempo de resposta
- **Cria issue automaticamente se falhar**
- **Fecha issue automaticamente quando recuperar**

---

## 5️⃣ SENTRY (Monitoramento de Erros - Grátis para 5k eventos/mês)

### Por que usar:

- ✅ Captura **todos os erros** em tempo real
- ✅ Stack traces completos
- ✅ Contexto do usuário
- ✅ Alertas instantâneos

### Como Configurar:

1. Acesse [sentry.io](https://sentry.io)
2. Crie projeto **Node.js/Express**
3. Copie o DSN
4. Instale:
   ```bash
   pnpm add @sentry/node @sentry/tracing
   ```
5. Adicione em `server/_core/index.ts`:
   ```typescript
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });

   // Depois de criar o app Express:
   app.use(Sentry.Handlers.requestHandler());
   app.use(Sentry.Handlers.tracingHandler());

   // No final, antes de app.listen():
   app.use(Sentry.Handlers.errorHandler());
   ```
6. Adicione `SENTRY_DSN` no Railway

### Testar:

```bash
# Force um erro:
throw new Error("Teste de monitoramento Sentry");

# Vá no Sentry dashboard e veja o erro aparecer
```

---

## 6️⃣ DATADOG (Enterprise - Grátis para 5 hosts)

### Por que usar:

- ✅ APM completo
- ✅ Métricas de performance
- ✅ Logs centralizados
- ✅ Dashboards customizados

### Como Configurar:

1. Acesse [datadoghq.com](https://datadoghq.com)
2. Crie conta trial (14 dias grátis, depois US$ 15/host/mês)
3. **Integrations** → **Railway**
4. Instale agent:
   ```bash
   pnpm add dd-trace
   ```
5. Adicione em `server/_core/index.ts`:
   ```typescript
   import tracer from 'dd-trace';
   tracer.init({
     service: 'elevare-api',
     env: process.env.NODE_ENV,
   });
   ```
6. Configure no Railway:
   ```
   DD_API_KEY=seu_api_key
   DD_SITE=datadoghq.com
   ```

---

## 7️⃣ SCRIPTS LOCAIS (Para Desenvolvimento)

### Scripts de Teste Já Configurados:

```bash
# Testar segurança (verifica filtros de userId, admin, rate limiting)
pnpm test:security

# Testar saúde (verifica endpoints, webhook, banco de dados)
pnpm test:health

# Executar todos os testes
pnpm test:all
```

### Monitor Local (Roda no seu PC):

Crie `monitor-local.sh`:

```bash
#!/bin/bash
API_URL="http://localhost:3000"

while true; do
  STATUS=$(curl -s -w "%{http_code}" -o /dev/null "$API_URL/api/trpc/health.check" 2>/dev/null || echo "0")
  
  if [ "$STATUS" != "200" ]; then
    echo "❌ $(date): Servidor local caiu! Status: $STATUS"
    
    # Tenta reiniciar (se estiver rodando via pnpm dev)
    pkill -f "tsx watch" 2>/dev/null
    sleep 2
    pnpm dev &
    
    echo "🔄 Tentando reiniciar servidor..."
  else
    echo "✅ $(date): Sistema OK"
  fi
  
  sleep 10
done
```

Execute:
```bash
chmod +x monitor-local.sh
./monitor-local.sh &
```

---

## 8️⃣ DASHBOARD DE STATUS PÚBLICO

### Status Page (Grátis):

1. Use [statuspage.io](https://statuspage.io) ou [Instatus](https://instatus.com)
2. Configure:
   - **Nome:** Elevare Status
   - **Componentes:** API, Dashboard, Pagamentos
   - **Monitores:** Link com UptimeRobot
3. Publique URL: `status.seudominio.com`
4. Adicione no footer do site:
   ```tsx
   <a href="https://status.seudominio.com" target="_blank">
     Status do Sistema
   </a>
   ```

---

## 9️⃣ CHECKLIST FINAL

Após configurar tudo, você terá:

- [x] Railway Health Check ativo (já configurado)
- [x] GitHub Actions executando testes (já configurado)
- [x] Scripts de teste funcionando (já configurado)
- [ ] UptimeRobot monitorando 24/7
- [ ] Sentry capturando erros (opcional)
- [ ] Dashboard de status público (opcional)
- [ ] Alertas no Discord/Email/SMS
- [ ] Logs centralizados (BetterStack ou Datadog - opcional)

---

## 🔟 ALERTAS RECOMENDADOS

### Críticos (te acordam 3h da manhã):

- ✅ Sistema fora do ar por >5 minutos
- ✅ Erro crítico no Stripe webhook
- ✅ Banco de dados inacessível

### Importantes (notificação normal):

- ⚠️ Taxa de erro >5%
- ⚠️ Tempo de resposta >2s
- ⚠️ Health check falhou 1 vez

### Informativos (apenas log):

- ℹ️ Deploy concluído
- ℹ️ Novo usuário cadastrado
- ℹ️ Assinatura renovada

---

## 1️⃣1️⃣ ENDPOINTS DE MONITORAMENTO

### Health Check Endpoint:

```
GET /api/trpc/health.check
```

**Resposta esperada (200 OK):**
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

### Health Check Simples (Express):

```
GET /api/health
```

**Resposta esperada (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-25T22:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## 📞 SUPORTE

Problemas com monitoramento? 

1. Verifique se health check responde: 
   ```bash
   curl https://acceptable-elegance-production-0f9f.up.railway.app/api/trpc/health.check
   ```
2. Veja logs no Railway: 
   ```bash
   railway logs
   ```
3. Verifique GitHub Actions: Vá na aba **Actions**
4. Execute testes localmente:
   ```bash
   pnpm test:all
   ```

---

## 📚 RECURSOS ADICIONAIS

- [Railway Documentation](https://docs.railway.app/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [UptimeRobot API](https://uptimerobot.com/api/)
- [Sentry Node.js Guide](https://docs.sentry.io/platforms/node/)
- [BetterStack Uptime](https://betterstack.com/docs/uptime/)

---

**URL de Produção:** https://acceptable-elegance-production-0f9f.up.railway.app

**Última atualização:** Dezembro 2025
