import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import RadarBio from "./pages/RadarBio";
import Pricing from "./pages/Pricing";
import EbookGenerator from "./pages/EbookGenerator";
import RoboProdutor from "./pages/RoboProdutor";
import VeoCinema from "./pages/VeoCinema";
import AdsManager from "./pages/AdsManager";
import FluxoClientes from "./pages/FluxoClientes";
import AgendaEstrategica from "./pages/AgendaEstrategica";
import CalendarioEstrategico from "./pages/CalendarioEstrategico";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DiagnosticoElevare from "./pages/DiagnosticoElevare";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import { useAuth } from "@/_core/hooks/useAuth";

// Protected Route wrapper - redirects to login if not authenticated
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-4 animate-pulse">
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-slate-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-4 animate-pulse">
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-slate-400 font-medium">Carregando Elevare...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/radar-bio" component={RadarBio} />
      <Route path="/diagnostico" component={DiagnosticoElevare} />
      
      {/* Protected Routes - redirect to login if not authenticated */}
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/dashboard/radar-bio">{() => <ProtectedRoute component={RadarBio} />}</Route>
      <Route path="/dashboard/ebooks">{() => <ProtectedRoute component={EbookGenerator} />}</Route>
      <Route path="/dashboard/robo-produtor">{() => <ProtectedRoute component={RoboProdutor} />}</Route>
      {/* PRO Routes */}
      <Route path="/dashboard/veo-cinema">{() => <ProtectedRoute component={VeoCinema} />}</Route>
      <Route path="/dashboard/anuncios">{() => <ProtectedRoute component={AdsManager} />}</Route>
      <Route path="/dashboard/fluxo-clientes">{() => <ProtectedRoute component={FluxoClientes} />}</Route>
      <Route path="/dashboard/agenda-estrategica">{() => <ProtectedRoute component={AgendaEstrategica} />}</Route>
      <Route path="/dashboard/calendario">{() => <ProtectedRoute component={CalendarioEstrategico} />}</Route>
      
      {/* Admin Routes */}
      <Route path="/admin">{() => <ProtectedRoute component={AdminDashboard} />}</Route>
      <Route path="/admin/users">{() => <ProtectedRoute component={AdminUsers} />}</Route>
      
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
