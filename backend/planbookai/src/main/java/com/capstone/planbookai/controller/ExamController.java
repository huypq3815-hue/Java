package com.capstone.planbookai.controller;

import com.capstone.planbookai.dto.*;
import com.capstone.planbookai.entity.Exam;
import com.capstone.planbookai.entity.StudentResult;
import com.capstone.planbookai.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    // ADMIN/TEACHER – TẠO ĐỀ THI
    @PostMapping("/generate")
    public ResponseEntity<Exam> generateExam(@RequestBody GenerateExamRequest req) {
        Exam exam = examService.generateExam(req);
        return ResponseEntity.ok(exam);
    }

    // LẤY DANH SÁCH TẤT CẢ ĐỀ THI
    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        List<Exam> exams = examService.getAllExams();
        return ResponseEntity.ok(exams);
    }

    // LẤY CHI TIẾT ĐỀ THI THEO ID
    @GetMapping("/{id}")
    public ResponseEntity<ExamDetailResponse> getExamDetail(@PathVariable Long id) {
        ExamDetailResponse detail = examService.getExamDetailById(id);
        return ResponseEntity.ok(detail);
    }

    // STUDENT – LẤY ĐỀ BẰNG EXAM CODE
    @GetMapping("/code/{examCode}")
    public ResponseEntity<RenderExamResponse> getExamByCode(@PathVariable String examCode) {
        RenderExamResponse exam = examService.renderExamByCode(examCode);
        return ResponseEntity.ok(exam);
    }

    // STUDENT – NỘP BÀI
    @PostMapping("/submit")
    public ResponseEntity<StudentResult> submitExam(@RequestBody SubmitExamRequest req) {
        StudentResult result = examService.submitExam(req);
        return ResponseEntity.ok(result);
    }

    // TEACHER – UPLOAD ẢNH ĐỂ CHẤM BẰNG OCR (Chuẩn bị)
    @PostMapping("/{examId}/grade-ocr")
    public ResponseEntity<StudentResult> gradeByOCR(
            @PathVariable Long examId,
            @RequestParam Long studentId,
            @RequestParam("file") MultipartFile file) {
        // TODO: Implement OCR logic
        StudentResult result = examService.gradeByOCR(examId, studentId, file);
        return ResponseEntity.ok(result);
    }

    // LẤY DANH SÁCH KẾT QUẢ CỦA 1 ĐỀ THI
    @GetMapping("/{examId}/results")
    public ResponseEntity<List<StudentResult>> getExamResults(@PathVariable Long examId) {
        List<StudentResult> results = examService.getResultsByExamId(examId);
        return ResponseEntity.ok(results);
    }

    // THỐNG KÊ KẾT QUẢ
    @GetMapping("/{examId}/statistics")
    public ResponseEntity<ExamStatisticsResponse> getExamStatistics(@PathVariable Long examId) {
        ExamStatisticsResponse stats = examService.getExamStatistics(examId);
        return ResponseEntity.ok(stats);
    }

    // XÓA ĐỀ THI
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }
}