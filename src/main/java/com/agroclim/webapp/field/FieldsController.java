package com.agroclim.webapp.field;

import java.util.*;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.agroclim.webapp.field.images.FieldImage;
import com.agroclim.webapp.field.images.FieldImageDateDto;
import com.agroclim.webapp.security.*;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/fields")
public class FieldsController {

  private final FieldService service;

  @PostMapping
  public Field create(@Valid @RequestBody FieldDto input, @AuthenticationPrincipal UserPrincipal principal) {
    return service.create(input, principal);
  }

  @PutMapping("/{uuid}")
  public Field update(@PathVariable String uuid, @RequestBody FieldDto input) {
    return service.update(uuid, input);
  }

  @GetMapping
  public List<Field> getAll(@AuthenticationPrincipal UserPrincipal principal) {
    return service.getAll(principal);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @DeleteMapping("/{uuid}")
  public void delete(@PathVariable String uuid) {
    service.delete(uuid);
  }

  @PutMapping("/{uuid}/geometry")
  public Field putGeometry(@PathVariable String uuid, @RequestBody FieldDto input) {
    return service.putGeometry(uuid, input);
  }

  @GetMapping("/{uuid}/images-dates")
  public List<FieldImageDateDto> fieldImages(@PathVariable String uuid) {
    return service.fieldImages(uuid);
  }

  @PostMapping("/{uuid}/image")
  public FieldImage indiceImageField(@PathVariable String uuid, @RequestParam int indice,
      @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") Date from) {
    return service.indiceImageField(uuid, indice, from);
  }

  @PostMapping("/shapefile")
  public List<Field> uploadShapefile(@RequestParam MultipartFile file,
      @AuthenticationPrincipal UserPrincipal principal) {
    return service.uploadShapefile(file, principal);
  }
}
