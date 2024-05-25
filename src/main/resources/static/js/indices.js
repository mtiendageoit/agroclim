const Indices = ((element) => {
  const INDICES = { NDVI: 1, EVI: 2, AVI: 3, SAVI: 4, MSI: 5, VCI: 6, VHI: 7 }
  const indicesBtns = $('.indice-menu-item');
  const selectedIndiceBtn = $('#selectedIndiceBtn');
  const container = $('#indicesListContainer');


  element.getIndiceValueFromPixel = (data) => {
    const indice = element.selectedIndice();
    if (INDICES.NDVI == indice) return ndvi(data);
    if (INDICES.EVI == indice) return evi(data);
    if (INDICES.AVI == indice) return avi(data);
    if (INDICES.SAVI == indice) return savi(data);
    if (INDICES.MSI == indice) return msi(data);
    if (INDICES.VCI == indice) return vci(data);
    if (INDICES.VHI == indice) return vhi(data);
  };

  function vhi(data) {
    if (data) {
      // Obtener el valor del VHI
      const vhiBandIndex = data.length - 1; // La última banda se asume como el VHI
      const vhi = data[vhiBandIndex];
      return vhi;
    }

    return 0;
  }

  function vci(data) {
    if (data) {
      // Obtener el valor del VCI
      const vciBandIndex = data.length - 1;
      const vci = data[vciBandIndex];
      return vci;
    }

    return 0;
  }

  function msi(data) {
    if (data) {
      const nir = data[0];
      const redEdge = data[1];
      return nir / redEdge;
    }

    return 0;
  }

  function savi(data) {
    if (data) {
      const nir = data[0];
      const red = data[1];
      return (nir - red) / (nir + red + 0.428) * (1.428);
    }

    return 0;
  }

  function avi(data) {
    if (data) {
      const nir = data[0];
      const red = data[1];
      return Math.pow(nir * (1 - red) * (nir - red), 1 / 3);
    }

    return 0;
  }

  function evi(data) {
    if (data) {
      const blue = data[0];
      const red = data[1];
      const nir = data[2];
      return 2.5 * (nir - red) / ((nir + 6 * red - 7.5 * blue) + 1);
    }

    return 0;
  }

  function ndvi(data) {
    if (data) {
      const red = data[0];
      const nir = data[1];
      return (nir - red) / (nir + red);
    }

    return 0;
  }

  element.showIndices = (show) => {
    if (show) container.show();
    else container.hide();
  };

  element.selectedIndice = () => {
    return selectedIndiceBtn.attr('indice');
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