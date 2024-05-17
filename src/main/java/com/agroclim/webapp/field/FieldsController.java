package com.agroclim.webapp.field;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

  @PostMapping("/shapefile")
  public List<Field> uploadShapefile(@RequestParam MultipartFile file,
      @AuthenticationPrincipal UserPrincipal principal) {
    return service.uploadShapefile(file, principal);
  }
}
