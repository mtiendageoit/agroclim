import functions_framework
import ee
import json

ee.Authenticate()
ee.Initialize(project='agroclim-project')

ee.Initialize()

@functions_framework.http
def image_dates(request):
  request_json = request.get_json()

  from_date = request_json.get('from', None)
  to_date = request_json.get('to', None)
  coords = request_json.get('coords', None)
  satellite = request_json.get('satellite', "COPERNICUS/S2_HARMONIZED")

  point = ee.Geometry.Point(coords)
  collection = (ee.ImageCollection(satellite)
              .filterBounds(point)
              .filterDate(from_date, to_date))

  info = collection.toList(collection.size()).map(lambda image: get_info(ee.Image(image)))
  response = json.dumps(info.getInfo())

  return response, 200, {'Content-Type': 'application/json'}





def get_info(image):
  date = ee.Date(image.get('system:time_start')).format('dd-MM-yyyy')
  cloudy_percentage = ee.Number(image.get('CLOUDY_PIXEL_PERCENTAGE'))
  return {'image_date': date, 'cloudy_percentage': cloudy_percentage}