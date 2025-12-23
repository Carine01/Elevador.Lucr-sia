import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  
  // Contador de urgência - expira em 47 minutos a partir do carregamento
  const [timeLeft, setTimeLeft] = useState({ minutes: 46, seconds: 59 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = true;

    const tryPlay = () => {
      const promise = videoElement.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Autoplay was prevented. A user interaction will be needed.
        });
      }
    };

    tryPlay();

    const handleClick = () => tryPlay();
    document.addEventListener('click', handleClick, { once: true, passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  const handleSubscribe = async (plan: 'essencial' | 'profissional') => {
    setIsLoading(plan);
    navigate('/pricing');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const landingPageStyles = `
    :root{
      --lavanda:#A36BFF;
      --lavanda-200:#EDE8FF;
      --dourado:#F6C86A;
      --bg:#F6F9FB;
    }
    .hero-gradient{background:linear-gradient(180deg, rgba(16
    
    
    
    
        pnpm dev3,107,255,0.06) 0%, rgba(227,220,255,0.04) 100%);}    
    .card-shadow{box-shadow: 0 6px 18px rgba(12,18,30,0.06);}    
    .btn-primary{background:var(--lavanda);color:white}
    .btn-ghost{border:2px solid rgba(163,107,255,0.14);color:var(--lavanda)}
    .video-wrap{position:relative;overflow:hidden;border-radius:16px}
    .video-wrap video{width:100%;height:100%;object-fit:cover;display:block}
    .video-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.08),rgba(163,107,255,0.18));backdrop-filter:blur(2px);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:2rem}
  `;

  return (
    <>
      <style>{landingPageStyles}</style>
      <header className="fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80 z-[100] border-b border-gray-100 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-300 to-purple-500 text-white flex items-center justify-center font-bold">EL</div>
            <div>
              <div className="font-semibold text-gray-800">Elevare AI</div>
              <div className="text-xs text-gray-500 -mt-1">NeuroVendas & Automação</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium text-gray-600 hover:text-[var(--lavanda)] transition-colors">Início</a>
            <a href="#modulos" className="text-sm font-medium text-gray-600 hover:text-[var(--lavanda)] transition-colors">Módulos</a>
            <a href="#planos" className="text-sm font-medium text-gray-600 hover:text-[var(--lavanda)] transition-colors">Planos</a>
            <a href="#mentora" className="text-sm font-medium text-gray-600 hover:text-[var(--lavanda)] transition-colors">Mentora</a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-[var(--lavanda)] transition-colors">FAQ</a>
            <button onClick={() => navigate('/login')} className="ml-2 px-4 py-2 rounded-full btn-ghost hover:bg-purple-50 transition-colors">Entrar</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 rounded-full btn-primary hover:opacity-95 shadow-md transition-transform hover:scale-105">Fazer Parte</button>
          </div>

          <button onClick={toggleMenu} className="md:hidden px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            {isMenuOpen ? '✕' : '☰'}
          </button>

          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden flex flex-col p-4 gap-4 animate-fade-in">
                <a href="#home" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-2 border-b border-gray-50">Início</a>
                <a href="#modulos" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-2 border-b border-gray-50">Módulos</a>
                <a href="#planos" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-2 border-b border-gray-50">Planos</a>
                <a href="#mentora" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-2 border-b border-gray-50">Mentora</a>
                <a href="#faq" onClick={closeMenu} className="text-sm font-medium text-gray-600 py-2 border-b border-gray-50">FAQ</a>
                <button onClick={() => { closeMenu(); navigate('/login'); }} className="text-center px-4 py-3 rounded-lg btn-ghost font-bold">Entrar</button>
                <button onClick={() => { closeMenu(); navigate('/register'); }} className="text-center px-4 py-3 rounded-lg btn-primary font-bold">Fazer Parte do Elevare</button>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-24 isolate">
        <section id="home" className="hero-gradient scroll-mt-28">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            {/* Badge de posicionamento */}
            <div className="mb-4">
              <span className="inline-block bg-[#6b2fa8] text-white px-4 py-2 rounded-full text-sm font-semibold">
                🧠 Venda como ciência, não como esperança.
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#5f3fb2] leading-tight max-w-4xl mx-auto">
              Crie 30 dias de conteúdo em 30 minutos
            </h1>

            <p className="mt-5 text-xl font-medium text-gray-700 max-w-2xl mx-auto">
              IA que gera posts, anúncios e e-books para esteticistas.<br/>
              Enquanto você atende, a Elevare vende por você.
            </p>

            {/* Prova social rápida */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-amber-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-300 border-2 border-white"></div>
              </div>
              <p className="text-sm text-gray-500">
                <strong className="text-[#6b2fa8]">+120 esteticistas</strong> já usam a Elevare
              </p>
            </div>
            
            {/* Garantia */}
            <p className="mt-4 text-xs text-gray-400">
              🔒 Pagamento seguro • Cancele quando quiser • Acesso imediato
            </p>
          </div>
        </section>

        {/* Seção de Custo de Oportunidade - PRIMEIRO ITEM APÓS HERO */}
        <section className="bg-gradient-to-b from-red-50 to-white py-12 border-y border-red-100">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
              Quanto custa um perfil amador?
            </h2>
            <p className="text-center text-gray-500 mb-8">O preço de NÃO ter a Elevare:</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 - Perda de pacientes */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-400 hover:shadow-xl transition-all">
                <div className="text-4xl mb-3">📉</div>
                <h3 className="font-bold text-red-600 text-lg mb-2">Pacientes perdidos</h3>
                <p className="text-gray-600 text-sm">
                  Perda de <strong className="text-red-600">3 a 5 pacientes por semana</strong> por falta de desejo visual no seu perfil.
                </p>
                <p className="mt-3 text-xs text-gray-400">≈ R$ 1.500/semana perdidos</p>
              </div>
              
              {/* Card 2 - Gasto com agências */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-400 hover:shadow-xl transition-all">
                <div className="text-4xl mb-3">💸</div>
                <h3 className="font-bold text-amber-600 text-lg mb-2">Agências genéricas</h3>
                <p className="text-gray-600 text-sm">
                  Gasto médio de <strong className="text-amber-600">R$ 2.000/mês</strong> com agências que não entendem estética.
                </p>
                <p className="mt-3 text-xs text-gray-400">Posts bonitos que não vendem</p>
              </div>
              
              {/* Card 3 - Tempo perdido */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-400 hover:shadow-xl transition-all">
                <div className="text-4xl mb-3">⌛</div>
                <h3 className="font-bold text-purple-600 text-lg mb-2">Seu tempo vale ouro</h3>
                <p className="text-gray-600 text-sm">
                  Sua hora clínica vale <strong>R$ 150</strong>. Gasta 4h criando posts? <strong className="text-purple-600">R$ 600 perdidos.</strong>
                </p>
                <p className="mt-3 text-xs text-gray-400">Tempo que deveria estar atendendo</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-lg font-semibold text-gray-700">
                💡 Com a Elevare: <span className="text-[#6b2fa8]">R$ 97/mês</span> e você recupera tudo isso.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="mt-4 px-8 py-3 rounded-full btn-primary font-bold hover:scale-105 transition-all"
              >
                Parar de Perder Dinheiro →
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#6b2fa8]">O maior problema: Falta de Tempo.</h2>
              <p className="mt-4 text-gray-600">A Elevare resolve isso combinando NeuroVendas com automação inteligente. Chega de encarar a tela em branco.</p>
              <ul className="mt-4 space-y-2 text-gray-700">
                 <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Gere conteúdo de qualidade em minutos</li>
                 <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Automatize em múltiplos canais (Insta, Blog)</li>
                 <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Aumente vendas com copy estratégica</li>
              </ul>
              <div className="mt-6">
                <button onClick={() => navigate('/register')} className="px-6 py-3 rounded-full btn-primary font-bold">Começar Agora →</button>
              </div>
            </div>
            <div className="video-wrap h-72 md:h-96">
              <video ref={videoRef} id="lucresia-video" autoPlay muted loop playsInline poster="https://images.pexels.com/videos/8743919/pexels-photo-8743919.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500">
                <source src="https://videos.pexels.com/video-files/8743919/8743919-hd_1920_1080_25fps.mp4" type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
              <div className="video-overlay">
                <h3 className="text-2xl font-semibold text-[#5f3fb2] drop-shadow-sm">Tecnologia NeuroVendas</h3>
                <p className="mt-2 text-sm max-w-md text-center text-[#6b2fa8]">Veja a IA criando anúncios e e-books em tempo real.</p>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => videoRef.current?.play()} className="px-4 py-2 rounded-full bg-white text-[var(--lavanda)] font-semibold hover:bg-gray-100 transition-colors">Assistir</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-gradient-to-b from-[#f5f3ff] to-white py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h3 className="text-2xl text-center font-semibold text-[#6b2fa8] mb-2">Sua Transformação Digital</h3>
            <p className="text-center text-gray-500 text-sm mb-8">Veja a diferença entre fazer sozinha e ter a Elevare ao seu lado</p>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
              <div className="grid md:grid-cols-2">
                {/* Lado ANTES - Sem Elevare */}
                <div className="p-6 bg-gray-50 border-r border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">😰</span>
                    <h4 className="font-bold text-gray-600">Sem Elevare AI</h4>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Horas gastas criando um único post</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Gasto alto com agências de marketing</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Posts bonitos que não vendem</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Instabilidade e falta de previsibilidade</span>
                    </li>
                  </ul>
                </div>
                
                {/* Lado DEPOIS - Com Elevare */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🚀</span>
                    <h4 className="font-bold text-[#6b2fa8]">Com Elevare AI</h4>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Conteúdo pronto em minutos</strong> (não horas)</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Economia real</strong> de dinheiro</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Copywriting estratégico</strong> que converte</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Crescimento consistente</strong> do negócio</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="modulos" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
          <h3 className="text-3xl text-center font-semibold text-[#6b2fa8]">Módulos Principais</h3>
          <p className="text-center mt-3 text-gray-600">Um ecossistema completo para dominar o digital.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#A36BFF]">
              <div className="text-3xl mb-4">🎯</div>
              <h5 className="text-xl font-bold text-gray-800">Radar de Bio (Lead Magnet)</h5>
              <p className="mt-2 text-sm text-gray-600">Diagnóstico automático do seu perfil. A IA analisa sua bio e entrega recomendações de melhoria instantâneas para atrair leads qualificados.</p>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#F6C86A]">
              <div className="text-3xl mb-4">🤖</div>
              <h5 className="text-xl font-bold text-gray-800">Robô Produtor</h5>
              <p className="mt-2 text-sm text-gray-600">Suite de automação completa. Gerador de Prompts (Midjourney/DALL-E), Criador de Anúncios (Ads) e Assistente IA para mentoria.</p>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#A36BFF]">
              <div className="text-3xl mb-4">📘</div>
              <h5 className="text-xl font-bold text-gray-800">Fábrica de E-books</h5>
              <p className="mt-2 text-sm text-gray-600">Crie iscas digitais profissionais. Conteúdo, capa, diagramas e até versão <strong>Audiobook</strong> (Text-to-Speech) gerados automaticamente.</p>
            </div>

             <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#F6C86A]">
              <div className="text-3xl mb-4">✍️</div>
              <h5 className="text-xl font-bold text-gray-800">Automação de Blogs</h5>
              <p className="mt-2 text-sm text-gray-600">Domine o Google. Calendário editorial e agendador de posts para blog com SEO, criando autoridade enquanto você dorme.</p>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#A36BFF]">
              <div className="text-3xl mb-4">🎓</div>
              <h5 className="text-xl font-bold text-gray-800">Área de Membros</h5>
              <p className="mt-2 text-sm text-gray-600">Educação continuada. Acesso à "Imersão IA NA PRÁTICA", replays de eventos e materiais de apoio exclusivos.</p>
            </div>

             <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#F6C86A]">
              <div className="text-3xl mb-4">📊</div>
              <h5 className="text-xl font-bold text-gray-800">Dashboard de Controle</h5>
              <p className="mt-2 text-sm text-gray-600">Visão total do seu negócio. Resumo de uso, histórico de gerações e atalhos rápidos para todas as ferramentas.</p>
            </div>

          </div>
        </section>

        <section id="planos" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24 bg-gray-50 rounded-3xl">
          <h3 className="text-3xl text-center font-semibold text-[#6b2fa8]">Entre no Sistema Elevare</h3>
          <p className="text-center text-gray-600 mt-2">Você não está comprando aulas. Está entrando em um sistema de crescimento.</p>
          
          {/* Contador discreto */}
          <div className="mt-4 flex justify-center">
            <span className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-full">
              🔥 Oferta expira em {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
          
          {/* Opção Comece Grátis */}
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/register')} className="text-[#6b2fa8] hover:underline text-sm font-medium">
              ✨ Comece Grátis com o Radar de Bio →
            </button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            
            {/* Acesso Essencial */}
            <div className="bg-white rounded-xl p-8 card-shadow hover:shadow-xl transition-all w-[300px]">
              <h4 className="font-semibold text-gray-800 text-lg">Acesso Essencial Elevare</h4>
              <p className="text-3xl font-extrabold mt-4 text-[#6b2fa8]">R$ 57<span className="text-base font-normal text-gray-500">/mês</span></p>
              <p className="mt-4 text-sm text-gray-600">Estrutura inicial para sua clínica</p>
              <ul className="mt-4 text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Acesso ao Radar de Bio</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 5 créditos por mês</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Gerador de Prompts</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Suporte por e-mail</li>
              </ul>
              <div className="mt-6">
                <button onClick={() => navigate('/register')} className="w-full px-6 py-3 rounded-full font-semibold btn-ghost hover:bg-purple-50 transition-all">
                  Assinar Essencial
                </button>
                <p className="mt-2 text-xs text-center text-gray-400">Acesso imediato</p>
              </div>
            </div>

            {/* Acesso Profissional - Destacado */}
            <div className="relative bg-[#eef2ff] border-2 border-[var(--dourado)] rounded-xl p-8 hover:shadow-2xl transition-all w-[320px] scale-105 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold bg-[var(--dourado)] text-white shadow-md">RECOMENDADO</div>
              <h4 className="font-semibold text-[#6b2fa8] text-lg mt-2">Acesso Profissional Elevare</h4>
              <p className="text-3xl font-extrabold mt-4 text-[#6b2fa8]">R$ 97<span className="text-base font-normal text-gray-500">/mês</span></p>
              <p className="mt-4 text-sm text-gray-600">Automação completa + crescimento acelerado</p>
              <ul className="mt-4 text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> <strong>Créditos ilimitados</strong></li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Tudo do Acesso Essencial</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Gerador de E-books</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Gerador de Anúncios</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Automação de Blogs (SEO)</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Área de Membros Exclusiva</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Suporte VIP prioritário</li>
              </ul>
              <div className="mt-6">
                <button onClick={() => navigate('/register')} className="w-full px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all" style={{background: 'linear-gradient(135deg, #F6C86A 0%, #f59e0b 100%)', color: 'white'}}>
                  Assinar Profissional
                </button>
                <p className="mt-2 text-xs text-center text-amber-600 font-semibold">⚡ Mais escolhido</p>
              </div>
              <p className="mt-4 text-xs text-center text-gray-500 italic">Você não está comprando aulas.<br/>Está entrando em um sistema de crescimento.</p>
            </div>

          </div>
        </section>

        <section className="py-12 bg-[var(--bg)]">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl text-center font-semibold text-[#6b2fa8]">Resultados Reais</h3>
            <p className="text-center text-gray-600 mt-2">Veja o que nossas alunas estão dizendo</p>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl card-shadow hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/sherlayne-galvane.jpg" alt="Sherlayne Galvane" className="w-16 h-16 rounded-full object-cover border-2 border-[var(--lavanda)]" />
                  <div>
                    <p className="font-semibold text-gray-800">Sherlayne Galvane</p>
                    <p className="text-sm text-gray-500">Vila Velha, ES</p>
                  </div>
                </div>
                <blockquote className="italic text-gray-600">"O Radar de Bio mudou meu perfil em um dia. Comecei a receber leads qualificados na mesma semana."</blockquote>
              </div>
              <div className="bg-white p-6 rounded-xl card-shadow hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/marta-amorin.jpg" alt="Marta Amorin" className="w-16 h-16 rounded-full object-cover border-2 border-[var(--lavanda)]" />
                  <div>
                    <p className="font-semibold text-gray-800">Marta Amorin</p>
                    <p className="text-sm text-gray-500">Vitória, ES</p>
                  </div>
                </div>
                <blockquote className="italic text-gray-600">"Com a Automação de Blogs, virei autoridade na minha cidade sem escrever uma linha sequer."</blockquote>
              </div>
              <div className="bg-white p-6 rounded-xl card-shadow hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/geisy-dias.jpg" alt="Geisy Dias" className="w-16 h-16 rounded-full object-cover border-2 border-[var(--lavanda)]" />
                  <div>
                    <p className="font-semibold text-gray-800">Geisy Dias</p>
                    <p className="text-sm text-gray-500">Teixeira de Freitas, BA</p>
                  </div>
                </div>
                <blockquote className="italic text-gray-600">"Os e-books gerados pela IA são incríveis. Uso como isca digital e minha lista de clientes explodiu."</blockquote>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
          <h3 className="text-3xl text-center font-semibold text-[#6b2fa8]">Perguntas Frequentes</h3>
          <div className="mt-8 space-y-4">
            <details className="bg-white p-4 rounded-lg card-shadow group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                    O que é a Elevare AI NeuroVendas?
                    <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-gray-600">Um ecossistema completo que usa IA para automatizar a criação de conteúdo, anúncios, e-books e blogs para esteticistas.</p>
            </details>
            <details className="bg-white p-4 rounded-lg card-shadow group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                    Como funciona o Radar de Bio?
                    <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-gray-600">Você insere seu @ do Instagram e nossa IA analisa pontos de melhoria para transformar visitantes em seguidores e clientes.</p>
            </details>
            <details className="bg-white p-4 rounded-lg card-shadow group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                    A IA cria imagens e textos?
                    <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-gray-600">Sim! O Robô Produtor gera textos persuasivos (copy) e sugestões visuais ou imagens para seus posts e anúncios.</p>
            </details>
             <details className="bg-white p-4 rounded-lg card-shadow group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                    O que está incluso na Área de Membros?
                    <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-2 text-gray-600">Conteúdo educacional exclusivo, imersões "IA NA PRÁTICA" e replays de eventos para você dominar as ferramentas.</p>
            </details>
          </div>
        </section>

        <section id="mentora" className="py-16 bg-white border-t border-gray-100 scroll-mt-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[var(--lavanda)] rounded-2xl transform rotate-3 opacity-20"></div>
                        <img 
                            src="/carine-marques.jpg" 
                            alt="Carine Marques" 
                            className="relative rounded-2xl shadow-xl w-full object-cover h-[500px]"
                        />
                    </div>

                    <div>
                        <span className="text-[var(--lavanda)] font-bold tracking-wider uppercase text-sm">Quem está por trás</span>
                        <h3 className="text-3xl font-extrabold text-[#6b2fa8] mt-2">Carine Marques</h3>
                        <p className="text-lg text-gray-500 font-medium">Mentora Estética Lucrativa</p>

                        <blockquote className="mt-6 border-l-4 border-[var(--dourado)] pl-4 italic text-gray-600 bg-gray-50 p-4 rounded-r-lg">
                            "Não sou administradora por formação. Sou esteticista por paixão. Mas precisei, sem aviso, me tornar líder, gestora e estrategista — mesmo sem estar preparada. Entre erros e acertos, foi difícil, desafiador, e eu sei o quanto pode ser solitário. Hoje, transformo essa vivência em caminho: para te mostrar, com clareza, o que ninguém nunca te ensinou."
                        </blockquote>

                        <p className="mt-6 text-gray-600 leading-relaxed">
                            Carine Marques é mentora e criadora da Plataforma Elevare, dedicada a transformar esteticistas em empreendedoras de sucesso através de estratégias práticas, ferramentas inteligentes e mentoria personalizada.
                        </p>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Com anos de experiência no mercado de estética, Carine desenvolveu métodos exclusivos que combinam técnica, estratégia e inteligência emocional para ajudar profissionais a se destacarem em um mercado cada vez mais competitivo.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-semibold text-[#6b2fa8]">Sua estética merece estratégia — e você merece tempo.</h3>
            <p className="mt-2 text-gray-600">A Elevare cuida da parte difícil enquanto você cuida do que ama.</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-full btn-primary shadow-lg text-lg font-bold hover:shadow-xl transition-all">
                Entrar no Método Elevare
              </button>
              <a href="#modulos" className="px-8 py-4 rounded-full btn-ghost text-lg font-semibold hover:bg-purple-50 transition-colors">
                Ver Como Funciona na Prática
              </a>
            </div>
            <p className="mt-6 text-xs text-gray-400">
              Acesso imediato à Plataforma Elevare • Sem teste gratuito • Método validado
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-12 bg-[#f3f5f8] py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 Elevare Global — Transformando estética em inteligência e lucro. • Suporte: carinefisio@hotmail.com
        </div>
      </footer>
    </>
  );
}
