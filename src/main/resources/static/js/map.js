let olMap;
const OlMap = ((element) => {
  const wktFormatter = new ol.format.WKT();
  const MapOptions = {
    center: [-11259661.941042908, 2703071.965672053],
    zoom: 6
  };

  const RasterLayer = new ol.layer.Tile({
    source: new ol.source.TileImage({ url: 'https://mt0.google.com/vt/lyrs=y&hl=sp&x={x}&y={y}&z={z}' })
  });

  const FieldsSource = new ol.source.Vector({ wrapX: false })
  const FieldsVectorLayer = new ol.layer.Vector({ source: FieldsSource });

  const DrawInteraction = new ol.interaction.Draw({
    source: FieldsSource,
    type: 'Polygon',
  });

  function init() {
    olMap = new ol.Map({
      layers: [RasterLayer, FieldsVectorLayer],
      target: 'map',
      view: new ol.View({
        projection: new ol.proj.Projection({
          code: 'EPSG:3857',
          units: 'm',
        }),
        center: MapOptions.center,
        zoom: MapOptions.zoom
      })
    });

    DrawInteraction.setActive(false);
    olMap.addInteraction(DrawInteraction);
  }

  element.removeField = (uuid) => {
    removeFeatureById(uuid);
  }

  element.removeDrawedField = () => {
    removeFeatureById('last-field-drawed');
  }

  function removeFeatureById(uuid) {
    const feature = FieldsSource.getFeatureById(uuid);
    if (feature) {
      FieldsSource.removeFeature(feature);
    }
  }

  element.addField = (field) => {
    const feature = wktToFeature(field.wkt);
    const style = strokeStyle(field.borderColor, field.borderSize);
    feature.setStyle(style);
    feature.setId(field.uuid);
    feature.set('field', field);

    FieldsSource.addFeature(feature);
  };

  element.goToFeature = (uuid) => {
    const feature = FieldsSource.getFeatureById(uuid);
    olMap.getView().fit(feature.getGeometry());
  };

  element.drawedWkt = () => {
    const drawedFeature = FieldsSource.getFeatureById('last-field-drawed');
    if (drawedFeature) {
      return geometryToWKT(drawedFeature.getGeometry());
    }
  };

  element.activateDrawField = (onDrawEnd) => {
    DrawInteraction.setActive(true);

    DrawInteraction.once('drawend', (event) => {
      event.feature.setId('last-field-drawed');
      DrawInteraction.setActive(false);
      if (onDrawEnd) { onDrawEnd(); }
    });
  }

  function geometryToWKT(geometry) {
    return wktFormatter.writeGeometry(geometry);
  }

  function wktToFeature(wkt) {
    return wktFormatter.readFeature(wkt);
  };

  function strokeStyle(borderColor, borderSize) {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: borderColor,
        width: borderSize
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0)'
      })
    });
  };


  init();
  return element;
})({});