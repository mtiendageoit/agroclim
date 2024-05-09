const Fields = ((element) => {
  element.goToFieldInMap = (uuid) => {
    OlMap.goToFeature(uuid);
  }

  element.deleteField = (uuid, name) => {
    $('#deleteFieldName').text(name);
    $('#deleteFieldModal').data('uuid', uuid).modal('show');
  };

  function init() {
    initUI();
    getUserFields();
  }

  function initUI() {
    $('#fieldBorderColor').minicolors({
      control: 'hue',
      position: 'bottom left',
    });

    $('#fieldCrop').select2({
      placeholder: 'Select value',
      dropdownParent: '#saveFieldModal',
      allowClear: false
    });

    $('#fieldPlantingDate,#fieldHarvestDate').datepicker({
      autoclose: true,
      todayBtn: true,
      language: 'es',
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      orientation: 'bottom right',
      container: '#saveFieldModal',
    });

    $('#fieldForm').submit(onFieldFormSubmit);
    $('#fmsCancelBtn').click(cancelSaveField);
    $('#drawNewFieldMenu').click(activateDrawField);
    $('#deleteFieldForm').submit(onDeleteFieldFormSubmit);
  }

  function cancelSaveField() {
    OlMap.removeDrawedField();
  }

  function onDeleteFieldFormSubmit(event) {
    event.preventDefault();

    const uuid = $('#deleteFieldModal').data('uuid');

    disableButton($('#fmdCancelBtn'));
    disableButton($('#fmdDeleteBtn'), true);

    $.post({
      url: `api/fields/${uuid}`,
      type: 'DELETE'
    }).done(() => { onDeleteFieldSuccess(uuid) }).fail((err) => {
      toastr.warning(`Ocurrio un error al ejecutar la acción, intente nuevamente más tarde.`);
    }).always(() => {
      enableButton($('#fmdDeleteBtn,#fmdCancelBtn'));
    });
  }

  function onDeleteFieldSuccess(uuid) {
    $(`#field-${uuid}`).remove();
    OlMap.removeField(uuid);

    $('#deleteFieldModal').modal('hide');
    toastr.success(`Se ha eliminado el lote exitosamente.`);
  }

  function onFieldFormSubmit(event) {
    event.preventDefault();
    const field = getFieldData();

    disableButton($('#fmsCancelBtn'));
    disableButton($('#fmsSaveBtn'), true);

    $.post({
      url: `api/fields`,
      contentType: 'application/json'
    }, JSON.stringify(field)).done(onSaveFieldSuccess).fail(() => {
      toastr.warning(`Ocurrio un error al ejecutar la acción, intente nuevamente más tarde.`);
    }).always(() => {
      enableButton($('#fmsSaveBtn,#fmsCancelBtn'));
    });
  }

  function getFieldData() {
    return {
      name: emptyToNull($('#fieldName').val()),
      cropId: emptyToNull($('#fieldCrop').val()),
      plantingDate: emptyToNull($('#fieldPlantingDate').val()),
      harvestDate: emptyToNull($('#fieldHarvestDate').val()),
      borderColor: $('#fieldBorderColor').val(),
      borderSize: $('#fieldBorderSize').val(),
      wkt: OlMap.drawedWkt()
    };
  }

  function onSaveFieldSuccess(field) {
    resetFieldModal();

    OlMap.removeDrawedField();
    showField(field);

    $('#saveFieldModal').modal('hide');
    toastr.success(`Lote guardado exitosamente.`);
  }

  function activateDrawField() {
    OlMap.activateDrawField(() => {
      resetFieldModal();
      $('#saveFieldModal').modal('show');
      setTimeout(() => { $('#fieldName').select(); }, 300);
    });
  }

  function resetFieldModal() {
    $('#fieldName').val(null);
    $('#fieldCrop').val(null).trigger('change.select2');
    $('#fieldBorderColor').minicolors('value', '#00ff00');
    $('#fieldBorderSize').val(5);
    $('#fieldPlantingDate,#fieldHarvestDate').datepicker('update', '');
  }

  function getUserFields() {
    $('#userFieldsList').empty();

    $.get(`api/fields`, (fields) => {
      $('#userFieldsList').empty();
      fields.forEach(showField);
    });
  }

  function showField(field) {
    OlMap.addField(field);
    addFieldToList(field);
  }

  function addFieldToList(field) {
    $('#userFieldsList').append($(templateFieldUI(field)));
  }

  function templateFieldUI(field) {
    return `
        <div id="field-${field.uuid}" class="pl-3 pr-2 py-2 d-flex justify-content-between align-items-center field-list-item">
          <div class="d-flex align-items-center">
            <div onclick="Fields.goToFieldInMap('${field.uuid}')" class="border p-2 rounded bg-dark" style="position: relative;opacity: 95%; cursor:pointer;">
              <i class="fas fa-seedling text-large text-white"></i>
              <i class="fas fa-seedling text-large" style="color: ${field.borderColor}; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></i>
            </div>
            <div class="ml-2">
              <p class="font-weight-bold m-0 text-truncate field-list-item-name">${field.name}</p>
              <small class="font-weight-normal">datos</small>
            </div>
          </div>
        <div class="btn-group dropright">
          <button id="field-ddm-${field.uuid}" type="button"
            class="btn btn-sm btn-default icon-btn borderless rounded-pill md-btn-flat dropdown-toggle hide-arrow"
            data-toggle="dropdown" aria-expanded="true" data-boundary="viewport">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="dropdown-menu" aria-labelledby="field-ddm-${field.uuid}">
            <a onclick="Fields.goToFieldInMap('${field.uuid}')" class="dropdown-item" href="javascript:void(0)">
              <i class="fas fa-map-pin"></i>&nbsp; Ubicar en mapa
            </a>
            <div class="dropdown-toggle">
              <div class="dropdown-item">
                <i class="fas fa-pencil-alt"></i>&nbsp; Editar
              </div>
              <div class="dropdown-menu" style="margin-left:-1px;">
                <a class="dropdown-item" href="javascript:void(0)">
                  <i class="fas fa-vector-square"></i>&nbsp; Límites
                </a>
                <a class="dropdown-item" href="javascript:void(0)">
                  <i class="far fa-list-alt"></i>&nbsp; Datos y cultivo
                </a>
              </div>
            </div>
            <a onclick="Fields.deleteField('${field.uuid}','${field.name}')" class="dropdown-item" href="javascript:void(0)">
              <i class="fas fa-trash-alt"></i>&nbsp; Eliminar
            </a>
          </div>
        </div>
      </div>
    `;
  }

  init();
  return element;
})({});