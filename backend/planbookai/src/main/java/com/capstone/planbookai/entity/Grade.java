package com.capstone.planbookai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "grades")
public class Grade {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;
}