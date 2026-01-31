package com.capstone.planbookai.dto;

import com.capstone.planbookai.entity.QuestionLevel;
import lombok.Data;
import java.util.List;

@Data
public class QuestionRequest {
    private String content;
    private QuestionLevel level; // EASY, MEDIUM, HARD
    private Long topicId;
    private List<AnswerDTO> answers;

    @Data
    public static class AnswerDTO {
        private String code;      // A, B, C, D
        private String content;   // Nội dung đáp án
        private Boolean isCorrect;
    }
}