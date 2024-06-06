package com.agroclim.webapp.google;

import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageRequest {
  private String imageName;
  private String from;
  private String to;
  private List<List<Double>> coords;
}
