package com.capstone.planbookai.exam.repository;

import com.capstone.planbookai.exam.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamQuestionRepository
        extends JpaRepository<ExamQuestion, Long> {

    // DÙNG CHO renderExam()
    List<ExamQuestion> findByExamId(Long examId);
}
