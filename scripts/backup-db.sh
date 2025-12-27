#!/bin/bash
# Backup automático do MySQL Railway
# Este script faz backup do banco de dados MySQL hospedado no Railway
# e mantém os últimos 7 backups localmente

set -e  # Sair se qualquer comando falhar

# Configuração
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$HOME/backups/elevare"
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql.gz"
LOG_FILE="/var/log/elevare-backup.log"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Verificar se .env.production existe
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Erro: Arquivo .env.production não encontrado${NC}"
    echo "Execute este script no diretório raiz do projeto"
    exit 1
fi

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

log "${YELLOW}🔄 Iniciando backup do MySQL Railway...${NC}"

# Carregar variáveis do .env.production
source .env.production

# Verificar se variáveis necessárias existem
if [ -z "$DB_HOST" ] || [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Erro: Variáveis DB_HOST ou DB_PASSWORD não encontradas no .env.production${NC}"
    exit 1
fi

# Fazer backup
log "Conectando ao banco: $DB_HOST"
mysqldump -h "$DB_HOST" \
          -u root \
          -p"$DB_PASSWORD" \
          railway \
          --single-transaction \
          --quick \
          --lock-tables=false \
          --add-drop-table \
          --routines \
          --triggers \
          2>> "$LOG_FILE" | gzip > "$BACKUP_FILE"

# Verificar se backup foi criado com sucesso
if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "${GREEN}✅ Backup criado com sucesso: $BACKUP_FILE ($SIZE)${NC}"
else
    log "${RED}❌ Erro: Backup não foi criado${NC}"
    exit 1
fi

# Manter apenas os últimos 7 backups
log "Limpando backups antigos (mantendo últimos 7)..."
cd "$BACKUP_DIR"
ls -t backup-*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -f

# Listar backups disponíveis
log "Backups disponíveis:"
ls -lht "$BACKUP_DIR"/backup-*.sql.gz 2>/dev/null | head -7 | tee -a "$LOG_FILE"

log "${GREEN}✅ Processo de backup concluído com sucesso${NC}"
