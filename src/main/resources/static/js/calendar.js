const CalendarImages = (function (element) {
  const calendarImages = $('#calendarImages');
  let currentDates;
  let currentField;

  element.activeDates = (dates, field) => {
    disabled();
    if (dates && dates.length > 0) {
      currentDates = dates;
      currentField = field;

      const startDate = currentDates[currentDates.length - 1].imageDate;
      calendarImages.datepicker('setStartDate', startDate);
    }
  };

  element.activateDate = (date) => {
    if (currentDates) {
      const exists = currentDates.find(item => item.imageDate === date);
      if (exists) {
        calendarImages.datepicker("setDate", date);
        OlMapField.getIndiceImageField(currentField, date);
      }
    }
  };

  function init() {
    initControls();
    disabled();
  }

  function initControls() {
    calendarImages.datepicker({
      autoclose: true,
      todayBtn: true,
      language: 'es',
      todayHighlight: false,
      format: 'dd/mm/yyyy',
      orientation: 'bottom right',
      container: '#calendarImagesContainer',
      beforeShowDay: beforeShowDay
    });
  }

  function beforeShowDay(date) {
    if (currentDates) {
      const showDate = formatDate(date);
      const imageDate = currentDates.find(item => item.imageDate === showDate);

      return {
        enabled: imageDate ? true : false
      }
    }

    return {
      enabled: false
    }
  }

  function disabled() {
    let startDate, endDate;
    startDate = endDate = formatDate(new Date());

    calendarImages.datepicker('setStartDate', startDate);
    calendarImages.datepicker('setEndDate', endDate);
    calendarImages.datepicker('setDatesDisabled', startDate);

    fieldImageDates = null;
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("es-MX", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  init();
  return element;
})({});