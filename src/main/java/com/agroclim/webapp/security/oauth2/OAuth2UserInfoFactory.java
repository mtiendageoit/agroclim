package com.agroclim.webapp.security.oauth2;

import java.util.Map;

import com.agroclim.webapp.exception.OAuth2AuthenticationProcessingException;
import com.agroclim.webapp.security.*;


public class OAuth2UserInfoFactory {

  public static UserPrincipal getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
    if (registrationId.equalsIgnoreCase(AuthProvider.google.toString())) {
      return GoogleOAuth2UserInfo.userPrincipalFrom(attributes);
    } else {
      throw new OAuth2AuthenticationProcessingException(
          "Sorry! Login with " + registrationId + " is not supported yet.");
    }
  }
}