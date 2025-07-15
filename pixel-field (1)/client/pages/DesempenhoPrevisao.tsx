import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Download,
  Target,
  Scale,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  calculateAverages,
  exportToCSV,
  type VendasData,
  type FilterState,
} from "@/lib/data";

const DesempenhoPrevisao = () => {
  const [filters, setFilters] = useState<FilterState>({
      year: "2025",
      month: "",
      week: "",
      date: undefined,
    });
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

  const linhasParaTabela = useMemo(() => {
    // Ajusta a data de todos os objetos de rawData em +1 dia para alinhar com o filtro
    const rawDataAjustado = rawData.map((item) => ({
      ...item,
      data: new Date(new Date(item.data).setDate(new Date(item.data).getDate() + 1)),
    }));

    if (filters.date) {
      const dataSelecionada = new Date(filters.date).toDateString();
      const index = rawDataAjustado.findIndex(
      (item) => new Date(item.data).toDateString() === dataSelecionada
      );
      if (index !== -1) {
      return rawDataAjustado.slice(index, index + 10);
      }
    }

    // Se não tiver dia selecionado, mostra as últimas 10 linhas normalmente
    return rawData.slice(-10);
  }, [rawData, filters]);



  const averages = useMemo(() => calculateAverages(rawData), [rawData]);
  console.log("MÉDIAS CALCULADAS:", averages);

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

  // Prepare data for bar chart (last 15 days for better visualization)
  const chartData = useMemo(() => {
    return rawData.slice(-15).map((item) => ({
      ...item,
      data_formatada: format(new Date(item.data), "dd/MM", { locale: ptBR }),
      performance_color:
        item.porcentagem_atendida >= 95
          ? "#10B981" // green-500
          : item.porcentagem_atendida >= 85
            ? "#F2CB57" // pulse-accent
            : item.porcentagem_atendida >= 75
              ? "#D98E04" // pulse-accent-dark
              : "#EF4444", // red-500
    }));
  }, [rawData]);

  const handleExport = () => {
    exportToCSV(
      rawData,
      `desempenho_previsao_${format(new Date(), "yyyy-MM-dd")}`,
    );
  };

  if (!averages) return null;

  // Performance classification
  const getPerformanceStatus = (percentage: number) => {
    if (percentage >= 95)
      return { status: "Excelente", color: "text-green-500" };
    if (percentage >= 85) return { status: "Bom", color: "text-pulse-accent" };
    if (percentage >= 75)
      return { status: "Regular", color: "text-orange-500" };
    return { status: "Abaixo", color: "text-red-500" };
  };

  const performanceStatus = getPerformanceStatus(
    contexto === "dia"
      ? dadoDoDia?.porcentagem_atendida ?? 0
      : averages.porcentagem_atendida_media
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Desempenho de Previsão e Atendimento
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Análise detalhada da performance operacional e atendimento de
            demanda
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

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Previsão vs Real Card */}
        <Card className="bg-gradient-to-br from-pulse-primary/20 to-pulse-secondary/20 border-pulse-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Previsão vs Real
            </CardTitle>
            <Scale className="h-5 w-5 text-pulse-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-lg font-bold text-pulse-primary">
                {contexto === "dia"
                ? `${dadoDoDia?.previsao_venda_kg?.toFixed(2)} kg`
                : `${averages.previsao_venda_kg_media} kg`
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {contexto === "dia"
                ? `Previsão de Hoje`
                : `Previsão Média`
                }
              </p>
            </div>
            <div>
              <div className="text-lg font-bold text-pulse-accent">
                {contexto === "dia"
                ? `${dadoDoDia?.venda_real_kg?.toFixed(2)} kg`
                : `${averages.venda_real_kg_media} kg`
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {contexto === "dia"
                ? `Venda Real de Hoje`
                : `Venda Real Média`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Porcentagem Atendida Card */}
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Porcentagem Atendida
            </CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {contexto === "dia"
                ? `${dadoDoDia?.porcentagem_atendida?.toFixed(2)} %`
                : `${averages.porcentagem_atendida_media}%`
                }
            </div>
            <p
              className={`text-xs font-medium mt-1 ${performanceStatus.color}`}
            >
              {performanceStatus.status}
            </p>
          </CardContent>
        </Card>

        {/* Quilos Excedentes Card */}
        <Card className="bg-gradient-to-br from-pulse-accent/20 to-pulse-accent-dark/20 border-pulse-accent/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quilos Excedentes
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-pulse-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pulse-accent">
              {contexto === "dia"
                ? `${dadoDoDia?.quilos_excedentes_kg?.toFixed(2)} kg`
                : `${averages.quilos_excedentes_kg_total} kg`
                }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contexto === "dia"
                ? `Hoje`
                : `${averages.total_dias} dias`
                }
            </p>
          </CardContent>
        </Card>

        {/* Retirada Emergencial Card */}
        <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Retirada Emergencial
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {contexto === "dia"
                ? `${dadoDoDia?.retirada_emergencial_kg?.toFixed(2)} kg`
                : `${averages.retirada_emergencial_kg_total} kg`
                }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              
              {contexto === "dia"
                ? `Hoje`
                : `Total do período`
                }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Bar Chart */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <BarChart className="w-6 h-6 text-pulse-primary" />
            Performance Diária - Porcentagem Atendida
          </CardTitle>
          <p className="text-muted-foreground">
            Análise dos últimos 15 dias
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    type="category"
                    dataKey="data_formatada"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      color: "#fff",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                    }}
                    formatter={(value: any, name: any) => [
                      <span style={{ color: "#fff"}}>{`Porcentagem Atendida: ${value.toFixed(1)}%`}</span>,
                    ]}
                    labelFormatter={(label) => (
                      <span style={{ color: "#fff" }}>{`Data: ${label}`}</span>
                    )}
                  />
                  <Bar dataKey="porcentagem_atendida" radius={[0, 8, 8, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.performance_color}
                      />
                    ))}
                  </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Excelente (≥95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pulse-accent rounded"></div>
              <span>Bom (85-94%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pulse-accent-dark rounded"></div>
              <span>Regular (75-84%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Abaixo (&lt;75%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Data Table */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-pulse-primary" />
            Dados Diários Detalhados
            </CardTitle>
          <p className="text-muted-foreground">
            Informações completas de performance por dia
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
                    % Atendida
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Excedente (kg)
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Retirada Emergencial (kg)
                  </th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {linhasParaTabela.map((row, index) => {
                  const status = getPerformanceStatus(row.porcentagem_atendida);
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
                        {row.previsao_venda_kg.toFixed(2)}
                      </td>
                      <td className="p-4 text-pulse-accent font-semibold">
                        {row.venda_real_kg}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-bold ${
                            row.porcentagem_atendida >= 95
                              ? "text-green-500"
                              : row.porcentagem_atendida >= 85
                                ? "text-pulse-accent"
                                : row.porcentagem_atendida >= 75
                                  ? "text-orange-500"
                                  : "text-red-500"
                          }`}
                        >
                          {(row.porcentagem_atendida).toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4">{(row.quilos_excedentes_kg).toFixed(2)}</td>
                      <td className="p-4">
                        {row.retirada_emergencial_kg > 0 ? (
                          <span className="text-red-500 font-semibold">
                            {(row.retirada_emergencial_kg).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            status.status === "Excelente"
                              ? "bg-green-500/20 text-green-500"
                              : status.status === "Bom"
                                ? "bg-pulse-accent/20 text-pulse-accent"
                                : status.status === "Regular"
                                  ? "bg-orange-500/20 text-orange-500"
                                  : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {status.status}
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

      {/* Summary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-pulse-primary/10 to-pulse-secondary/10 border-pulse''''''''''''''''-primary/20">
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
                  MAPE médio: {averages.mape_previsao_media}% - Indica a
                  precisão das previsões realizadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pulse-accent/10 to-pulse-accent-dark/10 border-pulse-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pulse-accent rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-pulse-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Gestão de Excedentes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total de {averages.quilos_excedentes_kg_total} kg excedentes
                  indica oportunidades de otimização
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DesempenhoPrevisao;
