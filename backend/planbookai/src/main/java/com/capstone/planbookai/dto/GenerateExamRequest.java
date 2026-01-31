package com.capstone.planbookai.dto;

public class GenerateExamRequest {

    // --- BỔ SUNG 2 TRƯỜNG MỚI ---
    private String examName;  // Tên đề thi
    private Integer duration; // Thời gian (phút)
    // ----------------------------

    private Long topicId;
    private int easy;
    private int medium;
    private int hard;

    // --- GETTERS & SETTERS CHO TRƯỜNG MỚI ---
    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    // ----------------------------------------

    // --- CÁC GETTER/SETTER CŨ GIỮ NGUYÊN ---
    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public int getEasy() {
        return easy;
    }

    public void setEasy(int easy) {
        this.easy = easy;
    }

    public int getMedium() {
        return medium;
    }

    public void setMedium(int medium) {
        this.medium = medium;
    }

    public int getHard() {
        return hard;
    }

    public void setHard(int hard) {
        this.hard = hard;
    }
}