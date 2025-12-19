# 🔧 Scripts - Meta Ads Integration

Este diretório contém scripts utilitários para a integração com Meta Ads API.

---

## 📁 Arquivos

### 1. `test-meta-campaign.sh`

**Script de teste para validar a criação de campanhas.**

#### Uso

```bash
chmod +x scripts/test-meta-campaign.sh
./scripts/test-meta-campaign.sh
```

#### Funcionalidade

- Envia um POST para o webhook do n8n
- Usa dados de exemplo para estética
- Cria campanha de teste no Meta Ads Manager
- Retorna resposta com IDs da campanha criada

#### Pré-requisitos

- n8n rodando em `http://localhost:5678`
- Workflow `workflow-criar-campanha-meta.json` importado e ativo
- Variáveis de ambiente configuradas
- `curl` instalado

#### Customização

Para alterar os dados de teste, edite o payload JSON no script:

```bash
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_name": "Seu Nome de Campanha",
    "objective": "OUTCOME_LEADS",
    "daily_budget": 100,
    "target_audience": {
      "age_min": 30,
      "age_max": 50
    }
  }'
```

#### Exemplo de Saída

```
🧪 Testando criação de campanha Meta Ads...
{
  "success": true,
  "campaign_id": "123456789",
  "adset_id": "987654321",
  "ad_id": "456789123",
  "message": "Campanha criada com sucesso!"
}

✅ Teste enviado! Verifique no Meta Ads Manager.
```

#### Troubleshooting

**Erro: Connection refused**

- Verifique se o n8n está rodando
- Confirme a porta (padrão: 5678)
- Teste com: `curl http://localhost:5678`

**Erro: 404 Not Found**

- Verifique se o workflow está ativo
- Confirme o path do webhook: `/webhook/meta-campaign`

**Erro: 500 Internal Server Error**

- Verifique os logs do n8n
- Confirme que as credenciais estão configuradas
- Teste as credenciais no Graph API Explorer

---

### 2. `refresh-meta-token.js`

**Script para renovar token de longa duração da Meta Ads API.**

#### Uso

```bash
node scripts/refresh-meta-token.js
```

#### Funcionalidade

- Lê token atual do `.env`
- Faz exchange para novo token de longa duração
- Exibe novo token na tela
- Mostra data de expiração

#### Pré-requisitos

- Node.js 16+
- Variáveis no `.env`:
  - `META_APP_ID`
  - `META_APP_SECRET`
  - `META_ACCESS_TOKEN` (token atual)

#### Configuração

Adicione ao `.env`:

```env
META_APP_ID=1234567890
META_APP_SECRET=abcdef1234567890abcdef1234567890
META_ACCESS_TOKEN=EAAxxxxxx...
```

Para obter `META_APP_SECRET`:

1. Acesse [Facebook Developers](https://developers.facebook.com/apps)
2. Selecione seu app
3. Vá em **"Settings"** → **"Basic"**
4. Copie o **"App Secret"** (clique em "Show")

#### Exemplo de Saída

```
🔄 Renovando token da Meta Ads API...

✅ Token renovado com sucesso!

📋 Novo token:
─────────────────────────────────────────────────────────
EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
─────────────────────────────────────────────────────────

⏰ Expira em: 60 dias (5184000 segundos)

📝 Próximos passos:
   1. Copie o token acima
   2. Atualize META_ACCESS_TOKEN no seu .env
   3. Reinicie o n8n se estiver rodando
   4. Configure um lembrete para renovar antes de expirar
```

#### Automação

Para renovar automaticamente, adicione ao crontab:

```bash
# Renovar token a cada 45 dias (antes de expirar)
0 0 */45 * * cd /path/to/project && node scripts/refresh-meta-token.js >> logs/token-refresh.log 2>&1
```

Ou crie um workflow n8n com Schedule trigger:

```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "days",
          "daysInterval": 45
        }
      ]
    }
  },
  "type": "n8n-nodes-base.scheduleTrigger"
}
```

#### Troubleshooting

**Erro: Missing environment variables**

- Verifique se o `.env` existe
- Confirme que as variáveis estão definidas
- Teste com: `echo $META_APP_ID`

**Erro: Invalid client_id or client_secret**

- Verifique o App ID e App Secret
- Confirme se copiou corretamente (sem espaços)
- Teste no Graph API Explorer

**Erro: Invalid OAuth access token**

- Token atual já expirou
- Gere um novo token manualmente:
  1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
  2. Gere token de curta duração
  3. Use este script para converter em longa duração

---

## 🔄 Fluxo de Trabalho Recomendado

### Teste Inicial

```bash
# 1. Testar criação de campanha
./scripts/test-meta-campaign.sh

# 2. Verificar no Ads Manager
open https://business.facebook.com/adsmanager
```

### Manutenção Regular

```bash
# A cada 45 dias: Renovar token
node scripts/refresh-meta-token.js

# Após renovar: Atualizar .env e reiniciar n8n
systemctl restart n8n
# ou
pm2 restart n8n
```

---

## 📝 Adicionando Novos Scripts

Para adicionar um novo script:

1. **Crie o arquivo**

   ```bash
   touch scripts/seu-script.sh
   ```

2. **Adicione o shebang**

   ```bash
   #!/bin/bash
   ```

3. **Torne executável**

   ```bash
   chmod +x scripts/seu-script.sh
   ```

4. **Documente aqui no README**

---

## 🔐 Segurança

### Boas Práticas

✅ Nunca commite `.env` no Git
✅ Use variáveis de ambiente
✅ Rotacione tokens regularmente
✅ Guarde backups de tokens antigos
✅ Use secrets manager em produção

❌ Não hardcode tokens nos scripts
❌ Não compartilhe tokens
❌ Não exiba tokens em logs públicos

### Proteção de Secrets

Para produção, use:

- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**
- **Google Secret Manager**

Exemplo com AWS:

```javascript
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

async function getToken() {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: "meta-ads-token" })
  );
  return JSON.parse(response.SecretString).token;
}
```

---

## 🐛 Debug

### Modo Verbose

Para debug detalhado, adicione `-v` ao curl:

```bash
curl -v -X POST "http://localhost:5678/webhook/meta-campaign" \
  -H "Content-Type: application/json" \
  -d '{"campaign_name": "Teste"}'
```

### Logs

Para salvar logs:

```bash
./scripts/test-meta-campaign.sh > logs/test-$(date +%Y%m%d-%H%M%S).log 2>&1
```

---

## 📚 Recursos

- [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-apis)
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)
- [curl Documentation](https://curl.se/docs/)
- [jq (JSON processor)](https://stedolan.github.io/jq/)

---

## 🆘 Suporte

Para problemas com scripts:

1. Verifique se está executável: `ls -la scripts/`
2. Teste comando por comando
3. Verifique permissões: `chmod +x scripts/script.sh`
4. Execute com bash explícito: `bash scripts/script.sh`

---

**Última atualização**: Dezembro 2024
