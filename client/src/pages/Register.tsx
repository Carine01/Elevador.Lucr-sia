import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Sparkles, Check } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!acceptTerms) {
      toast.error("Aceite os termos de uso para continuar");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    
    // Simular registro - depois conectar com backend
    setTimeout(() => {
      toast.success("Conta criada! Redirecionando...");
      // Redirecionar para OAuth do Google
      window.location.href = "/api/auth/google";
    }, 1000);
  };

  const handleGoogleRegister = () => {
    window.location.href = "/api/auth/google";
  };

  const benefits = [
    "Radar de Bio gratuito",
    "3 créditos para testar",
    "Acesso ao Dashboard",
    "Suporte por email",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6">
        <Button variant="ghost" className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </Link>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Benefits Section */}
        <div className="hidden md:block">
          <h2 className="text-3xl font-bold text-white mb-4">
            Comece sua jornada com a Elevare
          </h2>
          <p className="text-slate-400 mb-8">
            Transforme seu Instagram em uma máquina de clientes com IA e NeuroVendas.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-300">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <p className="text-slate-300 italic">
              "Comecei a receber leads qualificados na mesma semana."
            </p>
            <p className="text-sm text-slate-500 mt-2">— Sherlayne Galvane</p>
          </div>
        </div>

        {/* Register Form */}
        <Card className="w-full bg-slate-800/50 border-slate-700 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Criar conta grátis</h1>
            <p className="text-slate-400 mt-2">Comece a usar a Elevare agora</p>
          </div>

          {/* Google Register Button */}
          <Button 
            onClick={handleGoogleRegister}
            className="w-full mb-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-6"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Cadastrar com Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-slate-400">ou cadastre com email</span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input 
                type="text"
                placeholder="Seu nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 py-6"
              />
            </div>
            <div>
              <Input 
                type="email"
                placeholder="Seu email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 py-6"
              />
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha (mínimo 6 caracteres)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 py-6 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                  acceptTerms 
                    ? "bg-amber-500 border-amber-500" 
                    : "border-slate-600 hover:border-slate-500"
                }`}
              >
                {acceptTerms && <Check className="w-3 h-3 text-white" />}
              </button>
              <p className="text-sm text-slate-400">
                Li e aceito os{" "}
                <a href="#" className="text-amber-500 hover:text-amber-400">Termos de Uso</a>
                {" "}e a{" "}
                <a href="#" className="text-amber-500 hover:text-amber-400">Política de Privacidade</a>
              </p>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6"
            >
              {isLoading ? "Criando conta..." : "Criar minha conta"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-amber-500 hover:text-amber-400 font-semibold">
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
