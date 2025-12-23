import { useState } from "react";
import { useLocation } from "wouter";
import QuizBio from "@/components/diagnostico/QuizBio";
import ResultadoBio from "@/components/diagnostico/ResultadoBio";
import QuizConsciencia from "@/components/diagnostico/QuizConsciencia";
import QuizFinanceiro from "@/components/diagnostico/QuizFinanceiro";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

type Etapa = 
  | "intro" 
  | "quiz-bio" 
  | "resultado-bio" 
  | "quiz-consciencia" 
  | "resultado-consciencia"
  | "quiz-financeiro" 
  | "resultado-final"
  | "captura-lead";

interface Scores {
  bio: number;
  consciencia: number;
  financeiro: number;
}

export default function DiagnosticoElevare() {
  const [, navigate] = useLocation();
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [scores, setScores] = useState<Scores>({ bio: 0, consciencia: 0, financeiro: 0 });
  const [diagnosticoIA, setDiagnosticoIA] = useState<string>("");
  const [isLoadingIA, setIsLoadingIA] = useState(false);
  
  // Lead capture
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);

  // Calcular nível da bio
  const getNivelBio = (score: number) => {
    if (score <= 6) return "Bio Invisível";
    if (score <= 9) return "Bio Estética, mas Fraca";
    return "Bio Magnética";
  };

  const getNivelConsciencia = (score: number) => {
    if (score <= 6) return "Cliente Curiosa";
    if (score <= 9) return "Cliente Interessada";
    return "Cliente Pronta";
  };

  const getNivelFinanceiro = (score: number) => {
    if (score <= 6) return "Gestão Intuitiva";
    if (score <= 9) return "Gestão em Construção";
    return "Gestão Estratégica";
  };

  // Gerar diagnóstico com IA
  const gerarDiagnosticoIA = async (scoresFinais: Scores) => {
    setIsLoadingIA(true);
    
    const nivelBio = getNivelBio(scoresFinais.bio);
    const nivelConsciencia = getNivelConsciencia(scoresFinais.consciencia);
    const nivelFinanceiro = getNivelFinanceiro(scoresFinais.financeiro);
    
    const prompt = `Você é uma especialista em marketing estético, neurovendas e posicionamento premium.

Gere um diagnóstico claro, direto e respeitoso para uma dona de clínica estética com base nestes resultados:

- Nível de Bio: ${nivelBio} (${scoresFinais.bio}/12 pontos)
- Nível de Consciência das Clientes: ${nivelConsciencia} (${scoresFinais.consciencia}/12 pontos)  
- Nível de Gestão Financeira: ${nivelFinanceiro} (${scoresFinais.financeiro}/12 pontos)

Pontuação Total: ${scoresFinais.bio + scoresFinais.consciencia + scoresFinais.financeiro}/36

Estruture o diagnóstico assim:

1. **Visão Geral** (2-3 frases sobre o cenário atual)
2. **O que está travando seus agendamentos** (seja específica)
3. **O impacto no faturamento** (sem ser alarmista, mas real)
4. **Prioridade de correção** (o que atacar primeiro)
5. **Próximo passo** (convite sutil para aprofundar no Elevare)

Tom:
- Profissional e elegante
- Nada agressivo ou genérico
- Linguagem de estética e autoridade
- Evite termos técnicos de marketing

Máximo 400 palavras. Direto ao ponto.`;

    try {
      // Simular resposta da IA (em produção, usar o endpoint real)
      // Por enquanto, gerar um diagnóstico baseado nos scores
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let diagnostico = "";
      
      const totalScore = scoresFinais.bio + scoresFinais.consciencia + scoresFinais.financeiro;
      
      if (totalScore <= 18) {
        diagnostico = `**Sua clínica está operando abaixo do potencial.**

Você tem talento e entrega resultados — isso é inegável. Mas seu Instagram não reflete isso. Clientes chegam, olham, e vão embora sem entender por que deveriam escolher você.

**O que está travando seus agendamentos:**
Sua bio não comunica diferencial. Seus destaques não conduzem à decisão. E suas clientes ainda estão no modo "pesquisa de preço" — o que significa que você compete por valor, não por autoridade.

**O impacto no faturamento:**
Você está deixando dinheiro na mesa todo mês. Não por falta de demanda, mas porque a demanda certa não está chegando até você. Curiosas ocupam seu tempo. Clientes prontas vão para quem se posiciona melhor.

**Prioridade de correção:**
Comece pela bio e pelos destaques. São a porta de entrada. Depois, trabalhe a comunicação para elevar o nível de consciência das suas seguidoras.

**Próximo passo:**
O Elevare foi criado exatamente para isso: transformar sua presença digital em uma máquina de agendamentos qualificados. Sem depender de agência, sem perder tempo com conteúdo que não converte.`;
      } else if (totalScore <= 27) {
        diagnostico = `**Você está no caminho certo, mas falta consistência.**

Seu perfil tem potencial. Você já entende que não é só sobre postar bonito — é sobre estratégia. O problema é que ainda faltam peças no quebra-cabeça.

**O que está travando seus agendamentos:**
Você atrai interesse, mas não urgência. Suas clientes admiram seu trabalho, mas não sentem que precisam agendar *agora*. Falta um sistema que conduza da descoberta até a decisão.

**O impacto no faturamento:**
Você poderia estar faturando 30-50% a mais com a mesma estrutura. O gargalo não é capacidade — é conversão. Leads entram, mas não viram clientes na velocidade que poderiam.

**Prioridade de correção:**
Otimize seu funil de conversão. Bio, destaques e CTAs precisam trabalhar juntos. E suas clientes precisam ser educadas para valorizar protocolos, não procedimentos avulsos.

**Próximo passo:**
Com o Elevare, você automatiza a parte estratégica e foca no que faz de melhor: atender. A IA cuida do posicionamento, conteúdo e follow-up.`;
      } else {
        diagnostico = `**Você já domina o básico. Agora é hora de escalar.**

Parabéns — você faz parte de uma minoria. Sua bio comunica, suas clientes confiam, e sua gestão tem estrutura. O desafio agora é diferente: como crescer sem se sobrecarregar?

**O que pode estar limitando sua escala:**
Você ainda é o centro de tudo. Marketing, atendimento, gestão — tudo passa por você. Isso funciona até certo ponto, mas cria um teto de crescimento.

**O impacto no faturamento:**
Você está próxima do limite do modelo atual. Para faturar mais, precisa de sistemas que multipliquem seu tempo — não de mais horas trabalhadas.

**Prioridade de correção:**
Automatize o que pode ser automatizado. Delegue o operacional. Foque em decisões estratégicas e no atendimento de alto valor.

**Próximo passo:**
O Elevare foi pensado para clínicas no seu estágio: ferramentas de IA para conteúdo, CRM para pipeline de vendas, e automações que liberam seu tempo para o que realmente importa.`;
      }
      
      setDiagnosticoIA(diagnostico);
    } catch (error) {
      console.error("Erro ao gerar diagnóstico:", error);
      setDiagnosticoIA("Não foi possível gerar o diagnóstico personalizado. Por favor, tente novamente.");
    } finally {
      setIsLoadingIA(false);
    }
  };

  // Handlers
  const handleFinishBio = (score: number) => {
    setScores(prev => ({ ...prev, bio: score }));
    setEtapa("resultado-bio");
  };

  const handleFinishConsciencia = (score: number) => {
    setScores(prev => ({ ...prev, consciencia: score }));
    setEtapa("resultado-consciencia");
  };

  const handleFinishFinanceiro = async (score: number) => {
    const newScores = { ...scores, financeiro: score };
    setScores(newScores);
    setEtapa("resultado-final");
    await gerarDiagnosticoIA(newScores);
  };

  const handleSaveLead = () => {
    if (!email && !whatsapp) return;
    // Aqui salvaria o lead no banco
    setLeadSaved(true);
  };

  const totalScore = scores.bio + scores.consciencia + scores.financeiro;
  const porcentagemTotal = Math.round((totalScore / 36) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">E</div>
            <span className="font-semibold text-gray-900">Diagnóstico Elevare</span>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Voltar
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="pt-24 pb-16 px-6">
        {/* INTRO */}
        {etapa === "intro" && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                Diagnóstico Gratuito
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Seu Instagram atrai cliente certa ou só curiosa?
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Análise estratégica em 3 níveis para descobrir onde você está perdendo clientes — e o que precisa mudar.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">O que você vai descobrir:</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Diagnóstico da Bio</p>
                    <p className="text-sm text-gray-500">Se seu perfil gera desejo e conduz ao agendamento</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Nível de Consciência</p>
                    <p className="text-sm text-gray-500">Se suas clientes valorizam ou só perguntam preço</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Saúde Financeira</p>
                    <p className="text-sm text-gray-500">Se sua gestão é intuitiva ou estratégica</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEtapa("quiz-bio")}
              className="
                w-full py-4 px-8 rounded-xl font-semibold text-white text-lg
                bg-gradient-to-r from-purple-600 to-purple-700
                hover:from-purple-700 hover:to-purple-800
                transition-all duration-200 shadow-lg hover:shadow-xl
              "
            >
              Iniciar Diagnóstico
            </button>
            
            <p className="mt-4 text-sm text-gray-500">
              Leva menos de 3 minutos. Sem pegadinha.
            </p>
          </div>
        )}

        {/* QUIZ BIO */}
        {etapa === "quiz-bio" && (
          <div className="py-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Nível 1 — Bio
              </span>
            </div>
            <QuizBio onFinish={handleFinishBio} />
          </div>
        )}

        {/* RESULTADO BIO */}
        {etapa === "resultado-bio" && (
          <div className="py-8">
            <ResultadoBio 
              score={scores.bio} 
              avancar={() => setEtapa("quiz-consciencia")} 
            />
          </div>
        )}

        {/* QUIZ CONSCIÊNCIA */}
        {etapa === "quiz-consciencia" && (
          <div className="py-8">
            <QuizConsciencia onFinish={handleFinishConsciencia} />
          </div>
        )}

        {/* RESULTADO CONSCIÊNCIA */}
        {etapa === "resultado-consciencia" && (
          <div className="py-8 max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-6">
                <span className="text-3xl font-bold text-white">{scores.consciencia}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {getNivelConsciencia(scores.consciencia)}
              </h2>
              <p className="text-lg text-gray-600">
                {scores.consciencia <= 6 && "Suas clientes ainda não entendem o valor do que você oferece."}
                {scores.consciencia > 6 && scores.consciencia <= 9 && "Suas clientes têm interesse, mas precisam ser educadas."}
                {scores.consciencia > 9 && "Suas clientes confiam em você e valorizam seu trabalho."}
              </p>
            </div>

            <button
              onClick={() => setEtapa("quiz-financeiro")}
              className="
                w-full py-4 px-8 rounded-xl font-semibold text-white
                bg-gradient-to-r from-emerald-600 to-emerald-700
                hover:from-emerald-700 hover:to-emerald-800
                transition-all duration-200 shadow-lg
              "
            >
              Avançar para Diagnóstico Financeiro
            </button>
            <p className="mt-4 text-sm text-gray-500">Última etapa</p>
          </div>
        )}

        {/* QUIZ FINANCEIRO */}
        {etapa === "quiz-financeiro" && (
          <div className="py-8">
            <QuizFinanceiro onFinish={handleFinishFinanceiro} />
          </div>
        )}

        {/* RESULTADO FINAL */}
        {etapa === "resultado-final" && (
          <div className="py-8 max-w-3xl mx-auto">
            {/* Score Geral */}
            <div className="text-center mb-12">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-xl mb-6">
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">{porcentagemTotal}%</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Seu Diagnóstico Estratégico</h1>
              <p className="text-gray-600">Pontuação total: {totalScore} de 36 pontos</p>
            </div>

            {/* Cards dos 3 níveis */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <p className="text-sm text-purple-600 font-medium mb-1">Bio</p>
                <p className="text-xl font-bold text-gray-900">{getNivelBio(scores.bio)}</p>
                <p className="text-sm text-gray-500 mt-1">{scores.bio}/12 pontos</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <p className="text-sm text-blue-600 font-medium mb-1">Consciência</p>
                <p className="text-xl font-bold text-gray-900">{getNivelConsciencia(scores.consciencia)}</p>
                <p className="text-sm text-gray-500 mt-1">{scores.consciencia}/12 pontos</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <p className="text-sm text-emerald-600 font-medium mb-1">Financeiro</p>
                <p className="text-xl font-bold text-gray-900">{getNivelFinanceiro(scores.financeiro)}</p>
                <p className="text-sm text-gray-500 mt-1">{scores.financeiro}/12 pontos</p>
              </div>
            </div>

            {/* Diagnóstico da IA */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600">✨</span>
                </span>
                Análise Personalizada
              </h3>
              
              {isLoadingIA ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Gerando seu diagnóstico...</span>
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  {diagnosticoIA.split('\n\n').map((paragrafo, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                      {paragrafo.split('**').map((parte, j) => 
                        j % 2 === 1 ? <strong key={j}>{parte}</strong> : parte
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Pronta para transformar esse diagnóstico em ação?</h3>
              <p className="text-purple-100 mb-6 max-w-lg mx-auto">
                O Elevare foi criado para resolver exatamente os pontos que você viu aqui. IA aplicada à sua estratégia, conteúdo e vendas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 rounded-xl font-semibold bg-white text-purple-700 hover:bg-gray-100 transition-all"
                >
                  Começar com Trial de 30 dias
                </button>
                <button
                  onClick={() => setEtapa("captura-lead")}
                  className="px-8 py-4 rounded-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all"
                >
                  Receber diagnóstico por email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CAPTURA DE LEAD */}
        {etapa === "captura-lead" && (
          <div className="py-8 max-w-lg mx-auto text-center">
            {!leadSaved ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Receba seu diagnóstico completo
                </h2>
                <p className="text-gray-600 mb-8">
                  Enviaremos o diagnóstico detalhado + dicas exclusivas para o email ou WhatsApp que preferir.
                </p>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveLead}
                  disabled={!email && !whatsapp}
                  className="
                    w-full mt-6 py-4 px-8 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-purple-700
                    hover:from-purple-700 hover:to-purple-800
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  Enviar diagnóstico
                </button>
              </>
            ) : (
              <div className="py-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Enviado!</h2>
                <p className="text-gray-600 mb-8">
                  Você receberá seu diagnóstico completo em instantes.
                </p>
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all"
                >
                  Criar conta no Elevare
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
