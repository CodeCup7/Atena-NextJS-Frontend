'use client'
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

interface ArcedProps {
  value: number[];
  agentName: string;
}

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export function Dashboard_LineChart(props: ArcedProps) {

  const chartOptions = {
    responsive: true, // Wyłącz responsywność
    maintainAspectRatio: false , // Wyłącz zachowanie proporcji
  };

  return (

    <div>
      <Line data={{
        labels: ['1', '2', '3'],
        datasets: [{
          label: props.agentName,
          data: [65, 59, 80],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }}
        options={chartOptions}
        width={1000}
        height={300}
      />
    </div >
  );
}
