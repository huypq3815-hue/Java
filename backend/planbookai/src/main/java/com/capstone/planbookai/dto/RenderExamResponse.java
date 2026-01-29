package com.capstone.planbookai.dto;

import java.util.List;

public class RenderExamResponse {

    private Long examId;
    private List<QuestionRender> questions;

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

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
