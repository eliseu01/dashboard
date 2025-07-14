import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart, Download, AlertCircle } from "lucide-react";

const TrainingBasic = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Treinamento sem Controle de Estoque
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise de performance do modelo sem consideração de estoque
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Previsto vs Real
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-pulse-primary" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-pulse-primary">1,150</div>
            <p className="text-xs text-muted-foreground">Vendas previstas</p>
            <div className="data-medium text-pulse-accent mt-1">1,087</div>
            <p className="text-xs text-muted-foreground">Vendas reais</p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Erro Percentual
            </CardTitle>
            <BarChart className="h-4 w-4 text-pulse-accent-dark" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-pulse-accent-dark">5.8%</div>
            <p className="text-xs text-muted-foreground">Erro médio absoluto</p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dentro do Intervalo
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-green-500">Sim</div>
            <p className="text-xs text-muted-foreground">85% de confiança</p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-green-500">+2.5%</div>
            <p className="text-xs text-muted-foreground">Vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Vendas Previstas vs Reais</CardTitle>
            <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="w-12 h-12 mx-auto mb-2" />
                <p>Gráfico de linha será implementado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Análise de Erro</CardTitle>
            <p className="text-sm text-muted-foreground">Erro dia a dia</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Gráfico de barras será implementado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Placeholder */}
      <Card className="data-table">
        <CardHeader>
          <CardTitle>Tabela de Análise Detalhada</CardTitle>
          <p className="text-sm text-muted-foreground">
            Dados de performance do modelo
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 font-semibold">Lower Bound</th>
                  <th className="text-left p-3 font-semibold">Upper Bound</th>
                  <th className="text-left p-3 font-semibold">
                    Absolute Error
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Percentage Error
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Dentro do Intervalo
                  </th>
                  <th className="text-left p-3 font-semibold">Batch</th>
                  <th className="text-left p-3 font-semibold">Retreinado</th>
                  <th className="text-left p-3 font-semibold">
                    Intervalo Retrain (dias)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="border-t border-border">
                    <td className="p-3">950</td>
                    <td className="p-3">1,200</td>
                    <td className="p-3">63</td>
                    <td className="p-3">5.8%</td>
                    <td className="p-3">
                      <span className="text-green-500">Yes</span>
                    </td>
                    <td className="p-3">Batch_001</td>
                    <td className="p-3">
                      <span className="text-pulse-accent">Yes</span>
                    </td>
                    <td className="p-3">7</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notice */}
      <Card className="bg-pulse-accent/10 border-pulse-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pulse-accent rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-pulse-dark" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Em Desenvolvimento
              </h3>
              <p className="text-sm text-muted-foreground">
                Esta página está sendo desenvolvida com componentes interativos
                completos e integração de dados em tempo real.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingBasic;
