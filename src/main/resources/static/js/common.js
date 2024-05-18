$(function () {
  $.ajaxSetup({
    statusCode: {
      401: function () {
        location.reload();
      }
    }
  });
  
  $('[data-toggle="tooltip"]').tooltip();
});

const emptyToNull = (value) => {
  if (value == null || value == undefined) return null;
  if (value.trim().length == 0) return null;
  return value.trim();
}

const disableButton = (button, loading = false) => {
  if (loading)
    $(button).append('<span class="ml-2 spinner-border" role="status" aria-hidden="true"></span>');
  $(button).attr('disabled', 'disabled');
  $(button).addClass('disabled');
};

const enableButton = (button) => {
  $(button).find('.spinner-border').remove();
  $(button).removeAttr('disabled');
  $(button).removeClass('disabled');
};

const soloNumeros = (event) => {
  const tecla = event.key;
  const esNumero = /[0-9]/.test(tecla);
  if (!esNumero) {
    event.preventDefault();
  }
}

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

!function (a) { a.fn.datepicker.dates.es = { days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"], daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"], months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], today: "Hoy", monthsTitle: "Meses", clear: "Borrar", weekStart: 1, format: "dd/mm/yyyy" } }(jQuery);