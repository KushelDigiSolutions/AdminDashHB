import { ChartType } from './chartjs.model';

const donutChart: ChartType = {
    labels: [
        'Desktops', 'Tablets'
    ],
    datasets: [
        {
            data: [300, 210],
            backgroundColor: [
                '#556ee6', '#ebeff2'
            ],
            hoverBackgroundColor: ['#556ee6', '#ebeff2'],
            hoverBorderColor: '#fff',
        }],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        }
    }
};

export { donutChart };
