package com.agroclim.webapp.google;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.agroclim.webapp.config.AppConfig;
import com.agroclim.webapp.field.Field;
import com.agroclim.webapp.field.images.*;
import com.agroclim.webapp.google.functions.*;
import com.agroclim.webapp.indices.Indice;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EarthEngineClient {
  private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

  private final AppConfig config;
  private final RestTemplate restTemplate;

  public List<FieldImageDateDto> imageDates(Field field, LocalDate from, LocalDate to) {
    List<List<Double>> coords = coordinatesFromWKT(field.getWkt());

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    ImageDatesDto requestObject = ImageDatesDto.builder()
        .coords(coords)
        .from(DATE_FORMAT.format(from))
        .to(DATE_FORMAT.format(to))
        .build();

    HttpEntity<ImageDatesDto> requestEntity = new HttpEntity<>(requestObject, headers);

    String url = config.getGoogleCloudFunctionsUrl() + "/image-dates";
    ResponseEntity<List<FieldImageDateDto>> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity,
        new ParameterizedTypeReference<List<FieldImageDateDto>>() {
        });

    return response.getBody();
  }

  public String processIndiceImageField(Field field, String imageName, Indice indice, LocalDate imageDate) {
    List<List<Double>> coords = coordinatesFromWKT(field.getWkt());

    LocalDate to = imageDate.plusDays(1);

    NdviImageRequest requestObject = NdviImageRequest.builder()
        .imageName(imageName)
        .coords(coords)
        .from(DATE_FORMAT.format(imageDate))
        .to(DATE_FORMAT.format(to))
        .build();

    try {
      ResponseEntity<NdviImageResponse> response = restTemplate.postForEntity(indice.getUrl(), requestObject,
          NdviImageResponse.class);
      return response.getBody().getImageName();
    } catch (Exception e) {
      e.getMessage();
    }

    return null;
  }

  private List<List<Double>> coordinatesFromWKT(String wkt) {
    // wkt = "POLYGON((-98.27244851220578 20.079629401530283,-98.27080004364859
    // 20.079104413000877,-98.27294115798148 20.075482834059187,-98.27406855889127
    // 20.075776478711887,-98.27266641322196 20.079398050869628,-98.27244851220578
    // 20.079629401530283))";

    String coords = wkt.replace("POLYGON((", "").replace("))", "");
    String pairsCords[] = coords.split(",");

    List<List<Double>> coordinates = new ArrayList<>();
    String lonlat[];
    for (String coord : pairsCords) {
      lonlat = coord.split(" ");
      coordinates.add(Arrays.asList(Double.valueOf(lonlat[0]), Double.valueOf(lonlat[1])));
    }

    return coordinates;
  }

  @Async
  public void deleteFieldImages(List<FieldImage> images) {
    List<String> uuids = images.stream().map(item -> item.getUuid()).toList();
    FieldImagesDto fieldImages = new FieldImagesDto(uuids);

    String url = config.getGoogleCloudFunctionsUrl() + "/storage-delete-images";
    restTemplate.postForEntity(url, fieldImages, String.class);
  }
}
