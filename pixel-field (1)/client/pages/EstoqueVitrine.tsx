import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Package,
  Snowflake,
  Thermometer,
  Eye,
  Trash2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  calculateAverages,
  getLatestStockData,
  exportToCSV,
} from "@/lib/data";

const EstoqueVitrine = () => {
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
  const latestStock = useMemo(() => getLatestStockData(rawData), [rawData]);

  // Prepare stock comparison data for charts
  const stockComparisonData = useMemo(() => {
    return rawData.slice(-10).map((item, index) => ({
      dia: `Dia ${index + 1}`,
      estoque_freezer_kg: item.estoque_freezer_kg,
      estoque_congelador_kg: item.estoque_congelador_kg,
      exposto_na_vitrine_kg: item.exposto_na_vitrine_kg,
      descongelado_para_futuro_kg: item.descongelado_para_futuro_kg,
    }));
  }, [rawData]);

  // Pie chart data for current stock distribution
  const currentStockData = latestStock
    ? [
        {
          name: "Freezer",
          value: latestStock.current.estoque_freezer_kg,
          color: "#1F82BF",
        },
        {
          name: "Congelador",
          value: latestStock.current.estoque_congelador_kg,
          color: "#022873",
        },
        {
          name: "Exposto na Vitrine",
          value: latestStock.current.exposto_na_vitrine_kg,
          color: "#F2CB57",
        },
        {
          name: "Descongelado p/ Futuro",
          value: latestStock.current.descongelado_para_futuro_kg,
          color: "#D98E04",
        },
      ]
    : [];

  const handleExport = () => {
    exportToCSV(
      rawData,
      `estoque_vitrine_${new Date().toISOString().split("T")[0]}`,
    );
  };

  if (!averages || !latestStock) return null;

  const totalStock =
    latestStock.current.estoque_freezer_kg +
    latestStock.current.estoque_congelador_kg;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Estoque e Exposição
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gestão de estoque, vitrine e controle de qualidade
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

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estoque Freezer
            </CardTitle>
            <Snowflake className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {latestStock.current.estoque_freezer_kg} kg
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {latestStock.freezer_trend > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="w-3 h-3 text-red-500 mr-1 rotate-180" />
              )}
              {Math.abs(latestStock.freezer_trend)} kg vs ontem
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pulse-secondary/20 to-pulse-secondary/30 border-pulse-secondary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estoque Congelador
            </CardTitle>
            <Thermometer className="h-5 w-5 text-pulse-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pulse-primary">
              {latestStock.current.estoque_congelador_kg} kg
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {latestStock.congelador_trend > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="w-3 h-3 text-red-500 mr-1 rotate-180" />
              )}
              {Math.abs(latestStock.congelador_trend)} kg vs ontem
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pulse-accent/20 to-pulse-accent-dark/20 border-pulse-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Exposto na Vitrine
            </CardTitle>
            <Eye className="h-5 w-5 text-pulse-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pulse-accent">
              {latestStock.current.exposto_na_vitrine_kg} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(
                (latestStock.current.exposto_na_vitrine_kg / totalStock) *
                100
              ).toFixed(1)}
              % do estoque total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quilos Estragados
            </CardTitle>
            <Trash2 className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {averages.quilos_estragados_kg_total} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(
                (averages.quilos_estragados_kg_total /
                  (averages.previsao_venda_kg_media * averages.total_dias)) *
                100
              ).toFixed(1)}
              % perda total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Stock Distribution */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <Package className="w-5 h-5 text-pulse-primary" />
              Distribuição Atual do Estoque
            </CardTitle>
            <p className="text-muted-foreground">
              Visualização da distribuição por categorias
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentStockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value}kg (${(percent * 100).toFixed(1)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {currentStockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any) => [`${value} kg`, "Quantidade"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock Evolution */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-pulse-primary" />
              Evolução do Estoque
            </CardTitle>
            <p className="text-muted-foreground">
              Últimos 10 dias - Freezer vs Congelador
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stockComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="dia"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any, name: string) => [
                      `${value} kg`,
                      name === "estoque_freezer_kg" ? "Freezer" : "Congelador",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="estoque_freezer_kg"
                    fill="#1F82BF"
                    name="Freezer"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="estoque_congelador_kg"
                    fill="#022873"
                    name="Congelador"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vitrine and Future Stock Analysis */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Eye className="w-5 h-5 text-pulse-accent" />
            Análise de Vitrine e Estoque Futuro
          </CardTitle>
          <p className="text-muted-foreground">
            Exposição na vitrine vs descongelado para futuro uso
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="dia"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: any, name: string) => [
                    `${value} kg`,
                    name === "exposto_na_vitrine_kg"
                      ? "Exposto na Vitrine"
                      : "Descongelado p/ Futuro",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="exposto_na_vitrine_kg"
                  fill="#F2CB57"
                  name="Exposto na Vitrine"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="descongelado_para_futuro_kg"
                  fill="#D98E04"
                  name="Descongelado p/ Futuro"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quality Control Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Estoque Total
                </h3>
                <p className="text-2xl font-bold text-green-500">
                  {totalStock} kg
                </p>
                <p className="text-xs text-muted-foreground">
                  Capacidade disponível
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pulse-accent/10 to-pulse-accent-dark/10 border-pulse-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pulse-accent rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pulse-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Descongelado Futuro
                </h3>
                <p className="text-2xl font-bold text-pulse-accent">
                  {averages.descongelado_para_futuro_kg_total} kg
                </p>
                <p className="text-xs text-muted-foreground">Total preparado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Taxa de Perda
                </h3>
                <p className="text-2xl font-bold text-red-500">
                  {(
                    (averages.quilos_estragados_kg_total /
                      (averages.previsao_venda_kg_media *
                        averages.total_dias)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-xs text-muted-foreground">
                  Do total previsto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Recommendations */}
      <Card className="bg-gradient-to-r from-pulse-primary/10 to-pulse-secondary/10 border-pulse-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pulse-primary to-pulse-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Recomendações de Gestão
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Otimização de Estoque:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      Balanceamento entre freezer e congelador está adequado
                    </li>
                    <li>
                      Taxa de perda de{" "}
                      {(
                        (averages.quilos_estragados_kg_total /
                          (averages.previsao_venda_kg_media *
                            averages.total_dias)) *
                        100
                      ).toFixed(1)}
                      % está{" "}
                      {(averages.quilos_estragados_kg_total /
                        (averages.previsao_venda_kg_media *
                          averages.total_dias)) *
                        100 <
                      3
                        ? "excelente"
                        : "aceitável"}
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Gestão de Vitrine:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Exposição adequada mantida consistentemente</li>
                    <li>
                      Descongelamento futuro estratégico em{" "}
                      {averages.descongelado_para_futuro_kg_total} kg
                    </li>
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

export default EstoqueVitrine;
