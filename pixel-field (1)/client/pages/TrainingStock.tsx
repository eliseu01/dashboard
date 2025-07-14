import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Snowflake,
  Thermometer,
  TrendingUp,
  Download,
  AlertCircle,
} from "lucide-react";

const TrainingStock = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Treinamento com Controle de Estoque
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise de performance com gestão inteligente de estoque
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Previsão vs Venda Real
            </CardTitle>
            <Package className="h-4 w-4 text-pulse-primary" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-pulse-primary">2,340 kg</div>
            <p className="text-xs text-muted-foreground">Previsão</p>
            <div className="data-medium text-pulse-accent mt-1">2,187 kg</div>
            <p className="text-xs text-muted-foreground">Venda real</p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Erro Absoluto Percentual
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-pulse-accent-dark" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-pulse-accent-dark">6.5%</div>
            <p className="text-xs text-muted-foreground">MAPE médio</p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eficiência de Estoque
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-green-500">94.2%</div>
            <p className="text-xs text-muted-foreground">Taxa de utilização</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Analysis */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Análise de Estoque por Categoria</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribuição atual do estoque em kg
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stock bars */}
            {[
              {
                label: "Estoque no Freezer",
                value: 1850,
                max: 2000,
                icon: Snowflake,
                color: "bg-blue-500",
              },
              {
                label: "Estoque no Chiller",
                value: 420,
                max: 500,
                icon: Thermometer,
                color: "bg-pulse-primary",
              },
              {
                label: "Sobra",
                value: 153,
                max: 300,
                icon: Package,
                color: "bg-pulse-accent",
              },
              {
                label: "Descongelado para Futuro",
                value: 87,
                max: 200,
                icon: TrendingUp,
                color: "bg-green-500",
              },
            ].map((item) => {
              const percentage = (item.value / item.max) * 100;
              const Icon = item.icon;

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {item.value} kg / {item.max} kg
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${item.color}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% da capacidade
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chart and Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Previsão vs Real em kg</CardTitle>
            <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Gráfico de linha será implementado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Table */}
      <Card className="data-table">
        <CardHeader>
          <CardTitle>Tabela Detalhada de Gestão de Estoque</CardTitle>
          <p className="text-sm text-muted-foreground">
            Dados completos de previsão, vendas e gestão de estoque
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 font-semibold">Data</th>
                  <th className="text-left p-3 font-semibold">
                    Previsão de venda (kg)
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Venda real (kg)
                  </th>
                  <th className="text-left p-3 font-semibold">Sobra (kg)</th>
                  <th className="text-left p-3 font-semibold">
                    Descongelado para futuro (kg)
                  </th>
                  <th className="text-left p-3 font-semibold">Freezer (kg)</th>
                  <th className="text-left p-3 font-semibold">Chiller (kg)</th>
                  <th className="text-left p-3 font-semibold">
                    Erro percentual absoluto
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "01/12/2024",
                    predicted: 78.5,
                    actual: 72.3,
                    leftover: 6.2,
                    thawed: 0,
                    freezer: 1850,
                    chiller: 420,
                    error: 7.9,
                  },
                  {
                    date: "02/12/2024",
                    predicted: 85.2,
                    actual: 89.1,
                    leftover: 0,
                    thawed: 4.0,
                    freezer: 1845,
                    chiller: 415,
                    error: 4.6,
                  },
                  {
                    date: "03/12/2024",
                    predicted: 92.1,
                    actual: 87.8,
                    leftover: 4.3,
                    thawed: 0,
                    freezer: 1840,
                    chiller: 418,
                    error: 4.7,
                  },
                  {
                    date: "04/12/2024",
                    predicted: 76.8,
                    actual: 81.2,
                    leftover: 0,
                    thawed: 4.4,
                    freezer: 1835,
                    chiller: 410,
                    error: 5.7,
                  },
                  {
                    date: "05/12/2024",
                    predicted: 88.9,
                    actual: 84.6,
                    leftover: 4.3,
                    thawed: 0,
                    freezer: 1830,
                    chiller: 412,
                    error: 4.8,
                  },
                ].map((row, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.predicted}</td>
                    <td className="p-3">{row.actual}</td>
                    <td className="p-3">{row.leftover}</td>
                    <td className="p-3">{row.thawed}</td>
                    <td className="p-3">{row.freezer}</td>
                    <td className="p-3">{row.chiller}</td>
                    <td className="p-3">
                      <span
                        className={
                          row.error < 5 ? "text-green-500" : "text-yellow-500"
                        }
                      >
                        {row.error}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notice */}
      <Card className="bg-pulse-secondary/10 border-pulse-secondary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pulse-secondary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Gestão Inteligente de Estoque
              </h3>
              <p className="text-sm text-muted-foreground">
                Sistema completo com controle de temperatura, rotatividade e
                otimização de perdas será implementado com dados em tempo real.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingStock;
