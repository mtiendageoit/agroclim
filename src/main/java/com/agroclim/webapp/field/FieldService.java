package com.agroclim.webapp.field;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agroclim.webapp.exception.NotFoundException;
import com.agroclim.webapp.security.UserPrincipal;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class FieldService {
  private final FieldRepository repository;

  public Field create(FieldDto input, UserPrincipal user) {
    Field field = Field.builder()
        .uuid(UUID.randomUUID().toString())
        .name(input.getName())
        .userId(user.getId())
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

  public List<Field> getAll(UserPrincipal user) {
    return repository.findAllByUserId(user.getId());
  }

  @Transactional
  public void delete(String uuid) {
    repository.deleteByUuid(uuid);
  }

  public Field putGeometry(String uuid, FieldDto input) {
    Field field = repository.findByUuid(uuid)
        .orElseThrow(() -> new NotFoundException("field-not-found", "Field not found"));
    field.setWkt(input.getWkt());
    return repository.save(field);
  }

}
