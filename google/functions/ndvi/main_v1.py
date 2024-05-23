import ee
import time
import json
import functions_framework

ee.Authenticate()
ee.Initialize(project='agroclim-project')

ee.Initialize()

@functions_framework.http
def ndvi(request):
  request_json = request.get_json()

  from_date = request_json.get('from', None)
  to_date = request_json.get('to', None)
  roi_coords = request_json.get('coords', None)
  image_name = request_json.get('imageName', None)
  satellite = request_json.get('satellite', "COPERNICUS/S2_HARMONIZED")

  print("from_date:", from_date)
  print("to_date:", to_date)
  print("from_date:", from_date)
  print("roi_coords:", roi_coords)
  print("satellite:", satellite)

  roi = ee.Geometry.Polygon(roi_coords)
  
  collection = (ee.ImageCollection(satellite)
              .filterBounds(roi)
              .filterDate(from_date, to_date)
              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
              .select(['B2', 'B4', 'B8', 'B11']))

  # Aplica la función de recorte a cada imagen de la colección
  clipped_collection = collection.map(lambda image: image.clip(roi))
  
  # Aplica la función de cálculo de NDVI a cada imagen de la colección
  ndvi_collection = clipped_collection.map(calculate_ndvi)

  # Calcula la Anomalía del NDVI restando el NDVI de cada imagen a la media
  ndvi_mean = ndvi_collection.mean()
  ndvi_anomaly = ndvi_collection.map(lambda image: image.subtract(ndvi_mean).rename('NDVI_Anomaly'))

  ndvi_anomaly_mosaic_image = ndvi_anomaly.mosaic()

  # Exportar imagen a bucket
  task = ee.batch.Export.image.toCloudStorage(
        image=ndvi_anomaly_mosaic_image.visualize(min=-0.2, max=0.2, palette=['red', 'white', 'green']),
        bucket='agroclim_bucket',
        fileNamePrefix=image_name,
        region=roi,
        crs='EPSG:3857')
  task.start()

  while task.active():
      print("Exporting image... state:", task.status()['state'])
      time.sleep(1)
  print("Image exported. state:", task.status()['state'])

  response = json.dumps({"imageName": image_name})
  return response, 200, {'Content-Type': 'application/json'}



# Calcula el Índice de Vegetación de Diferencia Normalizada (NDVI)
def calculate_ndvi(image):
  return image.normalizedDifference(['B8', 'B4']).rename('NDVI')