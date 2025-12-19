# 📋 n8n Workflows - Meta Ads Integration

Este diretório contém workflows do n8n para integração com a Meta Ads API.

## 📁 Arquivos

### 1. `workflow-criar-campanha-meta.json`

**Workflow principal para criação de campanhas no Meta Ads.**

#### Funcionalidade

- Recebe dados via webhook POST
- Valida e prepara os dados
- Cria campanha no Meta Ads Manager
- Cria conjunto de anúncios (ad set)
- Cria anúncio individual
- Retorna resposta com IDs criados

#### Estrutura

```
Webhook → Preparar Dados → Criar Campanha → Criar Ad Set → Criar Anúncio → Resposta
```

#### Como Importar

1. Abra o n8n: `http://localhost:5678`
2. Clique em **"Workflows"** → **"Importar"**
3. Selecione `workflow-criar-campanha-meta.json`
4. Configure as credenciais da Meta Ads API
5. Ative o workflow

#### Endpoint

```
POST http://localhost:5678/webhook/meta-campaign
```

#### Payload

```json
{
  "campaign_name": "Nome da Campanha",
  "objective": "OUTCOME_TRAFFIC",
  "daily_budget": 50,
  "target_audience": {
    "age_min": 25,
    "age_max": 55,
    "genders": [2],
    "geo_locations": {
      "countries": ["BR"]
    }
  }
}
```

#### Resposta de Sucesso

```json
{
  "success": true,
  "campaign_id": "123456789",
  "adset_id": "987654321",
  "ad_id": "456789123",
  "message": "Campanha criada com sucesso!"
}
```

---

### 2. `integration-multi-agente-example.json`

**Exemplo de integração com workflow multi-agente.**

#### Funcionalidade

- Nó HTTP Request para chamar o workflow principal
- Verificação de sucesso/erro
- Formatação de resposta
- Link direto para o Ads Manager

#### Como Usar

1. Abra seu workflow multi-agente existente
2. Adicione um novo nó HTTP Request no final
3. Copie as configurações deste arquivo
4. Ajuste os campos de acordo com seus dados
5. Conecte ao seu fluxo

#### Integração Recomendada

```
[IA Gera Insights] → [Valida Dados] → [Chama Meta API] → [Formata Resposta]
```

---

## ⚙️ Configuração

### Credenciais n8n

1. No n8n, vá em **"Credentials"** → **"Add Credential"**
2. Selecione **"Facebook Graph API"**
3. Preencha:
   - **Name**: `Meta Ads API`
   - **Access Token**: Seu token Meta (do .env)
4. Teste a conexão
5. Salve

### Variáveis de Ambiente

No n8n, configure as seguintes variáveis:

```env
META_AD_ACCOUNT_ID=act_1234567890
META_CREATIVE_ID=1234567890
```

**Como adicionar variáveis no n8n:**

- Self-hosted: Adicione ao `.env` do n8n
- Cloud: Vá em Settings → Environment Variables

---

## 🧪 Testando

### Teste Manual via n8n UI

1. Abra o workflow
2. Clique em **"Execute Workflow"**
3. Vá no nó **"Webhook"**
4. Clique em **"Listen for test event"**
5. Execute o script de teste:
   ```bash
   ./scripts/test-meta-campaign.sh
   ```
6. Verifique os resultados no n8n

### Teste via cURL

```bash
curl -X POST "http://localhost:5678/webhook/meta-campaign" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_name": "Teste",
    "objective": "OUTCOME_TRAFFIC",
    "daily_budget": 50
  }'
```

---

## 🔍 Monitoramento

### Ver Execuções

No n8n:

1. Vá em **"Executions"**
2. Filtre por workflow
3. Clique em uma execução para ver detalhes
4. Analise cada nó e seus dados

### Logs

```bash
# Logs do n8n (self-hosted)
docker logs n8n -f

# Ou se rodando direto
pm2 logs n8n
```

---

## 🐛 Troubleshooting

### Webhook não responde

- Verifique se o workflow está ativo
- Confirme a URL do webhook
- Teste com a UI do n8n primeiro

### Erro "Invalid credentials"

- Verifique se as credenciais estão configuradas
- Teste se o token está válido
- Renove o token se necessário

### Erro "Node not found"

- Confirme que as referências entre nós estão corretas
- Verifique se todos os nós estão conectados

### Campanha não criada

- Verifique os logs do n8n
- Confirme que META_AD_ACCOUNT_ID está correto
- Teste manualmente via Graph API Explorer

---

## 📝 Customização

### Adicionar Mais Campos

Edite o nó **"Preparar Dados"** para incluir novos campos:

```json
{
  "id": "novo_campo",
  "name": "novo_campo",
  "value": "={{ $json.body.novo_campo }}",
  "type": "string"
}
```

### Alterar Segmentação Padrão

Edite o nó **"Criar Conjunto de Anúncios"** → `targeting`:

```json
"targeting": {
  "geo_locations": {
    "countries": ["BR"],
    "regions": [{"key": "3448"}]
  },
  "age_min": 18,
  "age_max": 65,
  "genders": [1, 2],
  "interests": [...]
}
```

### Adicionar Notificações

Adicione um nó de notificação após a resposta:

- Email (SMTP)
- Slack
- Discord
- Telegram
- Webhook personalizado

---

## 🔐 Segurança

### Boas Práticas

✅ Use tokens de longa duração
✅ Armazene credenciais de forma segura
✅ Configure renovação automática de tokens
✅ Use HTTPS em produção
✅ Implemente rate limiting

❌ Não commite tokens no Git
❌ Não exponha webhooks publicamente sem autenticação
❌ Não compartilhe credenciais

### Autenticação no Webhook

Para adicionar autenticação ao webhook:

1. Adicione nó **"HTTP Request Auth"** após o webhook
2. Configure verificação de token/API key
3. Retorne erro 401 se inválido

---

## 📚 Recursos Adicionais

- [Documentação n8n](https://docs.n8n.io/)
- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [Guia Completo Meta Ads](../docs/README-META-ADS.md)
- [Guia Rápido](../docs/META-ADS-QUICK-START.md)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do n8n
2. Teste os nós individualmente
3. Valide as credenciais
4. Consulte a documentação da Meta
5. Abra uma issue no repositório

---

**Última atualização**: Dezembro 2024
