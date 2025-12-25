import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { User } from "../../../drizzle/schema";

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  
  const { data: usersData, isLoading } = trpc.admin.getUsers.useQuery({ page, limit: 20 });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const totalPages = Math.ceil((usersData?.total || 0) / 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Usuários</h1>
            <p className="text-slate-400 mt-1">Total: {usersData?.total || 0} usuários</p>
          </div>
          <Button onClick={() => navigate("/admin")} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((u: User) => (
                    <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">{u.id}</td>
                      <td className="py-3 px-4 text-white">{u.name || "—"}</td>
                      <td className="py-3 px-4 text-slate-300">{u.email || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.role === "admin" 
                            ? "bg-purple-500/20 text-purple-300" 
                            : "bg-slate-500/20 text-slate-300"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-400">
                Página {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
