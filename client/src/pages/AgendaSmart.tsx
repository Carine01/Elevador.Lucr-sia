import ElevareDashboardLayout from "@/components/ElevareDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  DollarSign,
  Plus,
  Clock,
  User,
  Trash2,
  Edit,
  TrendingUp,
  Target,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Agendamento {
  id: string;
  clienteNome: string;
  procedimento: string;
  valor: number;
  data: string;
  horario: string;
  status: "confirmado" | "pendente" | "realizado" | "cancelado" | "remarcado";
  observacoes?: string;
}

const statusConfig = {
  confirmado: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Confirmado ✓" },
  pendente: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pendente" },
  realizado: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Realizado 💰" },
  cancelado: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Cancelado" },
  remarcado: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Remarcado" },
};

// Dados de exemplo
const mockAgendamentos: Agendamento[] = [
  {
    id: "1",
    clienteNome: "Maria Silva",
    procedimento: "Harmonização Facial",
    valor: 2500,
    data: "2024-12-23",
    horario: "09:00",
    status: "confirmado",
  },
  {
    id: "2",
    clienteNome: "Ana Costa",
    procedimento: "Limpeza de Pele",
    valor: 180,
    data: "2024-12-23",
    horario: "10:30",
    status: "confirmado",
  },
  {
    id: "3",
    clienteNome: "Carla Santos",
    procedimento: "Peeling",
    valor: 350,
    data: "2024-12-23",
    horario: "14:00",
    status: "pendente",
  },
  {
    id: "4",
    clienteNome: "Fernanda Lima",
    procedimento: "Botox",
    valor: 1200,
    data: "2024-12-24",
    horario: "09:00",
    status: "confirmado",
  },
  {
    id: "5",
    clienteNome: "Julia Oliveira",
    procedimento: "Preenchimento Labial",
    valor: 800,
    data: "2024-12-24",
    horario: "11:00",
    status: "pendente",
  },
  {
    id: "6",
    clienteNome: "Patrícia Almeida",
    procedimento: "Harmonização Facial",
    valor: 2500,
    data: "2024-12-20",
    horario: "09:00",
    status: "realizado",
  },
  {
    id: "7",
    clienteNome: "Renata Souza",
    procedimento: "Bioestimulador",
    valor: 3500,
    data: "2024-12-19",
    horario: "14:00",
    status: "realizado",
  },
];

export default function AgendaSmart() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(mockAgendamentos);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"dia" | "semana" | "mes">("semana");
  const [metaMensal, setMetaMensal] = useState(25000);

  // Form state
  const [formData, setFormData] = useState({
    clienteNome: "",
    procedimento: "",
    valor: "",
    data: selectedDate,
    horario: "09:00",
    observacoes: "",
  });

  // Cálculos financeiros
  const hoje = new Date().toISOString().split('T')[0];
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const agendamentosDoMes = agendamentos.filter(a => {
    const d = new Date(a.data);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  const faturamentoRealizado = agendamentosDoMes
    .filter(a => a.status === "realizado")
    .reduce((acc, a) => acc + a.valor, 0);

  const faturamentoPrevisto = agendamentosDoMes
    .filter(a => a.status === "confirmado" || a.status === "pendente")
    .reduce((acc, a) => acc + a.valor, 0);

  const faturamentoTotal = faturamentoRealizado + faturamentoPrevisto;
  const progressoMeta = Math.min((faturamentoTotal / metaMensal) * 100, 100);

  const agendamentosDoDia = agendamentos
    .filter(a => a.data === selectedDate)
    .sort((a, b) => a.horario.localeCompare(b.horario));

  const faturamentoDoDia = agendamentosDoDia
    .filter(a => a.status !== "cancelado")
    .reduce((acc, a) => acc + a.valor, 0);

  // Obter dias da semana atual
  const getWeekDays = (date: Date) => {
    const week = [];
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    for (let i = 0; i < 7; i++) {
      week.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return week;
  };

  const weekDays = getWeekDays(new Date(selectedDate));

  const handleSubmit = () => {
    if (!formData.clienteNome || !formData.procedimento || !formData.valor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newAgendamento: Agendamento = {
      id: Date.now().toString(),
      clienteNome: formData.clienteNome,
      procedimento: formData.procedimento,
      valor: parseFloat(formData.valor),
      data: formData.data,
      horario: formData.horario,
      status: "pendente",
      observacoes: formData.observacoes,
    };

    setAgendamentos([...agendamentos, newAgendamento]);
    toast.success("Agendamento criado!");
    setShowForm(false);
    setFormData({
      clienteNome: "",
      procedimento: "",
      valor: "",
      data: selectedDate,
      horario: "09:00",
      observacoes: "",
    });
  };

  const handleStatusChange = (id: string, newStatus: Agendamento["status"]) => {
    setAgendamentos(agendamentos.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (newStatus === "realizado") {
      toast.success("Procedimento marcado como realizado! 💰");
    } else {
      toast.success("Status atualizado!");
    }
  };

  const handleDelete = (id: string) => {
    setAgendamentos(agendamentos.filter(a => a.id !== id));
    toast.success("Agendamento removido");
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <ElevareDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Agenda Smart</h1>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
          <p className="text-slate-400 mt-2">
            Visualize seu faturamento diário, semanal e mensal. Acompanhe suas metas em tempo real.
          </p>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <p className="text-slate-400 text-sm">Realizado (Mês)</p>
            </div>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(faturamentoRealizado)}</p>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <p className="text-slate-400 text-sm">Previsto (Mês)</p>
            </div>
            <p className="text-2xl font-bold text-amber-400">{formatCurrency(faturamentoPrevisto)}</p>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-violet-400" />
              <p className="text-slate-400 text-sm">Meta Mensal</p>
            </div>
            <p className="text-2xl font-bold text-violet-400">{formatCurrency(metaMensal)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <p className="text-slate-300 text-sm">Progresso</p>
            </div>
            <p className="text-2xl font-bold text-white">{progressoMeta.toFixed(0)}%</p>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all" 
                style={{ width: `${progressoMeta}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")} className="border-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white font-medium">
              {weekDays[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")} className="border-slate-600">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedDate(hoje)}
            className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
          >
            Hoje
          </Button>
        </div>

        {/* Week View */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {weekDays.map((day) => {
            const dateStr = day.toISOString().split('T')[0];
            const dayAgendamentos = agendamentos.filter(a => a.data === dateStr && a.status !== "cancelado");
            const dayTotal = dayAgendamentos.reduce((acc, a) => acc + a.valor, 0);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === hoje;

            return (
              <Card 
                key={dateStr}
                className={`cursor-pointer transition-all p-3 ${
                  isSelected 
                    ? 'bg-violet-500/20 border-violet-500' 
                    : isToday 
                      ? 'bg-slate-800/70 border-violet-500/50' 
                      : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedDate(dateStr)}
              >
                <p className={`text-xs ${isToday ? 'text-violet-400' : 'text-slate-400'}`}>
                  {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {day.getDate()}
                </p>
                <div className="mt-2">
                  <p className="text-xs text-slate-500">{dayAgendamentos.length} agend.</p>
                  <p className={`text-sm font-medium ${dayTotal > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                    {dayTotal > 0 ? formatCurrency(dayTotal) : '-'}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Day Detail */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Previsão:</span>
              <span className="text-xl font-bold text-green-400">{formatCurrency(faturamentoDoDia)}</span>
            </div>
          </div>

          {agendamentosDoDia.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">Nenhum agendamento</h3>
              <p className="text-slate-500 mb-4">Não há agendamentos para este dia</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFormData({ ...formData, data: selectedDate });
                  setShowForm(true);
                }}
                className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Agendamento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {agendamentosDoDia.map((agendamento) => (
                <div 
                  key={agendamento.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    agendamento.status === "cancelado" 
                      ? 'bg-slate-900/30 border-slate-700 opacity-50' 
                      : 'bg-slate-900/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="text-white font-medium">{agendamento.horario}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium">{agendamento.clienteNome}</span>
                        <Badge className={statusConfig[agendamento.status].color}>
                          {statusConfig[agendamento.status].label}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{agendamento.procedimento}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-bold ${
                      agendamento.status === "realizado" ? 'text-green-400' : 'text-white'
                    }`}>
                      {formatCurrency(agendamento.valor)}
                    </span>

                    <Select 
                      value={agendamento.status} 
                      onValueChange={(v) => handleStatusChange(agendamento.id, v as Agendamento["status"])}
                    >
                      <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="realizado">✓ Realizado</SelectItem>
                        <SelectItem value="remarcado">Remarcado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDelete(agendamento.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Add Agendamento Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-700 p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Novo Agendamento</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Nome da Cliente *</Label>
                  <Input
                    value={formData.clienteNome}
                    onChange={(e) => setFormData({...formData, clienteNome: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Nome completo"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Procedimento *</Label>
                  <Input
                    value={formData.procedimento}
                    onChange={(e) => setFormData({...formData, procedimento: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ex: Harmonização Facial"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Valor (R$) *</Label>
                    <Input
                      type="number"
                      value={formData.valor}
                      onChange={(e) => setFormData({...formData, valor: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Horário</Label>
                    <Select value={formData.horario} onValueChange={(v) => setFormData({...formData, horario: v})}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 11 }, (_, i) => {
                          const hour = 8 + i;
                          return [`${hour}:00`, `${hour}:30`];
                        }).flat().map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white">Data</Label>
                  <Input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowForm(false)} className="border-slate-600">
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-violet-500 hover:bg-violet-600">
                  Adicionar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ElevareDashboardLayout>
  );
}
