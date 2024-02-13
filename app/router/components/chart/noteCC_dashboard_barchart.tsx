'use client'
import React from "react";
import { Bar, } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from "chart.js";

interface ArcedProps {
  value: number[];
  agentName: string;
}

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export function Dashboard_NoteCC_BarChart(props: ArcedProps) {
  const chartOptions = {
    responsive: false, // Wyłącz responsywność
    maintainAspectRatio: false , // Wyłącz zachowanie proporcji
  };

  return (

    <div>
      <Bar data={{
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
          label: props.agentName,
          data: props.value,
          borderColor: 'rgb(75, 192, 192)',
        }]
      }}
        options={chartOptions}
        width={900}
        height={225}
      />
    </div >
  );
}
