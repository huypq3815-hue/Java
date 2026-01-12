package com.capstone.planbookai.controller;

import com.capstone.planbookai.entity.Question;
import com.capstone.planbookai.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

  @Autowired
  private QuestionService questionService;

  // API: GET /api/questions
  @GetMapping
  public List<Question> getAll() {
    return questionService.getAllQuestions();
  }

  // API: POST /api/questions
  @PostMapping
  public Question create(@RequestBody Question question) {
    return questionService.createQuestion(question);
  }

  // API: GET /api/questions/{id}
  @GetMapping("/{id}")
  public Question getDetail(@PathVariable Long id) {
    return questionService.getQuestionById(id);
  }

  // API: PUT /api/questions/{id} (Cập nhật)
  @PutMapping("/{id}")
  public Question update(@PathVariable Long id, @RequestBody Question question) {
    return questionService.updateQuestion(id, question);
  }

  // API: DELETE /api/questions/{id} (Xóa)
  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    questionService.deleteQuestion(id);
  }
}