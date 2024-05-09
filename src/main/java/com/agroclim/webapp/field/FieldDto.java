package com.agroclim.webapp.field;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FieldDto {
  @NotBlank
  private String name;

  private Integer cropId;

  @JsonFormat(pattern = "dd/MM/yyyy")
  private Date plantingDate;

  @JsonFormat(pattern = "dd/MM/yyyy")
  private Date harvestDate;

  @NotBlank
  private String borderColor;

  @NotNull
  @Min(1)
  @Max(5)
  private Integer borderSize;

  @NotBlank
  private String wkt;
}