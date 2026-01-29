package com.capstone.planbookai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prompt_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String description;
}
