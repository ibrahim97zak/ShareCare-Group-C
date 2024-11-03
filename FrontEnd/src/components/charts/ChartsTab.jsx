import { lazy, Suspense } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

// Lazy load BarCharts component
const BarCharts = lazy(() => import('./BarCharts'));

const ChartsTab = ({ chartData, role, items }) => {
  const data = {
    labels: chartData.labels,
    datasets: [{
      label: role === "Donor" ? "Offers" : role === "Beneficiary" ? "Requests" : "Offers & Requests",
      data: chartData.datasets[0].data,
      backgroundColor: chartData.datasets[0].backgroundColor,
      hoverOffset: 4
    }]
  };

  const options = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => `${value} (${ctx.chart.data.labels[ctx.dataIndex]})`,
        color: 'white',
        font: {
          weight: 'bold'
        }
      }
    }
  };

  return (
    <div className='charts-tab-smaller'>
      <h2 className="text-lg font-bold mb-4">Distribution Chart</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="text-lg font-bold">Quantities based on donation type</h2>
          <Doughnut data={data} options={options} />
        </div>
        <div className="col-span-2">
          <Suspense fallback={<div>Loading Bar Chart...</div>}>
            <BarCharts items={items} role={role} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ChartsTab;
