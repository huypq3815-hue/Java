package com.capstone.planbookai.dto;

import java.util.List;

public class RenderExamResponse {

    private Long examId;
    
    // --- BỔ SUNG 2 TRƯỜNG NÀY ---
    private String examName;
    private Integer duration;
    // ----------------------------
    
    private List<QuestionRender> questions;

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    // Getter & Setter cho examName
    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }

    // Getter & Setter cho duration
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public List<QuestionRender> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionRender> questions) {
        this.questions = questions;
    }

    // ===== INNER DTO =====
    public static class QuestionRender {
        public Long id;
        public String content;
        public List<AnswerRender> answers;
    }

    public static class AnswerRender {
        public Long id;
        public String content;
    }
}