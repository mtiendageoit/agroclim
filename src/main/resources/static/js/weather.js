const Weather = ((element) => {
  const dayContainer = $('#dayWeatherContainer');
  const weatherModal = $('#weatherModal');
  

  function init() {
    dayContainer.click(onDayContainerClick)

    onDayContainerClick();
  }

  function onDayContainerClick() {
    weatherModal.modal('show');
  }

  init();

  return element;
})({});