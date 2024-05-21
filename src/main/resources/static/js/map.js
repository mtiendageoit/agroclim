let olMap;
const OlMap = ((element) => {
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
      target: 'map',
      controls: [],
      layers: [RasterLayer, FieldsVectorLayer],
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

    initControls();

    Measure.initMeasure(olMap);
  }

  function initControls() {
    $('#zoomInBtn').click(() => zoomInOut(true));
    $('#zoomOutBtn').click(() => zoomInOut(false));
    $('#locationBtn').click(onLocationClick);
  }

  function onLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        const center = ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857');
        olMap.getView().animate({
          center: center,
          duration: 400,
        });

        pulseFeature(center);
        setTimeout(() => pulseFeature(center), 400);
        setTimeout(() => pulseFeature(center), 800);
      });
    }
  }

  function pulseFeature(coord) {
    var f = new ol.Feature(new ol.geom.Point(coord));
    f.setStyle(new ol.style.Style({
      image: new ol.style['Circle']({
        radius: 20,
        points: 4,
        stroke: new ol.style.Stroke({ color: 'white', width: 2 })
      })
    }));
    olMap.animateFeature(f, new ol.featureAnimation.Zoom({
      fade: ol.easing.easeOut,
      duration: 2000,
      easing: ol.easing['easeOut']
    }));
  }

  function zoomInOut(isZoomIn) {
    let zoom = olMap.getView().getZoom();
    olMap.getView().animate({
      zoom: (isZoomIn) ? zoom + 1 : zoom - 1,
      duration: 250
    });
  }

  element.removeField = (uuid) => {
    removeFeatureById(uuid);
  }

  element.removeDrawedField = () => {
    removeFeatureById('last-field-drawed');
    OlMapPointerMoveEvent.active(true);
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
    OlMapPointerMoveEvent.active(false);

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

    OlMapPointerMoveEvent.active(true);
  }

  element.getModifiedField = () => {
    if (ModifyInteraction) {
      const feature = ModifyInteraction.features_.array_[0];
      const field = feature.get('field');
      field.wkt = geometryToWKT(feature.getGeometry());
      return field;
    }
  }

  element.activeMapEvents = (active) => {
    OlMapPointerMoveEvent.active(active);
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
    OlMapPointerMoveEvent.active(false);

    DrawInteraction.setActive(true);

    DrawInteraction.once('drawend', (event) => {
      event.feature.setId('last-field-drawed');
      DrawInteraction.setActive(false);
      OlMapPointerMoveEvent.active(true);
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


const OlMapPointerMoveEvent = ((element) => {
  let selectedFeature;
  let originalFeatureStyle;

  function init() {
    // element.active(true);
  }

  element.active = (active) => {
    if (active) {
      olMap.on('pointermove', pointerMoveListener);
    } else {
      olMap.un('pointermove', pointerMoveListener);
      olMap.getViewport().style.cursor = '';
    }
    OlMapSingleClickEvent.active(active);
  }

  function pointerMoveListener(e) {
    if (selectedFeature) {
      selectedFeature.setStyle(originalFeatureStyle);
      selectedFeature = null;
    }
    olMap.forEachFeatureAtPixel(e.pixel, function (f) {
      selectedFeature = f;
      originalFeatureStyle = f.getStyle();
      f.setStyle(mouseOverFeatureStyle());
      return true;
    });

    olMap.getViewport().style.cursor = selectedFeature ? 'pointer' : '';
  }

  function mouseOverFeatureStyle() {
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.05],
      }),
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 5,
      }),
    })
  }

  init();
  return element;
})({});


const OlMapSingleClickEvent = ((element) => {
  let clickedFeature;

  function init() {
    element.active(false);
  }

  element.active = (active) => {
    if (active) {
      olMap.on('singleclick', singleClickListener);
    } else {
      olMap.un('singleclick', singleClickListener);
    }
  }

  function singleClickListener(e) {

    olMap.forEachFeatureAtPixel(e.pixel, function (feature) {
      OlMapPointerMoveEvent.active(false);
      element.active(false);

      clickedFeature = feature;
      feature.setStyle(mouseOverFeatureStyle());

      Fields.processClickOverField(feature.get('field'), feature);

      return true;
    });

  }

  function mouseOverFeatureStyle() {
    return new ol.style.Style({
      fill: new ol.style.FillPattern({
        pattern: "hatch",
        ratio: 1,
        color: "rgba(255, 255, 255, 0.2)",
        offset: 0,
        scale: 2,
        fill: new ol.style.Fill({ color: "rgba(255, 0, 0, 0)" }),
        size: 5,
        spacing: 10,
        angle: 0
      }),
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 5,
      }),
    })
  }

  init();
  return element;
})({});