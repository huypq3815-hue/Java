package com.capstone.planbookai.exam.controller;

import com.capstone.planbookai.exam.dto.GenerateExamRequest;
import com.capstone.planbookai.exam.dto.RenderExamResponse;
import com.capstone.planbookai.exam.dto.SubmitExamRequest;
import com.capstone.planbookai.exam.entity.Exam;
import com.capstone.planbookai.exam.entity.StudentResult;
import com.capstone.planbookai.exam.service.ExamService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    // ADMIN – TẠO ĐỀ
    @PostMapping("/generate")
    public Exam generate(@RequestBody GenerateExamRequest req) {
        return examService.generateExam(req);
    }

    // STUDENT – LẤY ĐỀ BẰNG CODE
    @GetMapping("/{examCode}")
    public RenderExamResponse render(@PathVariable String examCode) {
        return examService.renderExamByCode(examCode);
    }

    // STUDENT – NỘP BÀI
    @PostMapping("/submit")
    public StudentResult submit(@RequestBody SubmitExamRequest req) {
        return examService.submitExam(req);
    }
}
