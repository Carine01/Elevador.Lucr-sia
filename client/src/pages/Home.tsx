import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

// Modal Component - Cinematográfico
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  
  // Modal states
  const [modalDiagnostico, setModalDiagnostico] = useState(false);
  const [modalMetodo, setModalMetodo] = useState(false);
  const [modalModulo, setModalModulo] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.muted = true;
    const tryPlay = () => {
      const promise = videoElement.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };
    tryPlay();
    const handleClick = () => tryPlay();
    document.addEventListener('click', handleClick, { once: true, passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const premiumStyles = `
    :root {
      --lavanda: #6b2fa8;
      --lavanda-light: #A36BFF;
      --dourado: #c9a227;
      --bg: #fafafa;
    }
    .hero-gradient { background: linear-gradient(180deg, #f8f6ff 0%, #ffffff 100%); }
    .card-shadow { box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(107,47,168,0.12); }
    .btn-primary { background: var(--lavanda); color: white; }
    .btn-secondary { background: transparent; border: 1.5px solid var(--lavanda); color: var(--lavanda); }
    .btn-gold { background: linear-gradient(135deg, #c9a227 0%, #e6c65c 100%); color: white; }
    .animate-fade-in { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .text-balance { text-wrap: balance; }
  `;

  const modulos = [
    {
      id: 'radar',
      titulo: 'Radar de Bio',
      subtitulo: 'Diagnóstico de posicionamento',
      descricao: 'Análise profunda do seu Instagram com inteligência artificial especializada em estética.',
      modalContent: {
        headline: 'Descubra onde você está perdendo clientes',
        corpo: 'A IA escaneia seu perfil como um especialista em neurovendas e revela exatamente onde você está deixando dinheiro na mesa. Sem achismo. Com dados.',
        beneficios: ['Análise de bio e posicionamento', 'Score de autoridade digital', 'Plano de correção personalizado', 'Identificação de pontos cegos']
      }
    },
    {
      id: 'posts',
      titulo: 'Produção de Conteúdo',
      subtitulo: 'Posts estratégicos com IA',
      descricao: 'Conteúdos prontos que posicionam você como referência, sem depender de inspiração.',
      modalContent: {
        headline: 'Conteúdo com método, não improviso',
        corpo: 'Posts criados com técnica de neurovendas, alinhados à sua estratégia de posicionamento. Legendas que convertem, não que só engajam.',
        beneficios: ['Carrosséis de autoridade', 'Legendas que vendem', 'Calendário estratégico', 'Visual premium']
      }
    },
    {
      id: 'ebooks',
      titulo: 'E-books com IA',
      subtitulo: 'Autoridade em formato premium',
      descricao: 'Transforme conhecimento em material estratégico para captação de clientes qualificadas.',
      modalContent: {
        headline: 'Sua autoridade em formato tangível',
        corpo: 'E-books profissionais gerados automaticamente. Capa, conteúdo estruturado e até audiobook. Material que posiciona você como especialista.',
        beneficios: ['Geração automática de conteúdo', 'Capas profissionais', 'Audiobook incluso', 'Lead magnet pronto']
      }
    },
    {
      id: 'reels',
      titulo: 'Roteiros de Reels',
      subtitulo: 'Vídeos que convertem',
      descricao: 'Scripts prontos para gravar. Sem pensar no que falar. Você só executa.',
      modalContent: {
        headline: 'Pare de improvisar na câmera',
        corpo: 'Roteiros estruturados com ganchos de atenção, desenvolvimento e chamada para ação. Técnicas de retenção aplicadas automaticamente.',
        beneficios: ['Roteiros com gancho validado', 'Estrutura de retenção', 'CTA que converte', 'Adaptados ao seu nicho']
      }
    },
    {
      id: 'anuncios',
      titulo: 'Anúncios Estratégicos',
      subtitulo: 'Tráfego qualificado',
      descricao: 'Campanhas que atraem quem paga, não quem só pergunta preço.',
      modalContent: {
        headline: 'Invista em quem tem perfil de cliente',
        corpo: 'Anúncios criados com copy de alta conversão. Segmentação estratégica. Resultados mensuráveis. Sem queimar dinheiro com curiosas.',
        beneficios: ['Copy de alta conversão', 'Segmentação premium', 'Criativos testados', 'ROI mensurável']
      }
    },
    {
      id: 'fluxo',
      titulo: 'Fluxo de Clientes',
      subtitulo: 'CRM inteligente',
      descricao: 'Organize cada lead do primeiro contato ao fechamento. Nunca mais perca uma venda.',
      modalContent: {
        headline: 'Nenhuma oportunidade esquecida',
        corpo: 'Sistema de acompanhamento automático. Cliente sumiu? Você é lembrada. Orçamento enviado? Acompanhamento automático. Pipeline visual.',
        beneficios: ['Pipeline de vendas visual', 'Follow-up automático', 'Histórico de conversas', 'Métricas de conversão']
      }
    }
  ];

  return (
    <>
      <style>{premiumStyles}</style>
      
      {/* Header Premium - Minimalista */}
      <header className="fixed top-0 left-0 right-0 backdrop-blur-md bg-white/90 z-[100] border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--lavanda)] text-white flex items-center justify-center font-semibold text-sm">E</div>
            <span className="font-semibold text-gray-900 tracking-tight">Elevare</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#metodo" className="text-sm text-gray-600 hover:text-[var(--lavanda)] transition-colors">Método</a>
            <a href="#modulos" className="text-sm text-gray-600 hover:text-[var(--lavanda)] transition-colors">Módulos</a>
            <a href="#planos" className="text-sm text-gray-600 hover:text-[var(--lavanda)] transition-colors">Planos</a>
            <a href="#mentora" className="text-sm text-gray-600 hover:text-[var(--lavanda)] transition-colors">Mentora</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-gray-600 hover:text-[var(--lavanda)] transition-colors">Entrar</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 rounded-lg btn-primary text-sm font-medium hover:opacity-90 transition-opacity">Começar</button>
          </div>

          <button onClick={toggleMenu} className="md:hidden p-2 text-gray-600">
            {isMenuOpen ? '✕' : '☰'}
          </button>

          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden p-6 space-y-4">
              <a href="#metodo" onClick={closeMenu} className="block text-gray-600 py-2">Método</a>
              <a href="#modulos" onClick={closeMenu} className="block text-gray-600 py-2">Módulos</a>
              <a href="#planos" onClick={closeMenu} className="block text-gray-600 py-2">Planos</a>
              <a href="#mentora" onClick={closeMenu} className="block text-gray-600 py-2">Mentora</a>
              <hr className="border-gray-100" />
              <button onClick={() => { closeMenu(); navigate('/login'); }} className="w-full text-left text-gray-600 py-2">Entrar</button>
              <button onClick={() => { closeMenu(); navigate('/register'); }} className="w-full py-3 rounded-lg btn-primary text-sm font-medium">Começar</button>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero - Clean & Premium */}
        <section className="hero-gradient min-h-[85vh] flex items-center">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <p className="text-sm font-medium text-[var(--lavanda)] tracking-wide uppercase mb-6">Centro de Comando para Clínicas de Estética</p>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight text-balance">
              Transforme sua clínica em uma operação previsível
            </h1>

            <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Inteligência artificial aplicada a estratégia, conteúdo e vendas.<br/>
              Para quem cansou de improvisar.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/diagnostico')} 
                className="px-8 py-4 rounded-lg btn-primary font-medium text-base hover:opacity-90 transition-all"
              >
                Iniciar diagnóstico gratuito
              </button>
              <button 
                onClick={() => setModalDiagnostico(true)} 
                className="px-8 py-4 rounded-lg btn-secondary font-medium text-base hover:bg-purple-50 transition-all"
              >
                Ver como funciona
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-400">
              Mais de 120 clínicas já operam com o método Elevare
            </p>
          </div>
        </section>

        {/* Diagnóstico - Premium Section */}
        <section id="metodo" className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Diagnóstico Estratégico Gratuito
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Avaliação profunda do seu posicionamento atual. Onde você está perdendo dinheiro — e o que precisa mudar.
              </p>
              <button 
                onClick={() => setModalDiagnostico(true)}
                className="mt-6 text-[var(--lavanda)] font-medium hover:underline"
              >
                Ver como funciona →
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-400 mb-6">Operando no improviso</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs mt-0.5">×</span>
                    <span>Agenda irregular e imprevisível</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs mt-0.5">×</span>
                    <span>Conteúdo sem estratégia definida</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs mt-0.5">×</span>
                    <span>Decisões baseadas em achismo</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-500">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs mt-0.5">×</span>
                    <span>Dependência de agências genéricas</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
                <h3 className="text-lg font-semibold text-[var(--lavanda)] mb-6">Com o método Elevare</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-[var(--lavanda)] flex items-center justify-center text-xs text-white mt-0.5">✓</span>
                    <span>Visão clara de onde vem o faturamento</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-[var(--lavanda)] flex items-center justify-center text-xs text-white mt-0.5">✓</span>
                    <span>Conteúdo com método e propósito</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-[var(--lavanda)] flex items-center justify-center text-xs text-white mt-0.5">✓</span>
                    <span>Decisões baseadas em diagnóstico</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-[var(--lavanda)] flex items-center justify-center text-xs text-white mt-0.5">✓</span>
                    <span>Autonomia estratégica total</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Módulos - Clean Cards with Modal */}
        <section id="modulos" className="py-24 bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                O que você ativa
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Ferramentas estratégicas para clínicas que pensam como empresa.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {modulos.map((modulo) => (
                <div 
                  key={modulo.id}
                  className="bg-white rounded-xl p-8 border border-gray-100 card-hover cursor-pointer"
                  onClick={() => setModalModulo(modulo.id)}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{modulo.titulo}</h3>
                  <p className="text-sm text-[var(--lavanda)] font-medium mb-4">{modulo.subtitulo}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{modulo.descricao}</p>
                  <button className="mt-6 text-sm text-[var(--lavanda)] font-medium hover:underline">
                    Ver detalhes →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Planos - Premium */}
        <section id="planos" className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Planos
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Escolha o nível de maturidade do seu negócio.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Start */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Start</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">Clínica Visível</h3>
                <p className="mt-4 text-4xl font-bold text-gray-900">R$ 57<span className="text-lg font-normal text-gray-500">/mês</span></p>
                <p className="mt-4 text-gray-600">Para quem está construindo presença e autoridade.</p>
                
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">✓</span>
                    Radar de Bio
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">✓</span>
                    Produção de Conteúdo
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">✓</span>
                    E-books com IA
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">✓</span>
                    Diagnóstico de Posicionamento
                  </li>
                </ul>

                <button 
                  onClick={() => navigate('/register')}
                  className="mt-8 w-full py-4 rounded-lg btn-secondary font-medium hover:bg-purple-50 transition-all"
                >
                  Começar agora
                </button>
              </div>

              {/* Pro */}
              <div className="bg-gradient-to-br from-[var(--lavanda)] to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
                  Mais escolhido
                </div>
                <p className="text-sm font-medium text-purple-200 uppercase tracking-wide">Pro</p>
                <h3 className="mt-2 text-2xl font-bold">Clínica Desejada</h3>
                <p className="mt-4 text-4xl font-bold">R$ 97<span className="text-lg font-normal text-purple-200">/mês</span></p>
                <p className="mt-4 text-purple-100">Para quem quer previsibilidade e escala.</p>
                
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Tudo do Start, mais:
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Roteiros de Reels
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Anúncios Estratégicos
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Fluxo de Clientes (CRM)
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Agenda e Calendário Estratégico
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Suporte prioritário
                  </li>
                </ul>

                <button 
                  onClick={() => navigate('/register')}
                  className="mt-8 w-full py-4 rounded-lg bg-white text-[var(--lavanda)] font-semibold hover:bg-gray-100 transition-all"
                >
                  Ativar centro de comando
                </button>
              </div>
            </div>

            <p className="mt-12 text-center text-sm text-gray-500">
              Não sabe por onde começar? <button onClick={() => navigate('/diagnostico')} className="text-[var(--lavanda)] hover:underline">Faça o diagnóstico gratuito</button>
            </p>
          </div>
        </section>

        {/* Depoimentos - Clean */}
        <section className="py-24 bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Resultados reais
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { nome: 'Sherlayne Galvane', local: 'Vila Velha, ES', foto: '/sherlayne-galvane.jpg', depoimento: 'O Radar de Bio mudou meu perfil em um dia. Comecei a receber clientes qualificadas na mesma semana.' },
                { nome: 'Marta Amorin', local: 'Vitória, ES', foto: '/marta-amorin.jpg', depoimento: 'Com os e-books da IA, virei referência na minha cidade. Clientes chegam já confiando em mim.' },
                { nome: 'Geisy Dias', local: 'Teixeira de Freitas, BA', foto: '/geisy-dias.jpg', depoimento: 'Minha agenda nunca mais ficou vazia. O fluxo de clientes mudou completamente.' }
              ].map((dep, i) => (
                <div key={i} className="bg-white rounded-xl p-8 border border-gray-100">
                  <blockquote className="text-gray-700 leading-relaxed">"{dep.depoimento}"</blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <img src={dep.foto} alt={dep.nome} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900">{dep.nome}</p>
                      <p className="text-sm text-gray-500">{dep.local}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mentora - Elegante */}
        <section id="mentora" className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <img 
                  src="/carine-marques.jpg" 
                  alt="Carine Marques" 
                  className="rounded-2xl shadow-lg w-full object-cover h-[500px]"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--lavanda)] uppercase tracking-wide">Quem está por trás</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Carine Marques</h2>
                <p className="text-lg text-gray-500">Mentora e criadora do método Elevare</p>

                <blockquote className="mt-8 text-gray-600 leading-relaxed border-l-2 border-[var(--dourado)] pl-6 italic">
                  "Não sou administradora por formação. Sou esteticista por paixão. Mas precisei me tornar líder, gestora e estrategista — mesmo sem estar preparada. Hoje, transformo essa vivência em caminho: para te mostrar o que ninguém nunca te ensinou."
                </blockquote>

                <p className="mt-8 text-gray-600 leading-relaxed">
                  Carine desenvolveu um método que combina técnica, estratégia e inteligência emocional. Para quem quer parar de improvisar e começar a operar como empresa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - Clean */}
        <section className="py-24 bg-[#fafafa]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perguntas frequentes</h2>
            
            <div className="space-y-4">
              {[
                { q: 'O que é o método Elevare?', a: 'Um sistema completo que usa IA para automatizar estratégia, conteúdo e vendas para clínicas de estética. Desenvolvido por quem conhece a rotina do mercado.' },
                { q: 'Como funciona o Radar de Bio?', a: 'Você insere seu @ do Instagram e a IA analisa seu posicionamento, identificando pontos de melhoria para aumentar conversão e autoridade.' },
                { q: 'A IA cria o conteúdo completo?', a: 'Sim. Posts, legendas, e-books, roteiros de vídeo e anúncios. Tudo alinhado à sua estratégia de posicionamento.' },
                { q: 'Posso testar antes de assinar?', a: 'Sim. O diagnóstico Radar de Bio é gratuito. Você pode avaliar a qualidade antes de decidir.' }
              ].map((faq, i) => (
                <details key={i} className="bg-white rounded-lg border border-gray-100 group">
                  <summary className="p-6 font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-gray-400 transition-transform group-open:rotate-180">↓</span>
                  </summary>
                  <p className="px-6 pb-6 text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final - Clean */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pronta para parar de improvisar?
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Comece pelo diagnóstico gratuito ou ative seu centro de comando agora.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')} 
                className="px-8 py-4 rounded-lg btn-primary font-medium hover:opacity-90 transition-all"
              >
                Ativar centro de comando
              </button>
              <button 
                onClick={() => navigate('/diagnostico')} 
                className="px-8 py-4 rounded-lg btn-secondary font-medium hover:bg-purple-50 transition-all"
              >
                Diagnóstico gratuito
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 Elevare · Centro de Comando para Clínicas de Estética · carinefisio@hotmail.com
        </div>
      </footer>

      {/* Modal: Diagnóstico */}
      <Modal isOpen={modalDiagnostico} onClose={() => setModalDiagnostico(false)}>
        <div className="p-10">
          <h3 className="text-2xl font-bold text-gray-900">Diagnóstico Estratégico</h3>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Se sua clínica não agenda como poderia, o problema não é o mercado. É estratégia mal aplicada.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            O Radar de Bio é uma análise profunda feita por IA especializada em estética. Em minutos, você descobre:
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-3 text-gray-700">
              <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-[var(--lavanda)]">1</span>
              Onde você está perdendo autoridade no Instagram
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-[var(--lavanda)]">2</span>
              O que está travando seus agendamentos
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-[var(--lavanda)]">3</span>
              Plano de correção personalizado
            </li>
          </ul>
          <button 
            onClick={() => { setModalDiagnostico(false); navigate('/diagnostico'); }}
            className="mt-10 w-full py-4 rounded-lg btn-primary font-medium"
          >
            Iniciar diagnóstico gratuito
          </button>
        </div>
      </Modal>

      {/* Modal: Módulos */}
      {modulos.map((modulo) => (
        <Modal key={modulo.id} isOpen={modalModulo === modulo.id} onClose={() => setModalModulo(null)}>
          <div className="p-10">
            <p className="text-sm font-medium text-[var(--lavanda)] uppercase tracking-wide">{modulo.subtitulo}</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">{modulo.modalContent.headline}</h3>
            <p className="mt-4 text-gray-600 leading-relaxed">{modulo.modalContent.corpo}</p>
            
            <ul className="mt-8 space-y-3">
              {modulo.modalContent.beneficios.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs text-[var(--lavanda)]">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => { setModalModulo(null); navigate('/register'); }}
              className="mt-10 w-full py-4 rounded-lg btn-primary font-medium"
            >
              Ativar este módulo
            </button>
          </div>
        </Modal>
      ))}
    </>
  );
}
