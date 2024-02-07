'use client'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

export default function UploadExcel() {

    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ['Ocena Agenta'],
        datasets: [{   // <- Dodaj pustą tablicę datasets
            label: '# sadas of Votes',
            data: [80,20],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };


    return (
        <div>
            <Doughnut data={data} />
        </div>
    );
}
