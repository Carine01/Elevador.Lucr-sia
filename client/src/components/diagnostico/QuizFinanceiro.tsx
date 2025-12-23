import { useState } from "react";

const perguntas = [
  {
    pergunta: "Você sabe exatamente quanto precisa faturar por mês para cobrir custos e ter lucro?",
    opcoes: [
      { texto: "Não tenho essa conta clara", pontos: 1 },
      { texto: "Tenho uma ideia, mas não é preciso", pontos: 2 },
      { texto: "Sim, com margem definida", pontos: 3 }
    ]
  },
  {
    pergunta: "Seu ticket médio:",
    opcoes: [
      { texto: "Varia muito — depende do dia", pontos: 1 },
      { texto: "É razoável, mas poderia ser maior", pontos: 2 },
      { texto: "É calculado e estratégico", pontos: 3 }
    ]
  },
  {
    pergunta: "Quando você pensa em aumentar o faturamento:",
    opcoes: [
      { texto: "Só consigo pensar em mais clientes", pontos: 1 },
      { texto: "Penso em promoções e combos", pontos: 2 },
      { texto: "Aumento ticket ou recorrência", pontos: 3 }
    ]
  },
  {
    pergunta: "Você separa seu dinheiro pessoal do da clínica?",
    opcoes: [
      { texto: "Está tudo misturado", pontos: 1 },
      { texto: "Tento separar, mas às vezes misturo", pontos: 2 },
      { texto: "Completamente separado, com pró-labore", pontos: 3 }
    ]
  }
];

interface QuizFinanceiroProps {
  onFinish: (score: number, respostas: number[]) => void;
}

export default function QuizFinanceiro({ onFinish }: QuizFinanceiroProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const responder = (pontos: number, opcaoIndex: number) => {
    setSelectedOption(opcaoIndex);
    
    setTimeout(() => {
      const novoScore = score + pontos;
      const novasRespostas = [...respostas, opcaoIndex];
      
      setScore(novoScore);
      setRespostas(novasRespostas);
      setSelectedOption(null);

      if (index + 1 < perguntas.length) {
        setIndex(index + 1);
      } else {
        onFinish(novoScore, novasRespostas);
      }
    }, 300);
  };

  const progresso = ((index + 1) / perguntas.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          Nível 3 — Financeiro
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Pergunta {index + 1} de {perguntas.length}</span>
          <span>{Math.round(progresso)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
          {perguntas[index].pergunta}
        </h2>
      </div>

      {/* Opções */}
      <div className="space-y-4">
        {perguntas[index].opcoes.map((opcao, i) => (
          <button
            key={i}
            onClick={() => responder(opcao.pontos, i)}
            disabled={selectedOption !== null}
            className={`
              w-full p-5 text-left rounded-xl border-2 transition-all duration-200
              ${selectedOption === i 
                ? 'border-emerald-500 bg-emerald-50 scale-[0.98]' 
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
              }
              ${selectedOption !== null && selectedOption !== i ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${selectedOption === i 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-gray-800 font-medium">{opcao.texto}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
