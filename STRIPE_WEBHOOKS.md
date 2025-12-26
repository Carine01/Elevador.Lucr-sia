# 🎯 Stripe Webhooks - Implementação Completa

## 📋 Visão Geral

O sistema de webhooks do Stripe foi **completamente implementado** para gerenciar assinaturas automaticamente.

### ✅ Funcionalidades Implementadas

1. **Idempotência**: Eventos duplicados são automaticamente ignorados
2. **Ativação Automática**: Assinaturas são ativadas após pagamento bem-sucedido
3. **Atualização de Status**: Status sincroniza em tempo real com Stripe
4. **Reset de Créditos**: Créditos mensais são resetados automaticamente
5. **Bloqueio por Falha**: Pagamentos falhados bloqueiam acesso automaticamente
6. **Downgrade Automático**: Cancelamentos retornam usuário para plano free
7. **Logs Detalhados**: Todos os eventos são registrados com IDs para auditoria

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_ESSENCIAL_PRICE_ID=price_your_essencial_price_id
STRIPE_PROFISSIONAL_PRICE_ID=price_your_profissional_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 2. Obter Webhook Secret

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Clique em "Add endpoint"
3. Configure a URL: `https://seu-dominio.com/api/stripe/webhook`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copie o "Signing secret" (whsec_...)

## 🧪 Testes Locais

### Instalar Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Outros sistemas
# https://stripe.com/docs/stripe-cli#install
```

### Fazer Login

```bash
stripe login
```

### Iniciar Forward de Webhooks

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o webhook secret exibido e adicione ao `.env` como `STRIPE_WEBHOOK_SECRET`.

### Testar Eventos

```bash
# Testar checkout completo
stripe trigger checkout.session.completed

# Testar atualização de assinatura
stripe trigger customer.subscription.updated

# Testar cancelamento
stripe trigger customer.subscription.deleted

# Testar falha de pagamento
stripe trigger invoice.payment_failed

# Testar pagamento bem-sucedido
stripe trigger invoice.payment_succeeded
```

## 📊 Eventos Suportados

### 1. `checkout.session.completed`

**Ação**: Ativa assinatura após pagamento bem-sucedido

**Processamento**:
- Busca subscription no Stripe
- Identifica plano pelo priceId
- Atualiza banco com:
  - Status: `active`
  - Plano correto
  - Créditos apropriados
  - Data de renovação

**Créditos por Plano**:
- Essencial: 5 créditos/mês
- Profissional: ilimitado (-1)

### 2. `customer.subscription.updated`

**Ação**: Atualiza status da assinatura

**Processamento**:
- Atualiza status no banco
- Atualiza data de renovação

### 3. `customer.subscription.deleted`

**Ação**: Downgrade automático para plano free

**Processamento**:
- Altera plano para `free`
- Define status como `cancelled`
- Reseta créditos para 1
- Registra data de cancelamento

### 4. `invoice.payment_failed`

**Ação**: Bloqueia acesso do usuário

**Processamento**:
- Define status como `inactive`
- Mantém dados da assinatura
- Permite reativação após pagamento

### 5. `invoice.payment_succeeded`

**Ação**: Reset de créditos mensais

**Processamento**:
- Reativa status para `active`
- Reseta créditos conforme plano:
  - Free: 1
  - Essencial: 5
  - Profissional: ilimitado

## 🔒 Segurança

### Validação de Assinatura

Todos os webhooks são validados usando a assinatura do Stripe:

```typescript
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  WEBHOOK_SECRET
);
```

Requisições sem assinatura válida são **rejeitadas com 400**.

### Idempotência

Eventos duplicados são ignorados automaticamente:

```typescript
if (processedEvents.has(event.id)) {
  return res.json({ received: true, skipped: true });
}
```

O cache é limpo após 1 hora.

## 📝 Logs

Todos os eventos geram logs estruturados:

```
ℹ️  [INFO] Webhook received { type: 'checkout.session.completed', eventId: 'evt_xxx' }
ℹ️  [INFO] Subscription activated { userId: 123, plan: 'essencial', subscriptionId: 'sub_xxx' }
```

Erros são registrados com stack trace completo em desenvolvimento.

## 🚀 Deployment

### Produção

1. Configure as variáveis de ambiente no Railway/Heroku
2. Atualize o endpoint do webhook no Stripe Dashboard
3. Teste cada evento após deploy
4. Monitore logs inicialmente

### Rollback

Se necessário fazer rollback:
1. O sistema continua funcionando (os webhooks falham silenciosamente)
2. Atualizações manuais podem ser feitas via admin
3. Reprocessar eventos usando Stripe Dashboard

## 🐛 Troubleshooting

### Webhook não está sendo chamado

1. Verifique se o endpoint está acessível publicamente
2. Confira se a URL está correta no Stripe Dashboard
3. Verifique logs do Stripe Dashboard > Webhooks

### Erro de assinatura inválida

1. Confirme que `STRIPE_WEBHOOK_SECRET` está correto
2. Verifique se não há espaços ou caracteres extras
3. Certifique-se que o body está sendo processado como raw

### Eventos não processam

1. Verifique logs do servidor para erros
2. Confirme que o banco de dados está acessível
3. Valide que os price IDs estão corretos no `.env`

### Créditos não resetam

1. Verifique se `invoice.payment_succeeded` está configurado
2. Confirme que o plano do usuário está correto no banco
3. Verifique logs do evento

## 📚 Referências

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Testing Guide](https://stripe.com/docs/webhooks/test)
- [Subscription Lifecycle](https://stripe.com/docs/billing/subscriptions/overview)

## 🎯 Próximos Passos

- [ ] Implementar envio de emails de notificação
- [ ] Adicionar retry automático para falhas temporárias
- [ ] Implementar webhook analytics/monitoring
- [ ] Adicionar testes automatizados de webhook handlers
