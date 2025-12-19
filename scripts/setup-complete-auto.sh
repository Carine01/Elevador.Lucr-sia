#!/bin/bash

# ==========================================
# SCRIPT DE SETUP AUTOMÁTICO COMPLETO
# Elevare AI NeuroVendas
# Automatiza: verificação, limpeza, deploy e configuração
# ==========================================

set -e  # Para execução em caso de erro

# ==========================================
# CORES PARA LOGS
# ==========================================
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ==========================================
# FUNÇÕES DE LOG
# ==========================================
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_section() {
    echo ""
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}$1${NC}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

error_exit() {
    log_error "$1"
    log_warning "Sugestão: $2"
    exit 1
}

# ==========================================
# 1. VERIFICAÇÃO DE AMBIENTE
# ==========================================
log_section "1. VERIFICAÇÃO DE AMBIENTE"

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    error_exit "package.json não encontrado!" "Execute este script na raiz do projeto (onde está o package.json)"
fi
log_success "package.json encontrado - pasta correta"

# Verificar Node.js >= 18
if ! command -v node &> /dev/null; then
    error_exit "Node.js não encontrado!" "Instale Node.js 18+ em https://nodejs.org"
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error_exit "Node.js versão $NODE_VERSION é muito antiga!" "Atualize para Node.js 18 ou superior"
fi
log_success "Node.js v$(node -v) ✓"

# Verificar pnpm instalado
if ! command -v pnpm &> /dev/null; then
    log_warning "pnpm não encontrado - instalando..."
    npm install -g pnpm || error_exit "Falha ao instalar pnpm" "Execute: npm install -g pnpm"
fi
log_success "pnpm v$(pnpm -v) ✓"

# ==========================================
# 2. LIMPEZA E REINSTALAÇÃO
# ==========================================
log_section "2. LIMPEZA E REINSTALAÇÃO DE DEPENDÊNCIAS"

log_info "Removendo node_modules..."
rm -rf node_modules

if [ -f "pnpm-lock.yaml" ]; then
    log_info "Removendo pnpm-lock.yaml..."
    rm pnpm-lock.yaml
fi

log_info "Instalando dependências com pnpm..."
pnpm install || error_exit "Falha ao instalar dependências" "Verifique o package.json e tente novamente"

log_success "Dependências instaladas com sucesso"

# ==========================================
# 3. COMMIT AUTOMÁTICO
# ==========================================
log_section "3. COMMIT AUTOMÁTICO DO LOCK FILE"

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    log_warning "git não encontrado - pulando commit automático"
else
    # Verificar se é um repositório git
    if [ ! -d ".git" ]; then
        log_warning "Não é um repositório git - pulando commit"
    else
        # Verificar se há mudanças no pnpm-lock.yaml
        if [ -f "pnpm-lock.yaml" ]; then
            if git diff --quiet pnpm-lock.yaml 2>/dev/null; then
                log_info "pnpm-lock.yaml não foi modificado - nada para commitar"
            else
                log_info "Commitando pnpm-lock.yaml..."
                git add pnpm-lock.yaml
                git commit -m "fix: atualizar pnpm-lock.yaml" || log_warning "Falha ao commitar (pode já estar commitado)"
                
                # Tentar push (pode falhar se não tiver permissões)
                if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
                    log_success "Push realizado com sucesso"
                else
                    log_warning "Push falhou - você pode precisar fazer push manual"
                fi
            fi
        fi
    fi
fi

# ==========================================
# 4. CONFIGURAÇÃO DE BANCO (RAILWAY)
# ==========================================
log_section "4. CONFIGURAÇÃO DE BANCO DE DADOS (RAILWAY)"

# Perguntar se usuário quer configurar Railway
read -p "$(echo -e ${BLUE}Deseja configurar banco de dados no Railway? [y/N]: ${NC})" SETUP_RAILWAY
SETUP_RAILWAY=${SETUP_RAILWAY:-n}

if [[ "$SETUP_RAILWAY" =~ ^[Yy]$ ]]; then
    # Verificar/Instalar Railway CLI
    if ! command -v railway &> /dev/null; then
        log_info "Railway CLI não encontrado - instalando..."
        
        # Detectar sistema operacional
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install railway || error_exit "Falha ao instalar Railway CLI" "Instale manualmente: https://docs.railway.app/develop/cli"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://railway.app/install.sh | sh || error_exit "Falha ao instalar Railway CLI" "Instale manualmente: https://docs.railway.app/develop/cli"
        else
            error_exit "Sistema operacional não suportado para instalação automática do Railway CLI" "Instale manualmente: https://docs.railway.app/develop/cli"
        fi
    fi
    log_success "Railway CLI instalado"
    
    # Login no Railway
    log_info "Fazendo login no Railway (abrirá seu navegador)..."
    railway login || error_exit "Falha no login do Railway" "Execute manualmente: railway login"
    log_success "Login no Railway realizado"
    
    # Verificar se já existe projeto Railway
    if railway status &> /dev/null; then
        log_info "Projeto Railway já configurado"
    else
        log_info "Inicializando projeto Railway..."
        railway init || error_exit "Falha ao inicializar projeto Railway" "Execute manualmente: railway init"
        log_success "Projeto Railway criado"
    fi
    
    # Adicionar MySQL
    log_info "Adicionando MySQL ao projeto..."
    railway add --plugin mysql || log_warning "Falha ao adicionar MySQL (pode já existir)"
    
    # Obter DATABASE_URL
    log_info "Obtendo DATABASE_URL..."
    DATABASE_URL=$(railway variables get DATABASE_URL 2>/dev/null || echo "")
    
    if [ -z "$DATABASE_URL" ]; then
        log_warning "Não foi possível obter DATABASE_URL automaticamente"
        log_info "Execute: railway variables get DATABASE_URL"
    else
        log_success "DATABASE_URL obtido"
        echo "$DATABASE_URL" > .railway-db-url.tmp
        log_info "DATABASE_URL salvo em .railway-db-url.tmp (arquivo temporário)"
    fi
else
    log_info "Configuração do Railway ignorada"
fi

# ==========================================
# 5. CONFIGURAÇÃO DE SECRETS NO GITHUB
# ==========================================
log_section "5. CONFIGURAÇÃO DE SECRETS NO GITHUB"

# Perguntar se usuário quer configurar GitHub secrets
read -p "$(echo -e ${BLUE}Deseja configurar secrets no GitHub? [y/N]: ${NC})" SETUP_GITHUB_SECRETS
SETUP_GITHUB_SECRETS=${SETUP_GITHUB_SECRETS:-n}

if [[ "$SETUP_GITHUB_SECRETS" =~ ^[Yy]$ ]]; then
    # Verificar gh CLI
    if ! command -v gh &> /dev/null; then
        log_warning "GitHub CLI (gh) não encontrado"
        log_info "Instale em: https://cli.github.com/"
        log_info "Após instalar, execute: gh auth login"
    else
        log_success "GitHub CLI instalado"
        
        # Verificar autenticação
        if ! gh auth status &> /dev/null; then
            log_info "Fazendo login no GitHub..."
            gh auth login || error_exit "Falha no login do GitHub" "Execute manualmente: gh auth login"
        fi
        log_success "Autenticado no GitHub"
        
        # Configurar DATABASE_URL_PROD
        if [ -f ".railway-db-url.tmp" ]; then
            DATABASE_URL=$(cat .railway-db-url.tmp)
            log_info "Configurando DATABASE_URL_PROD..."
            echo "$DATABASE_URL" | gh secret set DATABASE_URL_PROD || log_warning "Falha ao configurar DATABASE_URL_PROD"
            log_success "DATABASE_URL_PROD configurado"
            rm .railway-db-url.tmp
        else
            log_warning "DATABASE_URL não disponível - configure manualmente"
        fi
        
        # Gerar e configurar JWT_SECRET
        log_info "Gerando JWT_SECRET (64 caracteres)..."
        JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
        echo "$JWT_SECRET" | gh secret set JWT_SECRET || log_warning "Falha ao configurar JWT_SECRET"
        log_success "JWT_SECRET gerado e configurado"
        
        # Salvar JWT_SECRET localmente para .env
        echo "$JWT_SECRET" > .jwt-secret.tmp
        log_info "JWT_SECRET salvo em .jwt-secret.tmp (copie para seu .env)"
        
        # Listar secrets configurados
        log_info "Secrets configurados no GitHub:"
        gh secret list || log_warning "Não foi possível listar secrets"
    fi
else
    log_info "Configuração de GitHub secrets ignorada"
fi

# ==========================================
# 6. DEPLOY VERCEL
# ==========================================
log_section "6. DEPLOY VERCEL"

# Perguntar se usuário quer fazer deploy na Vercel
read -p "$(echo -e ${BLUE}Deseja fazer deploy na Vercel? [y/N]: ${NC})" SETUP_VERCEL
SETUP_VERCEL=${SETUP_VERCEL:-n}

if [[ "$SETUP_VERCEL" =~ ^[Yy]$ ]]; then
    # Verificar/Instalar Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_info "Vercel CLI não encontrado - instalando..."
        npm install -g vercel || error_exit "Falha ao instalar Vercel CLI" "Execute: npm install -g vercel"
    fi
    log_success "Vercel CLI instalado"
    
    # Login na Vercel
    log_info "Fazendo login na Vercel (abrirá seu navegador)..."
    vercel login || error_exit "Falha no login da Vercel" "Execute manualmente: vercel login"
    log_success "Login na Vercel realizado"
    
    # Deploy para produção
    log_info "Fazendo deploy para produção..."
    vercel --prod --yes || error_exit "Falha no deploy da Vercel" "Verifique os logs acima e tente novamente"
    log_success "Deploy realizado com sucesso!"
else
    log_info "Deploy na Vercel ignorado"
fi

# ==========================================
# 7. RESUMO FINAL
# ==========================================
log_section "✨ SETUP COMPLETO!"

log_success "Todas as etapas foram concluídas com sucesso!"
echo ""
log_info "Próximos passos:"
echo "  1. Configure seu arquivo .env com as variáveis necessárias"
echo "  2. Execute: pnpm db:push (para criar as tabelas no banco)"
echo "  3. Execute: pnpm dev (para rodar em desenvolvimento)"
echo ""

# Mostrar arquivos temporários criados
if [ -f ".jwt-secret.tmp" ]; then
    log_warning "Arquivo temporário criado:"
    echo "  - .jwt-secret.tmp (copie o JWT_SECRET para seu .env e delete este arquivo)"
fi

echo ""
log_success "🚀 Setup automático concluído!"
