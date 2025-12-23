import { useState } from "react";

const perguntas = [
  {
    pergunta: "Suas clientes costumam:",
    opcoes: [
      { texto: "Perguntar preço antes de tudo", pontos: 1 },
      { texto: "Pedir indicação de procedimento", pontos: 2 },
      { texto: "Confiar na sua recomendação", pontos: 3 }
    ]
  },
  {
    pergunta: "Quando você indica um tratamento mais completo:",
    opcoes: [
      { texto: "Elas acham caro", pontos: 1 },
      { texto: "Pedem para pensar", pontos: 2 },
      { texto: "Aceitam porque confiam em você", pontos: 3 }
    ]
  },
  {
    pergunta: "Suas clientes entendem a diferença entre:",
    opcoes: [
      { texto: "Nada — só querem desconto", pontos: 1 },
      { texto: "Procedimentos básicos", pontos: 2 },
      { texto: "Protocolos e resultados de longo prazo", pontos: 3 }
    ]
  },
  {
    pergunta: "Quando você fala sobre valor (não preço):",
    opcoes: [
      { texto: "Elas ignoram e focam no custo", pontos: 1 },
      { texto: "Escutam, mas ainda comparam", pontos: 2 },
      { texto: "Valorizam e pagam sem questionar", pontos: 3 }
    ]
  }
];

interface QuizConscienciaProps {
  onFinish: (score: number, respostas: number[]) => void;
}

export default function QuizConsciencia({ onFinish }: QuizConscienciaProps) {
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
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Nível 2 — Consciência
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
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
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
                ? 'border-blue-500 bg-blue-50 scale-[0.98]' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
              }
              ${selectedOption !== null && selectedOption !== i ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${selectedOption === i 
                  ? 'bg-blue-500 text-white' 
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
