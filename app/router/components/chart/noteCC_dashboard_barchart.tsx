'use client'
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { Mistake } from "@/app/classes/mistake";
import { getKeyAsName } from "@/app/globalKeys";

interface ArcedProps {
  agentName: string;
  data: Record<string, number>[]
}

ChartJS.register(Title, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export function Dashboard_NoteCC_BarChart(props: ArcedProps) {
  const chartOptions = {
    responsive: false, // Wyłącz responsywność
    maintainAspectRatio: false, // Wyłącz zachowanie proporcji
    plugins: {
      title: {
        display: true,
        text: 'Wykres błędów agenta',
        padding: {
          top: 1,
          bottom: 3
        },
        font:{
          size:14
        }
      },
      legend: {
        display: false,
    }

    }
  };

  return (
    <div>
      <Bar
        data={{
          labels: props.data.map(entry => getKeyAsName(Object.keys(entry)[0])),
          datasets: [{
            label: props.agentName,
            data: props.data.map(entry => Object.values(entry)[0]),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
            ],
            borderWidth: 1
          }]
        }}
        options={chartOptions}
        width={900}
        height={225}
      />
    </div>
  );
}
