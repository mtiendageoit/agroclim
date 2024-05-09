package com.agroclim.webapp.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.agroclim.webapp.field.*;
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

  @GetMapping
  public List<Field> getAll(@AuthenticationPrincipal UserPrincipal principal) {
    return service.getAll(principal);
  }

  @ResponseStatus(code = HttpStatus.NO_CONTENT)
  @DeleteMapping("/{uuid}")
  public void delete(@PathVariable String uuid) {
    service.delete(uuid);
  }
}
