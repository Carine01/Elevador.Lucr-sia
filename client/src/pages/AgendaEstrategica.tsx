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
  TrendingUp,
  Target,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type Agendamento = {
  id: number;
  userId: number;
  leadId: number | null;
  clienteNome: string;
  procedimento: string;
  valor: number;
  data: string;
  horario: string;
  status: "confirmado" | "pendente" | "realizado" | "cancelado" | "remarcado";
  observacoes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const statusConfig = {
  confirmado: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Confirmado ✓" },
  pendente: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pendente" },
  realizado: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Realizado 💰" },
  cancelado: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Cancelado" },
  remarcado: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Remarcado" },
};

export default function AgendaEstrategica() {
  // ========== TRPC QUERIES & MUTATIONS ==========
  const utils = trpc.useUtils();
  
  const { data: agendamentosData, isLoading, refetch } = trpc.crm.getAgendamentos.useQuery({
    limit: 100,
  });
  
  const { data: statsData } = trpc.crm.getCrmStats.useQuery();

  const createAgendamentoMutation = trpc.crm.createAgendamento.useMutation({
    onSuccess: () => {
      toast.success("Agendamento criado!");
      utils.crm.getAgendamentos.invalidate();
      utils.crm.getCrmStats.invalidate();
      setShowForm(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const updateAgendamentoMutation = trpc.crm.updateAgendamento.useMutation({
    onSuccess: (_, variables) => {
      if (variables.status === "realizado") {
        toast.success("Procedimento marcado como realizado! 💰");
      } else {
        toast.success("Status atualizado!");
      }
      utils.crm.getAgendamentos.invalidate();
      utils.crm.getCrmStats.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteAgendamentoMutation = trpc.crm.deleteAgendamento.useMutation({
    onSuccess: () => {
      toast.success("Agendamento removido");
      utils.crm.getAgendamentos.invalidate();
      utils.crm.getCrmStats.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // ========== LOCAL STATE ==========
  const hoje = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(hoje);
  const [showForm, setShowForm] = useState(false);
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

  const agendamentos = agendamentosData?.agendamentos || [];
  const stats = statsData?.stats;

  // Cálculos financeiros
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const agendamentosDoMes = agendamentos.filter((a: Agendamento) => {
    const d = new Date(a.data);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  const faturamentoRealizado = agendamentosDoMes
    .filter((a: Agendamento) => a.status === "realizado")
    .reduce((acc: number, a: Agendamento) => acc + a.valor, 0);

  const faturamentoPrevisto = agendamentosDoMes
    .filter((a: Agendamento) => a.status === "confirmado" || a.status === "pendente")
    .reduce((acc: number, a: Agendamento) => acc + a.valor, 0);

  const faturamentoTotal = faturamentoRealizado + faturamentoPrevisto;
  const progressoMeta = Math.min((faturamentoTotal / (metaMensal * 100)) * 100, 100);

  const agendamentosDoDia = agendamentos
    .filter((a: Agendamento) => a.data === selectedDate)
    .sort((a: Agendamento, b: Agendamento) => a.horario.localeCompare(b.horario));

  const faturamentoDoDia = agendamentosDoDia
    .filter((a: Agendamento) => a.status !== "cancelado")
    .reduce((acc: number, a: Agendamento) => acc + a.valor, 0);

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

  const resetForm = () => {
    setFormData({
      clienteNome: "",
      procedimento: "",
      valor: "",
      data: selectedDate,
      horario: "09:00",
      observacoes: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.clienteNome || !formData.procedimento || !formData.valor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createAgendamentoMutation.mutate({
      clienteNome: formData.clienteNome,
      procedimento: formData.procedimento,
      valor: Math.round(parseFloat(formData.valor) * 100), // Converter para centavos
      data: formData.data,
      horario: formData.horario,
      observacoes: formData.observacoes || undefined,
    });
  };

  const handleStatusChange = (id: number, newStatus: Agendamento["status"]) => {
    updateAgendamentoMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este agendamento?")) {
      deleteAgendamentoMutation.mutate({ id });
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formatCurrency = (value: number) => {
    // Valor vem em centavos, converter para reais
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
  };

  if (isLoading) {
    return (
      <ElevareDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-3 text-slate-400">Carregando agenda...</span>
        </div>
      </ElevareDashboardLayout>
    );
  }

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
                <h1 className="text-3xl font-bold text-white">Agenda Estratégica de Faturamento</h1>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="border-slate-600"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  setFormData({ ...formData, data: selectedDate });
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>
          <p className="text-slate-400 mt-2">
            Organize sua agenda para vender mais, reduzir faltas e priorizar procedimentos de maior ticket.
            <span className="text-emerald-400 ml-2">✓ Dados salvos no banco</span>
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
            <p className="text-2xl font-bold text-violet-400">{formatCurrency(metaMensal * 100)}</p>
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
            const dayAgendamentos = agendamentos.filter((a: Agendamento) => a.data === dateStr && a.status !== "cancelado");
            const dayTotal = dayAgendamentos.reduce((acc: number, a: Agendamento) => acc + a.valor, 0);
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
              {agendamentosDoDia.map((agendamento: Agendamento) => (
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
                      disabled={deleteAgendamentoMutation.isPending}
                    >
                      {deleteAgendamentoMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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
                          return [`${hour.toString().padStart(2, '0')}:00`, `${hour.toString().padStart(2, '0')}:30`];
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
                <Button 
                  onClick={handleSubmit} 
                  className="bg-violet-500 hover:bg-violet-600"
                  disabled={createAgendamentoMutation.isPending}
                >
                  {createAgendamentoMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
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
