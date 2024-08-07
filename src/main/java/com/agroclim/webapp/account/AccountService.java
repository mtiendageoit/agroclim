package com.agroclim.webapp.account;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agroclim.webapp.exception.InvalidPasswordException;
import com.agroclim.webapp.field.FieldService;
import com.agroclim.webapp.security.UserPrincipal;
import com.agroclim.webapp.user.*;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class AccountService {
  private final PasswordEncoder passwordEncoder;
  
  private final UserRepository userRepository;

  private final FieldService fieldService;
  // private final FieldRepository fieldRepository;

  public void chagePassword(ChangePasswordDto input, UserPrincipal principal) {
    User user = userRepository.findById(principal.getId()).get();

    if (!passwordEncoder.matches(input.getPassword(), user.getPassword())) {
      throw new InvalidPasswordException("invalid-password", "The current password is invalid");
    }

    user.setPassword(passwordEncoder.encode(input.getNewPassword()));
    userRepository.save(user);
  }

  @Transactional
  public void deleteAccount(UserPrincipal principal) {
    fieldService.deleteFieldsFor(principal.getId());

    userRepository.deleteById(principal.getId());
    log.warn("Account is deleted: {}", principal.getEmail());
  }

}
