const Weather = ((element) => {
  const dayContainer = $('#dayWeatherContainer');
  const weatherModal = $('#weatherModal');
  const variables = $('.weatherVariable');


  function init() {
    dayContainer.click(onDayContainerClick);
    variables.click(onVariableClick);

    onDayContainerClick();
  }

  function onVariableClick() {
    variables.parent().removeClass('btn-success').addClass('btn-default');
    $(this).parent().removeClass('btn-default').addClass('btn-success');
  }

  function onDayContainerClick() {
    weatherModal.modal('show');

    element.renderChart();
  }

  element.renderChart = (data) => {
    Highcharts.chart('weatherChartContainer', {
      title: { text: '' },
      credits: { enabled: false },
      xAxis: { type: 'datetime', offset: 40 },
      yAxis: [
        { title: { text: 'Temperatura °C' }, labels: { format: '{value}°' } },
        {
          title: { text: 'Humedad' },
          labels: { format: '{value} %' },
        },
        {
          title: { text: 'Precipitación' },
          labels: { format: '{value} mm' },
          opposite: true
        }
      ],
      plotOptions: {
        series: {
          pointStart: Date.UTC(2022, 6, 30),
          pointInterval: 36e5 * 2
        }
      },
      tooltip: {
        pointFormatter: function () {
          return `<span style=\"color:${this.color}\">●</span> ${this.series.name}: <b>${this.y}</b> <span style="opacity: 0.5"></span><br/>`;
        },
        shared: true
      },
      series: [
        {
          yAxis: 1,
          type: 'column',
          name: 'Precipitación',
          color: Highcharts.getOptions().colors[0],
          data: [27.6, 28.8, 21.7, 34.1, 29.0, 28.4, 45.6, 51.7, 39.0, 60.0, 28.6, 32.1, 10],
          tooltip: { valueSuffix: ' mm' }
        },
        {
          yAxis: 2,
          type: 'spline',
          name: 'Humedad',
          color: Highcharts.getOptions().colors[4],
          data: [2, 20, 42, 10, 25, 6, 17, 50, 17, 20, 37, 12, 20],
          tooltip: { valueSuffix: ' %' }
        },
        {
          type: 'spline',
          data: [5, 10, 15, 25, 20, 23, 7, 10, 15, 40, 35, 24, 20],
          color: '#ffa726',
          // fillColor: {
          //   linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          //   stops: [
          //     [0, '#ffe1b6'],
          //     [1, '#fffcf7'],
          //   ]
          // },
          name: 'Temperatura',
          tooltip: { valueSuffix: ' °C' },
        }, {
          type: 'windbarb',
          data: [
            [4.9, 90],
            [4.1, 242],
            [3.2, 262],
            [1.5, 284],
            [1.1, 294],
            [0.4, 192],
            [0.2, 30],
            [1.1, 110],
            [1.4, 112],
            [2.1, 132],
            [1.6, 134],
            [1.5, 128],
            [0.7, 91]
          ],
          name: 'Viento',
          color: Highcharts.getOptions().colors[1],
          showInLegend: false,
          tooltip: {
            valueSuffix: ' m/s'
          }
        }]
    });
  };

  init();

  return element;
})({});