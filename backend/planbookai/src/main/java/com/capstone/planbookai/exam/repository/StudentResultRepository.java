package com.capstone.planbookai.exam.repository;

import com.capstone.planbookai.exam.entity.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentResultRepository
        extends JpaRepository<StudentResult, Long> {

    // Lấy kết quả của 1 sinh viên trong 1 đề
    Optional<StudentResult> findByExamIdAndStudentId(
            Long examId,
            Long studentId
    );

    // Lấy tất cả kết quả của 1 sinh viên
    List<StudentResult> findByStudentId(Long studentId);

    // Lấy tất cả kết quả của 1 đề thi
    List<StudentResult> findByExamId(Long examId);
}
