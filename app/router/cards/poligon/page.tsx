'use client'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Dashboard_LineChart } from '../../components/chart/dashboard_chartLine';
import { Dashboard_DoughnutChart } from '../../components/chart/dashboard_chartDoughnut';

export default function UploadExcel() {

    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <div className='flex flex-row m-5 h-96'>
                <div className=''>
                    <Dashboard_DoughnutChart value={50} agentName='Szymon' />
                </div>
                <div className=''>
                    <Dashboard_LineChart value={[10, 20, 30]} agentName='Szymon' />
                </div>
            </div>
        </div>
    );
}
