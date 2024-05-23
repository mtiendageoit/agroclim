package com.agroclim.webapp.google.functions;

import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NdviImageRequest {
  private String imageName;
  private String from;
  private String to;
  private List<List<Double>> coords;
}
