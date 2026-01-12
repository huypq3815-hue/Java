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

  @Column(columnDefinition = "TEXT", nullable = false)
  private String content;

  private boolean isCorrect;

  @ManyToOne
  @JoinColumn(name = "question_id")
  @com.fasterxml.jackson.annotation.JsonIgnore
  @ToString.Exclude
  private Question question;
}