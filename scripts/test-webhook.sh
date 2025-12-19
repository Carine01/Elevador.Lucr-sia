#!/bin/bash

# ==========================================
# 🔔 ELEVARE AI - WEBHOOK TESTER
# ==========================================
# Script para testar webhooks do Stripe localmente
# Requer Stripe CLI instalado

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções auxiliares
print_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ==========================================
# VERIFICAR STRIPE CLI
# ==========================================
print_header "Verificando Stripe CLI"

if ! command -v stripe &> /dev/null; then
    print_error "Stripe CLI não está instalado!"
    echo -e "\n${YELLOW}Instalação:${NC}\n"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "  ${CYAN}macOS (Homebrew):${NC}"
        echo -e "    ${YELLOW}brew install stripe/stripe-cli/stripe${NC}\n"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "  ${CYAN}Linux:${NC}"
        echo -e "    ${YELLOW}# Debian/Ubuntu${NC}"
        echo -e "    ${YELLOW}curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg${NC}"
        echo -e "    ${YELLOW}echo 'deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main' | sudo tee -a /etc/apt/sources.list.d/stripe.list${NC}"
        echo -e "    ${YELLOW}sudo apt update && sudo apt install stripe${NC}\n"
    else
        echo -e "  ${CYAN}Windows/Outros:${NC}"
        echo -e "    Baixe de: ${BLUE}https://github.com/stripe/stripe-cli/releases${NC}\n"
    fi
    
    echo -e "${BLUE}Documentação completa:${NC} https://stripe.com/docs/stripe-cli"
    exit 1
fi

STRIPE_VERSION=$(stripe --version | grep -oP '\d+\.\d+\.\d+' || echo "unknown")
print_success "Stripe CLI $STRIPE_VERSION instalado"

# ==========================================
# VERIFICAR LOGIN
# ==========================================
print_header "Verificando Autenticação"

print_info "Verificando se está autenticado no Stripe..."

if stripe --version &> /dev/null && stripe config --list &> /dev/null 2>&1; then
    print_success "Autenticado no Stripe"
else
    print_warning "Não autenticado ou configuração incompleta"
    print_info "Executando login..."
    
    echo -e "\n${YELLOW}Você será redirecionado para o navegador para autenticação.${NC}"
    echo -e "${YELLOW}Após autorizar, retorne ao terminal.${NC}\n"
    
    if stripe login; then
        print_success "Login realizado com sucesso!"
    else
        print_error "Erro ao fazer login"
        exit 1
    fi
fi

# ==========================================
# CARREGAR ENV (se disponível)
# ==========================================
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | grep -v '^[[:space:]]*$' | xargs)
fi

# Determinar porta do servidor
SERVER_PORT=${PORT:-3000}
WEBHOOK_URL="http://localhost:${SERVER_PORT}/api/stripe/webhook"

# ==========================================
# INICIAR WEBHOOK LISTENER
# ==========================================
print_header "Iniciando Webhook Listener"

print_info "Configuração:"
echo -e "  ${CYAN}URL do Webhook:${NC} $WEBHOOK_URL"
echo -e "  ${CYAN}Porta do Servidor:${NC} $SERVER_PORT"
echo

print_warning "IMPORTANTE: Certifique-se que o servidor está rodando!"
echo -e "  ${YELLOW}Em outro terminal, execute: pnpm dev${NC}\n"

read -p "Pressione ENTER para continuar ou Ctrl+C para cancelar..."

echo
print_info "Iniciando listener do Stripe..."
print_info "O Stripe CLI irá:"
echo -e "  ${CYAN}1.${NC} Criar um webhook endpoint temporário"
echo -e "  ${CYAN}2.${NC} Gerar um WEBHOOK_SECRET"
echo -e "  ${CYAN}3.${NC} Encaminhar eventos para seu servidor local"
echo

print_warning "COPIE o webhook signing secret que será exibido abaixo"
print_warning "e adicione ao seu arquivo .env como STRIPE_WEBHOOK_SECRET"
echo

print_info "Para testar um evento específico, use:"
echo -e "  ${YELLOW}stripe trigger payment_intent.succeeded${NC}"
echo -e "  ${YELLOW}stripe trigger checkout.session.completed${NC}"
echo

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Iniciando Stripe Webhook Listener...${NC}"
echo -e "${CYAN}========================================${NC}\n"

# Eventos que queremos escutar
EVENTS="checkout.session.completed,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed"

# Iniciar listener
stripe listen --forward-to "$WEBHOOK_URL" --events "$EVENTS"

# Se chegou aqui, o listener foi interrompido
echo
print_info "Listener do webhook encerrado"
