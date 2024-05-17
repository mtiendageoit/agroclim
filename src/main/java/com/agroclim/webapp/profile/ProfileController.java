package com.agroclim.webapp.profile;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.agroclim.webapp.security.UserPrincipal;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@AllArgsConstructor
@RequestMapping("/api/settings/profile")
public class ProfileController {
  private final ProfileService profileService;

  @GetMapping
  public Profile profile(@AuthenticationPrincipal UserPrincipal principal) {
    return profileService.profile(principal);
  }

  @PostMapping(params = "general")
  public Profile updateProfileGeneral(@RequestBody Profile input, @AuthenticationPrincipal UserPrincipal principal) {
    Profile profile = profileService.updateProfileGeneral(input, principal);
    principal.setName(profile.getFullname());
    return profile;
  }

}
