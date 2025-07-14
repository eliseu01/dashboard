import { useEffect, useState } from 'react';
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
import { CalendarIcon, TrendingUp, TrendingDown, Download } from "lucide-react";
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
// Mock data for the temporal chart
const generateMockData = () => {
  const data = [];
  const baseDate = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const predicted = 800 + Math.random() * 400;
    const actual = predicted + (Math.random() - 0.5) * 200;

    data.push({
      date: format(date, "dd/MM", { locale: ptBR }),
      fullDate: date.toISOString(),
      vendas_previstas: Math.round(predicted),
      vendas_reais: Math.round(actual),
    });
  }

  return data;
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("dezembro");
  const [selectedWeek, setSelectedWeek] = useState("48");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/csv-data")
      .then((res) => res.json())
      .then((data) => {
        const dadosTratados = data.map((item: any) => ({
          date: format(new Date(item.data), "dd/MM", { locale: ptBR }),
          fullDate: new Date(item.data).toISOString(),
          vendas_previstas: Number(item.previsao_venda_kg),
          vendas_reais: Number(item.venda_real_kg),
          porcentagem_atendida: Number(item.porcentagem_atendida),
          exposto_na_vitrine_kg: Number(item.exposto_na_vitrine_kg),
          quilos_excedentes_kg: Number(item.quilos_excedentes_kg),
          quilos_estragados_kg: Number(item.quilos_estragados_kg),
          retirada_emergencial_kg: Number(item.retirada_emergencial_kg),
          descongelado_para_futuro_kg: Number(item.descongelado_para_futuro_kg),
          estoque_freezer_kg: Number(item.estoque_freezer_kg),
          estoque_congelador_kg: Number(item.estoque_congelador_kg),
          mape_previsao: Number(item.mape_previsao),
          mape_operacional: Number(item.mape_operacional),
        }));

        setChartData(dadosTratados);
      });
  }, []);


  // Calculate summary metrics
  const totalPredicted = chartData.reduce(
    (sum, item) => sum + item.vendas_previstas,
    0,
  );
  const totalActual = chartData.reduce(
    (sum, item) => sum + item.vendas_reais,
    0,
  );
  const variation = ((totalActual - totalPredicted) / totalPredicted) * 100;

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
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/csv-data')
      .then((res) => res.json())
      .then((data) => {
        setDados(data);
        console.log('Dados do CSV:', data);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados do CSV:', err);
      });
  }, []);


  return (
    <div className="space-y-6">
      {/* Page Title */}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Geral
          </h1>
          <pre>{JSON.stringify(dados.slice(0, 5), null, 2)}</pre>
          <p className="text-muted-foreground mt-1">
            Análise temporal de vendas previstas vs realizadas
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="filter-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Year Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Ano</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Mês</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Week Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Semana
            </label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a semana" />
              </SelectTrigger>
              <SelectContent>
                {weeks.map((week) => (
                  <SelectItem key={week} value={week}>
                    Semana {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Previstas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-pulse-primary" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-pulse-primary">
              {totalPredicted.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Realizadas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-pulse-accent" />
          </CardHeader>
          <CardContent>
            <div className="data-large text-pulse-accent">
              {totalActual.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação</CardTitle>
            {variation >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`data-large ${variation >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {variation >= 0 ? "+" : ""}
              {variation.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {variation >= 0 ? "Acima" : "Abaixo"} do previsto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Temporal Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Análise Temporal - Vendas Previstas vs Realizadas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparação das vendas previstas e realizadas nos últimos 30 dias
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value, name) => [
                    value?.toLocaleString(),
                    name === "vendas_previstas"
                      ? "Vendas Previstas"
                      : "Vendas Realizadas",
                  ]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vendas_previstas"
                  stroke="#1F82BF"
                  strokeWidth={3}
                  name="Vendas Previstas"
                  dot={{ fill: "#1F82BF", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="vendas_reais"
                  stroke="#F2CB57"
                  strokeWidth={3}
                  name="Vendas Realizadas"
                  dot={{ fill: "#F2CB57", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Insight */}
      <Card className="bg-pulse-primary/10 border-pulse-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pulse-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Insight do Período
              </h3>
              <p className="text-sm text-muted-foreground">
                {Math.abs(variation) < 5
                  ? "As vendas estão alinhadas com as previsões, indicando boa precisão do modelo."
                  : variation > 0
                    ? "Vendas superaram as expectativas. Considere revisar os parâmetros de previsão."
                    : "Vendas abaixo do previsto. Recomenda-se análise dos fatores externos."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
