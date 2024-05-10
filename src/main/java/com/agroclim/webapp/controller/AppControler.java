package com.agroclim.webapp.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.agroclim.webapp.crop.CropService;
import com.agroclim.webapp.exception.*;
import com.agroclim.webapp.security.UserPrincipal;
import com.agroclim.webapp.user.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class AppControler {
  private final UserService userService;
  private final CropService cropService;

  @GetMapping("/")
  public String home(@AuthenticationPrincipal UserPrincipal principal, Model model) {
    model.addAttribute("principal", principal);
    model.addAttribute("crops", cropService.crops());
    return "home";
  }

  @GetMapping("/login")
  public String login(@AuthenticationPrincipal UserPrincipal principal) {
    if (principal != null) {
      return "redirect:/";
    }
    return "login";
  }

  @GetMapping("/signup")
  public String signup(Model model) {
    RegisterUserDto user = new RegisterUserDto("Meliton Tienda Avila", "mtienda@geoit.com.mx", "123456");
    model.addAttribute("user", user);
    return "signup";
  }

  @PostMapping("/signup")
  public String postSignup(@ModelAttribute("user") @Valid RegisterUserDto input, Model model,
      HttpServletRequest request) {

    try {
      String appUrl = request.getContextPath();
      // appUrl = "http://localhost:8080";
      userService.registerByEmail(input, appUrl);
    } catch (AlreadyExistsException e) {
      model.addAttribute("error", "An account already exists for this email.");
      model.addAttribute("user", input);
      return "signup";
    }

    model.addAttribute("email", input.getEmail());
    return "signup-success";
  }

  @GetMapping("/verify")
  public String verifyRegistrationCode(@RequestParam String token) {
    try {
      userService.verifyRegistration(token);
    } catch (TokenNotFoundException | InvalidVerificacionTokenException e) {
      return "verify-error";
    }

    return "verify-success";
  }

  @GetMapping("/password-reset")
  public String passwordReset() {
    return "password-reset";
  }

  @PostMapping("/password-reset")
  public String postPasswordReset(String email, HttpServletRequest request) {
    String appUrl = request.getContextPath();
    // appUrl = "http://localhost:8080";
    userService.resetPassword(email, appUrl);
    return "redirect:/password-reset-success";
  }

  @GetMapping("/password-reset-success")
  public String passwordResetSuccess() {
    return "password-reset-success";
  }

  @GetMapping("/change-password")
  public String changePassword(@RequestParam String token, Model model) {
    boolean isValid = userService.isResetPasswordTokenValid(token);

    if (!isValid) {
      return "change-password-error";
    }

    model.addAttribute("token", token);

    return "change-password";
  }

  @PostMapping("/change-password")
  public String postChangePassword(String token, String password, Model model) {

    try {
      userService.changePassword(token, password);
    } catch (TokenNotFoundException e) {
      model.addAttribute(token, token);
      return "change-password-error";
    }

    return "change-password-success";
  }

}
