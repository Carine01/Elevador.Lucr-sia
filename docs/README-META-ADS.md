# 🎯 Meta Ads API - Guia de Configuração

## Integração Meta Ads - Criação Automática de Campanhas

Este guia completo mostra como integrar a plataforma Elevare com a Meta Ads API para criar campanhas automaticamente no Facebook e Instagram.

---

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Setup Rápido (15 minutos)](#setup-rápido-15-minutos)
- [Configuração Detalhada](#configuração-detalhada)
- [Uso do Workflow n8n](#uso-do-workflow-n8n)
- [Integração com Multi-Agente](#integração-com-multi-agente)
- [Troubleshooting](#troubleshooting)
- [Limites da API](#limites-da-api)
- [Monitoramento](#monitoramento)

---

## 🚀 Pré-requisitos

Antes de começar, você precisa ter:

- ✅ Conta Meta Business Manager ativa
- ✅ Conta de anúncios criada e configurada
- ✅ Página do Facebook vinculada à conta Business
- ✅ Pixel do Facebook instalado (opcional, mas recomendado)
- ✅ n8n instalado e rodando (self-hosted ou cloud)
- ✅ Acesso de administrador à conta de anúncios

---

## ⚡ Setup Rápido (15 minutos)

### 1. Criar App no Meta for Developers

1. Acesse [Facebook Developers](https://developers.facebook.com/apps)
2. Clique em **"Criar App"**
3. Selecione tipo: **"Business"**
4. Preencha:
   - Nome do app: `"Campanha Automatizada IA"`
   - Email de contato: seu email profissional
   - Business Manager: selecione sua conta business
5. Clique em **"Criar App"**

### 2. Adicionar Marketing API

1. No painel do seu app, clique em **"Adicionar Produto"**
2. Selecione **"Marketing API"**
3. Clique em **"Configurar"**
4. Aceite os termos de uso

### 3. Gerar Token de Acesso

#### 3.1. Token de Curta Duração (Para Teste)

1. Acesse o [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecione seu app no dropdown
3. Clique em **"Permissões"** e adicione:
   - `ads_management`
   - `ads_read`
   - `business_management`
4. Clique em **"Gerar Token de Acesso"**
5. Copie o token (válido por 1-2 horas)

#### 3.2. Token de Longa Duração (Para Produção)

Execute o seguinte comando substituindo os valores:

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "fb_exchange_token=SHORT_LIVED_TOKEN"
```

O token retornado será válido por 60 dias.

### 4. Obter IDs Necessários

#### 4.1. ID da Conta de Anúncios

1. Acesse [Business Settings](https://business.facebook.com/settings/ad-accounts)
2. Clique na conta de anúncios desejada
3. Copie o **Account ID** (formato: `act_1234567890`)

#### 4.2. ID da Página

1. Acesse sua página do Facebook
2. Clique em **"Sobre"** ou **"About"**
3. Role até encontrar o **Page ID**
4. Ou use a URL: `https://www.facebook.com/YOUR_PAGE` → Inspecionar → Ver ID

#### 4.3. ID do Pixel (Opcional)

1. Acesse o [Events Manager](https://business.facebook.com/events_manager)
2. Selecione seu pixel
3. Copie o **Pixel ID** (numérico)

#### 4.4. ID do Creative (Necessário)

Você precisa criar um creative padrão primeiro:

1. Acesse o [Ads Manager](https://business.facebook.com/adsmanager)
2. Vá em **"Todos os Anúncios"** → **"Creative Hub"**
3. Crie um creative básico (imagem + texto)
4. Salve e copie o **Creative ID**

Ou crie via API:

```bash
curl -X POST "https://graph.facebook.com/v18.0/act_YOUR_ACCOUNT_ID/adcreatives" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Creative Padrão",
    "object_story_spec": {
      "page_id": "YOUR_PAGE_ID",
      "link_data": {
        "image_hash": "YOUR_IMAGE_HASH",
        "link": "https://seu-site.com",
        "message": "Texto do anúncio"
      }
    },
    "access_token": "YOUR_ACCESS_TOKEN"
  }'
```

### 5. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Meta Ads API
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
META_AD_ACCOUNT_ID=act_1234567890
META_PAGE_ID=1234567890
META_PIXEL_ID=1234567890
META_CREATIVE_ID=1234567890
```

### 6. Importar Workflow no n8n

1. Acesse seu n8n: `http://localhost:5678`
2. Clique em **"Workflows"** → **"Importar"**
3. Selecione o arquivo: `n8n-workflows/workflow-criar-campanha-meta.json`
4. Configure as credenciais do Facebook Graph API:
   - Nome: `Meta Ads API`
   - Access Token: Cole o token gerado no passo 3

### 7. Testar a Integração

Execute o script de teste:

```bash
chmod +x scripts/test-meta-campaign.sh
./scripts/test-meta-campaign.sh
```

Se tudo estiver correto, você verá a campanha criada no Meta Ads Manager em modo **PAUSED**.

---

## 🔧 Configuração Detalhada

### Estrutura do Workflow n8n

O workflow `workflow-criar-campanha-meta.json` contém:

1. **Webhook Receiver**: Recebe dados da campanha via POST
2. **Data Preparation**: Prepara e valida os dados
3. **Create Campaign**: Cria a campanha no Meta Ads
4. **Create Ad Set**: Cria o conjunto de anúncios
5. **Create Ad**: Cria o anúncio individual
6. **Response**: Retorna sucesso ou erro

### Payload de Exemplo

```json
{
  "campaign_name": "Promoção de Verão - Harmonização",
  "objective": "OUTCOME_TRAFFIC",
  "daily_budget": 50,
  "target_audience": {
    "age_min": 25,
    "age_max": 55,
    "genders": [2],
    "geo_locations": {
      "countries": ["BR"],
      "cities": [
        {
          "key": "São Paulo",
          "radius": 50,
          "distance_unit": "kilometer"
        }
      ]
    },
    "interests": [
      { "id": "6003139266461", "name": "Beauty" },
      { "id": "6003189043461", "name": "Skin care" }
    ]
  }
}
```

### Objetivos Disponíveis

Use os seguintes valores para o campo `objective`:

| Objetivo | Descrição | Quando Usar |
|----------|-----------|-------------|
| `OUTCOME_AWARENESS` | Reconhecimento de marca | Aumentar visibilidade |
| `OUTCOME_ENGAGEMENT` | Engajamento | Mais interações |
| `OUTCOME_TRAFFIC` | Tráfego | Direcionar ao site |
| `OUTCOME_LEADS` | Geração de leads | Capturar contatos |
| `OUTCOME_SALES` | Vendas | Conversões diretas |
| `OUTCOME_APP_PROMOTION` | Promoção de app | Downloads de app |

### Segmentação Avançada

#### Por Localização

```json
"geo_locations": {
  "countries": ["BR"],
  "regions": [
    { "key": "3448" }  // São Paulo state
  ],
  "cities": [
    { "key": "São Paulo", "radius": 25, "distance_unit": "kilometer" },
    { "key": "Rio de Janeiro", "radius": 30, "distance_unit": "kilometer" }
  ]
}
```

#### Por Interesses

Interesses populares para estética:

```json
"interests": [
  { "id": "6003139266461", "name": "Beauty" },
  { "id": "6003189043461", "name": "Skin care" },
  { "id": "6003113684861", "name": "Cosmetics" },
  { "id": "6003397425279", "name": "Health" },
  { "id": "6003020834693", "name": "Wellness" }
]
```

Para encontrar mais IDs de interesses, use o [Targeting Search](https://developers.facebook.com/docs/marketing-api/audiences/reference/targeting-search):

```bash
curl -X GET "https://graph.facebook.com/v18.0/search" \
  -d "type=adinterest" \
  -d "q=beauty salon" \
  -d "access_token=YOUR_TOKEN"
```

---

## 🔗 Integração com Multi-Agente

Se você possui um workflow multi-agente que gera insights de campanha, adicione este nó no final para criar campanhas automaticamente:

```json
{
  "parameters": {
    "url": "http://localhost:5678/webhook/meta-campaign",
    "method": "POST",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "campaign_name",
          "value": "={{ $json.campaign_name }}"
        },
        {
          "name": "objective",
          "value": "OUTCOME_TRAFFIC"
        },
        {
          "name": "daily_budget",
          "value": "={{ $json.budget }}"
        }
      ]
    }
  },
  "id": "call-meta-api",
  "name": "Criar Campanha Real",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [2000, 300]
}
```

---

## 🐛 Troubleshooting

### Erro: "Invalid OAuth access token"

**Causa**: Token expirado ou inválido.

**Solução**:
1. Gere um novo token de longa duração
2. Atualize as credenciais no n8n
3. Se usar token de curta duração, configure renovação automática

### Erro: "(#10) Application does not have permission for this action"

**Causa**: Permissões insuficientes.

**Solução**:
1. Verifique se o app tem as permissões: `ads_management`, `ads_read`, `business_management`
2. No Business Manager, adicione o app à conta de anúncios
3. Conceda permissões de "Advertiser" ou superior

### Erro: "Insufficient permissions to create campaign"

**Causa**: Usuário não tem acesso de admin na conta de anúncios.

**Solução**:
1. Acesse [Business Settings](https://business.facebook.com/settings/ad-accounts)
2. Adicione seu usuário como **Admin** da conta de anúncios
3. Aguarde alguns minutos e tente novamente

### Erro: "Campaign budget optimization required"

**Causa**: Conta requer otimização de orçamento em nível de campanha.

**Solução**:
Adicione ao nó de criação de campanha:

```json
"additional_fields": {
  "campaign_budget_optimization": true
}
```

### Erro: "Creative not found"

**Causa**: ID do creative inválido ou não pertence à conta.

**Solução**:
1. Crie um novo creative no Ads Manager
2. Copie o ID correto
3. Atualize `META_CREATIVE_ID` no `.env`

### Erro: "Rate limit exceeded"

**Causa**: Muitas requisições em curto período.

**Solução**:
1. Aguarde 1 hora antes de tentar novamente
2. Implemente throttling no workflow
3. Use delays entre as chamadas de API

---

## ⚠️ Limites da API

A Meta Ads API possui os seguintes limites:

| Limite | Valor |
|--------|-------|
| Requisições por usuário/hora | 200 |
| Requisições por app/hora | 4.800 |
| Taxa de requisição | 1 req/s (burst de 10) |
| Campanhas por conta | 10.000 |
| Ad sets por campanha | 1.000 |
| Anúncios por ad set | 50 |

### Boas Práticas

1. **Implemente Retry Logic**: Retentar após erros 500+
2. **Use Batch Requests**: Agrupe múltiplas chamadas quando possível
3. **Cache Tokens**: Não gere novo token a cada requisição
4. **Monitore Rate Limits**: Implemente alertas

---

## 📊 Monitoramento

### Ver Campanhas Criadas

```bash
curl -X GET "https://graph.facebook.com/v18.0/act_YOUR_ACCOUNT_ID/campaigns" \
  -d "fields=id,name,status,objective,daily_budget" \
  -d "access_token=YOUR_TOKEN"
```

### Ver Métricas de Campanha

```bash
curl -X GET "https://graph.facebook.com/v18.0/CAMPAIGN_ID/insights" \
  -d "fields=impressions,clicks,spend,cpc,ctr" \
  -d "access_token=YOUR_TOKEN"
```

### Webhook para Atualizações

Configure um webhook para receber atualizações em tempo real:

1. No painel do app, vá em **"Webhooks"**
2. Adicione URL de callback: `https://seu-dominio.com/meta-webhook`
3. Subscreva aos eventos: `ad_campaign`, `ad_account`

---

## 🔐 Segurança

### Renovação de Token

Tokens de longa duração expiram após 60 dias. Configure renovação automática:

```javascript
// scripts/refresh-meta-token.js
import axios from 'axios';

async function refreshToken() {
  const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: process.env.META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      fb_exchange_token: process.env.META_ACCESS_TOKEN
    }
  });
  
  console.log('Novo token:', response.data.access_token);
  // Atualize seu .env ou secrets manager
}

refreshToken();
```

### Proteção de Credenciais

- ❌ Nunca commite tokens no Git
- ✅ Use variáveis de ambiente
- ✅ Rotacione tokens regularmente
- ✅ Use secrets manager em produção (AWS Secrets, Vault)

---

## 📚 Recursos Adicionais

- [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-apis)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Targeting Reference](https://developers.facebook.com/docs/marketing-api/audiences/reference/targeting)
- [Error Codes](https://developers.facebook.com/docs/graph-api/using-graph-api/error-handling)

---

## ✅ Checklist de Implementação

- [ ] App criado no Meta for Developers
- [ ] Marketing API adicionada ao app
- [ ] Token de longa duração gerado
- [ ] IDs coletados (account, page, pixel, creative)
- [ ] Variáveis de ambiente configuradas
- [ ] Workflow importado no n8n
- [ ] Credenciais configuradas no n8n
- [ ] Teste de criação de campanha executado com sucesso
- [ ] Campanha verificada no Meta Ads Manager
- [ ] Integração com sistema principal funcionando

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do n8n
2. Teste manualmente via Graph API Explorer
3. Consulte a documentação oficial da Meta
4. Verifique status da API: [Meta Status](https://status.facebook.com/)

---

**Última atualização**: Dezembro 2024
