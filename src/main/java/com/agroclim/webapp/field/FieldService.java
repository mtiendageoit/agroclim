package com.agroclim.webapp.field;

import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.agroclim.webapp.exception.NotFoundException;
import com.agroclim.webapp.field.images.*;
import com.agroclim.webapp.google.EarthEngineClient;
import com.agroclim.webapp.indices.Indice;
import com.agroclim.webapp.indices.IndiceRepository;
import com.agroclim.webapp.security.UserPrincipal;
import com.agroclim.webapp.utils.RandomCodeGenerator;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class FieldService {
  private final EarthEngineClient earthEngineClient;

  private final FieldRepository repository;
  private final IndiceRepository indiceRepository;
  private final FieldImageRepository fieldImageRepository;

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
        .version(1)
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
    field.setVersion(field.getVersion() + 1);// Change version field when geometry change
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

  @Transactional
  public FieldImage indiceImageField(String uuid, int indiceId, Date from) {
    Field field = fieldByUuid(uuid);
    Optional<FieldImage> opt = fieldImageRepository.findByFieldIdAndFieldVersionAndIndiceIdAndImageDate(field.getId(),
        field.getVersion(), indiceId, from);
    if (opt.isPresent()) {
      return opt.get();
    }

    Indice indice = indiceRepository.findById(indiceId)
        .orElseThrow(() -> new NotFoundException("indice-not-exists", "The indice id not exists"));
    // process field image in google cloud funcions

    String imageUuid = RandomCodeGenerator.generateUUIDCode();
    String image = earthEngineClient.processIndiceImageField(field, imageUuid, indice, from);

    FieldImage fieldImage = FieldImage.builder()
        .uuid(imageUuid)
        .fieldId(field.getId())
        .indiceId(indiceId)
        .imageDate(from)
        .status(ImageStatus.CREATED)
        .fieldVersion(field.getVersion())
        .processStarting(new Date())
        .build();

    fieldImage = fieldImageRepository.save(fieldImage);

    return fieldImage;
  }

  public List<FieldImageDateDto> fieldImages(String uuid) {
    Field field = fieldByUuid(uuid);

    Date now = new Date();
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(now);
    calendar.add(Calendar.YEAR, -1);
    Date from = calendar.getTime();

    calendar.setTime(now);
    calendar.add(Calendar.DAY_OF_MONTH, 1);
    Date to = calendar.getTime();

    List<FieldImageDateDto> images = earthEngineClient.imageDates(field, from, to);
    Collections.sort(images, Comparator.comparing(FieldImageDateDto::getImageDate).reversed());
    return images;
  }

}
