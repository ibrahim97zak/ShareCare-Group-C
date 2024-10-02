/* eslint-disable react/prop-types */
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import BarCharts from './BarCharts';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const ChartsTab = ({ chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: [{
      label: 'Donations',
      data: chartData.datasets[0].data,
      backgroundColor: chartData.datasets[0].backgroundColor,
      hoverOffset: 4
    }]
  };

  const options = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return `${value} (${ctx.chart.data.labels[ctx.dataIndex]})`;
        },
        color: 'white',
        font: {
          weight: 'bold'
        }
      }
    }
  };

  return (
    <div className='charts-tab-smaller '>
      <h2 className="text-lg font-bold mb-4">Distribution Chart</h2>
      <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
      <Doughnut data={data} options={options} />
      </div>
      <div className="col-span-2">
        <BarCharts />
      </div>
    </div>
      
    </div>
  );
};
export default ChartsTab;