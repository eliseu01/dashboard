import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Database,
  Target,
  Zap,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";

const Cover = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pulse-dark via-pulse-secondary/20 to-pulse-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-pulse-primary/30 rounded-lg rotate-12"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-pulse-accent/40 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-pulse-secondary/30 rounded-lg -rotate-6"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-pulse-accent-dark/40 rounded-full"></div>

        {/* Data Network Pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(31, 130, 191, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection Lines */}
          <g opacity="0.2">
            <line
              x1="300"
              y1="200"
              x2="600"
              y2="300"
              stroke="#1F82BF"
              strokeWidth="1"
            />
            <line
              x1="600"
              y1="300"
              x2="900"
              y2="250"
              stroke="#F2CB57"
              strokeWidth="1"
            />
            <line
              x1="900"
              y1="250"
              x2="1200"
              y2="400"
              stroke="#1F82BF"
              strokeWidth="1"
            />
            <line
              x1="400"
              y1="600"
              x2="700"
              y2="500"
              stroke="#022873"
              strokeWidth="1"
            />
            <line
              x1="700"
              y1="500"
              x2="1000"
              y2="600"
              stroke="#D98E04"
              strokeWidth="1"
            />
          </g>

          {/* Data Nodes */}
          <g opacity="0.3">
            <circle cx="300" cy="200" r="4" fill="#1F82BF" />
            <circle cx="600" cy="300" r="4" fill="#F2CB57" />
            <circle cx="900" cy="250" r="4" fill="#1F82BF" />
            <circle cx="1200" cy="400" r="4" fill="#022873" />
            <circle cx="400" cy="600" r="4" fill="#D98E04" />
            <circle cx="700" cy="500" r="4" fill="#F2CB57" />
            <circle cx="1000" cy="600" r="4" fill="#1F82BF" />
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 py-16 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left Side - Main Content */}
          <div className="space-y-8">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pulse-primary to-pulse-secondary rounded-2xl flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pulse-accent rounded-full animate-pulse"></div>
                <div
                  className="w-1 h-1 bg-pulse-primary rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-pulse-accent-dark rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  PulseMinds
                </span>
                <br />
                <span className="bg-gradient-to-r from-pulse-primary via-pulse-accent to-pulse-primary bg-clip-text text-transparent">
                  Dashboard
                </span>
                <br />
                <span className="text-4xl lg:text-5xl text-gray-300">
                  de Previsão e Controle Operacional
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-2xl">
                Análises inteligentes para transformar{" "}
                <span className="text-pulse-accent font-semibold">dados</span>{" "}
                em{" "}
                <span className="text-pulse-primary font-semibold">
                  decisões estratégicas.
                </span>
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3 p-4 bg-pulse-primary/10 rounded-lg border border-pulse-primary/20">
                <Brain className="w-6 h-6 text-pulse-primary" />
                <span className="text-sm font-medium text-gray-300">
                  IA Preditiva
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-pulse-accent/10 rounded-lg border border-pulse-accent/20">
                <Target className="w-6 h-6 text-pulse-accent" />
                <span className="text-sm font-medium text-gray-300">
                  Precisão MAPE
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-pulse-secondary/10 rounded-lg border border-pulse-secondary/20">
                <Database className="w-6 h-6 text-pulse-primary" />
                <span className="text-sm font-medium text-gray-300">
                  Gestão de Estoque
                </span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-pulse-accent-dark/10 rounded-lg border border-pulse-accent-dark/20">
                <Activity className="w-6 h-6 text-pulse-accent-dark" />
                <span className="text-sm font-medium text-gray-300">
                  Analytics Real-time
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-pulse-primary to-pulse-secondary hover:from-pulse-primary/80 hover:to-pulse-secondary/80 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl group transition-all duration-300"
            >
              Acessar Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Side - Visual Elements */}
          <div className="relative">
            {/* Main Dashboard Preview Card */}
            <div className="relative z-10 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pulse-accent rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">LIVE</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-pulse-primary/20 rounded-lg p-4 border border-pulse-primary/30">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="w-5 h-5 text-pulse-primary" />
                      <span className="text-2xl font-bold text-pulse-primary">
                        94.2%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Precisão</p>
                  </div>
                  <div className="bg-pulse-accent/20 rounded-lg p-4 border border-pulse-accent/30">
                    <div className="flex items-center justify-between">
                      <Zap className="w-5 h-5 text-pulse-accent" />
                      <span className="text-2xl font-bold text-pulse-accent">
                        1,247
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Vendas kg</p>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300">
                      Previsão vs Real
                    </span>
                    <Layers className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Chart bars */}
                  <div className="space-y-2">
                    {[85, 92, 78, 95, 88, 91, 87].map((height, index) => (
                      <div key={index} className="flex items-end space-x-1 h-8">
                        <div
                          className="bg-pulse-primary rounded-sm w-3"
                          style={{ height: `${(height / 95) * 100}%` }}
                        ></div>
                        <div
                          className="bg-pulse-accent rounded-sm w-3"
                          style={{
                            height: `${((height + Math.random() * 10 - 5) / 95) * 100}%`,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Table Preview */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/20">
                  <div className="space-y-2">
                    {[1, 2, 3].map((row) => (
                      <div key={row} className="flex justify-between text-xs">
                        <span className="text-gray-400">Item {row}</span>
                        <span className="text-pulse-accent">92.{row}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pulse-accent to-pulse-accent-dark rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-pulse-primary to-pulse-secondary rounded-lg rotate-12 opacity-60"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-8 right-8 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>@pulseminds</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>www.linkedin.com/in/pulseminds</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>(55) 7565-6545</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            © 2024 PulseMinds - Business Intelligence Platform
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-pulse-accent rounded-full animate-ping"></div>
      <div
        className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-pulse-primary rounded-full animate-ping"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pulse-accent-dark rounded-full animate-ping"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default Cover;
