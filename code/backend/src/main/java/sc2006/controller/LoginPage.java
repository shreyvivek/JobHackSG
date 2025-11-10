package sc2006.controller;

import java.util.HashMap;
import java.util.Map;

import sc2006.util.Exceptions;

public class LoginPage {
    private String lastError;

    public LoginPage() {}

    public void enterCredentials(String email, String password) {
        // UI placeholder
    }

    public Map<String, Object> submitLogin(String email, String password) {
        try {
            AuthenticationController authController = new AuthenticationController();

            // Build request body in the expected format
            Map<String, String> loginData = new HashMap<>();
            loginData.put("email", email);
            loginData.put("passwordHash", password);

            // Controller returns JSON-like response
            Map<String, Object> response = authController.login(loginData);

            if (response.containsKey("error")) {
                showError((String) response.get("error"));
            }

            return response;

        } catch (Exceptions.Auth e) {
            showError(e.getMessage());
            Map<String, Object> err = new HashMap<>();
            err.put("error", e.getMessage());
            return err;
        }
    }

    public void showError(String message) {
        this.lastError = message;
    }

    public String getLastError() {
        return lastError;
    }
}
