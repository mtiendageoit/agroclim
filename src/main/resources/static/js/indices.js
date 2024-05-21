const Indices = (() => {

  const indicesBtns = $('.indice-menu-item');
  const selectedIndiceBtn = $('#selectedIndiceBtn');

  function init() {
    indicesBtns.click(onIndiceClick);

    selectFirstIndice();
  }

  function selectFirstIndice() {
    const firstId = indicesBtns.first().attr('indice')
    selectIndice(firstId);
  }

  function selectIndice(id) {
    indicesBtns.removeClass('active');
    indicesBtns.find('i').hide();

    const indiceBtn = indicesBtns.filter(`[indice='${id}']`);
    const name = $(indiceBtn).attr('indice-name');
    selectedIndiceBtn.text(name);
    selectedIndiceBtn.attr('indice', id);

    indiceBtn.find('i').show();
    indiceBtn.addClass('active');
  }

  function onIndiceClick() {
    const indice = $(this).attr('indice');
    selectIndice(indice);
  }

  init();
})({});