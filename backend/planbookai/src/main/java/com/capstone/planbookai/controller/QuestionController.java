package com.capstone.planbookai.controller;

import com.capstone.planbookai.entity.Answer;
import com.capstone.planbookai.entity.Question;
import com.capstone.planbookai.entity.Topic;
import com.capstone.planbookai.payload.request.QuestionRequest;
import com.capstone.planbookai.repository.TopicRepository;
import com.capstone.planbookai.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private TopicRepository topicRepository;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody QuestionRequest request) {
        try {
            Question question = new Question();
            question.setContent(request.getContent());
            question.setLevel(request.getLevel());

            Topic topic = topicRepository.findById(request.getTopicId())
                    .orElseThrow(() -> new RuntimeException("Topic not found"));
            question.setTopic(topic);

            List<Answer> answers = new ArrayList<>();
            // SỬA: Duyệt qua List thay vì Map
            if (request.getAnswers() != null) {
                for (QuestionRequest.AnswerDTO dto : request.getAnswers()) {
                    Answer answer = new Answer();
                    answer.setCode(dto.getCode());       // Lấy code từ DTO
                    answer.setContent(dto.getContent()); // Lấy content từ DTO
                    answer.setIsCorrect(dto.getIsCorrect()); // Lấy boolean trực tiếp
                    answer.setQuestion(question);
                    answers.add(answer);
                }
            }
            question.setAnswers(answers);

            Question created = questionService.createQuestion(question);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody QuestionRequest request) {
        try {
            Question question = new Question();
            question.setContent(request.getContent());
            question.setLevel(request.getLevel());

            Topic topic = topicRepository.findById(request.getTopicId())
                    .orElseThrow(() -> new RuntimeException("Topic not found"));
            question.setTopic(topic);

            List<Answer> answers = new ArrayList<>();
            // SỬA: Duyệt qua List thay vì Map (Tương tự Create)
            if (request.getAnswers() != null) {
                for (QuestionRequest.AnswerDTO dto : request.getAnswers()) {
                    Answer answer = new Answer();
                    answer.setCode(dto.getCode());
                    answer.setContent(dto.getContent());
                    answer.setIsCorrect(dto.getIsCorrect());
                    answer.setQuestion(question);
                    answers.add(answer);
                }
            }
            question.setAnswers(answers);

            Question updated = questionService.updateQuestion(id, question);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }
}