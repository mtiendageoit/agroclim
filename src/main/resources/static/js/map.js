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
  const FieldsVectorLayer = new ol.layer.Vector({ source: FieldsSource, zIndex: 1 });

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
    OlMapField.activeMouseEvents(true);
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
    OlMapField.activeMouseEvents(false);

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

    OlMapField.activeMouseEvents(true);
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
    OlMapField.activeMouseEvents(active);
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
    OlMapField.activeMouseEvents(false);

    DrawInteraction.setActive(true);

    DrawInteraction.once('drawend', (event) => {
      event.feature.setId('last-field-drawed');
      DrawInteraction.setActive(false);
      if (onDrawEnd) { onDrawEnd(); }
    });
  }

  function geometryToWKT(geometry) {
    const clone = geometry.clone();
    clone.transform('EPSG:3857', 'EPSG:4326');
    return wktFormatter.writeGeometry(clone);
  }

  function wktToFeature(wkt) {
    const feature = wktFormatter.readFeature(wkt);
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    return feature;
  };

  function wktToGeometry(wkt) {
    const geometry = wktFormatter.readGeometry(wkt);
    return geometry.transform('EPSG:4326', 'EPSG:3857');
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

const OlMapField = ((element) => {
  let mouseOverFeature;
  let originalMouseOverFeatureStyle;
  let processImageFeature;

  element.activeMouseEvents = (active) => {
    activeSingleClick(active);
    activePointerMove(active);

    olMap.getViewport().style.cursor = active ? 'pointer' : '';
  }

  function activePointerMove(active) {
    if (active) {
      olMap.on('pointermove', pointerMoveListener);
    } else {
      olMap.un('pointermove', pointerMoveListener);
    }
  }

  function pointerMoveListener(evt) {
    if (mouseOverFeature) {
      mouseOverFeature.setStyle(originalMouseOverFeatureStyle);
      mouseOverFeature = null;
    }

    olMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
      mouseOverFeature = feature;
      originalMouseOverFeatureStyle = feature.getStyle();
      feature.setStyle(mouseOverFeatureStyle());
      return true;
    });

    olMap.getViewport().style.cursor = mouseOverFeature ? 'pointer' : '';
  }

  function activeSingleClick(active) {
    if (active) {
      olMap.on('singleclick', singleClickListener);
    } else {
      olMap.un('singleclick', singleClickListener);
    }
  }

  function singleClickListener(evt) {
    const features = olMap.getFeaturesAtPixel(evt.pixel, {
      hitTolerance: 10
    });

    if (features) {
      const feature = features[0];
      if (feature) {
        getImageFor(feature);
      }
    }
  }

  function getImageFor(feature) {
    //loading
    element.activeMouseEvents(false);
    Notifications.loading(true);
    OlAnimateLoadingFeature.animate(feature);

    const field = feature.get('field');
    removeFieldImage(field);

    const url = `api/fields/${field.uuid}/images-dates`;
    $.get(url, (dates) => {
      const from = getClosesImageDateToNow(dates);
      if (from) {
        getIndiceFieldImage(field, from.imageDate);
      } else {
        //TODO: Alert. No images dates valid fro process images indice
        // 
        alert('No se encontraron imagenes para este punto de la fecha actual a un año atras');
      }
    });
  }

  function getIndiceFieldImage(field, from) {
    const indice = Indices.selectedIndice();

    const url = `api/fields/${field.uuid}/image?indice=${indice}&from=${from}`;

    $.post(url).done((image) => {
      addFieldImageToMap(field, image);
    }).fail(() => {
      toastr.warning(`Ocurrio un error al ejecutar la acción, intente nuevamente más tarde.`);
    }).always(() => {
      OlAnimateLoadingFeature.endAnimation();
      
      resetFieldStyle(field);
      Notifications.loading(false);
      element.activeMouseEvents(true);
    });
  }

  function removeFieldImage(field) {
    const layer = olMap.getAllLayers().find(layer => layer.get('field')?.uuid == field.uuid);
    if (layer) {
      olMap.removeLayer(layer);
    }
  }



  function resetFieldStyle(field) {
    OlMap.updateFeatureField(field);
  }

  function addFieldImageToMap(field, image) {
    const layer = geoTiffLayerFrom(field, image);
    olMap.addLayer(layer);
  }

  function geoTiffLayerFrom(field, image) {
    const source = new ol.source.GeoTIFF({
      sources: [{
        url: `${App.ImagesUrl}/${image.uuid}.tif`,
        nodata: 0
      }]
    });

    const layer = new ol.layer.WebGLTile({ source: source });
    layer.set('field', field);
    layer.set('image', image);

    return layer;
  }

  function getClosesImageDateToNow(dates) {
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];

      if (date.cloudyPercentage <= 20) {
        return date;
      }
    }
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

  return element;
})({});






const OlAnimateLoadingFeature = ((element) => {
  let timer, feature;

  element.endAnimation = () => {
    if (timer) clearInterval(timer);
  };

  element.animate = (f) => {
    feature = f;
    let offset = 0;
    feature.setStyle(style(offset));

    timer = setInterval(() => {
      feature.setStyle(style(offset += 0.5));
    }, 50);

  };

  function style(offset) {
    return new ol.style.Style({
      fill: new ol.style.FillPattern({
        pattern: "hatch",
        ratio: 1,
        color: "rgba(255, 255, 255, 0.2)",
        offset: offset,
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
    });
  }

  return element;
})({});