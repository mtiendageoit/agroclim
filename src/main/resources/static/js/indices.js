const Indices = ((element) => {
  const INDICES = {
    NDVI: { id: 1, name: 'NDVI' }, EVI: { id: 2, name: 'EVI' }, AVI: { id: 3, name: 'AVI' },
    SAVI: { id: 4, name: 'SAVI' }, MSI: { id: 5, name: 'MSI' }, VCI: { id: 6, name: 'VCI' }, VHI: { id: 7, name: 'VHI' }
  }
  const indicesBtns = $('.indice-menu-item');
  const selectedIndiceBtn = $('#selectedIndiceBtn');
  const container = $('#indicesListContainer');


  element.getSelectedIndiceStyle = () => {
    const indice = element.selectedIndice();
    if (INDICES.NDVI == indice) return ndviStyle();
    if (INDICES.EVI == indice) return eviStyle();
    if (INDICES.AVI == indice) return aviStyle();
    if (INDICES.SAVI == indice) return saviStyle();
    if (INDICES.MSI == indice) return msiStyle();
    if (INDICES.VCI == indice) return vciStyle();
    if (INDICES.VHI == indice) return vhiStyle();
  };

  function vhiStyle() {
    return {
      color: [
        'interpolate',
        ['linear'],
        ['band', 1],
        -9999, 'Transparent',
        0, '#A52A2A',
        0.5, '#FFFF00',
        1, '#008000',
      ],
    };
  }

  function vciStyle() {
    return {
      color: [
        'interpolate',
        ['linear'],
        ['band', 1],
        -9999, 'Transparent',
        0, '#FF0000',
        50, '#FFFF00',
        100, '#008000',
      ],
    };
  }

  function msiStyle() {
    return {
      color: [
        'interpolate',
        ['linear'],
        ['band', 1],
        -9999, 'Transparent',
        0, '#A52A2A',
        1, '#FFFFFF',
        2, '#0000FF',
      ],
    };
  }

  function saviStyle() {
    return {
      color: [
        'interpolate',
        ['linear'],
        ['band', 1],
        -9999, 'Transparent',
        -1, '#A52A2A',
        0, '#FFFFFF',
        1, '#008000',
      ],
    };
  }

  function aviStyle() {
    return {
      color: [
        'interpolate',
        ['linear'],
        ['band', 1],
        -9999, 'Transparent',
        0, '#0000FF',
        0.5, '#FFFFFF',
        1, '#008000',
      ],
    };
  }

  function eviStyle() {
    return {
      color: [
        'interpolate',
        ['linear'],
        ['band', 1],
        -9999, 'Transparent',
        -1, '#0000FF',
        0, '#FFFFFF',
        1, '#008000',
      ],
    };
  }

  function ndviStyle() {
    return {
      color: [
        'interpolate',
        ['linear'],
        ['band', 1],
        -9999, 'Transparent',
        -0.2, '#FF0000',
        0, '#FFFFFF',
        0.2, '#008000',
      ],
    };
  }

  element.showIndices = (show) => {
    if (show) container.show();
    else container.hide();
  };

  element.selectedIndice = () => {
    const id = selectedIndiceBtn.attr('indice');
    return Object.values(INDICES).find(item => item.id == id);
  }

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

    OlMapField.getImageForSelectedField();
  }

  init();

  return element;
})({});