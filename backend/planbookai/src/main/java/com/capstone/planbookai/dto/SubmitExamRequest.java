package com.capstone.planbookai.dto;

import java.util.List;

public class SubmitExamRequest {

    private Long examId;
    private Long studentId;
    private List<AnswerSubmit> answers;

    // ===== getter & setter =====

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public List<AnswerSubmit> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerSubmit> answers) {
        this.answers = answers;
    }

    // =========================
    // INNER DTO
    // =========================
    public static class AnswerSubmit {
        private Long questionId;
        private String selectedCode; // A / B / C / D

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getSelectedCode() {
            return selectedCode;
        }

        public void setSelectedCode(String selectedCode) {
            this.selectedCode = selectedCode;
        }
    }
}
