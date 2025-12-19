#!/bin/bash

# ==========================================
# 🚀 ELEVARE AI - SETUP SCRIPT
# ==========================================
# Script de configuração inicial do projeto
# Verifica pré-requisitos, instala dependências e configura ambiente

set -e  # Sair em caso de erro

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

# Verificar versão de comando
check_version() {
    local cmd=$1
    local required=$2
    local current=$3
    
    if [ -z "$current" ]; then
        return 1
    fi
    
    # Comparação simples de versão
    if [ "$(printf '%s\n' "$required" "$current" | sort -V | head -n1)" = "$required" ]; then
        return 0
    else
        return 1
    fi
}

# ==========================================
# 1. PRÉ-REQUISITOS
# ==========================================
print_header "Verificando Pré-requisitos"

# Node.js
print_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    echo "   Instale Node.js 18+ de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE="18.0.0"

if check_version "node" "$REQUIRED_NODE" "$NODE_VERSION"; then
    print_success "Node.js $NODE_VERSION (✓ >= $REQUIRED_NODE)"
else
    print_error "Node.js $NODE_VERSION está desatualizado!"
    print_warning "Versão mínima requerida: $REQUIRED_NODE"
    echo "   Atualize em: https://nodejs.org/"
    exit 1
fi

# pnpm
print_info "Verificando pnpm..."
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm não está instalado. Instalando..."
    npm install -g pnpm
fi

PNPM_VERSION=$(pnpm --version)
REQUIRED_PNPM="10.0.0"

if check_version "pnpm" "$REQUIRED_PNPM" "$PNPM_VERSION"; then
    print_success "pnpm $PNPM_VERSION (✓ >= $REQUIRED_PNPM)"
else
    print_warning "pnpm $PNPM_VERSION está desatualizado. Atualizando..."
    npm install -g pnpm@latest
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm atualizado para $PNPM_VERSION"
fi

# MySQL (apenas verificar se está disponível)
print_info "Verificando MySQL..."
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version | grep -oP '(?<=Ver )\d+\.\d+\.\d+' || echo "unknown")
    print_success "MySQL $MYSQL_VERSION encontrado"
else
    print_warning "MySQL não encontrado localmente"
    print_info "Se usar MySQL remoto, certifique-se que está acessível"
fi

# ==========================================
# 2. INSTALAÇÃO DE DEPENDÊNCIAS
# ==========================================
print_header "Instalando Dependências"

print_info "Executando: pnpm install"
if pnpm install; then
    print_success "Dependências instaladas com sucesso"
else
    print_error "Erro ao instalar dependências"
    exit 1
fi

# ==========================================
# 3. CONFIGURAÇÃO DO AMBIENTE
# ==========================================
print_header "Configurando Ambiente"

# Verificar se .env já existe
if [ -f ".env" ]; then
    print_warning "Arquivo .env já existe"
    read -p "Deseja sobrescrevê-lo? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
        print_info "Mantendo .env existente"
    else
        print_info "Copiando .env.example para .env..."
        cp .env.example .env
        print_success "Arquivo .env criado"
    fi
else
    print_info "Copiando .env.example para .env..."
    cp .env.example .env
    print_success "Arquivo .env criado"
fi

# Gerar JWT_SECRET automaticamente
print_info "Gerando JWT_SECRET..."

# Verificar se openssl está disponível
if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
    print_success "JWT_SECRET gerado com openssl"
elif command -v node &> /dev/null; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))" | tr -d '\n')
    print_success "JWT_SECRET gerado com Node.js"
else
    print_error "Não foi possível gerar JWT_SECRET automaticamente"
    print_info "Por favor, gere manualmente e adicione ao .env"
    JWT_SECRET=""
fi

# Atualizar JWT_SECRET no .env se foi gerado
if [ ! -z "$JWT_SECRET" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" .env
    else
        # Linux
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" .env
    fi
    print_success "JWT_SECRET atualizado no arquivo .env"
fi

# ==========================================
# 4. MIGRATIONS DO BANCO DE DADOS
# ==========================================
print_header "Configuração do Banco de Dados"

print_warning "Deseja executar as migrations do banco de dados agora?"
print_info "Certifique-se que o MySQL está rodando e as credenciais em .env estão corretas"
read -p "Executar migrations? (s/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[SsYy]$ ]]; then
    print_info "Executando: pnpm db:push"
    if pnpm db:push; then
        print_success "Migrations executadas com sucesso"
    else
        print_error "Erro ao executar migrations"
        print_warning "Verifique suas credenciais do MySQL no arquivo .env"
        print_info "Você pode executar manualmente depois com: pnpm db:push"
    fi
else
    print_info "Migrations puladas. Execute manualmente quando pronto:"
    print_info "  pnpm db:push"
fi

# ==========================================
# 5. INSTRUÇÕES FINAIS
# ==========================================
print_header "Setup Concluído! 🎉"

echo -e "${GREEN}Próximos Passos:${NC}\n"
echo -e "1. ${CYAN}Configure as variáveis de ambiente:${NC}"
echo -e "   ${YELLOW}nano .env${NC}"
echo -e "   Preencha: DATABASE_URL, VITE_APP_ID, STRIPE_*, etc.\n"

echo -e "2. ${CYAN}Valide as variáveis de ambiente:${NC}"
echo -e "   ${YELLOW}./scripts/check-env.sh${NC}\n"

echo -e "3. ${CYAN}Execute as migrations (se ainda não fez):${NC}"
echo -e "   ${YELLOW}pnpm db:push${NC}\n"

echo -e "4. ${CYAN}Inicie o servidor de desenvolvimento:${NC}"
echo -e "   ${YELLOW}pnpm dev${NC}\n"

echo -e "5. ${CYAN}Teste webhooks do Stripe (opcional):${NC}"
echo -e "   ${YELLOW}./scripts/test-webhook.sh${NC}\n"

echo -e "${BLUE}Documentação completa:${NC} README.md"
echo -e "${BLUE}Troubleshooting:${NC} README.md#troubleshooting\n"

print_success "Setup finalizado com sucesso!"
