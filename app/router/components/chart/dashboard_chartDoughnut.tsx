'use client'
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, scales, LinearScale } from "chart.js";
import { max } from "date-fns";

interface ArcedProps {
  value: number;
  agentName: string;
}

ChartJS.register(ArcElement, Tooltip, Legend);

export function Dashboard_DoughnutChart(props: ArcedProps) {
console.log('props :', props);

  let bgColor;
  let borderColor;
  if (props.value > 80) {
    bgColor = ['rgba(0, 169, 110)', 'rgba(19, 31, 39, 0.9)'];
    borderColor = ['rgba(0, 169, 110, 0.9)', 'rgba(255, 159, 64, 0.2)'];
  } else if (props.value > 50 && props.value < 80) {
    bgColor = ['rgba(255, 190, 0)', 'rgba(19, 31, 39, 0.9)'];
    borderColor = ['rgba(255, 190, 0, 0.9)', 'rgba(255, 159, 64, 0.2)'];
  } else {
    bgColor = ['rgba(255, 88, 97)', 'rgba(19, 31, 39, 0.9)'];
    borderColor = ['rgba(255, 88, 97, 0.9)', 'rgba(255, 0, 0, 0.2)'];
  }

  const chartOptions = {
    responsive: true, // Wyłącz responsywność
    maintainAspectRatio: false , // Wyłącz zachowanie proporcji
  };

  return (
    <div>
      <Doughnut data={{
        labels: ['Ocena'],
        datasets: [{
          label: props.agentName,
          data: [props.value, 100 - props.value],
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: 1
        }]
      }}
        options={chartOptions}
        width={300}
        height={300}
      />
    </div >
  );
}
