const AccountPassword = ((element) => {
  const currentPassword = $('#currentPassword');
  const newPassword = $('#newPassword');
  const matchPassword = $('#matchPassword');

  const changePassword = $('#changePassword');
  const changePasswordForm = $('#changePasswordForm');

  function init() {
    changePasswordForm.submit(onChangePasswordSubmit);
  }

  function onChangePasswordSubmit(e) {
    e.preventDefault();

    if (newPassword.val() !== matchPassword.val()) {
      matchPassword.focus();
      return toastr.warning(`Las contraseñas no coinciden.`);
    }

    const body = {
      password: currentPassword.val(),
      newPassword: newPassword.val()
    }

    disableButton(changePassword, true);
    $.post({
      url: `/api/settings/account?change-password`,
      contentType: 'application/json'
    }, JSON.stringify(body)).done(() => {
      currentPassword.val(null);
      newPassword.val(null);
      matchPassword.val(null);
      toastr.success('La contraseña ha sido actualizada');
    }).fail((error) => {
      const code = error.responseJSON.code;
      if (code === 'invalid-password') {
        currentPassword.focus();
        return toastr.warning('La contraseña actual es incorrecta.');
      }
      toastr.warning(`Ocurrio un error al ejecutar la acción, intente nuevamente más tarde.`);
    }).always(() => {
      enableButton(changePassword);
    });

  }

  init();
})({});


const AccountDelete = ((element) => {
  const deletePhrase = 'Eliminar';
  const deletePhraseLabel = $('#deletePhraseLabel');
  const deleteAccountModal = $('#deleteAccountModal');
  const deleteAccountBtn = $('#deleteAccount');

  function init() {
    deletePhraseLabel.text(`"${deletePhrase}"`);
    deleteAccountBtn.click(onDeleteAccountClick)
  }

  function onDeleteAccountClick() {
    deleteAccountModal.modal('show');
  }

  // function onDeleteAccountSubmit(e) {
  //   e.preventDefault();
  // }

  init();
})({});