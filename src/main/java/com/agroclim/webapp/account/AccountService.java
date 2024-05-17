package com.agroclim.webapp.account;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.agroclim.webapp.exception.InvalidPasswordException;
import com.agroclim.webapp.security.UserPrincipal;
import com.agroclim.webapp.user.*;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AccountService {
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public void chagePassword(ChangePasswordDto input, UserPrincipal principal) {
    User user = userRepository.findById(principal.getId()).get();

    if (!passwordEncoder.matches(input.getPassword(), user.getPassword())) {
      throw new InvalidPasswordException("invalid-password", "The current password is invalid");
    }

    user.setPassword(passwordEncoder.encode(input.getNewPassword()));
    userRepository.save(user);
  }

}
