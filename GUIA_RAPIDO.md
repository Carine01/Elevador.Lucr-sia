# 🎯 GUIA RÁPIDO - Elevare AI NeuroVendas

## ⚡ INÍCIO EM 5 MINUTOS

```bash
# 1. Setup
./setup.sh

# 2. Configurar
nano .env

# 3. Instalar
pnpm install
```

---

## 📋 DOCUMENTOS

| Documento | Use Para | Tempo |
|-----------|----------|-------|
| **STATUS_FINAL.md** | Resumo executivo | 5 min |
| **RELATORIO_REVISAO.md** | Guia completo passo a passo | 15 min |
| **DEPLOYMENT_CHECKLIST.md** | Checklist técnico | 10 min |
| **README.md** | Visão geral do projeto | 10 min |

---

## ✅ CHECKLIST ULTRA-RÁPIDA

### Hoje (1h)
- [ ] `./setup.sh`
- [ ] Criar .env
- [ ] Criar conta Railway
- [ ] Criar conta Stripe

### Amanhã (2h)
- [ ] Configurar MySQL (Railway)
- [ ] Criar produtos Stripe
- [ ] Configurar webhook

### Deploy (1h)
- [ ] Deploy no Railway
- [ ] Configurar env vars
- [ ] Testar

**Total: 4 horas**

---

## 🚀 DEPLOY MAIS RÁPIDO (Railway)

```bash
# 1. Conta
railway.app → Login com GitHub

# 2. Novo Projeto
New Project → Deploy from GitHub

# 3. MySQL
Add Service → MySQL

# 4. Env Vars
Settings → Variables → Cole do .env

# 5. Deploy
Automático! ✅
```

**Pronto em 30 minutos!**

---

## 💡 DICAS DE OURO

### Para Economizar
- ✅ Use Railway (MySQL + hosting grátis)
- ✅ Comece com Stripe test mode
- ✅ PlanetScale tem free tier

### Para Não Errar
- ✅ JWT_SECRET com 32+ caracteres
- ✅ Configure webhook do Stripe
- ✅ Teste local primeiro: `pnpm dev`

### Para Ir Rápido
- ✅ Use Railway (tudo integrado)
- ✅ Siga RELATORIO_REVISAO.md
- ✅ Não pule o .env

---

## 🆘 PROBLEMAS COMUNS

### Build falha
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Erro de .env
```bash
# Verifique se todas as variáveis estão preenchidas
cat .env
```

### MySQL não conecta
```bash
# Teste a connection string
mysql -h HOST -u USER -p
```

---

## 📞 AJUDA

**Documentos Completos:**
- STATUS_FINAL.md
- RELATORIO_REVISAO.md
- DEPLOYMENT_CHECKLIST.md

**Email:**
carinefisio@hotmail.com

---

## ✅ STATUS

- **Código:** ✅ Pronto
- **Build:** ✅ Funciona
- **Segurança:** ✅ 0 vulnerabilidades
- **Deploy:** ⏳ Configure infraestrutura

**Tempo restante: 4-6 horas**

---

**Próximo Passo:** Abra **RELATORIO_REVISAO.md**

🚀 Boa sorte!
