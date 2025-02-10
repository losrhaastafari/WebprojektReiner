import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = {
  chart: {
    type: 'column',
  },
  title: {
    text: 'Angebotsstatistiken',
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'März', 'Apr', 'Mai'],
  },
  yAxis: {
    title: {
      text: 'Anzahl Angebote',
    },
  },
  series: [
    {
      name: 'Erstellte Angebote',
      data: [5, 3, 4, 7, 2],
    },
    {
      name: 'Abgeschlossene Angebote',
      data: [2, 2, 3, 2, 1],
    },
  ],
};

export default function HighchartsChart() {
  return (
    <div className="chart-container my-4">
      <h5 className="text-center">Angebotsstatistiken (Highcharts)</h5>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
