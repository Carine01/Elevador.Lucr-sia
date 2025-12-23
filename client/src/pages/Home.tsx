// Landing Page LucresIA Premium - v2.0 - 23/12/2025
import React, { useState } from 'react';
import { useLocation } from "wouter";

// Modal Component - Elegante e silencioso
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors text-lg"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Modal states - Revelação progressiva
  const [modalBio, setModalBio] = useState(false);
  const [modalGargalos, setModalGargalos] = useState(false);
  const [modalDiagnostico, setModalDiagnostico] = useState(false);
  const [modalPlano, setModalPlano] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const premiumStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600&display=swap');
    
    :root {
      --roxo-elevare: #6b2fa8;
      --dourado-fosco: #b8975a;
      --grafite: #2d2d2d;
      --off-white: #faf9f7;
    }
    
    .font-serif { font-family: 'Libre Baskerville', Georgia, serif; }
    .font-sans { font-family: 'Inter', -apple-system, sans-serif; }
    
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { 
      from { opacity: 0; transform: translateY(8px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    
    .animate-fade-up { animation: fadeUp 0.6s ease-out; }
    @keyframes fadeUp { 
      from { opacity: 0; transform: translateY(20px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    
    .card-elegant {
      transition: all 0.3s ease;
    }
    .card-elegant:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.06);
    }
  `;

  return (
    <>
      <style>{premiumStyles}</style>
      
      {/* Header - Minimalista */}
      <header className="fixed top-0 left-0 right-0 backdrop-blur-md bg-[var(--off-white)]/95 z-[100] border-b border-gray-100">
        <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--roxo-elevare)] text-white flex items-center justify-center font-semibold text-sm">L</div>
            <span className="font-semibold text-[var(--grafite)] tracking-tight">LucresIA</span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-gray-500 hover:text-[var(--grafite)] transition-colors">
              Entrar
            </button>
            <button onClick={() => navigate('/diagnostico')} className="px-5 py-2.5 rounded-lg bg-[var(--grafite)] text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              Diagnóstico
            </button>
          </div>

          <button onClick={toggleMenu} className="md:hidden p-2 text-gray-500">
            {isMenuOpen ? '×' : '≡'}
          </button>

          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden p-6 space-y-4">
              <button onClick={() => { closeMenu(); navigate('/login'); }} className="w-full text-left text-gray-600 py-2">Entrar</button>
              <button onClick={() => { closeMenu(); navigate('/diagnostico'); }} className="w-full py-3 rounded-lg bg-[var(--grafite)] text-white text-sm font-medium">Diagnóstico</button>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-20 bg-[var(--off-white)] font-sans">
        
        {/* ═══════════════════════════════════════════════════════════════
            DOBRA 1 — HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section className="min-h-[85vh] flex items-center">
          <div className="max-w-3xl mx-auto px-6 py-24 text-center animate-fade-up">
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--grafite)] leading-[1.15] tracking-tight">
              Transforme sua clínica em uma operação previsível e lucrativa.
            </h1>

            <p className="mt-8 text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Diagnóstico estratégico para clínicas estéticas que querem sair do improviso e escalar com inteligência.
            </p>

            <div className="mt-12">
              <button 
                onClick={() => navigate('/diagnostico')} 
                className="px-10 py-4 rounded-xl bg-[var(--grafite)] text-white font-medium text-base hover:bg-gray-800 transition-all"
              >
                Iniciar Diagnóstico Gratuito
              </button>
            </div>

            <p className="mt-5 text-sm text-gray-400">
              Análise estratégica real. Sem promessas vazias.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            DOBRA 2 — O PROBLEMA (SEM DRAMA)
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--grafite)] leading-tight">
              Você pode ser excelente tecnicamente<br/>
              <span className="text-gray-400">e ainda assim estar perdendo dinheiro todos os dias.</span>
            </h2>

            <p className="mt-10 text-lg text-gray-500 leading-relaxed">
              O problema raramente é falta de esforço.<br/>
              É falta de clareza estratégica.
            </p>

            <div className="mt-14 grid md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-sm mb-2">Padrão comum</p>
                <p className="text-[var(--grafite)]">Posta sem estratégia</p>
              </div>
              <div className="p-6 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-sm mb-2">Padrão comum</p>
                <p className="text-[var(--grafite)]">Agenda sem previsibilidade</p>
              </div>
              <div className="p-6 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-sm mb-2">Padrão comum</p>
                <p className="text-[var(--grafite)]">Cresce sem controle</p>
              </div>
            </div>

            <p className="mt-14 text-lg text-[var(--grafite)] font-medium">
              A LucresIA existe para corrigir isso.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            DOBRA 3 — O QUE O DIAGNÓSTICO ENTREGA (CARDS + MODALS)
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[var(--off-white)]">
          <div className="max-w-4xl mx-auto px-6">
            
            <div className="text-center mb-16">
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-4">Etapas do Diagnóstico</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--grafite)]">
                O que você vai descobrir
              </h2>
            </div>

            <div className="space-y-4">
              
              {/* Card 1 - Análise da Bio */}
              <div 
                className="bg-white rounded-xl border border-gray-100 p-8 card-elegant cursor-pointer"
                onClick={() => setModalBio(true)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">1</span>
                      <h3 className="font-semibold text-[var(--grafite)] text-lg">Análise Estratégica da Bio</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                      Avaliação da estética, clareza e comunicação do seu Instagram para identificar se seu perfil constrói autoridade e gera intenção real de agendamento.
                    </p>
                    <button className="mt-4 text-sm text-[var(--roxo-elevare)] font-medium hover:underline">
                      Ver análise detalhada da bio →
                    </button>
                    <p className="mt-2 text-xs text-gray-400">Leva menos de 2 minutos.</p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Pontos Invisíveis */}
              <div 
                className="bg-white rounded-xl border border-gray-100 p-8 card-elegant cursor-pointer"
                onClick={() => setModalGargalos(true)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">2</span>
                      <h3 className="font-semibold text-[var(--grafite)] text-lg">Pontos Invisíveis</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                      Mapeamento dos fatores ocultos que silenciosamente travam seus agendamentos, mesmo quando você posta, atende bem e se esforça.
                    </p>
                    <button className="mt-4 text-sm text-[var(--roxo-elevare)] font-medium hover:underline">
                      Revelar gargalos ocultos →
                    </button>
                    <p className="mt-2 text-xs text-gray-400">Análise baseada no seu momento atual.</p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Diagnóstico Completo */}
              <div 
                className="bg-white rounded-xl border border-gray-100 p-8 card-elegant cursor-pointer"
                onClick={() => setModalDiagnostico(true)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">3</span>
                      <h3 className="font-semibold text-[var(--grafite)] text-lg">Diagnóstico de Autoridade, Desejo e Conversão</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                      Avaliação de como sua clínica é percebida hoje e como isso impacta diretamente sua capacidade de cobrar, escalar e prever faturamento.
                    </p>
                    <button className="mt-4 text-sm text-[var(--roxo-elevare)] font-medium hover:underline">
                      Ver diagnóstico completo →
                    </button>
                    <p className="mt-2 text-xs text-gray-400">Clareza antes da decisão.</p>
                  </div>
                </div>
              </div>

              {/* Card 4 - Plano de Correção */}
              <div 
                className="bg-white rounded-xl border border-gray-100 p-8 card-elegant cursor-pointer"
                onClick={() => setModalPlano(true)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">4</span>
                      <h3 className="font-semibold text-[var(--grafite)] text-lg">Plano de Correção Estratégico</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                      Direcionamento claro e personalizado para corrigir posicionamento, comunicação e estrutura de conversão.
                    </p>
                    <p className="mt-3 text-gray-400 text-sm">
                      Nada genérico. Nada automático.
                    </p>
                    <button className="mt-4 text-sm text-[var(--roxo-elevare)] font-medium hover:underline">
                      Ver plano recomendado para mim →
                    </button>
                    <p className="mt-2 text-xs text-gray-400">Baseado nas suas respostas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => navigate('/diagnostico')} 
                className="px-10 py-4 rounded-xl bg-[var(--grafite)] text-white font-medium hover:bg-gray-800 transition-all"
              >
                Iniciar Diagnóstico Gratuito
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            DOBRA 4 — POSICIONAMENTO / AUTORIDADE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--grafite)] leading-tight">
              A LucresIA não é uma ferramenta genérica.
            </h2>
            
            <p className="mt-6 text-xl text-[var(--roxo-elevare)] font-medium">
              Ela foi treinada dentro da estética.
            </p>

            <div className="mt-14 grid md:grid-cols-3 gap-8 text-left">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Aqui</p>
                <p className="text-[var(--grafite)] text-lg">Imagem é produto.</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Aqui</p>
                <p className="text-[var(--grafite)] text-lg">Confiança é moeda.</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Aqui</p>
                <p className="text-[var(--grafite)] text-lg">Decisão é estratégica.</p>
              </div>
            </div>

            <div className="mt-16 p-8 rounded-xl border border-gray-100 bg-[var(--off-white)]">
              <p className="text-lg text-gray-500">
                Você não recebe achismo.<br/>
                <span className="text-[var(--grafite)] font-medium">Recebe clareza.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            DOBRA 5 — CTA FINAL
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[var(--off-white)] border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--grafite)] leading-tight">
              Pronta para enxergar onde sua clínica realmente está?
            </h2>

            <p className="mt-8 text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
              O diagnóstico gratuito revela o cenário.<br/>
              A escala vem depois — para quem decide avançar.
            </p>

            <div className="mt-12">
              <button 
                onClick={() => navigate('/diagnostico')} 
                className="px-10 py-4 rounded-xl bg-[var(--grafite)] text-white font-medium text-base hover:bg-gray-800 transition-all"
              >
                Iniciar Diagnóstico Gratuito
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              A execução completa e automações fazem parte dos planos avançados.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FRASE-CHAVE (RODAPÉ DA LANDING)
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="font-serif text-xl text-gray-400 italic">
              "Clareza vem antes da escala.<br/>
              A LucresIA apenas revela o caminho."
            </p>
          </div>
        </section>

      </main>

      {/* Footer - Minimal */}
      <footer className="bg-[var(--off-white)] py-10 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-400">
          © 2025 LucresIA · Diagnóstico Estratégico para Clínicas de Estética
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          MODAIS — REVELAÇÃO PROGRESSIVA
      ═══════════════════════════════════════════════════════════════ */}
      
      {/* Modal: Análise da Bio */}
      <Modal isOpen={modalBio} onClose={() => setModalBio(false)}>
        <div className="p-10">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Etapa 1 de 4</p>
          <h3 className="font-serif text-2xl text-[var(--grafite)]">Análise Estratégica da Bio</h3>
          
          <p className="mt-6 text-gray-500 leading-relaxed">
            Sua bio é o primeiro filtro de decisão de uma paciente.
            Em poucos segundos, ela decide se confia, se valoriza — ou se ignora.
          </p>

          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-4">A LucresIA analisa:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                Clareza da sua proposta
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                Linguagem estética e persuasiva
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                Coerência entre imagem e posicionamento
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                Chamada para ação e fluxo de contato
              </li>
            </ul>
          </div>

          <p className="mt-8 text-gray-600 border-l-2 border-[var(--dourado-fosco)] pl-4 italic">
            Você descobre se seu perfil convida para agendar — ou se apenas existe.
          </p>
          
          <button 
            onClick={() => { setModalBio(false); navigate('/diagnostico'); }}
            className="mt-10 w-full py-4 rounded-xl bg-[var(--grafite)] text-white font-medium hover:bg-gray-800 transition-all"
          >
            Iniciar Análise da Bio
          </button>
        </div>
      </Modal>

      {/* Modal: Pontos Invisíveis */}
      <Modal isOpen={modalGargalos} onClose={() => setModalGargalos(false)}>
        <div className="p-10">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Etapa 2 de 4</p>
          <h3 className="font-serif text-2xl text-[var(--grafite)]">Pontos Invisíveis</h3>
          
          <p className="mt-6 text-gray-500 leading-relaxed">
            Existem falhas que você não vê — mas que suas clientes sentem.
            São os gargalos silenciosos que drenam seu faturamento enquanto você trabalha cada vez mais.
          </p>

          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-4">Identificamos:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                Onde a jornada da cliente trava
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                Por que orçamentos não fecham
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                O que afasta clientes de alto valor
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--roxo-elevare)] mt-2 flex-shrink-0"></span>
                Padrões que sabotam sem você perceber
              </li>
            </ul>
          </div>

          <p className="mt-8 text-gray-600 border-l-2 border-[var(--dourado-fosco)] pl-4 italic">
            Nomear a dor é o primeiro passo para resolver.
          </p>
          
          <button 
            onClick={() => { setModalGargalos(false); navigate('/diagnostico'); }}
            className="mt-10 w-full py-4 rounded-xl bg-[var(--grafite)] text-white font-medium hover:bg-gray-800 transition-all"
          >
            Revelar Meus Gargalos
          </button>
        </div>
      </Modal>

      {/* Modal: Diagnóstico Completo */}
      <Modal isOpen={modalDiagnostico} onClose={() => setModalDiagnostico(false)}>
        <div className="p-10">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Etapa 3 de 4</p>
          <h3 className="font-serif text-2xl text-[var(--grafite)]">Diagnóstico de Autoridade, Desejo e Conversão</h3>
          
          <p className="mt-6 text-gray-500 leading-relaxed">
            Como sua clínica é percebida hoje?
            Técnica comum, especialista respeitada ou referência premium?
          </p>

          <p className="mt-4 text-gray-500 leading-relaxed">
            Essa percepção define quanto você pode cobrar, quantas clientes fecham sem negociar, e se você atrai quem valoriza ou quem só pergunta preço.
          </p>

          <div className="mt-8 p-6 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-400 mb-3">O diagnóstico revela:</p>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Seu nível de autoridade percebida</li>
              <li>• O quanto seu conteúdo gera desejo real</li>
              <li>• Onde está o vazamento de conversão</li>
            </ul>
          </div>

          <p className="mt-8 text-gray-600 border-l-2 border-[var(--dourado-fosco)] pl-4 italic">
            Aqui você aceita ser avaliada. É o ponto de virada.
          </p>
          
          <button 
            onClick={() => { setModalDiagnostico(false); navigate('/diagnostico'); }}
            className="mt-10 w-full py-4 rounded-xl bg-[var(--grafite)] text-white font-medium hover:bg-gray-800 transition-all"
          >
            Ver Meu Diagnóstico
          </button>
        </div>
      </Modal>

      {/* Modal: Plano de Correção */}
      <Modal isOpen={modalPlano} onClose={() => setModalPlano(false)}>
        <div className="p-10">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Etapa 4 de 4</p>
          <h3 className="font-serif text-2xl text-[var(--grafite)]">Plano de Correção Estratégico</h3>
          
          <p className="mt-6 text-gray-500 leading-relaxed">
            Com base nas suas respostas, este plano mostra o que ajustar agora para melhorar autoridade, desejo e conversão na sua clínica.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">✓</span>
              <span className="text-gray-600">Nada genérico.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">✓</span>
              <span className="text-gray-600">Nada copiado.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">✓</span>
              <span className="text-gray-600">Aplicável ao seu momento real.</span>
            </div>
          </div>

          <p className="mt-8 text-gray-600 border-l-2 border-[var(--dourado-fosco)] pl-4 italic">
            Aqui você não recebe promessas. Recebe direção.
          </p>

          <p className="mt-6 text-xs text-gray-400">
            Este é um plano inicial e gratuito. A execução contínua, automações e inteligência evolutiva fazem parte dos planos avançados.
          </p>
          
          <button 
            onClick={() => { setModalPlano(false); navigate('/diagnostico'); }}
            className="mt-8 w-full py-4 rounded-xl bg-[var(--grafite)] text-white font-medium hover:bg-gray-800 transition-all"
          >
            Ver Meu Plano Personalizado
          </button>
        </div>
      </Modal>
    </>
  );
}
