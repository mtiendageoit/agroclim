package com.agroclim.webapp.field.images;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FieldImageRepository extends JpaRepository<FieldImage, Long> {
  Optional<FieldImage> findByFieldIdAndFieldVersionAndIndiceIdAndImageDate(long fieldId, int version, int indice,
      Date from);
}
