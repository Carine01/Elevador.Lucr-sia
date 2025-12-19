#!/usr/bin/env node
/**
 * Script para renovar token de longa duração da Meta Ads API
 * 
 * Uso:
 *   node scripts/refresh-meta-token.js
 * 
 * Requer:
 *   - META_APP_ID no .env
 *   - META_APP_SECRET no .env
 *   - META_ACCESS_TOKEN (token atual) no .env
 */

import 'dotenv/config';
import axios from 'axios';

async function refreshMetaToken() {
  console.log('🔄 Renovando token da Meta Ads API...\n');

  // Validar variáveis de ambiente
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const currentToken = process.env.META_ACCESS_TOKEN;

  if (!appId || !appSecret || !currentToken) {
    console.error('❌ Erro: Variáveis de ambiente faltando!');
    console.error('   Certifique-se de que seu .env contém:');
    console.error('   - META_APP_ID');
    console.error('   - META_APP_SECRET');
    console.error('   - META_ACCESS_TOKEN');
    process.exit(1);
  }

  try {
    // Fazer requisição para trocar token
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: currentToken
      }
    });

    const newToken = response.data.access_token;
    const expiresIn = response.data.expires_in; // em segundos

    console.log('✅ Token renovado com sucesso!\n');
    console.log('📋 Novo token:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(newToken);
    console.log('─────────────────────────────────────────────────────────\n');
    
    if (expiresIn) {
      const expiryDays = Math.floor(expiresIn / 86400);
      console.log(`⏰ Expira em: ${expiryDays} dias (${expiresIn} segundos)\n`);
    }

    console.log('📝 Próximos passos:');
    console.log('   1. Copie o token acima');
    console.log('   2. Atualize META_ACCESS_TOKEN no seu .env');
    console.log('   3. Reinicie o n8n se estiver rodando');
    console.log('   4. Configure um lembrete para renovar antes de expirar\n');

  } catch (error) {
    console.error('❌ Erro ao renovar token:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Mensagem:', error.response.data.error?.message || error.response.data);
      
      if (error.response.status === 400) {
        console.error('\n💡 Dicas:');
        console.error('   - Verifique se META_APP_ID e META_APP_SECRET estão corretos');
        console.error('   - Confirme se o token atual ainda é válido');
        console.error('   - Tente gerar um novo token no Graph API Explorer');
      }
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

// Verificar se está sendo executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  refreshMetaToken();
}

export { refreshMetaToken };
