package com.agroclim.webapp.account;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.agroclim.webapp.security.UserPrincipal;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/settings/account")
public class AccountController {
  private final AccountService accountService;

  @PostMapping(params = "change-password")
  public void changePassword(@Valid @RequestBody ChangePasswordDto input,
      @AuthenticationPrincipal UserPrincipal principal) {
    accountService.chagePassword(input, principal);
  }

}
