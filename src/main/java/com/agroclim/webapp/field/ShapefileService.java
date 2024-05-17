package com.agroclim.webapp.field;

import java.io.*;
import java.util.*;

import org.geotools.data.*;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.feature.*;
import org.opengis.feature.Property;
import org.opengis.feature.simple.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.agroclim.webapp.exception.BaseException;
import com.agroclim.webapp.utils.FileUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ShapefileService {
  public static List<Field> fromShapefile(MultipartFile file) {
    File shapefile = null;
    try {
      shapefile = FileUtils.fromMultiPartFile(file);
    } catch (IOException e) {
      log.error(e.getMessage(), e);
      throw new BaseException("multipart-to-file-conversion-error", "Can not convert MultipartFile to File.");
    }

    List<Field> fields = new ArrayList<>();
    FileDataStore myData = null;

    try {
      myData = FileDataStoreFinder.getDataStore(shapefile);
      SimpleFeatureSource source = myData.getFeatureSource();
      SimpleFeatureType schema = source.getSchema();

      Query query = new Query(schema.getTypeName());
      FeatureCollection<SimpleFeatureType, SimpleFeature> collection = source.getFeatures(query);
      try (FeatureIterator<SimpleFeature> features = collection.features()) {
        List<String> row;
        while (features.hasNext()) {
          SimpleFeature feature = features.next();
          row = new ArrayList<>();

          for (Property attribute : feature.getProperties()) {
            row.add(attribute.getValue() != null ? attribute.getValue().toString() : null);
          }
          // rows.add(row);
          // if (maxRows != null && rows.size() >= maxRows) {
          // break;
          // }
        }
      }

      return fields;
    } catch (Exception e) {
      log.error(e.getMessage(), e);
      throw new BaseException("shp-file-error", "Ocurrio un error al obtener los datos del shape");
    } finally {
      if (myData != null) {
        myData.dispose();
      }
    }
  }

}
