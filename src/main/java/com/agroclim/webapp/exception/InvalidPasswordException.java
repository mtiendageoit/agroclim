package com.agroclim.webapp.exception;

public class InvalidPasswordException extends BaseException {
  public InvalidPasswordException(String code, String message) {
    super(code, message);
  }
}