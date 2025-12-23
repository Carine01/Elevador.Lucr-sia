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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-300 to-purple-500 text-white flex items-center justify-center font-bold">L$</div>
            <div>
              <div className="font-semibold text-gray-800">LucresIA</div>
              <div className="text-xs text-gray-500 -mt-1">Estética Lucrativa</div>
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
                🧠 LucresIA — Estética Lucrativa
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#5f3fb2] leading-tight max-w-4xl mx-auto">
              Transforme sua clínica em uma máquina previsível de agendamentos premium
            </h1>

            <p className="mt-5 text-xl font-medium text-gray-700 max-w-2xl mx-auto">
              A LucresIA é o centro de comando com IA para donas de clínicas<br/>
              que querem parar de improvisar e começar a escalar.
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
                <strong className="text-[#6b2fa8]">+120 clínicas</strong> já operam com a LucresIA
              </p>
            </div>
            
            {/* CTA Diagnóstico Gratuito */}
            <div className="mt-8">
              <button onClick={() => navigate('/radar-bio')} className="px-10 py-5 rounded-full btn-primary shadow-xl text-lg font-black hover:scale-105 transition-all">
                🔍 Fazer Diagnóstico Gratuito
              </button>
              <p className="mt-3 text-xs text-gray-400">
                Descubra onde sua clínica está perdendo agendamentos — sem pagar nada
              </p>
            </div>
            
            {/* Garantia */}
            <p className="mt-4 text-xs text-gray-400">
              🔒 A LucresIA não substitui sua decisão. Ela elimina o caos e acelera quem está pronta.
            </p>
          </div>
        </section>

        {/* Seção Diagnóstico Gratuito - PRIMEIRO ITEM APÓS HERO */}
        <section className="bg-gradient-to-b from-purple-50 to-white py-12 border-y border-purple-100">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
              🧪 O Diagnóstico que Abre os Olhos
            </h2>
            <p className="text-center text-gray-500 mb-8">Antes de qualquer assinatura, você passa por um raio-X completo do seu posicionamento digital.</p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-purple-400 hover:shadow-xl transition-all text-center">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-bold text-gray-800 text-sm mb-2">Análise da Bio</h3>
                <p className="text-gray-500 text-xs">Estética e comunicação do seu Instagram</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-amber-400 hover:shadow-xl transition-all text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-800 text-sm mb-2">Pontos Invisíveis</h3>
                <p className="text-gray-500 text-xs">O que está travando seus agendamentos</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-green-400 hover:shadow-xl transition-all text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-gray-800 text-sm mb-2">Diagnóstico Completo</h3>
                <p className="text-gray-500 text-xs">Autoridade, desejo e conversão</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-blue-400 hover:shadow-xl transition-all text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-800 text-sm mb-2">Plano de Correção</h3>
                <p className="text-gray-500 text-xs">Não genérico — feito para você</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-base text-gray-600 mb-4">
                Muitas clínicas perdem dinheiro todos os dias sem saber onde está o vazamento.<br/>
                <strong className="text-[#6b2fa8]">Aqui você descobre — sem pagar nada.</strong>
              </p>
              <button
                onClick={() => navigate('/radar-bio')}
                className="mt-2 px-8 py-4 rounded-full btn-primary font-bold hover:scale-105 transition-all shadow-lg"
              >
                👉 Quero meu diagnóstico gratuito agora
              </button>
              <p className="mt-3 text-xs text-gray-400">Isso não é isca. É prova de inteligência do sistema.</p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#6b2fa8]">Você não assina uma ferramenta.</h2>
              <p className="mt-4 text-gray-600 text-lg">Você ativa um sistema que trabalha por você 24h por dia, enquanto você cuida do que realmente importa: <strong>procedimentos, autoridade e faturamento.</strong></p>
              <ul className="mt-4 space-y-2 text-gray-700">
                 <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Organize sua estratégia com clareza</li>
                 <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Produza conteúdo com método, não improviso</li>
                 <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Tome decisões melhores, mais rápido</li>
              </ul>
              <div className="mt-6">
                <button onClick={() => navigate('/register')} className="px-6 py-3 rounded-full btn-primary font-bold">Ativar Meu Centro de Comando →</button>
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
            <h3 className="text-2xl text-center font-semibold text-[#6b2fa8] mb-2">🚀 Por Que Isso Funciona?</h3>
            <p className="text-center text-gray-500 text-sm mb-8">Estética não vende só procedimento. Vende confiança, imagem e autoridade.</p>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
              <div className="grid md:grid-cols-2">
                {/* Lado ANTES - Improviso */}
                <div className="p-6 bg-gray-50 border-r border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">😰</span>
                    <h4 className="font-bold text-gray-600">Operando no Improviso</h4>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Agenda irregular e imprevisível</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Posta sem padrão, sem estratégia</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Refém de agências genéricas</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-600">
                      <span className="text-red-400 text-lg">✖</span>
                      <span>Decisões no achismo</span>
                    </li>
                  </ul>
                </div>
                
                {/* Lado DEPOIS - Com LucresIA */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🧠</span>
                    <h4 className="font-bold text-[#6b2fa8]">Com Centro de Comando LucresIA</h4>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Visão clara</strong> de onde vem o dinheiro</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Conteúdo com método</strong>, não inspiração</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Estratégia organizada</strong> em um lugar só</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-lg">✔</span>
                      <span><strong>Decisões com diagnóstico</strong>, não achismo</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-500 italic">
              A LucresIA não foi criada em laboratório. Foi moldada na rotina real de clínicas que precisavam crescer — sem virar reféns de agência.
            </p>
          </div>
        </section>

        <section id="modulos" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
          <h3 className="text-3xl text-center font-semibold text-[#6b2fa8]">🧠 O Que Você Ativa no Centro de Comando</h3>
          <p className="text-center mt-3 text-gray-600">Ferramentas estratégicas para clínicas que pensam como empresa.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#A36BFF]">
              <div className="text-3xl mb-4">📡</div>
              <h5 className="text-xl font-bold text-gray-800">RADAR DE BIO</h5>
              <p className="text-xs text-purple-600 font-semibold mb-2">DIAGNÓSTICO QUE PARA DE QUEIMAR DINHEIRO</p>
              <p className="mt-2 text-sm text-gray-600">A IA escaneia seu Instagram como um especialista em Neurovendas e mostra exatamente onde você está perdendo autoridade, desejo e agendamentos.</p>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#F6C86A]">
              <div className="text-3xl mb-4">🤖</div>
              <h5 className="text-xl font-bold text-gray-800">ROBÔ DE POST</h5>
              <p className="text-xs text-amber-600 font-semibold mb-2">PRODUÇÃO GUIADA DE CONTEÚDO</p>
              <p className="mt-2 text-sm text-gray-600">Conteúdos prontos com estética premium e legendas que posicionam você como referência. Alinhado à sua estratégia, sem depender de inspiração ou agência.</p>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#A36BFF]">
              <div className="text-3xl mb-4">📖</div>
              <h5 className="text-xl font-bold text-gray-800">IA DE E-BOOKS</h5>
              <p className="text-xs text-purple-600 font-semibold mb-2">ESTRUTURAÇÃO DE AUTORIDADE</p>
              <p className="mt-2 text-sm text-gray-600">Transforme conhecimento em material estratégico para relacionamento e captação. Capa, conteúdo e até <strong>audiobook</strong> gerados automaticamente.</p>
            </div>

             <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#F6C86A]">
              <div className="text-3xl mb-4">🎥</div>
              <h5 className="text-xl font-bold text-gray-800">VEO CINEMA</h5>
              <p className="text-xs text-amber-600 font-semibold mb-2">VISUAL PROFISSIONAL DE ALTO IMPACTO</p>
              <p className="mt-2 text-sm text-gray-600">Vídeos cinematográficos que elevam o valor percebido do seu trabalho. Quando sua comunicação parece profissional, sua percepção de valor sobe.</p>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#A36BFF]">
              <div className="text-3xl mb-4">🎯</div>
              <h5 className="text-xl font-bold text-gray-800">ADS MANAGER</h5>
              <p className="text-xs text-purple-600 font-semibold mb-2">PLANEJAMENTO DE CAMPANHAS</p>
              <p className="mt-2 text-sm text-gray-600">Planejamento guiado para investir melhor, não para apostar no escuro. Estratégia focada em pacientes premium, não caçadores de preço.</p>
            </div>

             <div className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-t-4 border-[#F6C86A]">
              <div className="text-3xl mb-4">💎</div>
              <h5 className="text-xl font-bold text-gray-800">LEADS PIPELINE</h5>
              <p className="text-xs text-amber-600 font-semibold mb-2">ORGANIZAÇÃO E PRIORIDADE</p>
              <p className="mt-2 text-sm text-gray-600">CRM com termômetro neural que mostra quem está pronta para comprar e o que dizer no WhatsApp. Organize oportunidades, não perca vendas.</p>
            </div>

          </div>
        </section>

        <section id="planos" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24 bg-gray-50 rounded-3xl">
          <h3 className="text-3xl text-center font-semibold text-[#6b2fa8]">🔓 Planos de Assinatura LucresIA</h3>
          <p className="text-center text-gray-600 mt-2">Escolha o nível de maturidade do seu negócio. A IA evolui. Você evolui junto.</p>
          
          {/* Diagnóstico Gratuito */}
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/radar-bio')} className="text-[#6b2fa8] hover:underline text-sm font-medium">
              🔍 Começar com Diagnóstico Gratuito →
            </button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            
            {/* PLANO START */}
            <div className="bg-white rounded-xl p-8 card-shadow hover:shadow-xl transition-all w-[320px]">
              <div className="text-sm font-bold text-purple-600 mb-2">🌱 PLANO START</div>
              <h4 className="font-bold text-gray-800 text-xl">Clínica Visível & Posicionada</h4>
              <p className="text-3xl font-extrabold mt-4 text-[#6b2fa8]">R$ 57<span className="text-base font-normal text-gray-500">/mês</span></p>
              <p className="mt-4 text-sm text-gray-600">Para quem cansou de postar bonito e vender pouco.</p>
              <ul className="mt-4 text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 📡 Radar de Bio</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 🤖 Robô de Post Inteligente</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 📖 IA de E-books</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 🧠 Diagnóstico de Posicionamento</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Gerações inteligentes incluídas</li>
              </ul>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600"><strong>Resultado prático:</strong></p>
                <p className="text-xs text-gray-500">✔ Sua clínica deixa de parecer comum<br/>✔ Atrai clientes certas<br/>✔ Instagram trabalha por você</p>
              </div>
              <div className="mt-6">
                <button onClick={() => navigate('/register')} className="w-full px-6 py-3 rounded-full font-semibold btn-ghost hover:bg-purple-50 transition-all">
                  👉 Ativar Clínica Visível
                </button>
                <p className="mt-2 text-xs text-center text-gray-400">Ideal para clínicas em crescimento</p>
              </div>
            </div>

            {/* PLANO PRO - Destacado */}
            <div className="relative bg-[#eef2ff] border-2 border-[var(--dourado)] rounded-xl p-8 hover:shadow-2xl transition-all w-[340px] scale-105 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold bg-[var(--dourado)] text-white shadow-md">🔥 MAIS ESCOLHIDO</div>
              <div className="text-sm font-bold text-amber-600 mb-2 mt-2">⭐ PLANO PRO</div>
              <h4 className="font-bold text-[#6b2fa8] text-xl">Clínica Desejada & Lotada</h4>
              <p className="text-3xl font-extrabold mt-4 text-[#6b2fa8]">R$ 97<span className="text-base font-normal text-gray-500">/mês</span></p>
              <p className="mt-4 text-sm text-gray-600">Para quem quer previsibilidade, agenda cheia e autoridade local.</p>
              <ul className="mt-4 text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> <strong>Tudo do Plano Start +</strong></li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 🎥 Veo Cinema</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 🎯 Ads Manager Inteligente</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 💎 Leads Pipeline com Termômetro</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 📅 Agenda Smart Financeira</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> IA sem limite operacional</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Suporte VIP prioritário</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-gray-600"><strong>Resultado prático:</strong></p>
                <p className="text-xs text-gray-500">✔ Agenda previsível<br/>✔ Menos tempo no Instagram<br/>✔ Clareza total de onde vem o dinheiro</p>
              </div>
              <div className="mt-6">
                <button onClick={() => navigate('/register')} className="w-full px-6 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all" style={{background: 'linear-gradient(135deg, #F6C86A 0%, #f59e0b 100%)', color: 'white'}}>
                  👉 Quero Meu Centro de Comando
                </button>
                <p className="mt-2 text-xs text-center text-amber-600 font-semibold">Para quem parou de brincar de clínica</p>
              </div>
            </div>

          </div>
          
          {/* Bônus */}
          <div className="mt-10 max-w-2xl mx-auto text-center p-6 bg-white rounded-xl border border-purple-100">
            <h4 className="font-bold text-[#6b2fa8] mb-3">🎁 BÔNUS EXCLUSIVOS (Enquanto Durar)</h4>
            <p className="text-sm text-gray-600">Ao ativar qualquer plano, você recebe:</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <span>✅ Diagnóstico CEO de Mentalidade</span>
              <span>✅ Scripts prontos de WhatsApp</span>
              <span>✅ Templates de campanhas locais</span>
              <span>✅ Atualizações contínuas da IA</span>
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

        <section className="py-16 bg-gradient-to-b from-purple-100 to-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-[#6b2fa8]">🔔 Pare de Operar no Improviso</h3>
            <p className="mt-4 text-lg text-gray-600">Você pode continuar tentando acertar sozinha.<br/>Ou pode ativar um sistema que já sabe o caminho.</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/register')} className="px-10 py-5 rounded-full shadow-xl text-lg font-black hover:shadow-2xl hover:scale-105 transition-all" style={{background: 'linear-gradient(135deg, #6b2fa8 0%, #A36BFF 100%)', color: 'white'}}>
                👉 ATIVAR MEU CENTRO DE COMANDO AGORA
              </button>
            </div>
            <div className="mt-6">
              <button onClick={() => navigate('/radar-bio')} className="text-[#6b2fa8] hover:underline font-medium">
                🔍 Ou começar com diagnóstico gratuito
              </button>
            </div>
            <p className="mt-6 text-xs text-gray-400">
              A LucresIA não substitui sua decisão. Ela elimina o caos, organiza a estratégia e acelera quem está pronta para crescer.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-12 bg-[#f3f5f8] py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 LucresIA — O Centro de Comando por IA para Clínicas Estéticas que Pensam Grande. • Suporte: carinefisio@hotmail.com
        </div>
      </footer>
    </>
  );
}
