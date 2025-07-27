'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const RegionPriceChart = ({ regions, prices }) => {

   


    const config = {
        labels: regions,
        datasets: [
            {
                label: 'Price per Unit (USD)',
                data: prices,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                fill: true,
                tension: 0.3,
                pointRadius: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false },
        },
        scales: {
            x: {
                title: { display: true, text: 'Region' },
                ticks: { maxRotation: 90, minRotation: 45 },
            },
            y: {
                title: { display: true, text: 'Price (USD)' },
                beginAtZero: true,
            },
        },
    };

    return <Line data={config} options={options} />;
};

export default RegionPriceChart;
