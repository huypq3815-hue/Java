package com.capstone.planbookai.controller;

import com.capstone.planbookai.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/generate-question")
    public ResponseEntity<?> generateQuestion(@RequestBody Map<String, String> request) {
        String topic = request.get("topic");
        String level = request.get("level");
        String subject = request.get("subject");
        String grade = request.get("grade");
        String promptName = request.get("promptName"); // Optional

        String result = geminiService.generateQuestion(topic, level, subject, grade, promptName);
        
        // Result is expected to be a JSON string from AI.
        // We return it directly. Ideally we might want to parse it to ensure valid JSON,
        // but for now let's return it as string or object.
        // If the AI returns a JSON string, we can try to return it as raw JSON.
        
        return ResponseEntity.ok(result);
    }
}
