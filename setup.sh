#!/bin/bash

# ==========================================
# SCRIPT DE SETUP RÁPIDO
# Elevare AI NeuroVendas
# ==========================================

echo "🚀 SETUP RÁPIDO - Elevare AI NeuroVendas"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se .env existe
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env já existe!${NC}"
    read -p "Deseja sobrescrever? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Abortando..."
        exit 1
    fi
fi

# Copiar .env.example para .env
echo "📝 Criando arquivo .env..."
cp .env.example .env

echo -e "${GREEN}✓${NC} Arquivo .env criado!"
echo ""
echo "⚠️  IMPORTANTE: Edite o arquivo .env e configure as seguintes variáveis:"
echo ""
echo "1. DATABASE_URL - Connection string do MySQL"
echo "2. VITE_APP_ID - App ID do OAuth Manus"
echo "3. OWNER_OPEN_ID - Owner OpenID do Manus"
echo "4. JWT_SECRET - Chave secreta (mínimo 32 caracteres)"
echo "5. STRIPE_SECRET_KEY - Chave secreta do Stripe"
echo "6. STRIPE_PRO_PRICE_ID - Price ID do plano PRO"
echo "7. STRIPE_PRO_PLUS_PRICE_ID - Price ID do plano PRO+"
echo "8. STRIPE_WEBHOOK_SECRET - Secret do webhook Stripe"
echo "9. BUILT_IN_FORGE_API_KEY - API key do Forge"
echo ""

# Gerar JWT_SECRET se necessário
echo "🔑 Gerando JWT_SECRET..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "JWT_SECRET sugerido: $JWT_SECRET"
echo ""

# Perguntar se quer editar agora
read -p "Deseja editar o .env agora? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    # Detectar editor
    if command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    elif command -v vi &> /dev/null; then
        vi .env
    else
        echo "Editor não encontrado. Edite manualmente: nano .env"
    fi
fi

echo ""
echo "📦 Próximos passos:"
echo ""
echo "1. pnpm install           # Instalar dependências"
echo "2. Editar .env            # Configurar variáveis"
echo "3. pnpm db:push           # Aplicar migrations"
echo "4. pnpm dev               # Iniciar desenvolvimento"
echo ""
echo "📖 Para mais detalhes, leia:"
echo "   - DEPLOYMENT_CHECKLIST.md"
echo "   - DEPLOY.md"
echo "   - INSTRUCOES_IMPLEMENTACAO.md"
echo ""
echo -e "${GREEN}✓ Setup inicial concluído!${NC}"
