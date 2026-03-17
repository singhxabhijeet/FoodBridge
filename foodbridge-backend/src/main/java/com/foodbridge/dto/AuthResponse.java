package com.foodbridge.dto;

public class AuthResponse {
    private String token;
    private String role;
    private String fullName;
    private Long userId;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role, String fullName, Long userId) {
        this.token = token;
        this.role = role;
        this.fullName = fullName;
        this.userId = userId;
    }

    public AuthResponse(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
