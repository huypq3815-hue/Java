package com.capstone.planbookai.dto;

import java.util.Map;

public class ExamStatisticsResponse {
    private Long examId;
    private Integer totalStudents;
    private Double averageScore;
    private Double maxScore;
    private Double minScore;
    private Map<String, Integer> scoreDistribution; // "0-2": 5, "2-4": 10, ...

    // Getters & Setters
    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }

    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }

    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }

    public Double getMaxScore() { return maxScore; }
    public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }

    public Double getMinScore() { return minScore; }
    public void setMinScore(Double minScore) { this.minScore = minScore; }

    public Map<String, Integer> getScoreDistribution() { return scoreDistribution; }
    public void setScoreDistribution(Map<String, Integer> scoreDistribution) { 
        this.scoreDistribution = scoreDistribution; 
    }
}