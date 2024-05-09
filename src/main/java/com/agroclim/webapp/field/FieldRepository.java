package com.agroclim.webapp.field;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FieldRepository extends JpaRepository<Field, Long> {
  List<Field> findAllByUserId(long userId);
  void deleteByUuid(String uuid);
}
