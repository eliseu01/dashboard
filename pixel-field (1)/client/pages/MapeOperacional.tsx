import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  calculateAverages,
  formatChartData,
  exportToCSV,
} from "@/lib/data";

const MapeOperacional = () => {
  const [rawData, setRawData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/csv-data')
      .then((res) => res.json())
      .then((data) => {
        const dadosTratados = data.map((item: any) => ({
          data: item.data,
          previsao_venda_kg: Number(item.previsao_venda_kg),
          venda_real_kg: Number(item.venda_real_kg),
          porcentagem_atendida: Number(item.porcentagem_atendida),
          quilos_excedentes_kg: Number(item.quilos_excedentes_kg),
          quilos_estragados_kg: Number(item.quilos_estragados_kg),
          retirada_emergencial_kg: Number(item.retirada_emergencial_kg),
          descongelado_para_futuro_kg: Number(item.descongelado_para_futuro_kg),
          estoque_freezer_kg: Number(item.estoque_freezer_kg),
          estoque_congelador_kg: Number(item.estoque_congelador_kg),
          exposto_na_vitrine_kg: Number(item.exposto_na_vitrine_kg),
          mape_previsao: Number(item.mape_previsao),
          mape_operacional: Number(item.mape_operacional),
        }));
        setRawData(dadosTratados);
      });
  }, []);

  const averages = useMemo(() => calculateAverages(rawData), [rawData]);
  const chartData = useMemo(() => formatChartData(rawData), [rawData]);

  // Calculate MAPE performance levels
  const getMAPEStatus = (mape: number) => {
    if (mape <= 5)
      return {
        status: "Excelente",
        color: "text-green-500",
        bgColor: "from-green-500/20 to-green-600/20",
        borderColor: "border-green-500/30",
      };
    if (mape <= 10)
      return {
        status: "Bom",
        color: "text-pulse-accent",
        bgColor: "from-pulse-accent/20 to-pulse-accent-dark/20",
        borderColor: "border-pulse-accent/30",
      };
    if (mape <= 15)
      return {
        status: "Regular",
        color: "text-orange-500",
        bgColor: "from-orange-500/20 to-orange-600/20",
        borderColor: "border-orange-500/30",
      };
    return {
      status: "Crítico",
      color: "text-red-500",
      bgColor: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30",
    };
  };

  const mapePrevisaoStatus = getMAPEStatus(averages?.mape_previsao_media || 0);
  const mapeOperacionalStatus = getMAPEStatus(
    averages?.mape_operacional_media || 0,
  );

  // Prepare data for trend analysis
  const trendData = useMemo(() => {
    return chartData.map((item, index) => ({
      ...item,
      mape_7d_avg:
        index >= 6
          ? chartData
              .slice(index - 6, index + 1)
              .reduce((acc, curr) => acc + curr.mape_previsao, 0) / 7
          : item.mape_previsao,
      mape_operacional_7d_avg:
        index >= 6
          ? chartData
              .slice(index - 6, index + 1)
              .reduce((acc, curr) => acc + curr.mape_operacional, 0) / 7
          : item.mape_operacional,
    }));
  }, [chartData]);

  const handleExport = () => {
    exportToCSV(
      rawData,
      `mape_operacional_${new Date().toISOString().split("T")[0]}`,
    );
  };

  if (!averages) return null;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            MAPE e Desempenho Operacional
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Análise de precisão e performance dos modelos preditivos
          </p>
        </div>
        <Button
          onClick={handleExport}
          className="bg-pulse-accent hover:bg-pulse-accent-dark text-pulse-dark font-semibold flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Main MAPE Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MAPE Previsão Card */}
        <Card
          className={`bg-gradient-to-br ${mapePrevisaoStatus.bgColor} ${mapePrevisaoStatus.borderColor}`}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <Target className="w-6 h-6 text-pulse-primary" />
              MAPE Previsão
            </CardTitle>
            <p className="text-muted-foreground">
              Mean Absolute Percentage Error das previsões
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-pulse-primary mb-2">
                {averages.mape_previsao_media}%
              </div>
              <div
                className={`text-lg font-semibold ${mapePrevisaoStatus.color}`}
              >
                {mapePrevisaoStatus.status}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Período</div>
                <div className="font-semibold">{averages.total_dias} dias</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Meta</div>
                <div className="font-semibold">≤ 5%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MAPE Operacional Card */}
        <Card
          className={`bg-gradient-to-br ${mapeOperacionalStatus.bgColor} ${mapeOperacionalStatus.borderColor}`}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <Activity className="w-6 h-6 text-pulse-secondary" />
              MAPE Operacional
            </CardTitle>
            <p className="text-muted-foreground">
              Erro considerando fatores operacionais
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-pulse-secondary mb-2">
                {averages.mape_operacional_media}%
              </div>
              <div
                className={`text-lg font-semibold ${mapeOperacionalStatus.color}`}
              >
                {mapeOperacionalStatus.status}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Diferença</div>
                <div className="font-semibold">
                  +
                  {(
                    averages.mape_operacional_media -
                    averages.mape_previsao_media
                  ).toFixed(1)}
                  %
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Meta</div>
                <div className="font-semibold">≤ 8%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAPE Evolution Chart */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-pulse-primary" />
            Evolução do MAPE - Últimos 30 Dias
          </CardTitle>
          <p className="text-muted-foreground">
            Comparação entre MAPE de previsão e operacional com médias móveis de
            7 dias
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id="colorMapePrevisao"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#1F82BF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1F82BF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorMapeOperacional"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#022873" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#022873" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="data_formatada"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{
                    value: "MAPE (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                  }}
                  formatter={(value: any, name: string) => [
                    `${Number(value).toFixed(2)}%`,
                    name === "mape_previsao"
                      ? "MAPE Previsão"
                      : name === "mape_operacional"
                        ? "MAPE Operacional"
                        : name === "mape_7d_avg"
                          ? "Média 7d - Previsão"
                          : "Média 7d - Operacional",
                  ]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="mape_previsao"
                  stroke="#1F82BF"
                  strokeWidth={2}
                  fill="url(#colorMapePrevisao)"
                  name="MAPE Previsão"
                />
                <Area
                  type="monotone"
                  dataKey="mape_operacional"
                  stroke="#022873"
                  strokeWidth={2}
                  fill="url(#colorMapeOperacional)"
                  name="MAPE Operacional"
                />
                <Line
                  type="monotone"
                  dataKey="mape_7d_avg"
                  stroke="#F2CB57"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Média 7d - Previsão"
                />
                <Line
                  type="monotone"
                  dataKey="mape_operacional_7d_avg"
                  stroke="#D98E04"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Média 7d - Operacional"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed MAPE Table */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Calendar className="w-5 h-5 text-pulse-primary" />
            Dados Diários de MAPE
          </CardTitle>
          <p className="text-muted-foreground">
            Valores detalhados de MAPE por dia com classificação de performance
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Data
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Previsão (kg)
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Real (kg)
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    MAPE Previsão (%)
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    MAPE Operacional (%)
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Performance
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Diferença
                  </th>
                </tr>
              </thead>
              <tbody>
                {rawData.slice(-12).map((row, index) => {
                  const mapeStatus = getMAPEStatus(row.mape_previsao);
                  const diferenca = row.mape_operacional - row.mape_previsao;
                  return (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 font-medium">
                        {format(new Date(row.data), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </td>
                      <td className="p-4 text-pulse-primary font-semibold">
                        {row.previsao_venda_kg}
                      </td>
                      <td className="p-4 text-pulse-accent font-semibold">
                        {row.venda_real_kg}
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${mapeStatus.color}`}>
                          {row.mape_previsao}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-pulse-secondary">
                          {row.mape_operacional}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            mapeStatus.status === "Excelente"
                              ? "bg-green-500/20 text-green-500"
                              : mapeStatus.status === "Bom"
                                ? "bg-pulse-accent/20 text-pulse-accent"
                                : mapeStatus.status === "Regular"
                                  ? "bg-orange-500/20 text-orange-500"
                                  : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {mapeStatus.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            diferenca > 2
                              ? "text-red-500"
                              : diferenca > 1
                                ? "text-orange-500"
                                : "text-green-500"
                          }`}
                        >
                          +{diferenca.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-pulse-primary/10 to-pulse-secondary/10 border-pulse-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pulse-primary rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Análise de Precisão
                </h3>
                <p className="text-sm text-muted-foreground">
                  MAPE médio de {averages.mape_previsao_media}% indica{" "}
                  {averages.mape_previsao_media <= 5
                    ? "excelente precisão do modelo"
                    : averages.mape_previsao_media <= 10
                      ? "boa precisão com margem para melhoria"
                      : "necessidade de ajustes no modelo"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pulse-accent/10 to-pulse-accent-dark/10 border-pulse-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pulse-accent rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-pulse-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Impacto Operacional
                </h3>
                <p className="text-sm text-muted-foreground">
                  Diferença de{" "}
                  {(
                    averages.mape_operacional_media -
                    averages.mape_previsao_media
                  ).toFixed(1)}
                  % entre MAPE operacional e previsão indica{" "}
                  {averages.mape_operacional_media -
                    averages.mape_previsao_media <=
                  2
                    ? "baixo impacto dos fatores externos"
                    : "necessidade de revisar processos operacionais"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-pulse-secondary/10 to-pulse-primary/10 border-pulse-secondary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pulse-secondary to-pulse-primary rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Recomendações de Melhoria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Para MAPE Previsão:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {averages.mape_previsao_media <= 5 ? (
                      <li>Modelo apresenta excelente performance</li>
                    ) : (
                      <li>Considerar refinamento dos parâmetros do modelo</li>
                    )}
                    <li>Monitorar sazonalidade e tendências</li>
                    <li>Validar qualidade dos dados históricos</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Para MAPE Operacional:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {averages.mape_operacional_media -
                      averages.mape_previsao_media <=
                    2 ? (
                      <li>Processos operacionais bem alinhados</li>
                    ) : (
                      <li>Revisar fatores operacionais externos</li>
                    )}
                    <li>Analisar impacto de eventos especiais</li>
                    <li>Otimizar tempo de resposta operacional</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapeOperacional;
