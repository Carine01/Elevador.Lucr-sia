import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const BANNER_DELAY_MS = 1000;

/**
 * Banner de Consentimento de Cookies - LGPD Compliance
 * Exibe na primeira visita e salva preferência no localStorage
 */
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      // Delay de 1s para não ser intrusivo
      setTimeout(() => setShow(true), BANNER_DELAY_MS);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("cookiesAcceptedDate", new Date().toISOString());
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookiesAccepted", "false");
    localStorage.setItem("cookiesAcceptedDate", new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4 z-[9999] animate-fade-in shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Texto */}
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
              🍪 Cookies e Privacidade
            </h3>
            <p className="text-sm text-slate-300">
              Usamos cookies essenciais para autenticação e melhorar sua experiência. 
              Ao continuar navegando, você concorda com nossa{" "}
              <a 
                href="/privacy" 
                className="text-amber-400 hover:text-amber-300 underline font-medium"
              >
                Política de Privacidade
              </a>
              {" "}e com o uso de cookies.
            </p>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Button
              onClick={handleReject}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Recusar
            </Button>
            <Button 
              onClick={handleAccept}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6"
            >
              Aceitar Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
