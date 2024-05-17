const ProfileGeneral = ((element) => {
  const phone = $('#phone');
  const email = $('#email');
  const fullname = $('#fullname');
  const saveGeneral = $('#saveGeneral');

  const profileName = $('.principal-name');

  function init() {
    initUI();
    getProfile();
  }

  function initUI() {
    $('#generalInfo').submit(generalInfoSubmit);
  }

  function generalInfoSubmit(e) {
    e.preventDefault();

    const profile = {
      fullname: emptyToNull(fullname.val()),
      phone: emptyToNull(phone.val())
    }

    disableButton(saveGeneral, true);
    $.post({
      url: `/api/settings/profile?general`,
      contentType: 'application/json'
    }, JSON.stringify(profile)).done((profile) => {
      showProfile(profile);
      toastr.success('Perfil actualizado');
    }).fail(function () {
      toastr.warning(`Ocurrio un error al ejecutar la acción, intente nuevamente más tarde.`);
    }).always(function () {
      enableButton(saveGeneral);
    });
  }

  function getProfile() {
    $.get("/api/settings/profile", showProfile);
  }

  function showProfile(profile) {
    fullname.val(profile.fullname);
    email.val(profile.email);
    phone.val(profile.phone);

    profileName.text(profile.fullname);
  }

  init();
  return element;
})({});