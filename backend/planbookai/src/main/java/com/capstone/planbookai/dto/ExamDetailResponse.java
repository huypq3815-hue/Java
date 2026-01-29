package com.capstone.planbookai.dto;

import java.util.List;

public class ExamDetailResponse {
    private Long id;
    private Long topicId;
    private String topicName;
    private String examCode;
    private List<QuestionDetail> questions;
    private Integer totalQuestions;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }

    public String getExamCode() { return examCode; }
    public void setExamCode(String examCode) { this.examCode = examCode; }

    public List<QuestionDetail> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDetail> questions) { this.questions = questions; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public static class QuestionDetail {
        public Long id;
        public String content;
        public String level;
        public List<AnswerDetail> answers;
    }

    public static class AnswerDetail {
        public Long id;
        public String code;
        public String content;
        public Boolean isCorrect; // Chỉ hiển thị cho teacher
    }
}