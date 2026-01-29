package com.capstone.planbookai.repository;

import com.capstone.planbookai.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {
    List<ExamQuestion> findByExamId(Long examId);
    void deleteByExamId(Long examId);
    void deleteByQuestionId(Long questionId);
}