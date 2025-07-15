import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Package,
  Target,
} from "lucide-react";
import VisaoGeral from "./pages/VisaoGeral";
import DesempenhoPrevisao from "./pages/DesempenhoPrevisao";
import EstoqueVitrine from "./pages/EstoqueVitrine";
import MapeOperacional from "./pages/MapeOperacional";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      id: "visao-geral",
      title: "Visão Geral",
      subtitle: "Filtros e Análise Temporal",
      icon: BarChart3,
      component: VisaoGeral,
    },
    {
      id: "desempenho-previsao",
      title: "Previsão e Atendimento",
      subtitle: "Desempenho Operacional",
      icon: TrendingUp,
      component: DesempenhoPrevisao,
    },
    {
      id: "estoque-vitrine",
      title: "Estoque e Vitrine",
      subtitle: "Gestão de Produtos",
      icon: Package,
      component: EstoqueVitrine,
    },
    {
      id: "mape-operacional",
      title: "MAPE Operacional",
      subtitle: "Análise de Precisão",
      icon: Target,
      component: MapeOperacional,
    },
  ];

  const CurrentPageComponent = pages[currentPage].component;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-pulse-dark">
          {/* Header with PulseMinds branding and navigation */}
          <header className="bg-card border-b border-border">
            <div className="flex items-center justify-between px-8 py-4">
              {/* Logo and brand */}
              <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="PulseMinds Logo"
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                PulseMinds
                </h1>
                <p className="text-sm text-muted-foreground">
                Dashboard de Vendas e Estoque
                </p>
              </div>
              </div>

              {/* Page navigation tabs */}
              <nav className="flex-1 max-w-3xl mx-8">
              <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
                {pages.map((page, index) => {
                const Icon = page.icon;
                return (
                  <button
                  key={page.id}
                  onClick={() => setCurrentPage(index)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                    currentPage === index
                    ? "bg-pulse-primary text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  >
                  <Icon className="w-4 h-4" />
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-medium">
                    {page.title}
                    </div>
                    <div className="text-xs opacity-75">
                    {page.subtitle}
                    </div>
                  </div>
                  <div className="lg:hidden text-sm font-medium">
                    {page.title}
                  </div>
                  </button>
                );
                })}
              </div>
              </nav>
            </div>
          </header>

          {/* Page content */}
          <main className="p-8">
            <div className="max-w-[1920px] mx-auto">
              <CurrentPageComponent />
            </div>
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
