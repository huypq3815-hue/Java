package com.capstone.planbookai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exams") // Đổi tên bảng thành số nhiều cho chuẩn (tùy chọn)
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long topicId;

    @Column(length = 50, unique = true)
    private String examCode;

    // --- BỔ SUNG 2 TRƯỜNG MỚI (BẮT BUỘC) ---
    @Column(name = "exam_name")
    private String examName;  // Tên đề thi (VD: Kiểm tra 15 phút)

    @Column(name = "duration")
    private Integer duration; // Thời gian làm bài (phút)
    // ---------------------------------------

    // --- GETTERS & SETTERS ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getExamCode() {
        return examCode;
    }

    public void setExamCode(String examCode) {
        this.examCode = examCode;
    }

    // Getter & Setter cho examName
    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    // Getter & Setter cho duration
    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}