package com.capstone.planbookai.service;

import com.capstone.planbookai.model.PromptTemplate;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private PromptTemplateService promptTemplateService;

    // Reverting to gemini-2.5-flash-lite
    private static final String MODEL_NAME = "gemini-2.5-flash-lite";

    public String generateQuestion(String topic, String level, String subject, String grade, String promptName) {
        try {
            // 1. Get Prompt
            String targetPrompt = (promptName != null && !promptName.isEmpty()) ? promptName : "question_generation_mcq";
            Optional<PromptTemplate> templateOpt = promptTemplateService.getTemplateByName(targetPrompt);
            
            // Fallback content if template missing
            String template = templateOpt.map(PromptTemplate::getContent).orElse("Create a {level} question about {topic} for {subject} {grade}. Format: JSON.");
            
            String prompt = template
                    .replace("{topic}", topic)
                    .replace("{level}", level)
                    .replace("{subject}", subject)
                    .replace("{grade}", grade);

            // 2. Call Gemini SDK
            Client client = Client.builder()
                    .apiKey(apiKey)
                    .build();

            GenerateContentResponse response = client.models.generateContent(
                    MODEL_NAME,
                    prompt,
                    null
            );

            String text = response.text();
            
            // 3. Robust JSON Extraction
            int startIndex = text.indexOf("{");
            int endIndex = text.lastIndexOf("}");
            
            if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
                return text.substring(startIndex, endIndex + 1);
            }
            
            return text.trim();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gemini generation failed: " + e.getMessage());
        }
    }
}
