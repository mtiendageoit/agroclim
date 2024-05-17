package com.agroclim.webapp.profile;

import com.agroclim.webapp.user.User;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
public class Profile {
  @NotBlank
  private String fullname;
  
  private String phone;
  private String email;

  public static Profile fromUser(User user) {
    return new Profile(user.getFullname(), user.getPhone(), user.getEmail());
  }
}
