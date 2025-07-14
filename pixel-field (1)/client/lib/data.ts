import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface VendasData {
  data: string;
  previsao_venda_kg: number;
  venda_real_kg: number;
  exposto_na_vitrine_kg: number;
  porcentagem_atendida: number;
  quilos_excedentes_kg: number;
  quilos_estragados_kg: number;
  retirada_emergencial_kg: number;
  descongelado_para_futuro_kg: number;
  estoque_freezer_kg: number;
  estoque_congelador_kg: number;
  mape_previsao: number;
  mape_operacional: number;
}

export interface FilterState {
  year: string;
  month: string;
  week: string;
  date: Date | undefined;
}

// Generate realistic mock data for the last 30 days
export const generateMockData = (days: number = 30): VendasData[] => {
  const data: VendasData[] = [];
  const baseDate = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const currentDate = subDays(baseDate, i);

    // Base values with some seasonal patterns
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const basePrevisao = isWeekend
      ? 45 + Math.random() * 20
      : 65 + Math.random() * 30;

    const previsao_venda_kg = Math.round(basePrevisao * 10) / 10;
    const vendaVariation = (Math.random() - 0.5) * 0.3; // ±15% variation
    const venda_real_kg =
      Math.round(previsao_venda_kg * (1 + vendaVariation) * 10) / 10;

    const porcentagem_atendida = Math.min(
      100,
      Math.round((venda_real_kg / previsao_venda_kg) * 100 * 10) / 10,
    );

    const quilos_excedentes_kg = Math.max(
      0,
      Math.round((previsao_venda_kg - venda_real_kg) * 10) / 10,
    );
    const exposto_na_vitrine_kg =
      Math.round((venda_real_kg + quilos_excedentes_kg * 0.8) * 10) / 10;

    // Stock levels (decreasing over time)
    const stockBase = 800 - i * 5 + Math.random() * 50;
    const estoque_freezer_kg = Math.round(stockBase * 0.7);
    const estoque_congelador_kg = Math.round(stockBase * 0.3);

    // Quality and operational data
    const quilos_estragados_kg = Math.round(Math.random() * 3 * 10) / 10;
    const retirada_emergencial_kg =
      Math.random() > 0.8 ? Math.round(Math.random() * 8 * 10) / 10 : 0;
    const descongelado_para_futuro_kg = Math.round(Math.random() * 5 * 10) / 10;

    // MAPE calculations
    const mape_previsao =
      Math.round(
        Math.abs((venda_real_kg - previsao_venda_kg) / previsao_venda_kg) *
          100 *
          10,
      ) / 10;
    const mape_operacional =
      Math.round((mape_previsao + Math.random() * 2) * 10) / 10;

    data.push({
      data: format(currentDate, "yyyy-MM-dd"),
      previsao_venda_kg,
      venda_real_kg,
      exposto_na_vitrine_kg,
      porcentagem_atendida,
      quilos_excedentes_kg,
      quilos_estragados_kg,
      retirada_emergencial_kg,
      descongelado_para_futuro_kg,
      estoque_freezer_kg,
      estoque_congelador_kg,
      mape_previsao,
      mape_operacional,
    });
  }

  return data;
};

// Utility functions for data analysis
export const calculateAverages = (data: VendasData[]) => {
  if (data.length === 0) return null;

  const totals = data.reduce(
    (acc, item) => ({
      previsao_venda_kg: acc.previsao_venda_kg + item.previsao_venda_kg,
      venda_real_kg: acc.venda_real_kg + item.venda_real_kg,
      porcentagem_atendida:
        acc.porcentagem_atendida + item.porcentagem_atendida,
      quilos_excedentes_kg:
        acc.quilos_excedentes_kg + item.quilos_excedentes_kg,
      quilos_estragados_kg:
        acc.quilos_estragados_kg + item.quilos_estragados_kg,
      retirada_emergencial_kg:
        acc.retirada_emergencial_kg + item.retirada_emergencial_kg,
      descongelado_para_futuro_kg:
        acc.descongelado_para_futuro_kg + item.descongelado_para_futuro_kg,
      mape_previsao: acc.mape_previsao + item.mape_previsao,
      mape_operacional: acc.mape_operacional + item.mape_operacional,
    }),
    {
      previsao_venda_kg: 0,
      venda_real_kg: 0,
      porcentagem_atendida: 0,
      quilos_excedentes_kg: 0,
      quilos_estragados_kg: 0,
      retirada_emergencial_kg: 0,
      descongelado_para_futuro_kg: 0,
      mape_previsao: 0,
      mape_operacional: 0,
    },
  );

  const count = data.length;

  return {
    previsao_venda_kg_media:
      Math.round((totals.previsao_venda_kg / count) * 10) / 10,
    venda_real_kg_media: Math.round((totals.venda_real_kg / count) * 10) / 10,
    porcentagem_atendida_media:
      Math.round((totals.porcentagem_atendida / count) * 10) / 10,
    quilos_excedentes_kg_total:
      Math.round(totals.quilos_excedentes_kg * 10) / 10,
    quilos_estragados_kg_total:
      Math.round(totals.quilos_estragados_kg * 10) / 10,
    retirada_emergencial_kg_total:
      Math.round(totals.retirada_emergencial_kg * 10) / 10,
    descongelado_para_futuro_kg_total:
      Math.round(totals.descongelado_para_futuro_kg * 10) / 10,
    mape_previsao_media: Math.round((totals.mape_previsao / count) * 10) / 10,
    mape_operacional_media:
      Math.round((totals.mape_operacional / count) * 10) / 10,
    total_dias: count,
  };
};

// Format data for chart display
export const formatChartData = (data: VendasData[]) => {
  return data.map((item) => ({
    ...item,
    data_formatada: format(new Date(item.data), "dd/MM", { locale: ptBR }),
    data_completa: format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR }),
  }));
};

// Filter data by date range
export const filterDataByDateRange = (
  data: VendasData[],
  startDate: Date,
  endDate: Date,
) => {
  return data.filter((item) => {
    const itemDate = new Date(item.data);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

// Get latest stock data
export const getLatestStockData = (data: VendasData[]) => {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : latest;

  return {
    current: latest,
    previous: previous,
    freezer_trend: latest.estoque_freezer_kg - previous.estoque_freezer_kg,
    congelador_trend:
      latest.estoque_congelador_kg - previous.estoque_congelador_kg,
  };
};

// Calculate performance indicators
export const getPerformanceIndicators = (data: VendasData[]) => {
  const averages = calculateAverages(data);
  if (!averages) return null;

  const excellentThreshold = 95;
  const goodThreshold = 85;
  const poorThreshold = 75;

  const performanceLevel =
    averages.porcentagem_atendida_media >= excellentThreshold
      ? "excellent"
      : averages.porcentagem_atendida_media >= goodThreshold
        ? "good"
        : averages.porcentagem_atendida_media >= poorThreshold
          ? "average"
          : "poor";

  const wastePercentage =
    (averages.quilos_estragados_kg_total /
      (averages.previsao_venda_kg_media * averages.total_dias)) *
    100;

  return {
    ...averages,
    performance_level: performanceLevel,
    waste_percentage: Math.round(wastePercentage * 10) / 10,
  };
};

// Export functionality
export const exportToCSV = (data: VendasData[], filename: string) => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(","));
  const csvContent = [headers, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};
