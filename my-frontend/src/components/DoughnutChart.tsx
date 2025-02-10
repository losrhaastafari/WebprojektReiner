import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Registriere die benötigten Elemente
Chart.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Kategorie 1', 'Kategorie 2', 'Kategorie 3'],
  datasets: [
    {
      data: [30, 50, 20],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF4364', '#1A8FE0', '#FFC843'],
    },
  ],
};

export default function DoughnutChart() {
  return (
    <div className="chart-container my-4">
      <h5 className="text-center">Datenübersicht (Doughnut-Chart)</h5>
      <Doughnut data={data} />
    </div>
  );
}
