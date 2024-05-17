package com.agroclim.webapp.field;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.agroclim.webapp.exception.NotFoundException;
import com.agroclim.webapp.security.UserPrincipal;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class FieldService {
  private final FieldRepository repository;

  public Field create(FieldDto input, UserPrincipal principal) {
    Field field = Field.builder()
        .uuid(UUID.randomUUID().toString())
        .name(input.getName())
        .userId(principal.getId())
        .cropId(input.getCropId())
        .plantingDate(input.getPlantingDate())
        .harvestDate(input.getHarvestDate())
        .borderColor(input.getBorderColor())
        .borderSize(input.getBorderSize())
        .wkt(input.getWkt())
        .createdAt(new Date())
        .build();

    return repository.save(field);
  }

  public List<Field> getAll(UserPrincipal principal) {
    return repository.findAllByUserId(principal.getId());
  }

  @Transactional
  public void delete(String uuid) {
    repository.deleteByUuid(uuid);
  }

  public Field putGeometry(String uuid, FieldDto input) {
    Field field = fieldByUuid(uuid);
    field.setWkt(input.getWkt());
    return repository.save(field);
  }

  public Field update(String uuid, FieldDto input) {
    Field field = fieldByUuid(uuid);

    field.setName(input.getName());
    field.setCropId(input.getCropId());
    field.setPlantingDate(input.getPlantingDate());
    field.setHarvestDate(input.getHarvestDate());
    field.setBorderColor(input.getBorderColor());
    field.setBorderSize(input.getBorderSize());

    return repository.save(field);
  }

  private Field fieldByUuid(String uuid) {
    return repository.findByUuid(uuid)
        .orElseThrow(() -> new NotFoundException("field-not-found", "Field not found"));
  }

  public List<Field> uploadShapefile(MultipartFile file, UserPrincipal principal) {
    return null;
  }
}
