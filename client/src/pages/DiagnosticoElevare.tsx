import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

// ============================================
// TIPOS
// ============================================
type Etapa = 
  | "intro"
  | "consciencia"
  | "financeiro"
  | "posicionamento"
  | "resultado"
  | "plano"
  | "feedback";

interface Scores {
  consciencia: number;
  financeiro: number;
  posicionamento: number;
}

interface QuizData {
  answers: Record<string, number>;
  scores: Scores;
  currentStep: string;
  startedAt: string;
}

// ============================================
// PERGUNTAS
// ============================================
const PERGUNTAS = {
  consciencia: [
    {
      id: "c1",
      pergunta: "Quando algo precisa ser feito na clínica, sua tendência natural é:",
      opcoes: [
        { texto: "Fazer pessoalmente para garantir o padrão", valor: 1 },
        { texto: "Acompanhar de perto mesmo delegando", valor: 2 },
        { texto: "Criar um padrão que não dependa de mim", valor: 3 },
      ]
    },
    {
      id: "c2",
      pergunta: "A maior parte do seu dia é consumida por:",
      opcoes: [
        { texto: "Execução técnica e imprevistos", valor: 1 },
        { texto: "Atendimento e organização", valor: 2 },
        { texto: "Decisão e direcionamento estratégico", valor: 3 },
      ]
    },
    {
      id: "c3",
      pergunta: "Se você tirasse 15 dias de férias hoje, o que aconteceria?",
      opcoes: [
        { texto: "A clínica pararia", valor: 1 },
        { texto: "Funcionaria com dificuldade", valor: 2 },
        { texto: "Seguiria normalmente", valor: 3 },
      ]
    },
  ],
  financeiro: [
    {
      id: "f1",
      pergunta: "Você sabe exatamente quanto lucrou nos últimos 3 meses?",
      opcoes: [
        { texto: "Não tenho esse controle", valor: 1 },
        { texto: "Tenho uma ideia aproximada", valor: 2 },
        { texto: "Sei com precisão", valor: 3 },
      ]
    },
    {
      id: "f2",
      pergunta: "Seu pró-labore está definido e separado do caixa?",
      opcoes: [
        { texto: "Retiro conforme preciso", valor: 1 },
        { texto: "Tenho um valor, mas nem sempre sigo", valor: 2 },
        { texto: "Fixo e separado das despesas", valor: 3 },
      ]
    },
    {
      id: "f3",
      pergunta: "Se uma cliente cancelar hoje, você sabe o impacto no mês?",
      opcoes: [
        { texto: "Não consigo calcular", valor: 1 },
        { texto: "Teria que verificar", valor: 2 },
        { texto: "Sei exatamente", valor: 3 },
      ]
    },
  ],
  posicionamento: [
    {
      id: "p1",
      pergunta: "Quando alguém visita seu perfil, ela entende em 5 segundos o que você faz?",
      opcoes: [
        { texto: "Não tenho certeza", valor: 1 },
        { texto: "Acho que sim", valor: 2 },
        { texto: "Com certeza", valor: 3 },
      ]
    },
    {
      id: "p2",
      pergunta: "Sua bio fala sobre você ou para a cliente certa?",
      opcoes: [
        { texto: "Fala sobre mim e minha formação", valor: 1 },
        { texto: "Um pouco dos dois", valor: 2 },
        { texto: "Fala diretamente com quem quero atrair", valor: 3 },
      ]
    },
    {
      id: "p3",
      pergunta: "Suas clientes chegam pelo Instagram já querendo agendar?",
      opcoes: [
        { texto: "Não, só perguntam preço", valor: 1 },
        { texto: "Algumas sim, outras não", valor: 2 },
        { texto: "A maioria já vem decidida", valor: 3 },
      ]
    },
  ],
};

// ============================================
// STORAGE KEY
// ============================================
const STORAGE_KEY = "elevare_quiz_data";

function getVisitorId(): string {
  let id = localStorage.getItem("elevare_visitor_id");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("elevare_visitor_id", id);
  }
  return id;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function DiagnosticoElevare() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estado principal
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<Scores>({
    consciencia: 0,
    financeiro: 0,
    posicionamento: 0,
  });
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const [diagnosticoIA, setDiagnosticoIA] = useState<string | null>(null);
  const [isLoadingIA, setIsLoadingIA] = useState(false);
  const [diagnosticoId, setDiagnosticoId] = useState<number | null>(null);

  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 80;

  // Referral tracking
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  // tRPC mutations
  const submitQuiz = trpc.quiz.submit.useMutation();
  const gerarDiagnosticoIA = trpc.quiz.gerarDiagnosticoIA.useMutation();
  const trackReferralClick = trpc.gamification.trackReferralClick.useMutation();

  // ============================================
  // PERSISTÊNCIA LOCAL
  // ============================================
  const saveToLocal = useCallback((data: Partial<QuizData>) => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const updated = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const loadFromLocal = useCallback((): QuizData | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }, []);

  const clearLocal = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // ============================================
  // INICIALIZAÇÃO
  // ============================================
  useEffect(() => {
    // Capturar referral code da URL
    const params = new URLSearchParams(searchString);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      trackReferralClick.mutate({ referralCode: ref });
    }

    // Carregar dados salvos
    const saved = loadFromLocal();
    if (saved && saved.startedAt) {
      // Verificar se não expirou (24h)
      const startTime = new Date(saved.startedAt).getTime();
      const now = Date.now();
      const hoursDiff = (now - startTime) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setAnswers(saved.answers || {});
        setScores(saved.scores || { consciencia: 0, financeiro: 0, posicionamento: 0 });
        // Restaurar etapa se não estava no resultado
        if (saved.currentStep && saved.currentStep !== "resultado") {
          setEtapa(saved.currentStep as Etapa);
        }
      } else {
        clearLocal();
      }
    }
  }, [searchString]);

  // ============================================
  // SWIPE HANDLERS (MOBILE)
  // ============================================
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Só funciona durante o quiz
    if (etapa === "consciencia" || etapa === "financeiro" || etapa === "posicionamento") {
      const perguntasAtuais = PERGUNTAS[etapa];
      const pergunta = perguntasAtuais[perguntaAtual];
      
      if (isRightSwipe) {
        // Swipe direita = resposta mais estratégica (valor 3)
        handleResposta(pergunta.id, 3);
      } else if (isLeftSwipe) {
        // Swipe esquerda = resposta mais operacional (valor 1)
        handleResposta(pergunta.id, 1);
      }
    }
  };

  // ============================================
  // CÁLCULOS
  // ============================================
  const getProgresso = () => {
    let respondidas = Object.keys(answers).length;
    return Math.round((respondidas / 9) * 100);
  };

  const getNivel = () => {
    const total = scores.consciencia + scores.financeiro + scores.posicionamento;
    if (total <= 15) return "desbravadora";
    if (total <= 21) return "estrategista";
    return "rainha";
  };

  const getPontoFraco = () => {
    const areas = [
      { nome: "consciencia", label: "consciência empreendedora", score: scores.consciencia },
      { nome: "financeiro", label: "gestão financeira", score: scores.financeiro },
      { nome: "posicionamento", label: "posicionamento digital", score: scores.posicionamento },
    ];
    return areas.reduce((a, b) => a.score < b.score ? a : b);
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleResposta = async (questionId: string, valor: number) => {
    const blocoAtual = etapa as "consciencia" | "financeiro" | "posicionamento";
    
    // Atualizar answers
    const newAnswers = { ...answers, [questionId]: valor };
    setAnswers(newAnswers);

    // Atualizar score do bloco
    const newScores = { ...scores };
    newScores[blocoAtual] = newScores[blocoAtual] + valor;
    setScores(newScores);

    // Salvar no localStorage
    saveToLocal({
      answers: newAnswers,
      scores: newScores,
      currentStep: etapa,
      startedAt: loadFromLocal()?.startedAt || new Date().toISOString(),
    });

    // Próxima pergunta ou próximo bloco
    if (perguntaAtual < 2) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      setPerguntaAtual(0);
      if (etapa === "consciencia") {
        setEtapa("financeiro");
        saveToLocal({ currentStep: "financeiro" });
      } else if (etapa === "financeiro") {
        setEtapa("posicionamento");
        saveToLocal({ currentStep: "posicionamento" });
      } else {
        // Fim do quiz - submeter para backend
        await submitQuizToBackend(newAnswers, newScores);
      }
    }
  };

  const submitQuizToBackend = async (finalAnswers: Record<string, number>, finalScores: Scores) => {
    setIsLoadingIA(true);
    
    try {
      // Submeter quiz
      const result = await submitQuiz.mutateAsync({
        answers: finalAnswers,
        scores: finalScores,
        visitorId: getVisitorId(),
        referralCode: referralCode || undefined,
      });

      setDiagnosticoId(Number(result.diagnosticoId));

      // Gerar diagnóstico com IA
      const iaResult = await gerarDiagnosticoIA.mutateAsync({
        answers: finalAnswers,
        scores: finalScores,
        diagnosticoId: Number(result.diagnosticoId),
      });

      setDiagnosticoIA(iaResult.diagnostico);
      setEtapa("resultado");
      saveToLocal({ currentStep: "resultado" });

    } catch (error) {
      console.error("Erro ao submeter quiz:", error);
      // Fallback: mostrar resultado sem IA
      setEtapa("resultado");
    } finally {
      setIsLoadingIA(false);
    }
  };

  const handleFeedback = (rating: number) => {
    setFeedbackRating(rating);
    if (rating >= 4) setShowUnlock(true);
  };

  const handleUnlockAction = (action: "google" | "whatsapp" | "pdf") => {
    // Limpar dados locais após completar
    clearLocal();
    
    if (action === "google") {
      window.open("https://g.page/r/lucresia", "_blank");
    } else if (action === "whatsapp") {
      const msg = encodeURIComponent(
        `Fiz um diagnóstico gratuito da minha clínica e me surpreendi. Testa aqui: ${window.location.origin}/diagnostico${referralCode ? `?ref=${referralCode}` : ''}`
      );
      window.open(`https://wa.me/?text=${msg}`, "_blank");
    } else {
      window.print();
    }
  };

  // ============================================
  // RESULTADO ESTÁTICO (FALLBACK)
  // ============================================
  const getResultadoEstatico = () => {
    const nivel = getNivel();
    const pontoFraco = getPontoFraco();

    let momento = "";
    let insight = "";

    if (nivel === "desbravadora") {
      momento = "Você sustenta o negócio com esforço pessoal. A clínica funciona, mas depende excessivamente de você.";
      if (pontoFraco.nome === "consciencia") {
        insight = "Seu maior gargalo está na mentalidade operacional. Você é a técnica e a empresa ao mesmo tempo.";
      } else if (pontoFraco.nome === "financeiro") {
        insight = "Você trabalha muito, mas não sabe onde o dinheiro está indo. Fatura, mas não sobra.";
      } else {
        insight = "Seu perfil não está convertendo. Pessoas visitam, mas não entendem por que deveriam agendar.";
      }
    } else if (nivel === "estrategista") {
      momento = "Você está em transição. Já percebeu que técnica não sustenta crescimento sozinha.";
      if (pontoFraco.nome === "consciencia") {
        insight = "Você pensa como empresária em alguns momentos, mas ainda opera como técnica na maior parte do tempo.";
      } else if (pontoFraco.nome === "financeiro") {
        insight = "Você tem noção dos números, mas ainda não tem previsibilidade. Meses bons e ruins se alternam.";
      } else {
        insight = "Seu conteúdo atrai, mas sua bio não converte. Há interesse, mas falta direcionamento.";
      }
    } else {
      momento = "Você pensa como empresária. Agora o desafio é estruturar para escalar com controle.";
      if (pontoFraco.nome === "consciencia") {
        insight = "Você lidera bem, mas ainda é o centro de tudo. Próximo passo: sistemas que multipliquem você.";
      } else if (pontoFraco.nome === "financeiro") {
        insight = "Gestão sólida, mas ainda manual. Automatizar liberaria tempo para o estratégico.";
      } else {
        insight = "Posicionamento forte, mas pode ser premium. Você atrai clientes, poderia atrair ticket maior.";
      }
    }

    return { momento, insight, nivel, pontoFraco };
  };

  // ============================================
  // RENDER
  // ============================================
  const perguntasAtuais = etapa === "consciencia" ? PERGUNTAS.consciencia :
                          etapa === "financeiro" ? PERGUNTAS.financeiro :
                          etapa === "posicionamento" ? PERGUNTAS.posicionamento : [];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#f8f7f4] flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="w-full max-w-[520px] px-8 py-10">
        
        {/* Barra de progresso fina */}
        <div className="h-[3px] bg-[#d1d5db] mb-8 overflow-hidden">
          <div 
            className="h-full bg-[#111827] transition-all duration-400 ease-out"
            style={{ width: `${getProgresso()}%` }}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            INTRO
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "intro" && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[26px] font-medium text-[#1f2933] mb-4">
              Antes de crescer, é preciso clareza
            </h1>
            <p className="text-[15px] text-[#6b7280] leading-relaxed mb-8">
              Este diagnóstico não avalia sua técnica.<br />
              Ele revela como você está conduzindo seu negócio —<br />
              e onde sua energia está sendo drenada silenciosamente.
            </p>
            <button
              onClick={() => {
                setEtapa("consciencia");
                saveToLocal({ 
                  currentStep: "consciencia", 
                  startedAt: new Date().toISOString() 
                });
              }}
              className="w-full py-4 bg-[#111827] text-white text-[15px] hover:opacity-90 transition-opacity"
            >
              Iniciar diagnóstico
            </button>
            
            {/* Dica de swipe para mobile */}
            <p className="mt-6 text-center text-[12px] text-[#6b7280]">
              No celular: deslize para responder rapidamente
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PERGUNTAS (consciencia, financeiro, posicionamento)
        ═══════════════════════════════════════════════════════════════ */}
        {(etapa === "consciencia" || etapa === "financeiro" || etapa === "posicionamento") && (
          <div className="animate-fade-in" key={`${etapa}-${perguntaAtual}`}>
            <p className="text-xs text-[#6b7280] mb-6 uppercase tracking-wide">
              {etapa === "consciencia" && "Consciência Empreendedora"}
              {etapa === "financeiro" && "Gestão Financeira"}
              {etapa === "posicionamento" && "Posicionamento Digital"}
              {" • "}{perguntaAtual + 1}/3
            </p>
            
            <div className="text-[18px] font-medium text-[#1f2933] mb-6 leading-snug">
              {perguntasAtuais[perguntaAtual]?.pergunta}
            </div>

            <div className="flex flex-col gap-3">
              {perguntasAtuais[perguntaAtual]?.opcoes.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => handleResposta(perguntasAtuais[perguntaAtual].id, opcao.valor)}
                  className="p-4 border border-[#d1d5db] bg-transparent text-left text-[15px] text-[#1f2933] hover:bg-white hover:border-[#111827] transition-all"
                >
                  {opcao.texto}
                </button>
              ))}
            </div>

            {/* Indicador de swipe */}
            <div className="mt-8 flex justify-between text-[11px] text-[#9ca3af]">
              <span>← Operacional</span>
              <span>Estratégico →</span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            LOADING IA
        ═══════════════════════════════════════════════════════════════ */}
        {isLoadingIA && (
          <div className="animate-fade-in text-center py-20">
            <div className="w-12 h-12 mx-auto mb-6 border-2 border-[#111827] border-t-transparent rounded-full animate-spin" />
            <p className="text-[15px] text-[#6b7280]">
              Analisando suas respostas...
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            RESULTADO
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "resultado" && !isLoadingIA && (
          <div className="animate-fade-in">
            {diagnosticoIA ? (
              // Resultado com IA
              <>
                <p className="text-xs text-[#6b7280] mb-4 uppercase tracking-wide">
                  Leitura inicial concluída
                </p>
                <div 
                  className="prose prose-sm max-w-none mb-8 text-[#1f2933]"
                  dangerouslySetInnerHTML={{ 
                    __html: diagnosticoIA
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#111827]">$1</strong>')
                      .replace(/\n/g, '<br />') 
                  }}
                />
              </>
            ) : (
              // Resultado estático (fallback)
              <>
                {(() => {
                  const { momento, insight, nivel, pontoFraco } = getResultadoEstatico();
                  return (
                    <>
                      <p className="text-xs text-[#6b7280] mb-4 uppercase tracking-wide">
                        Leitura inicial concluída
                      </p>
                      <h1 className="font-serif text-[26px] font-medium text-[#1f2933] mb-4">
                        {nivel === "desbravadora" && "Fase Desbravadora"}
                        {nivel === "estrategista" && "Fase Estrategista"}
                        {nivel === "rainha" && "Fase Rainha"}
                      </h1>
                      <p className="text-[15px] text-[#6b7280] leading-relaxed mb-6">
                        {momento}
                      </p>
                      <div className="p-4 bg-white border border-[#d1d5db] mb-8">
                        <p className="text-xs text-[#6b7280] mb-2 uppercase tracking-wide">
                          Ponto de atenção: {pontoFraco.label}
                        </p>
                        <p className="text-[15px] text-[#1f2933]">
                          {insight}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
            <button
              onClick={() => setEtapa("plano")}
              className="w-full py-4 bg-[#111827] text-white text-[15px] hover:opacity-90 transition-opacity"
            >
              Ver meu plano de correção
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PLANO
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "plano" && (
          <div className="animate-fade-in">
            {(() => {
              const pontoFraco = getPontoFraco();
              return (
                <>
                  <p className="text-xs text-[#6b7280] mb-4 uppercase tracking-wide">
                    Seu plano inicial
                  </p>
                  <h1 className="font-serif text-[26px] font-medium text-[#1f2933] mb-6">
                    Faça isso primeiro. Só isso.
                  </h1>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 border border-[#d1d5db] flex items-center justify-center flex-shrink-0 text-xs text-[#6b7280]">1</div>
                      <div>
                        <p className="text-[15px] text-[#1f2933] font-medium mb-1">
                          {pontoFraco.nome === "consciencia" && "Delegue uma tarefa operacional"}
                          {pontoFraco.nome === "financeiro" && "Anote seu faturamento diário"}
                          {pontoFraco.nome === "posicionamento" && "Reescreva sua bio"}
                        </p>
                        <p className="text-[14px] text-[#6b7280]">
                          {pontoFraco.nome === "consciencia" && "Escolha uma tarefa que você faz toda semana e crie um passo a passo para outra pessoa executar."}
                          {pontoFraco.nome === "financeiro" && "Por 7 dias, anote quanto entrou e quanto saiu. Sem planilha complexa. Papel e caneta serve."}
                          {pontoFraco.nome === "posicionamento" && "Sua bio deve falar para a cliente, não sobre você. Comece com o resultado que ela busca."}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 border border-[#d1d5db] flex items-center justify-center flex-shrink-0 text-xs text-[#6b7280]">2</div>
                      <div>
                        <p className="text-[15px] text-[#1f2933] font-medium mb-1">
                          {pontoFraco.nome === "consciencia" && "Bloqueie 1h/semana para estratégia"}
                          {pontoFraco.nome === "financeiro" && "Defina seu pró-labore fixo"}
                          {pontoFraco.nome === "posicionamento" && "Adicione um CTA claro"}
                        </p>
                        <p className="text-[14px] text-[#6b7280]">
                          {pontoFraco.nome === "consciencia" && "Sem celular, sem atendimento. Só você pensando no negócio, não no dia a dia."}
                          {pontoFraco.nome === "financeiro" && "Defina um valor fixo mensal para você. Pode ser baixo. O importante é separar."}
                          {pontoFraco.nome === "posicionamento" && "'Agende pelo link' ou 'WhatsApp na bio'. Torne a conversão óbvia."}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 border border-[#d1d5db] flex items-center justify-center flex-shrink-0 text-xs text-[#6b7280]">3</div>
                      <div>
                        <p className="text-[15px] text-[#1f2933] font-medium mb-1">
                          {pontoFraco.nome === "consciencia" && "Pergunte: isso depende só de mim?"}
                          {pontoFraco.nome === "financeiro" && "Calcule seu ticket médio real"}
                          {pontoFraco.nome === "posicionamento" && "Poste 3 resultados em 7 dias"}
                        </p>
                        <p className="text-[14px] text-[#6b7280]">
                          {pontoFraco.nome === "consciencia" && "Toda vez que for fazer algo, pergunte. Se sim, documente o processo."}
                          {pontoFraco.nome === "financeiro" && "Faturamento ÷ número de atendimentos. Você pode se surpreender."}
                          {pontoFraco.nome === "posicionamento" && "Antes e depois, depoimento, ou bastidor do procedimento. Prova social converte."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#6b7280] text-center mb-6">
                    Checklist simples. Sem PDF gigante. Aplique e veja o resultado.
                  </p>

                  <button
                    onClick={() => setEtapa("feedback")}
                    className="w-full py-4 bg-[#111827] text-white text-[15px] hover:opacity-90 transition-opacity"
                  >
                    Concluir diagnóstico
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            FEEDBACK + GAMIFICAÇÃO
        ═══════════════════════════════════════════════════════════════ */}
        {etapa === "feedback" && (
          <div className="animate-fade-in text-center">
            {!showUnlock ? (
              <>
                <div className="w-12 h-12 mx-auto mb-6 border border-[#d1d5db] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#1f2933]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h1 className="font-serif text-[26px] font-medium text-[#1f2933] mb-4">
                  Diagnóstico entregue
                </h1>
                
                <p className="text-[15px] text-[#6b7280] mb-8">
                  Isso foi relevante para você?
                </p>

                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleFeedback(star)}
                      className={`p-2 transition-all hover:scale-110 ${
                        feedbackRating >= star ? 'text-[#111827]' : 'text-[#d1d5db]'
                      }`}
                      aria-label={`${star} estrelas`}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                  ))}
                </div>

                {feedbackRating > 0 && feedbackRating < 4 && (
                  <>
                    <p className="text-[15px] text-[#6b7280] mb-6">Obrigada pelo feedback.</p>
                    <button
                      onClick={() => navigate("/")}
                      className="text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors"
                    >
                      Voltar para a home
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <h1 className="font-serif text-[26px] font-medium text-[#1f2933] mb-4">
                  Quer testar o sistema completo?
                </h1>
                
                <p className="text-[15px] text-[#6b7280] mb-8">
                  Ganhe 30 dias gratuitos completando uma ação:
                </p>

                <div className="space-y-3 text-left">
                  <button
                    onClick={() => handleUnlockAction("google")}
                    className="w-full p-4 border border-[#d1d5db] text-left hover:bg-white hover:border-[#111827] transition-all"
                  >
                    <p className="text-[15px] text-[#1f2933] font-medium">Avaliar no Google</p>
                    <p className="text-[14px] text-[#6b7280]">Ajude outras profissionais a encontrar</p>
                  </button>

                  <button
                    onClick={() => handleUnlockAction("whatsapp")}
                    className="w-full p-4 border border-[#d1d5db] text-left hover:bg-white hover:border-[#111827] transition-all"
                  >
                    <p className="text-[15px] text-[#1f2933] font-medium">Compartilhar com uma amiga</p>
                    <p className="text-[14px] text-[#6b7280]">Link único rastreável</p>
                  </button>

                  <button
                    onClick={() => handleUnlockAction("pdf")}
                    className="w-full p-4 border border-[#d1d5db] text-left hover:bg-white hover:border-[#111827] transition-all"
                  >
                    <p className="text-[15px] text-[#1f2933] font-medium">Salvar diagnóstico</p>
                    <p className="text-[14px] text-[#6b7280]">PDF com seu resultado</p>
                  </button>
                </div>

                <p className="mt-8 text-[13px] text-[#6b7280]">
                  1 ação = 30 dias free. Sem truque.
                </p>

                <button
                  onClick={() => {
                    clearLocal();
                    navigate("/");
                  }}
                  className="mt-4 text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors"
                >
                  Talvez depois
                </button>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-[12px] text-[#6b7280]">
          Diagnóstico confidencial • Estrutura profissional • Sem respostas certas
        </div>
      </div>

      {/* Estilos */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@500&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(12px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .prose strong {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
