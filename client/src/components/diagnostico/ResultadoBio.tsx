interface ResultadoBioProps {
  score: number;
  avancar: () => void;
}

export default function ResultadoBio({ score, avancar }: ResultadoBioProps) {
  let nivel = "";
  let mensagem = "";
  let cor = "";
  let icone = "";

  if (score <= 6) {
    nivel = "Bio Invisível";
    mensagem = "Seu Instagram até existe, mas não vende. Você perde clientes antes mesmo da conversa começar. A boa notícia: isso tem solução.";
    cor = "from-red-500 to-orange-500";
    icone = "⚠️";
  } else if (score <= 9) {
    nivel = "Bio Estética, mas Fraca";
    mensagem = "Você atrai curiosas, mas não conduz à decisão. Seu perfil é bonito, porém falta estratégia de conversão.";
    cor = "from-amber-500 to-yellow-500";
    icone = "📊";
  } else {
    nivel = "Bio Magnética";
    mensagem = "Sua bio já trabalha por você. Agora é hora de escalar e otimizar o que já funciona.";
    cor = "from-green-500 to-emerald-500";
    icone = "✨";
  }

  const porcentagem = Math.round((score / 12) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Score Visual */}
      <div className="mb-8">
        <div className={`
          w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${cor}
          flex items-center justify-center shadow-lg
        `}>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{score}</p>
            <p className="text-white/80 text-xs">de 12</p>
          </div>
        </div>
      </div>

      {/* Nível */}
      <div className="mb-6">
        <span className="text-4xl mb-4 block">{icone}</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{nivel}</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
          {mensagem}
        </p>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-8 px-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Invisível</span>
          <span>Estética</span>
          <span>Magnética</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${cor} transition-all duration-1000 ease-out`}
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>

      {/* Insight */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8 text-left">
        <p className="text-sm font-medium text-purple-600 uppercase tracking-wide mb-2">
          O que isso significa
        </p>
        <p className="text-gray-700 leading-relaxed">
          {score <= 6 && "Clientes chegam no seu perfil, mas não entendem por que deveriam escolher você. Não é falta de talento — é falta de posicionamento claro."}
          {score > 6 && score <= 9 && "Você tem presença, mas falta direcionamento estratégico. Sua cliente olha, admira, mas não sente urgência em agendar."}
          {score > 9 && "Você já domina o básico. O próximo passo é transformar autoridade em escala — e fazer sua clínica funcionar mesmo quando você não está no celular."}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={avancar}
        className="
          w-full py-4 px-8 rounded-xl font-semibold text-white
          bg-gradient-to-r from-purple-600 to-purple-700
          hover:from-purple-700 hover:to-purple-800
          transition-all duration-200 shadow-lg hover:shadow-xl
        "
      >
        Avançar para Diagnóstico de Consciência
      </button>

      <p className="mt-4 text-sm text-gray-500">
        Próximo passo: entender o nível de consciência das suas clientes
      </p>
    </div>
  );
}
