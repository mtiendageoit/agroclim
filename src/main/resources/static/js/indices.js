const Indices = (() => {
  const indicesBtns = $('.indice');

  function init() {
    indicesBtns.click(onIndiceClick);
  }

  function onIndiceClick() {
    const indice = $(this).attr('indice');
    
  }

  init();
})({});