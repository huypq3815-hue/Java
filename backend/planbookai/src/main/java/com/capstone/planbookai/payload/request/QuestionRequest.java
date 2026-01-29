package com.capstone.planbookai.payload.request;

import com.capstone.planbookai.entity.QuestionLevel;
import lombok.Data;

import java.util.Map;

@Data
public class QuestionRequest {
    private Long topicId;
    private String content;
    private QuestionLevel level;
    
    // Map<String, AnswerData> where key is "A", "B", "C", "D"
    private Map<String, AnswerData> answers; 
    
    private String correctAnswer; // "A", "B", "C", "D"

    @Data
    public static class AnswerData {
        private String content;
    }
}
