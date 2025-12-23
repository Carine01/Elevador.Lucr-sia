import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

// ============================================
// TIPOS
// ============================================
type Etapa = 
  | "intro"           // ATO 1 - Porta de entrada
  | "quiz"            // ATO 2 - O espelho (quiz progressivo)
  | "diagnostico"     // ATO 3 - Diagnóstico personalizado
  | "plano"           // ATO 4 - Plano gratuito
  | "feedback";       // Gamificação

interface Respostas {
  posicionamento: number[];
  gestao: number[];
  maturidade: number[];
}

interface DiagnosticoResult {
  momento: string;
  pontoInvisivel: string;
  impacto: string;
  nivel: "desbravadora" | "estrategista" | "rainha";
}

// ============================================
// PERGUNTAS DO QUIZ (PROGRESSIVO)
// ============================================
const PERGUNTAS = {
  posicionamento: [
    {
      pergunta: "Quando alguém visita seu perfil, ela entende em 5 segundos o que você faz?",
      opcoes: [
        { texto: "Não tenho certeza", valor: 1 },
        { texto: "Acho que sim", valor: 2 },
        { texto: "Com certeza", valor: 3 },
      ]
    },
    {
      pergunta: "Sua bio fala sobre você ou para a cliente certa?",
      opcoes: [
        { texto: "Fala sobre mim e minha formação", valor: 1 },
        { texto: "Um pouco dos dois", valor: 2 },
        { texto: "Fala diretamente com quem quero atrair", valor: 3 },
      ]
    },
    {
      pergunta: "Suas clientes chegam pelo Instagram já querendo agendar?",
      opcoes: [
        { texto: "Não, só perguntam preço", valor: 1 },
        { texto: "Algumas sim, outras não", valor: 2 },
        { texto: "A maioria já vem decidida", valor: 3 },
      ]
    },
  ],
  gestao: [
    {
      pergunta: "Você sabe exatamente quanto faturou nos últimos 3 meses?",
      opcoes: [
        { texto: "Não tenho controle", valor: 1 },
        { texto: "Tenho uma ideia aproximada", valor: 2 },
        { texto: "Sei com precisão", valor: 3 },
      ]
    },
    {
      pergunta: "Você consegue prever o faturamento do próximo mês?",
      opcoes: [
        { texto: "Não, é sempre incerto", valor: 1 },
        { texto: "Consigo estimar", valor: 2 },
        { texto: "Tenho previsibilidade", valor: 3 },
      ]
    },
    {
      pergunta: "Como está sua agenda para as próximas 2 semanas?",
      opcoes: [
        { texto: "Vazia ou muito instável", valor: 1 },
        { texto: "Parcialmente preenchida", valor: 2 },
        { texto: "Praticamente lotada", valor: 3 },
      ]
    },
  ],
  maturidade: [
    {
      pergunta: "Você define suas estratégias ou reage ao que aparece?",
      opcoes: [
        { texto: "Vou apagando incêndios", valor: 1 },
        { texto: "Tenho algumas estratégias", valor: 2 },
        { texto: "Planejo e executo com método", valor: 3 },
      ]
    },
    {
      pergunta: "Quanto tempo você dedica ao estratégico vs operacional?",
      opcoes: [
        { texto: "90% operacional", valor: 1 },
        { texto: "50/50", valor: 2 },
        { texto: "Foco no estratégico", valor: 3 },
      ]
    },
    {
      pergunta: "Você se vê como técnica ou como CEO do seu negócio?",
      opcoes: [
        { texto: "Técnica que faz tudo", valor: 1 },
        { texto: "Em transição", valor: 2 },
        { texto: "CEO com visão de negócio", valor: 3 },
      ]
    },
  ],
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function DiagnosticoElevare() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  
  // Estado principal
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [blocoAtual, setBlocoAtual] = useState<"posicionamento" | "gestao" | "maturidade">("posicionamento");
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({
    posicionamento: [],
    gestao: [],
    maturidade: [],
  });
  const [diagnostico, setDiagnostico] = useState<DiagnosticoResult | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [showUnlockOptions, setShowUnlockOptions] = useState(false);
  
  // Referral tracking
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const trackReferralClick = trpc.gamification.trackReferralClick.useMutation();

  // Capturar referral code da URL
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      trackReferralClick.mutate({ referralCode: ref });
    }
  }, [searchString]);

  // ============================================
  // CÁLCULOS
  // ============================================
  const calcularDiagnostico = (): DiagnosticoResult => {
    const somaPos = respostas.posicionamento.reduce((a, b) => a + b, 0);
    const somaGes = respostas.gestao.reduce((a, b) => a + b, 0);
    const somaMat = respostas.maturidade.reduce((a, b) => a + b, 0);
    const total = somaPos + somaGes + somaMat;

    // Determinar nível
    let nivel: "desbravadora" | "estrategista" | "rainha";
    if (total <= 15) nivel = "desbravadora";
    else if (total <= 21) nivel = "estrategista";
    else nivel = "rainha";

    // Identificar ponto fraco
    const areas = [
      { nome: "posicionamento", soma: somaPos },
      { nome: "gestão", soma: somaGes },
      { nome: "maturidade", soma: somaMat },
    ];
    const pontoFraco = areas.reduce((a, b) => a.soma < b.soma ? a : b);

    // Gerar diagnóstico baseado em correlação
    let momento = "";
    let pontoInvisivel = "";
    let impacto = "";

    if (nivel === "desbravadora") {
      momento = "Você está construindo as bases. Há potencial, mas falta estrutura.";
      if (pontoFraco.nome === "posicionamento") {
        pontoInvisivel = "Sua bio fala sobre você, não para a cliente certa.";
        impacto = "Pessoas visitam seu perfil, mas não se sentem conduzidas ao agendamento.";
      } else if (pontoFraco.nome === "gestão") {
        pontoInvisivel = "Você trabalha muito, mas não sabe onde o dinheiro está indo.";
        impacto = "Fatura, mas no final do mês não sobra o que deveria.";
      } else {
        pontoInvisivel = "Você opera no modo técnica, não no modo CEO.";
        impacto = "Seu negócio depende 100% de você. Não escala.";
      }
    } else if (nivel === "estrategista") {
      momento = "Comunicação forte, mas conversão fraca. Você gera interesse, mas não direciona ação.";
      if (pontoFraco.nome === "posicionamento") {
        pontoInvisivel = "Seu conteúdo atrai, mas sua bio não converte.";
        impacto = "Seguidores admiram, mas não viram clientes.";
      } else if (pontoFraco.nome === "gestão") {
        pontoInvisivel = "Você tem agenda, mas não tem previsibilidade.";
        impacto = "Meses bons e ruins se alternam sem padrão claro.";
      } else {
        pontoInvisivel = "Você ainda é o centro de tudo.";
        impacto = "Para crescer, precisa de sistemas que multipliquem seu tempo.";
      }
    } else {
      momento = "Você já domina o básico. Agora é hora de otimizar e escalar.";
      if (pontoFraco.nome === "posicionamento") {
        pontoInvisivel = "Seu posicionamento está bom, mas pode ser premium.";
        impacto = "Você atrai clientes, mas poderia atrair clientes de ticket maior.";
      } else if (pontoFraco.nome === "gestão") {
        pontoInvisivel = "Gestão sólida, mas ainda manual.";
        impacto = "Automatizar liberaria tempo para estratégia.";
      } else {
        pontoInvisivel = "Você opera bem, mas ainda não delegou o operacional.";
        impacto = "Próximo passo: montar equipe ou sistemas.";
      }
    }

    return { momento, pontoInvisivel, impacto, nivel };
  };

  const getProgresso = () => {
    const totalPerguntas = 9;
    let respondidas = respostas.posicionamento.length + respostas.gestao.length + respostas.maturidade.length;
    return Math.round((respondidas / totalPerguntas) * 100);
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleResposta = (valor: number) => {
    const novasRespostas = { ...respostas };
    novasRespostas[blocoAtual].push(valor);
    setRespostas(novasRespostas);

    // Próxima pergunta ou próximo bloco
    if (perguntaAtual < 2) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      // Fim do bloco atual
      if (blocoAtual === "posicionamento") {
        setBlocoAtual("gestao");
        setPerguntaAtual(0);
      } else if (blocoAtual === "gestao") {
        setBlocoAtual("maturidade");
        setPerguntaAtual(0);
      } else {
        // Fim do quiz - calcular diagnóstico
        const resultado = calcularDiagnostico();
        setDiagnostico(resultado);
        setEtapa("diagnostico");
      }
    }
  };

  const handleFeedback = (rating: number) => {
    setFeedbackRating(rating);
    if (rating >= 4) {
      setShowUnlockOptions(true);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">E</div>
            <span className="font-semibold text-gray-900 tracking-tight">Diagnóstico Elevare</span>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        
        {/* ═══════════════════════════════════════════════════════════════
            ATO 1 — PORTA DE ENTRADA
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "intro" && (
          <div className="max-w-xl mx-auto text-center animate-fade-up">
            <div className="mb-12">
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-6">Diagnóstico Elevare</p>
              <h1 className="font-serif text-3xl md:text-4xl text-gray-900 leading-tight mb-6">
                Descubra por que seu Instagram não agenda como poderia.
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                Em menos de 3 minutos, você recebe uma leitura real da sua bio, do seu posicionamento e do que está travando seus agendamentos hoje.
              </p>
            </div>

            <button
              onClick={() => setEtapa("quiz")}
              className="px-10 py-4 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all"
            >
              Começar análise gratuita
            </button>
            
            <p className="mt-6 text-sm text-gray-400">
              Sem promessas vazias. Só clareza.
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            ATO 2 — O ESPELHO (QUIZ PROGRESSIVO)
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "quiz" && (
          <div className="max-w-xl mx-auto animate-fade-in">
            {/* Barra de progresso */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {blocoAtual === "posicionamento" && "Bloco 1 — Posicionamento"}
                  {blocoAtual === "gestao" && "Bloco 2 — Gestão"}
                  {blocoAtual === "maturidade" && "Bloco 3 — Maturidade"}
                </span>
                <span className="text-sm text-gray-400">{getProgresso()}%</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 transition-all duration-500"
                  style={{ width: `${getProgresso()}%` }}
                />
              </div>
            </div>

            {/* Pergunta atual */}
            <div className="text-center mb-10">
              <p className="text-sm text-gray-400 mb-4">
                Pergunta {perguntaAtual + 1} de 3
              </p>
              <h2 className="font-serif text-2xl text-gray-900 leading-relaxed">
                {PERGUNTAS[blocoAtual][perguntaAtual].pergunta}
              </h2>
            </div>

            {/* Opções */}
            <div className="space-y-3">
              {PERGUNTAS[blocoAtual][perguntaAtual].opcoes.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => handleResposta(opcao.valor)}
                  className="w-full p-5 rounded-xl border border-gray-200 bg-white text-left hover:border-gray-400 hover:bg-gray-50 transition-all group"
                >
                  <span className="text-gray-700 group-hover:text-gray-900">
                    {opcao.texto}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            ATO 3 — DIAGNÓSTICO PERSONALIZADO
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "diagnostico" && diagnostico && (
          <div className="max-w-xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-4">Seu diagnóstico</p>
              <h2 className="font-serif text-3xl text-gray-900">
                Com base nas suas respostas
              </h2>
            </div>

            {/* Card do diagnóstico */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
              {/* Nível */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className={`w-3 h-3 rounded-full ${
                  diagnostico.nivel === "desbravadora" ? "bg-amber-400" :
                  diagnostico.nivel === "estrategista" ? "bg-blue-400" : "bg-emerald-400"
                }`} />
                <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  {diagnostico.nivel === "desbravadora" && "Fase Desbravadora"}
                  {diagnostico.nivel === "estrategista" && "Fase Estrategista"}
                  {diagnostico.nivel === "rainha" && "Fase Rainha"}
                </span>
              </div>

              {/* Momento */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Seu momento hoje</p>
                <p className="text-gray-900 leading-relaxed">{diagnostico.momento}</p>
              </div>

              {/* Ponto invisível */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Ponto invisível identificado</p>
                <p className="text-gray-900 leading-relaxed">{diagnostico.pontoInvisivel}</p>
              </div>

              {/* Impacto */}
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-400 mb-2">Impacto direto</p>
                <p className="text-gray-700">{diagnostico.impacto}</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 mb-6">
              Isso não é bola de cristal. É correlação baseada em padrões reais.
            </p>

            <button
              onClick={() => setEtapa("plano")}
              className="w-full py-4 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all"
            >
              Ver meu plano de correção
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            ATO 4 — PLANO GRATUITO
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "plano" && diagnostico && (
          <div className="max-w-xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-4">Seu plano inicial</p>
              <h2 className="font-serif text-3xl text-gray-900">
                Faça isso primeiro. Só isso.
              </h2>
            </div>

            {/* Checklist do plano */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
              <div className="space-y-6">
                {/* Correção 1 */}
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-gray-400">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Correção na bio</p>
                    <p className="text-sm text-gray-500">
                      {diagnostico.nivel === "desbravadora" 
                        ? "Reescreva sua bio falando para a cliente, não sobre você. Comece com o resultado que ela busca."
                        : diagnostico.nivel === "estrategista"
                        ? "Adicione um CTA claro no final da bio. 'Agende pelo link' ou 'WhatsApp para agendar'."
                        : "Posicione-se como referência. Troque 'esteticista' por 'especialista em [seu diferencial]'."}
                    </p>
                  </div>
                </div>

                {/* Ajuste 2 */}
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-gray-400">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Ajuste de comunicação</p>
                    <p className="text-sm text-gray-500">
                      {diagnostico.nivel === "desbravadora"
                        ? "Nos próximos 7 dias, poste 3 conteúdos mostrando resultados de clientes. Sem filtro exagerado."
                        : diagnostico.nivel === "estrategista"
                        ? "Crie um destaque 'Como agendar' com o passo a passo. Torne a conversão óbvia."
                        : "Produza 1 conteúdo sobre bastidores ou método. Mostre profundidade, não só resultado."}
                    </p>
                  </div>
                </div>

                {/* Ação 3 */}
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-gray-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Ação para os próximos 7 dias</p>
                    <p className="text-sm text-gray-500">
                      {diagnostico.nivel === "desbravadora"
                        ? "Responda TODA mensagem em até 2 horas. Velocidade gera confiança nesse estágio."
                        : diagnostico.nivel === "estrategista"
                        ? "Anote quanto faturou cada dia. Só anotar. Consciência vem antes de controle."
                        : "Identifique 1 tarefa que você faz que poderia delegar. Prepare para terceirizar."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 mb-8">
              Checklist simples. Sem PDF gigante. Aplique e veja o resultado.
            </p>

            <button
              onClick={() => setEtapa("feedback")}
              className="w-full py-4 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all"
            >
              Concluir diagnóstico
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            GAMIFICAÇÃO — FEEDBACK + UNLOCK
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "feedback" && (
          <div className="max-w-md mx-auto text-center animate-fade-in">
            {!showUnlockOptions ? (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="font-serif text-2xl text-gray-900 mb-4">
                  Diagnóstico entregue
                </h2>
                
                <p className="text-gray-500 mb-10">
                  Isso foi relevante para você?
                </p>

                {/* Estrelas de feedback */}
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleFeedback(star)}
                      className={`p-2 transition-all hover:scale-110 ${
                        feedbackRating >= star ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    >
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                  ))}
                </div>

                {feedbackRating > 0 && feedbackRating < 4 && (
                  <div className="text-center">
                    <p className="text-gray-500 mb-6">Obrigada pelo feedback. Vamos melhorar.</p>
                    <button
                      onClick={() => navigate("/")}
                      className="text-sm text-gray-400 hover:text-gray-600"
                    >
                      Voltar para a home
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-gray-900 mb-4">
                  Quer testar o sistema completo?
                </h2>
                
                <p className="text-gray-500 mb-8">
                  Ganhe 30 dias gratuitos completando uma ação:
                </p>

                <div className="space-y-3 text-left">
                  {/* Opção 1: Google Review */}
                  <a
                    href="https://g.page/r/lucresia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-4 rounded-xl border border-gray-200 bg-white flex items-center gap-4 hover:border-gray-400 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Avaliar no Google</p>
                      <p className="text-sm text-gray-500">Ajude outras profissionais</p>
                    </div>
                  </a>

                  {/* Opção 2: Compartilhar */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Fiz um diagnóstico gratuito da minha clínica e me surpreendi. Testa aqui: ${window.location.origin}/diagnostico${referralCode ? `?ref=${referralCode}` : ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-4 rounded-xl border border-gray-200 bg-white flex items-center gap-4 hover:border-gray-400 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Compartilhar com amiga</p>
                      <p className="text-sm text-gray-500">Link único rastreável</p>
                    </div>
                  </a>

                  {/* Opção 3: Salvar PDF */}
                  <button
                    onClick={() => window.print()}
                    className="w-full p-4 rounded-xl border border-gray-200 bg-white flex items-center gap-4 hover:border-gray-400 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Salvar diagnóstico</p>
                      <p className="text-sm text-gray-500">PDF com marca Elevare</p>
                    </div>
                  </button>
                </div>

                <p className="mt-8 text-sm text-gray-400">
                  1 ação = 30 dias free. Sem truque.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-6 text-sm text-gray-400 hover:text-gray-600"
                >
                  Talvez depois
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* Estilos de animação */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        
        .font-serif { font-family: 'Libre Baskerville', Georgia, serif; }
        
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
