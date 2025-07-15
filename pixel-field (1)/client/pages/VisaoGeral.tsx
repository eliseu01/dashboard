import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  Download,
  Target,
  Scale,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  calculateAverages,
  formatChartData,
  exportToCSV,
  type FilterState,
} from "@/lib/data";

const VisaoGeral = () => {
  const [filters, setFilters] = useState<FilterState>({
    year: "2025",
    month: "",
    week: "",
    date: undefined,
  });

  
  // Generate mock data
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

  const dadosFiltrados = useMemo(() => {
    const meses = {
      janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,  
      julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
    };

    const filtrado = rawData.filter((item) => {
      const dataItem = new Date(item.data);
      dataItem.setDate(dataItem.getDate() + 1); // ajuste seu

      // 🎯 Se filtro por data estiver ativo, ignora mês e ano
      if (filters.date) {
        return dataItem.toDateString() === new Date(filters.date).toDateString();
      }

      // Caso contrário, usa filtro por mês e ano
      const anoIgual = dataItem.getFullYear().toString() === filters.year;
      const mesIgual = dataItem.getMonth() === meses[filters.month];
      if (!anoIgual || !mesIgual) return false;

      if (filters.week) {
        const primeiraSemana = new Date(dataItem.getFullYear(), dataItem.getMonth(), 1);
        const diffDias = (dataItem.getTime() - primeiraSemana.getTime()) / (1000 * 60 * 60 * 24);
        const semanaItem = Math.floor(diffDias / 7) + 1;
        return semanaItem.toString() === filters.week;
      }

      return true;
    });


    console.log("DADOS FILTRADOS:", filtrado);
    return filtrado;
}, [rawData, filters]);


  const contexto = useMemo(() => {
    console.log("Contexto atualizado:", filters);
    if (filters.date) return "dia";
    if (filters.week) return "semana";
    return "mês";
  }, [filters]);

  const dadoDoDia = useMemo(() => {
    if (contexto === "dia") {
      console.log("Dado do dia:", dadosFiltrados[0]);
      return dadosFiltrados[0];
    }
    return null;
  }, [contexto, dadosFiltrados]);


  const chartData = useMemo(() => formatChartData(rawData), [rawData]);
  const averages = useMemo(() => calculateAverages(rawData), [rawData]);

  const years = ["2023", "2024", "2025"];
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const weeks = Array.from({ length: 52 }, (_, i) => (i + 1).toString());

  const handleExport = () => {
    exportToCSV(rawData, `visao_geral_${format(new Date(), "yyyy-MM-dd")}`);
  };

  if (!averages) return null;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Visão Geral</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Análise temporal de previsão vs vendas realizadas
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

      {/* Filters Section */}
      <Card className="bg-gradient-to-r from-pulse-secondary/20 to-pulse-primary/20 border-pulse-primary/30">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-pulse-primary" />
            Filtros de Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Year Filter */}
            

            {/* Week Filter */}
           

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Data
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-card border-pulse-primary/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.date
                      ? format(filters.date, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.date}
                    onSelect={(date) =>
                      setFilters((prev) => ({ ...prev, date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main KPI - Porcentagem Atendida */}
      <Card className="bg-gradient-to-br from-pulse-primary to-pulse-secondary text-white border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-90 mb-2">
                {contexto === "dia"
                ? "Previsão de Vendas"
                : "Porcentagem Atendida Média"}
              </h2>
              <div className="text-6xl font-bold">
                {contexto === "dia"
                ? `${dadoDoDia?.previsao_venda_kg?.toFixed(1)} kg`
                : `${averages.porcentagem_atendida_media}%`
                }
              </div>
              <p className="text-lg opacity-75 mt-2">
                
                {contexto === "dia"
                ? " "
                : `Período: ${averages.total_dias} dias`
                }
              </p>
            </div>
            <div className="text-right">
              <Target className="w-16 h-16 mb-4 opacity-80" />
              <div className="space-y-1 text-sm opacity-90">
                
                <div>
                  {contexto === "dia"
                  ? ""
                  : `Previsão: ${averages.previsao_venda_kg_media} kg/dia`
                  }
                  </div>
                <div>
                  {contexto === "dia"
                  ? ""
                  : `Real: ${averages.venda_real_kg_media} kg/dia`
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur border-pulse-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {contexto === "dia" ? "Descongelar hoje" :
              contexto === "semana" ? "Resumo da semana" :
              "Previsão Total"}
            </CardTitle>
            <Scale className="h-5 w-5 text-pulse-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pulse-primary">
              {contexto === "dia"
              ? `${dadosFiltrados[0]?.descongelado_para_futuro_kg || 0} kg`
              : `${averages.previsao_venda_kg_media * averages.total_dias || 0} kg`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contexto === "dia"
                ? `Para ficar pronto em ${
                    dadoDoDia?.data
                      ? format(
                          new Date(new Date(dadoDoDia.data).setDate(new Date(dadoDoDia.data).getDate() + 3)),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )
                      : ""
                  }`
                : `Média: ${averages.previsao_venda_kg_media} kg/dia`
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-pulse-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {contexto === "dia"
              ? `Vendas Realizadas`
              : `Vendas Realizadas`
              }
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-pulse-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pulse-accent">
              {contexto === "dia"
              ? `${(dadoDoDia?.venda_real_kg).toFixed(1)} kg`
              : `${(averages.venda_real_kg_media * averages.total_dias).toFixed(1)} kg`
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contexto === "dia"
              ? `Hoje`
              : `Média: ${averages.venda_real_kg_media} kg/dia`
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quilos Estragados
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {contexto === "dia"
              ? `${(dadoDoDia?.quilos_estragados_kg).toFixed(1)} kg`
              : `${averages.quilos_estragados_kg_total} kg`
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contexto === "dia"
              ? `Hoje`
              : `${((averages.quilos_estragados_kg_total /
                    (averages.previsao_venda_kg_media * averages.total_dias)) *
                      100
                    ).toFixed(1)} % do total`
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Temporal Chart */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-pulse-primary" />
            Análise Temporal - Previsão vs Vendas Realizadas
          </CardTitle>
          <p className="text-muted-foreground">
            Comparação detalhada dos últimos {averages.total_dias} dias
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
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
                    value: "Quilos (kg)",
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
                    `${value.toFixed(1)} kg`,
                    name === "Previsão de Venda"
                      ? "Previsão de Venda"
                      : "Venda Realizada",
                  ]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="previsao_venda_kg"
                  stroke="#1F82BF"
                  strokeWidth={3}
                  name="Previsão de Venda"
                  dot={{ fill: "#1F82BF", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#1F82BF", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="venda_real_kg"
                  stroke="#F2CB57"
                  strokeWidth={3}
                  name="Venda Realizada"
                  dot={{ fill: "#F2CB57", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#F2CB57", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insight */}
      <Card className="bg-gradient-to-r from-pulse-accent/10 to-pulse-accent-dark/10 border-pulse-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pulse-accent to-pulse-accent-dark rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-pulse-dark" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Análise de Performance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {averages.porcentagem_atendida_media >= 95
                  ? "Excelente performance! A taxa de atendimento está acima de 95%, indicando alta precisão nas previsões."
                  : averages.porcentagem_atendida_media >= 85
                    ? "Boa performance. Taxa de atendimento sólida, com margem para otimização na precisão das previsões."
                    : "Performance abaixo do ideal. Recomenda-se revisão dos parâmetros de previsão e análise dos fatores externos."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">MAPE Médio</div>
              <div className="text-2xl font-bold text-pulse-primary">
                {averages.mape_previsao_media}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisaoGeral;
