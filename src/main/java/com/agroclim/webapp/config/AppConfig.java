package com.agroclim.webapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import lombok.Getter;

@Getter
@Configuration
public class AppConfig {

  @Value("${apis.google.maps.key}")
  private String googleMapsApiKey;

  @Value("${google.cloud.functions.url}")
  private String googleCloudFunctionsUrl;

  @Value("${google.cloud.storage.images.url}")
  private String googleCloudStorageImagesUrl;

  @Value("${spring.mail.username}")
  private String appMailSender;

  @Bean
  public RestTemplate restTemplate() {
    return new RestTemplate();
  }
}
