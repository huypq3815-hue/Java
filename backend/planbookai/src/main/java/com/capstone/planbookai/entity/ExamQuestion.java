package com.capstone.planbookai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exam_question")
public class ExamQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long examId;
    private Long questionId;

    // Ví dụ: "B,A,D,C"
    private String answerOrder;

    public Long getId() {
        return id;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getAnswerOrder() {
        return answerOrder;
    }

    public void setAnswerOrder(String answerOrder) {
        this.answerOrder = answerOrder;
    }
}
