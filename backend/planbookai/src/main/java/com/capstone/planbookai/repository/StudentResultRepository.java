package com.capstone.planbookai.repository;

import com.capstone.planbookai.entity.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
    List<StudentResult> findByExamId(Long examId);
    Optional<StudentResult> findByExamIdAndStudentId(Long examId, Long studentId);
    
    @Query("SELECT AVG(r.score) FROM StudentResult r WHERE r.examId = :examId")
    Double getAverageScoreByExamId(Long examId);
}