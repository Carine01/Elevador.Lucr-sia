#!/bin/bash

# ==========================================
# 🔍 ELEVARE AI - ENVIRONMENT CHECKER
# ==========================================
# Valida todas as variáveis de ambiente obrigatórias
# Diferencia desenvolvimento vs produção

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Contadores
ERRORS=0
WARNINGS=0
SUCCESS=0

# Funções auxiliares
print_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

check_required() {
    local var_name=$1
    local var_value=${!var_name}
    local min_length=${2:-1}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}✗${NC} $var_name ${RED}[FALTANDO]${NC}"
        ((ERRORS++))
        return 1
    elif [ ${#var_value} -lt $min_length ]; then
        echo -e "${YELLOW}⚠${NC} $var_name ${YELLOW}[MUITO CURTO - Mín: $min_length chars]${NC}"
        ((WARNINGS++))
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name ${GREEN}[OK]${NC}"
        ((SUCCESS++))
        return 0
    fi
}

check_optional() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${YELLOW}○${NC} $var_name ${YELLOW}[OPCIONAL - Não configurado]${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓${NC} $var_name ${GREEN}[OK]${NC}"
        ((SUCCESS++))
    fi
}

check_format() {
    local var_name=$1
    local var_value=${!var_name}
    local pattern=$2
    local format_name=$3
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}✗${NC} $var_name ${RED}[FALTANDO]${NC}"
        ((ERRORS++))
        return 1
    elif [[ ! $var_value =~ $pattern ]]; then
        echo -e "${RED}✗${NC} $var_name ${RED}[FORMATO INVÁLIDO - Esperado: $format_name]${NC}"
        ((ERRORS++))
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name ${GREEN}[OK]${NC}"
        ((SUCCESS++))
        return 0
    fi
}

# ==========================================
# CARREGAR VARIÁVEIS DO .env
# ==========================================
print_header "Carregando Variáveis de Ambiente"

if [ ! -f ".env" ]; then
    echo -e "${RED}✗ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}Execute: cp .env.example .env${NC}"
    echo -e "${YELLOW}Ou use: ./scripts/setup.sh${NC}"
    exit 1
fi

# Carregar variáveis
export $(cat .env | grep -v '^#' | grep -v '^[[:space:]]*$' | xargs)

echo -e "${GREEN}✓ Arquivo .env carregado${NC}"

# Detectar ambiente
IS_PRODUCTION=false
if [ "$NODE_ENV" = "production" ]; then
    IS_PRODUCTION=true
    echo -e "${YELLOW}⚠ Modo: PRODUÇÃO${NC}"
else
    echo -e "${BLUE}ℹ Modo: DESENVOLVIMENTO${NC}"
fi

# ==========================================
# VALIDAÇÕES OBRIGATÓRIAS (TODOS OS AMBIENTES)
# ==========================================
print_header "Variáveis Obrigatórias (Todos os Ambientes)"

check_format "DATABASE_URL" "^mysql://.+:.+@.+:.+/.+$" "mysql://user:pass@host:port/db"
check_required "OAUTH_SERVER_URL"
check_required "VITE_APP_ID"
check_required "OWNER_OPEN_ID"

# JWT_SECRET com validação de tamanho
JWT_SECRET_MIN_LENGTH=32
if [ -n "$JWT_SECRET" ]; then
    if [ ${#JWT_SECRET} -lt $JWT_SECRET_MIN_LENGTH ]; then
        echo -e "${RED}✗${NC} JWT_SECRET ${RED}[MUITO CURTO - Mínimo: $JWT_SECRET_MIN_LENGTH chars, Atual: ${#JWT_SECRET} chars]${NC}"
        echo -e "   ${YELLOW}Gere um novo com: openssl rand -base64 48${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓${NC} JWT_SECRET ${GREEN}[OK - ${#JWT_SECRET} chars]${NC}"
        ((SUCCESS++))
    fi
else
    echo -e "${RED}✗${NC} JWT_SECRET ${RED}[FALTANDO]${NC}"
    echo -e "   ${YELLOW}Gere com: openssl rand -base64 48${NC}"
    ((ERRORS++))
fi

check_required "NODE_ENV"
check_optional "PORT"
check_optional "ALLOWED_ORIGINS"

# ==========================================
# VALIDAÇÕES STRIPE
# ==========================================
print_header "Stripe (Monetização)"

if [ "$IS_PRODUCTION" = true ]; then
    # Produção: Obrigatório
    check_format "STRIPE_SECRET_KEY" "^sk_live_" "sk_live_..."
    check_format "STRIPE_WEBHOOK_SECRET" "^whsec_" "whsec_..."
else
    # Desenvolvimento: Aceita chaves de teste
    if [ -n "$STRIPE_SECRET_KEY" ]; then
        if [[ $STRIPE_SECRET_KEY =~ ^sk_test_ ]]; then
            echo -e "${GREEN}✓${NC} STRIPE_SECRET_KEY ${GREEN}[OK - Modo teste]${NC}"
            ((SUCCESS++))
        elif [[ $STRIPE_SECRET_KEY =~ ^sk_live_ ]]; then
            echo -e "${YELLOW}⚠${NC} STRIPE_SECRET_KEY ${YELLOW}[AVISO - Usando chave LIVE em desenvolvimento!]${NC}"
            ((WARNINGS++))
        else
            echo -e "${RED}✗${NC} STRIPE_SECRET_KEY ${RED}[FORMATO INVÁLIDO - Use sk_test_ ou sk_live_]${NC}"
            ((ERRORS++))
        fi
    else
        check_optional "STRIPE_SECRET_KEY"
    fi
    
    check_optional "STRIPE_WEBHOOK_SECRET"
fi

# Price IDs
if [ -n "$STRIPE_PRO_PRICE_ID" ]; then
    if [[ $STRIPE_PRO_PRICE_ID =~ ^price_ ]]; then
        echo -e "${GREEN}✓${NC} STRIPE_PRO_PRICE_ID ${GREEN}[OK]${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} STRIPE_PRO_PRICE_ID ${RED}[FORMATO INVÁLIDO - Deve começar com 'price_']${NC}"
        ((ERRORS++))
    fi
else
    check_optional "STRIPE_PRO_PRICE_ID"
fi

if [ -n "$STRIPE_PRO_PLUS_PRICE_ID" ]; then
    if [[ $STRIPE_PRO_PLUS_PRICE_ID =~ ^price_ ]]; then
        echo -e "${GREEN}✓${NC} STRIPE_PRO_PLUS_PRICE_ID ${GREEN}[OK]${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} STRIPE_PRO_PLUS_PRICE_ID ${RED}[FORMATO INVÁLIDO - Deve começar com 'price_']${NC}"
        ((ERRORS++))
    fi
else
    check_optional "STRIPE_PRO_PLUS_PRICE_ID"
fi

# ==========================================
# VALIDAÇÕES FORGE API
# ==========================================
print_header "Forge API (IA & Geração de Imagens)"

if [ "$IS_PRODUCTION" = true ]; then
    check_required "BUILT_IN_FORGE_API_URL"
    check_required "BUILT_IN_FORGE_API_KEY"
else
    check_optional "BUILT_IN_FORGE_API_URL"
    check_optional "BUILT_IN_FORGE_API_KEY"
fi

# ==========================================
# RESUMO FINAL
# ==========================================
print_header "Resumo da Validação"

echo -e "${GREEN}✓ Sucessos:${NC} $SUCCESS"
echo -e "${YELLOW}⚠ Avisos:${NC} $WARNINGS"
echo -e "${RED}✗ Erros:${NC} $ERRORS"

if [ $ERRORS -gt 0 ]; then
    echo -e "\n${RED}❌ Validação FALHOU!${NC}"
    echo -e "${YELLOW}Corrija os erros acima antes de iniciar a aplicação.${NC}"
    echo -e "\n${BLUE}Dicas:${NC}"
    echo -e "  - Use ${YELLOW}./scripts/setup.sh${NC} para configuração automática"
    echo -e "  - Veja ${YELLOW}.env.example${NC} para referência completa"
    echo -e "  - Leia ${YELLOW}README.md${NC} para instruções detalhadas"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "\n${YELLOW}⚠ Validação OK com avisos${NC}"
    echo -e "${BLUE}A aplicação pode funcionar, mas algumas funcionalidades podem estar limitadas.${NC}"
    exit 0
else
    echo -e "\n${GREEN}✅ Validação PERFEITA!${NC}"
    echo -e "${GREEN}Todas as variáveis estão configuradas corretamente.${NC}"
    echo -e "\n${CYAN}Você pode iniciar a aplicação:${NC}"
    echo -e "  ${YELLOW}pnpm dev${NC}     # Desenvolvimento"
    echo -e "  ${YELLOW}pnpm build${NC}   # Build de produção"
    echo -e "  ${YELLOW}pnpm start${NC}   # Servidor de produção"
    exit 0
fi
