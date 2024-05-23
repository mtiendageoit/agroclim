package com.agroclim.webapp.field.images;

import java.time.LocalDate;
import java.util.Date;

import com.fasterxml.jackson.annotation.*;

import lombok.Data;

@Data
public class FieldImageDateDto {
  @JsonProperty("cloudy_percentage")
  private double cloudyPercentage;

  @JsonProperty("image_date")
  @JsonFormat(pattern = "dd/MM/yyyy")
  private LocalDate imageDate;
}
