package com.agroclim.webapp.profile;

import org.springframework.stereotype.Service;

import com.agroclim.webapp.security.UserPrincipal;
import com.agroclim.webapp.user.*;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProfileService {
  private final UserRepository userRepository;

  public Profile profile(UserPrincipal principal) {
    User user = userRepository.findById(principal.getId()).get();

    return Profile.fromUser(user);
  }

  public Profile updateProfileGeneral(Profile input, UserPrincipal principal) {
    User user = userRepository.findById(principal.getId()).get();

    user.setFullname(input.getFullname());
    user.setPhone(input.getPhone());

    user = userRepository.save(user);

    return Profile.fromUser(user);
  }

}
