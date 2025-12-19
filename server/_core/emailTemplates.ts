export interface WelcomeEmailData {
  userName: string;
  dashboardUrl: string;
}

export function getWelcomeEmailHtml(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .feature { margin: 20px 0; padding: 15px; background: #FEF3C7; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Bem-vindo ao Elevare!</h1>
      <p>Venda como ciência, não como esperança.</p>
    </div>
    
    <div class="content">
      <p>Olá, <strong>${data.userName}</strong>!</p>
      
      <p>Que alegria ter você conosco! 🎉</p>
      
      <p>O Elevare AI NeuroVendas é a plataforma que vai transformar a forma como você vende na estética. Aqui você encontra:</p>
      
      <div class="feature">
        <strong>📊 Radar de Bio</strong><br>
        Analise perfis do Instagram e capture leads qualificados automaticamente.
      </div>
      
      <div class="feature">
        <strong>📚 Gerador de E-books</strong><br>
        Crie materiais educativos profissionais em minutos.
      </div>
      
      <div class="feature">
        <strong>🤖 Robô Produtor</strong><br>
        Gere prompts de imagens e anúncios com técnicas de neurovendas.
      </div>
      
      <p style="text-align: center;">
        <a href="${data.dashboardUrl}" class="button">
          Acessar Dashboard
        </a>
      </p>
      
      <p>Comece explorando o <strong>Radar de Bio</strong> - é grátis e você vai se surpreender! 😊</p>
      
      <p>Qualquer dúvida, estamos aqui para ajudar.</p>
      
      <p>
        Sucesso nas vendas!<br>
        <strong>Equipe Elevare</strong>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getWelcomeEmailText(data: WelcomeEmailData): string {
  return `
Bem-vindo ao Elevare, ${data.userName}!

Venda como ciência, não como esperança.

O Elevare AI NeuroVendas é a plataforma que vai transformar a forma como você vende na estética.

Recursos disponíveis:
- Radar de Bio: Analise perfis e capture leads
- Gerador de E-books: Crie materiais profissionais
- Robô Produtor: Gere prompts e anúncios

Acesse agora: ${data.dashboardUrl}

Comece pelo Radar de Bio - é grátis!

Sucesso nas vendas!
Equipe Elevare
  `;
}
