# Arquitetura do Sistema

O Elevare Core foi projetado para crescer sem reescrita estrutural.

## Camadas

### Domínio
Regras e entidades de negócio. Define contratos de dados e comportamentos esperados.

### Infraestrutura
Banco de dados, integrações externas e serviços de suporte.

### Interface
tRPC como camada de comunicação type-safe entre frontend e backend.

## Princípios de Design

### 1. Domain-First
Schemas de banco de dados são definidos como **contratos de domínio** antes da implementação completa.
Isso permite:
- Clareza sobre estrutura de dados desde o início
- Evolução incremental sem refatorações traumáticas
- Comunicação clara de intenção arquitetural

### 2. Incremental Activation
Nem todas as tabelas ou módulos presentes estão ativos em produção.
Alguns representam preparação intencional para fases futuras.

### 3. Type Safety
TypeScript + tRPC + Drizzle ORM garantem contratos de tipo em toda stack.

## Estrutura de Dados

### Tabelas Core (Ativas)
- `users` - Autenticação e perfil
- `subscription` - Planos e créditos
- `bioRadarDiagnosis` - Lead magnet
- `contentGeneration` - Conteúdo gerado por IA
- `brandEssence` - Identidade de marca

### Tabelas de Lead Management (Contratos Definidos)
- `leads` - Gestão de leads com scoring
- `leadInteractions` - Histórico de interações
- `campaigns` - Métricas de campanhas

**Status:** Schema pronto, implementação backend/frontend em roadmap (Fase 2).

## Stack Técnica

- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **API:** tRPC
- **Database:** MySQL + Drizzle ORM
- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS + shadcn/ui

## Padrões de Código

- Preferência por clareza sobre cleverness
- Validação explícita em boundaries
- Separação clara de responsabilidades
- Zero acoplamento desnecessário

## Observabilidade

Sistema preparado para:
- Logging estruturado (pino)
- Error tracking (Sentry - configurável)
- Métricas de negócio

## Segurança

- Rate limiting em APIs públicas
- CORS configurado com whitelist
- Validação de variáveis de ambiente obrigatórias
- Tratamento de erros sem exposição de internals

## Filosofia

Este projeto não compete em "velocidade de feature".
Compete em **solidez de fundação**.

Cada decisão arquitetural prioriza:
1. Manutenibilidade
2. Escalabilidade
3. Auditabilidade
4. Clareza de intenção

**Resultado:** Um ativo digital que pode crescer, ser auditado e eventualmente transferido sem reescrita.
