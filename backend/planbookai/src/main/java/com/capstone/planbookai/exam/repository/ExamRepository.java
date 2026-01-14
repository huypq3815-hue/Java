package com.capstone.planbookai.exam.repository;

import com.capstone.planbookai.exam.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    Optional<Exam> findByExamCode(String examCode);
}
