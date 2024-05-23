package com.agroclim.webapp.google;

import java.util.List;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImageDatesDto {
  private List<List<Double>> coords;
  private String from;
  private String to;
}
