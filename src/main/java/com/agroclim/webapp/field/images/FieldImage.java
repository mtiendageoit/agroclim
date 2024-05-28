package com.agroclim.webapp.field.images;

import java.time.LocalDate;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "field_images")
public class FieldImage {
  @Id
  @JsonIgnore
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private String uuid;

  @JsonIgnore
  private long fieldId;

  @JsonIgnore
  private int fieldVersion;

  @JsonIgnore
  private int indiceId;

  @JsonIgnore
  private long userId;

  @JsonFormat(pattern = "dd/MM/yyyy")
  private LocalDate imageDate;

  @Enumerated(EnumType.STRING)
  private ImageStatus status;

  @JsonIgnore
  private Date processStarting;

  @JsonIgnore
  private Date processEnding;
}
