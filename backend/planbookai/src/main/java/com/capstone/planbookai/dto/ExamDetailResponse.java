package com.capstone.planbookai.dto;

import java.util.List;

public class ExamDetailResponse {
    private Long id;
    private Long topicId;
    
    // Đổi tên thành topicTitle cho khớp với ExamService
    private String topicTitle; 
    
    private String examCode;
    
    // --- BỔ SUNG 2 TRƯỜNG NÀY ---
    private String examName;
    private Integer duration;
    // ----------------------------

    private List<QuestionDetail> questions;
    private Integer totalQuestions;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }

    public String getTopicTitle() { return topicTitle; }
    public void setTopicTitle(String topicTitle) { this.topicTitle = topicTitle; }

    public String getExamCode() { return examCode; }
    public void setExamCode(String examCode) { this.examCode = examCode; }

    // Getter & Setter cho examName
    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }

    // Getter & Setter cho duration
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

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
        public Boolean isCorrect; 
    }
}