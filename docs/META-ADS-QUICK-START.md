# 🚀 Meta Ads API - Guia Rápido de Início

## Setup em 5 Passos (15 minutos)

### 1️⃣ Criar App no Facebook

```
👉 https://developers.facebook.com/apps
   → Criar App
   → Tipo: Business
   → Adicionar "Marketing API"
```

### 2️⃣ Gerar Token

```
👉 https://developers.facebook.com/tools/explorer/
   → Selecionar seu app
   → Permissões: ads_management, ads_read, business_management
   → Gerar Token
   → Copiar token
```

### 3️⃣ Obter IDs

```bash
# ID da Conta de Anúncios
👉 https://business.facebook.com/settings/ad-accounts
   → Copiar Account ID (formato: act_1234567890)

# ID da Página
👉 Sua página → Sobre → Page ID

# ID do Creative (criar primeiro no Ads Manager)
👉 https://business.facebook.com/adsmanager
   → Creative Hub → Criar Creative → Copiar ID
```

### 4️⃣ Configurar .env

```env
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
META_AD_ACCOUNT_ID=act_1234567890
META_PAGE_ID=1234567890
META_PIXEL_ID=1234567890
META_CREATIVE_ID=1234567890
```

### 5️⃣ Testar

```bash
chmod +x scripts/test-meta-campaign.sh
./scripts/test-meta-campaign.sh
```

✅ Verifique a campanha no [Meta Ads Manager](https://business.facebook.com/adsmanager)

---

## 📝 Estrutura dos Arquivos

```
n8n-workflows/
├── workflow-criar-campanha-meta.json          # Workflow principal
└── integration-multi-agente-example.json      # Exemplo de integração

scripts/
├── test-meta-campaign.sh                      # Script de teste
└── refresh-meta-token.js                      # Renovar token

docs/
├── README-META-ADS.md                         # Documentação completa
└── META-ADS-QUICK-START.md                    # Este guia

shared/
└── metaAds.ts                                 # Utilitários TypeScript
```

---

## 🎯 Objetivos Disponíveis

| Código               | Uso                     |
| -------------------- | ----------------------- |
| `OUTCOME_TRAFFIC`    | Direcionar ao site      |
| `OUTCOME_LEADS`      | Capturar contatos       |
| `OUTCOME_SALES`      | Gerar vendas            |
| `OUTCOME_AWARENESS`  | Reconhecimento de marca |
| `OUTCOME_ENGAGEMENT` | Mais interações         |

---

## 💰 Orçamento

- Mínimo: R$ 10,00/dia
- Formato API: Centavos (5000 = R$ 50,00)
- Exemplo: `daily_budget: 50` = R$ 50,00/dia

---

## 🎨 Interesses Populares para Estética

```typescript
const interests = [
  { id: "6003139266461", name: "Beauty" },
  { id: "6003189043461", name: "Skin care" },
  { id: "6003113684861", name: "Cosmetics" },
  { id: "6003397425279", name: "Health" },
  { id: "6003020834693", name: "Wellness" },
];
```

---

## 🔧 Troubleshooting Rápido

### Token Expirado

```bash
node scripts/refresh-meta-token.js
```

### Permissões Insuficientes

```
👉 Business Manager → Ad Accounts
   → Adicionar você como Admin
```

### Creative Não Encontrado

```
👉 Ads Manager → Creative Hub
   → Criar novo → Copiar ID correto
```

---

## 📚 Documentação Completa

Para informações detalhadas, consulte: [README-META-ADS.md](./README-META-ADS.md)

---

## 🆘 Suporte

- [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-apis)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Meta Status](https://status.facebook.com/)

---

**Última atualização**: Dezembro 2024
