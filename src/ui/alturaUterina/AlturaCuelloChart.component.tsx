// AlturaCuelloChart.tsx
import React from 'react';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

interface PacienteDataPoint {
  semana: number;
  altura: number;
}

interface AlturaCuelloChartProps {
  pacienteData?: PacienteDataPoint[];
  paciente?: string;
}

const percentiles = [
  { semana: 13, p10: 8.0, p90: 12.0 },
  { semana: 14, p10: 9.0, p90: 14.0 },
  { semana: 15, p10: 10.0, p90: 15.0 },
  { semana: 16, p10: 12.0, p90: 17.0 },
  { semana: 17, p10: 13.0, p90: 18.0 },
  { semana: 18, p10: 14.0, p90: 19.0 },
  { semana: 19, p10: 14.0, p90: 20.0 },
  { semana: 20, p10: 15.0, p90: 21.0 },
  { semana: 21, p10: 16.0, p90: 22.0 },
  { semana: 22, p10: 17.0, p90: 23.0 },
  { semana: 23, p10: 18.0, p90: 23.0 },
  { semana: 24, p10: 19.0, p90: 24.0 },
  { semana: 25, p10: 20.0, p90: 25.0 },
  { semana: 26, p10: 21.0, p90: 26.0 },
  { semana: 27, p10: 21.0, p90: 27.0 },
  { semana: 28, p10: 22.0, p90: 27.0 },
  { semana: 29, p10: 23.0, p90: 28.0 },
  { semana: 30, p10: 24.0, p90: 29.0 },
  { semana: 31, p10: 25.0, p90: 30.0 },
  { semana: 32, p10: 25.0, p90: 30.0 },
  { semana: 33, p10: 26.0, p90: 31.0 },
  { semana: 34, p10: 26.0, p90: 32.0 },
  { semana: 35, p10: 27.0, p90: 33.0 },
  { semana: 36, p10: 28.0, p90: 33.0 },
  { semana: 37, p10: 29.0, p90: 34.0 },
  { semana: 38, p10: 30.0, p90: 34.0 },
  { semana: 39, p10: 31.0, p90: 35.0 },
  { semana: 40, p10: 31.0, p90: 35.0 },
];

const getChartData = (pacienteData?: PacienteDataPoint[], paciente?: string) => {
  const data: any[] = [];

  percentiles.forEach((row) => {
    data.push({ group: 'P10', semana: row.semana, value: row.p10 });
    data.push({ group: 'P90', semana: row.semana, value: row.p90 });
  });

  if (pacienteData && paciente) {
    pacienteData.forEach((d) => {
      data.push({ group: paciente, semana: d.semana, value: d.altura });
    });
  }

  return data;
};

const options = (paciente?: string) => ({
  title: 'Altura Uterina (cm) por Semana',
  axes: {
    bottom: {
      title: 'Semanas',
      mapsTo: 'semana',
      scaleType: 'linear',
    },
    left: {
      title: 'Altura Uterina (cm)',
      mapsTo: 'value',
      scaleType: 'linear',
      domain: [5, 40],
    },
  },
  height: '400px',
  legend: { enabled: true },
  tooltip: { enabled: true },
  color: {
    scale: {
      P10: '#e67300',
      P90: '#cc0000',
      ...(paciente ? { [paciente]: '#2b6693' } : {}),
    },
  },
  points: { enabled: true },
  curve: 'curveMonotoneX',
});

const AlturaCuelloChart: React.FC<AlturaCuelloChartProps> = ({ pacienteData, paciente }) => {
  const chartData = getChartData(pacienteData, paciente);

  return (
    <div style={{ maxWidth: 700 }}>
      <LineChart data={chartData} options={options(paciente)} />
    </div>
  );
};

export default AlturaCuelloChart;
