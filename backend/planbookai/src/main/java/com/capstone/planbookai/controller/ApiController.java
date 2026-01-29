package com.capstone.planbookai.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ApiController {

  @GetMapping("/")
  public Map<String, Object> home() {
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Welcome to PlanbookAI API");
    response.put("version", "0.0.1-SNAPSHOT");
    response.put("endpoints", new HashMap<String, String>() {{
      put("Auth", "POST /api/auth/register, POST /api/auth/login");
      put("Questions", "GET /api/questions, POST /api/questions, GET /api/questions/{id}, PUT /api/questions/{id}, DELETE /api/questions/{id}");
      put("Exams", "GET /api/exams, POST /api/exams, GET /api/exams/{id}, PUT /api/exams/{id}, DELETE /api/exams/{id}");
      put("Users", "GET /api/users, GET /api/users/{id}");
    }});
    return response;
  }

  @GetMapping("/health")
  public Map<String, String> health() {
    Map<String, String> response = new HashMap<>();
    response.put("status", "UP");
    response.put("message", "PlanbookAI API is running");
    return response;
  }
}
