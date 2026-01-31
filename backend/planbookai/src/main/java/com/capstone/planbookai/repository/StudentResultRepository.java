package com.capstone.planbookai.repository;

import com.capstone.planbookai.entity.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
    
    List<StudentResult> findByExamId(Long examId);

    @Query("SELECT AVG(s.score) FROM StudentResult s WHERE s.examId = :examId")
    Double getAverageScoreByExamId(@Param("examId") Long examId);

    List<StudentResult> findTop5ByOrderByIdDesc();
}