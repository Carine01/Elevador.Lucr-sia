import ElevareDashboardLayout from "@/components/ElevareDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  Sparkles,
  Target,
  Heart,
  MessageCircle,
  TrendingUp,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PostSugestao {
  id: string;
  data: string;
  tipo: "autoridade" | "desejo" | "fechamento" | "conexao";
  titulo: string;
  descricao: string;
  legenda: string;
  hashtags: string;
  melhorHorario: string;
}

const tipoConfig = {
  autoridade: { 
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30", 
    icon: Crown, 
    label: "Autoridade",
    descricao: "Posiciona você como referência"
  },
  desejo: { 
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30", 
    icon: Heart, 
    label: "Desejo",
    descricao: "Desperta vontade de agendar"
  },
  fechamento: { 
    color: "bg-green-500/20 text-green-400 border-green-500/30", 
    icon: Target, 
    label: "Fechamento",
    descricao: "Converte em agendamento"
  },
  conexao: { 
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30", 
    icon: MessageCircle, 
    label: "Conexão",
    descricao: "Cria relacionamento"
  },
};

// Calendário com sugestões pré-definidas
const gerarSugestoesSemana = (startDate: Date): PostSugestao[] => {
  const sugestoes: PostSugestao[] = [];
  const conteudos = [
    {
      tipo: "autoridade" as const,
      titulo: "Antes e Depois com Explicação Técnica",
      descricao: "Mostre um resultado real e explique o que foi feito tecnicamente. Isso posiciona você como especialista.",
      legenda: "Resultado de [PROCEDIMENTO] após [X] sessões.\n\nO que fizemos:\n✅ [Técnica 1]\n✅ [Técnica 2]\n✅ [Técnica 3]\n\nCada pele é única e merece um protocolo personalizado.\n\n📲 Quer saber qual o ideal para você? Me chama no direct.",
      hashtags: "#esteticaavancada #resultadosreais #harmonizacaofacial #esteticista",
      melhorHorario: "19:00"
    },
    {
      tipo: "desejo" as const,
      titulo: "Transformação Emocional",
      descricao: "Mostre o impacto emocional do procedimento. O que a cliente sentiu, como se viu diferente.",
      legenda: "Ela chegou insegura.\nSaiu se sentindo linda.\n\nIsso não é só estética.\nÉ autoestima. É confiança. É se olhar no espelho e gostar do que vê.\n\n✨ Você também merece se sentir assim.\n\n📲 Vem conversar comigo.",
      hashtags: "#transformacao #autoestima #estetica #beleza",
      melhorHorario: "12:00"
    },
    {
      tipo: "fechamento" as const,
      titulo: "Oferta com Escassez Real",
      descricao: "Última vaga, condição especial, prazo limitado. Use escassez REAL.",
      legenda: "🚨 ÚLTIMA VAGA DESSA SEMANA\n\nSó consegui encaixar mais 1 horário para [PROCEDIMENTO].\n\n📅 [DIA] às [HORÁRIO]\n\n💰 Condição especial: [VALOR ou BENEFÍCIO]\n\nQuem garantir primeiro, leva.\n\n📲 Comenta \"EU QUERO\" ou me chama no direct.",
      hashtags: "#ultimavaga #agendaaberta #estetica",
      melhorHorario: "10:00"
    },
    {
      tipo: "conexao" as const,
      titulo: "Bastidores do Dia a Dia",
      descricao: "Mostre sua rotina, sua preparação, seu espaço. Humanize sua marca.",
      legenda: "Um dia normal aqui na clínica:\n\n☕ Café antes de tudo\n📋 Revisão das fichas do dia\n✨ Cada detalhe pensado para você\n\nNão é só atender.\nÉ cuidar de cada cliente como única.\n\n💜 Assim é o meu dia a dia.",
      hashtags: "#rotina #esteticista #bastidores #diadeclínica",
      melhorHorario: "08:00"
    },
    {
      tipo: "autoridade" as const,
      titulo: "Mito vs Verdade",
      descricao: "Desmistifique algo comum. Posicione-se como quem sabe do que fala.",
      legenda: "❌ MITO: \"[Crença comum errada]\"\n\n✅ VERDADE: [Explicação correta]\n\nMuita gente ainda acredita nisso e acaba [consequência negativa].\n\nNa minha clínica, faço diferente porque [seu diferencial].\n\n📲 Tem dúvidas? Me pergunta aqui.",
      hashtags: "#mitoeverdade #esteticaconsciente #educacao",
      melhorHorario: "20:00"
    },
    {
      tipo: "desejo" as const,
      titulo: "Depoimento de Cliente",
      descricao: "Print de mensagem real ou vídeo curto de cliente satisfeita.",
      legenda: "Mensagens assim que fazem meu dia valer a pena 🥹\n\n[Inserir print ou citação]\n\nVer minha cliente feliz é o maior pagamento que existe.\n\n✨ Quer ter um resultado assim também?\n\n📲 Vem conversar comigo.",
      hashtags: "#depoimento #resultados #clientesatisfeita",
      melhorHorario: "18:00"
    },
    {
      tipo: "fechamento" as const,
      titulo: "CTA Direto - Agenda da Semana",
      descricao: "Post direto para preencher agenda. Sem rodeios.",
      legenda: "📅 AGENDA DA SEMANA ABERTA\n\nHorários disponíveis para [PROCEDIMENTO]:\n\n🗓 Segunda: [horário]\n🗓 Terça: [horário]\n🗓 Quarta: [horário]\n\n💜 Escolhe o seu e me chama.\n\nNão deixa pra depois. Agenda lota rápido.",
      hashtags: "#agendaaberta #horariodisponivel #estetica",
      melhorHorario: "09:00"
    },
  ];

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  for (let i = 0; i < 7; i++) {
    const data = new Date(startDate);
    data.setDate(data.getDate() + i);
    const conteudo = conteudos[i % conteudos.length];
    
    sugestoes.push({
      id: `${data.toISOString()}-${i}`,
      data: data.toISOString().split('T')[0],
      ...conteudo,
    });
  }
  
  return sugestoes;
};

export default function CalendarioEstrategico() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  
  const [sugestoes] = useState<PostSugestao[]>(() => gerarSugestoesSemana(currentWeekStart));
  const [selectedPost, setSelectedPost] = useState<PostSugestao | null>(null);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const hoje = new Date().toISOString().split('T')[0];

  const copiarLegenda = (legenda: string, hashtags: string) => {
    navigator.clipboard.writeText(`${legenda}\n\n${hashtags}`);
    toast.success("Legenda copiada! Cole no Instagram.");
  };

  return (
    <ElevareDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Calendário de Conteúdo e Vendas</h1>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 mt-2">
            Sugestões prontas do que postar, quando postar e com que intenção. Sem depender de criatividade diária.
          </p>
        </div>

        {/* Legenda dos tipos */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {Object.entries(tipoConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Card key={key} className={`p-3 ${config.color} border`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{config.label}</span>
                </div>
                <p className="text-xs opacity-80 mt-1">{config.descricao}</p>
              </Card>
            );
          })}
        </div>

        {/* Navegação da Semana */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")} className="border-slate-600">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Semana Anterior
          </Button>
          <span className="text-white font-medium">
            {weekDays[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} — {weekDays[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek("next")} className="border-slate-600">
            Próxima Semana
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Grade Semanal */}
        <div className="grid grid-cols-7 gap-3 mb-8">
          {weekDays.map((day, idx) => {
            const dateStr = day.toISOString().split('T')[0];
            const sugestao = sugestoes[idx];
            const TipoIcon = tipoConfig[sugestao?.tipo]?.icon || Sparkles;
            const isToday = dateStr === hoje;
            
            return (
              <Card 
                key={dateStr}
                className={`cursor-pointer transition-all p-4 ${
                  isToday 
                    ? 'bg-pink-500/10 border-pink-500' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
                onClick={() => setSelectedPost(sugestao)}
              >
                <div className="text-center mb-3">
                  <p className={`text-xs ${isToday ? 'text-pink-400' : 'text-slate-500'}`}>
                    {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className={`text-xl font-bold ${isToday ? 'text-white' : 'text-slate-300'}`}>
                    {day.getDate()}
                  </p>
                </div>
                
                {sugestao && (
                  <div className={`p-2 rounded-lg ${tipoConfig[sugestao.tipo].color} border`}>
                    <div className="flex items-center gap-1 mb-1">
                      <TipoIcon className="w-3 h-3" />
                      <span className="text-xs font-semibold">{tipoConfig[sugestao.tipo].label}</span>
                    </div>
                    <p className="text-xs line-clamp-2">{sugestao.titulo}</p>
                    <p className="text-xs opacity-70 mt-1">⏰ {sugestao.melhorHorario}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Detalhe do Post Selecionado */}
        {selectedPost && (
          <Card className="bg-slate-800/70 border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className={tipoConfig[selectedPost.tipo].color}>
                  {tipoConfig[selectedPost.tipo].label}
                </Badge>
                <h2 className="text-xl font-bold text-white mt-2">{selectedPost.titulo}</h2>
                <p className="text-slate-400 mt-1">{selectedPost.descricao}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Melhor horário</p>
                <p className="text-lg font-bold text-pink-400">{selectedPost.melhorHorario}</p>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 mb-4">
              <p className="text-sm text-slate-500 mb-2 font-semibold">📝 LEGENDA PRONTA:</p>
              <p className="text-white whitespace-pre-line text-sm leading-relaxed">
                {selectedPost.legenda}
              </p>
              <p className="text-blue-400 text-xs mt-4">
                {selectedPost.hashtags}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => copiarLegenda(selectedPost.legenda, selectedPost.hashtags)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Legenda Completa
              </Button>
              <Button variant="outline" className="border-slate-600" onClick={() => setSelectedPost(null)}>
                Fechar
              </Button>
            </div>
          </Card>
        )}

        {/* Dica */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-4 mt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">Dica de Ouro</p>
              <p className="text-slate-400 text-sm mt-1">
                Alterne entre posts de <strong>Autoridade</strong>, <strong>Desejo</strong> e <strong>Fechamento</strong>. 
                Não venda o tempo todo — primeiro gere valor, depois converta.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ElevareDashboardLayout>
  );
}
