const OlMap = ((element) => {
  let olMap;
  let ModifyInteraction;

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

  element.fieldByUuid = (uuid) => {
    const feature = FieldsSource.getFeatureById(uuid);
    if (feature) {
      return feature.get('field');
    }
  }

  element.updateFeatureField = (field) => {
    const feature = FieldsSource.getFeatureById(field.uuid);
    if (feature) {
      feature.set('field', field);
      feature.setStyle(strokeStyle(field.borderColor, field.borderSize));
    }
  }

  element.activateModifyField = (uuid) => {
    const feature = FieldsSource.getFeatureById(uuid);
    if (feature) {
      feature.setStyle(editStyle());
      const features = new ol.Collection();
      features.push(feature);

      if (!ModifyInteraction) {
        ModifyInteraction = new ol.interaction.Modify({
          features: features
        });
        olMap.addInteraction(ModifyInteraction);
      }
    }
  }

  element.cancelModifyField = () => {
    if (ModifyInteraction) {
      const feature = ModifyInteraction.features_.array_[0];
      if (feature) {
        const field = feature.get('field');
        feature.setGeometry(wktToGeometry(field.wkt))
        feature.setStyle(strokeStyle(field.borderColor, field.borderSize));
        if (ModifyInteraction) {
          olMap.removeInteraction(ModifyInteraction);
          ModifyInteraction = null;
        }
      }
    }
  }

  element.getModifiedField = () => {
    if (ModifyInteraction) {
      const feature = ModifyInteraction.features_.array_[0];
      const field = feature.get('field');
      field.wkt = geometryToWKT(feature.getGeometry());
      return field;
    }
  }

  function editStyle() {
    return [new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.05],
      }),
    }), new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 5,
      }),
    }), new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 153, 255, 1],
        width: 3,
      }),
    })];
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
    olMap.getView().setZoom(olMap.getView().getZoom() - 0.5);
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

  function wktToGeometry(wkt) {
    return wktFormatter.readGeometry(wkt);
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