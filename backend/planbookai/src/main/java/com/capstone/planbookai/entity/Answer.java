package com.capstone.planbookai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A / B / C / D
    @Column(length = 5, nullable = false, columnDefinition = "VARCHAR(5) DEFAULT 'A'")
    private String code;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // ❗ Render ra để Admin biết đáp án đúng
    private Boolean isCorrect;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Question question;
}
