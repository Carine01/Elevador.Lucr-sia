import ElevareDashboardLayout from "@/components/ElevareDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, Loader2, Sparkles, Download, Copy, Play, Film, Clapperboard } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function VeoCinema() {
  const [procedimento, setProcedimento] = useState("");
  const [estilo, setEstilo] = useState("cinematografico");
  const [duracao, setDuracao] = useState("30");
  const [objetivo, setObjetivo] = useState("autoridade");
  const [detalhes, setDetalhes] = useState("");
  
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generateMutation = trpc.content.generateContent.useMutation();

  const handleGenerate = async () => {
    if (!procedimento.trim()) {
      toast.error("Digite o nome do procedimento");
      return;
    }

    setGenerating(true);
    setGeneratedScript(null);

    try {
      const prompt = `Você é um roteirista especializado em vídeos cinematográficos para clínicas de estética. 
      
Crie um ROTEIRO CINEMATOGRÁFICO completo para um vídeo de ${duracao} segundos sobre o procedimento "${procedimento}".

ESTILO: ${estilo === "cinematografico" ? "Cinematográfico premium (luz suave, movimentos lentos, sofisticado)" : estilo === "dinamico" ? "Dinâmico e moderno (cortes rápidos, energia)" : "Minimalista e elegante (clean, foco no essencial)"}

OBJETIVO: ${objetivo === "autoridade" ? "Transmitir autoridade e expertise técnica" : objetivo === "desejo" ? "Gerar desejo e transformação emocional" : "Mostrar resultados e depoimentos"}

${detalhes ? `DETALHES ADICIONAIS: ${detalhes}` : ""}

O roteiro deve incluir:

📹 **ABERTURA (${Math.round(parseInt(duracao) * 0.2)}s)**
- Gancho visual impactante
- Descrição da cena de abertura
- Música/ambiente sugerido

🎬 **DESENVOLVIMENTO (${Math.round(parseInt(duracao) * 0.5)}s)**
- Sequência de cenas detalhada
- Movimentos de câmera sugeridos
- Pontos de destaque do procedimento
- Texto/narração sugerida

✨ **FECHAMENTO (${Math.round(parseInt(duracao) * 0.3)}s)**
- Call-to-action visual
- Texto de encerramento
- Sugestão de logo/contato

🎨 **DIREÇÃO DE ARTE**
- Paleta de cores sugerida
- Iluminação recomendada
- Props e elementos visuais

📝 **LEGENDAS PARA INSTAGRAM**
- 3 opções de legenda para o post

Seja específico e profissional. O roteiro deve ser executável por uma produtora de vídeo.`;

      const result = await generateMutation.mutateAsync({
        type: "video_script",
        prompt,
      });

      setGeneratedScript(result.content);
      toast.success("Roteiro gerado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar roteiro");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  return (
    <ElevareDashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Veo Cinema</h1>
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
            </div>
          </div>
          <p className="text-slate-400">
            Crie roteiros cinematográficos profissionais para seus procedimentos.
            Vídeos que elevam o valor percebido do seu trabalho.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-rose-400" />
              Configurar Roteiro
            </h2>

            <div className="space-y-5">
              <div>
                <Label htmlFor="procedimento" className="text-white mb-2 block">
                  Procedimento / Tratamento *
                </Label>
                <Input
                  id="procedimento"
                  placeholder="Ex: Harmonização Facial, Limpeza de Pele, Peeling..."
                  value={procedimento}
                  onChange={(e) => setProcedimento(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={generating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Estilo Visual</Label>
                  <Select value={estilo} onValueChange={setEstilo} disabled={generating}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematografico">🎬 Cinematográfico Premium</SelectItem>
                      <SelectItem value="dinamico">⚡ Dinâmico e Moderno</SelectItem>
                      <SelectItem value="minimalista">✨ Minimalista Elegante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Duração</Label>
                  <Select value={duracao} onValueChange={setDuracao} disabled={generating}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 segundos (Story)</SelectItem>
                      <SelectItem value="30">30 segundos (Reels)</SelectItem>
                      <SelectItem value="60">60 segundos (Reels longo)</SelectItem>
                      <SelectItem value="90">90 segundos (YouTube Shorts)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Objetivo do Vídeo</Label>
                <Select value={objetivo} onValueChange={setObjetivo} disabled={generating}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autoridade">🎓 Transmitir Autoridade</SelectItem>
                    <SelectItem value="desejo">💫 Gerar Desejo</SelectItem>
                    <SelectItem value="resultados">📊 Mostrar Resultados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="detalhes" className="text-white mb-2 block">
                  Detalhes Adicionais (opcional)
                </Label>
                <Textarea
                  id="detalhes"
                  placeholder="Ex: Foco no antes/depois, mostrar equipamentos, incluir depoimento..."
                  value={detalhes}
                  onChange={(e) => setDetalhes(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  disabled={generating}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !procedimento.trim()}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-6"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Criando Roteiro...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5 mr-2" />
                    Gerar Roteiro Cinematográfico
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Result */}
          <div>
            {generatedScript ? (
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-rose-400" />
                    Roteiro Gerado
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedScript)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <Streamdown>{generatedScript}</Streamdown>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                  <p className="text-rose-300 text-sm">
                    💡 <strong>Dica:</strong> Envie este roteiro para sua produtora de vídeo 
                    ou use como guia para gravar você mesma com o celular.
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-800/30 border-slate-700 border-dashed p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <Film className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  Roteiro aparecerá aqui
                </h3>
                <p className="text-slate-500 max-w-sm">
                  Preencha os dados e clique em gerar para criar um roteiro
                  cinematográfico profissional para seus procedimentos
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-white mb-6">📽️ Exemplos de Uso</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/30 border-slate-700 p-4">
              <h4 className="font-semibold text-white mb-2">Harmonização Facial</h4>
              <p className="text-slate-400 text-sm">Vídeo cinematográfico mostrando o procedimento com luz suave e foco nos detalhes técnicos.</p>
            </Card>
            <Card className="bg-slate-800/30 border-slate-700 p-4">
              <h4 className="font-semibold text-white mb-2">Antes e Depois</h4>
              <p className="text-slate-400 text-sm">Comparativo dramático com transições elegantes e música emocional.</p>
            </Card>
            <Card className="bg-slate-800/30 border-slate-700 p-4">
              <h4 className="font-semibold text-white mb-2">Tour pela Clínica</h4>
              <p className="text-slate-400 text-sm">Apresentação premium do espaço para transmitir sofisticação e confiança.</p>
            </Card>
          </div>
        </div>
      </div>
    </ElevareDashboardLayout>
  );
}
