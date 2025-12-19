#!/bin/bash
set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Setup Rápido - Elevador.Lucr-sia${NC}\n"

# 1. Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ necessário. Versão atual: $(node -v)${NC}"
    exit 1
fi

# 2. Verificar pnpm
echo "Verificando pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm não encontrado. Instalando...${NC}"
    npm install -g pnpm
fi

# 3. Limpar e reinstalar
echo -e "\n${YELLOW}🧹 Limpando instalação anterior...${NC}"
rm -rf node_modules
rm -f pnpm-lock.yaml

echo -e "${YELLOW}📦 Instalando dependências...${NC}"
pnpm install

# 4. Verificar .env
if [ ! -f .env ]; then
    echo -e "\n${YELLOW}⚙️  Criando .env a partir do .env.example...${NC}"
    cp .env.example .env
    
    # Gerar JWT_SECRET
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
        rm .env.bak 2>/dev/null || true
        echo -e "${GREEN}✅ JWT_SECRET gerado automaticamente${NC}"
    fi
fi

# 5. Status final
echo -e "\n${GREEN}✅ Setup completo!${NC}\n"
echo -e "📋 Próximos passos:\n"
echo "1. Configure as variáveis no arquivo .env"
echo "2. Configure os secrets no GitHub:"
echo "   https://github.com/Carine01/Elevador.Lucr-sia/settings/secrets/actions"
echo "3. Rode: pnpm dev (desenvolvimento)"
echo "4. Ou: pnpm build && pnpm start (produção)"
echo ""
