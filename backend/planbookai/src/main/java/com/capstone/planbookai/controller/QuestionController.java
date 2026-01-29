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
import java.util.Map;

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
        Question question = new Question();
        question.setContent(request.getContent());
        question.setLevel(request.getLevel());

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        question.setTopic(topic);

        List<Answer> answers = new ArrayList<>();
        if (request.getAnswers() != null) {
            for (Map.Entry<String, QuestionRequest.AnswerData> entry : request.getAnswers().entrySet()) {
                String code = entry.getKey();
                String content = entry.getValue().getContent();
                boolean isCorrect = code.equals(request.getCorrectAnswer());

                Answer answer = new Answer();
                answer.setCode(code);
                answer.setContent(content);
                answer.setIsCorrect(isCorrect);
                answer.setQuestion(question);
                answers.add(answer);
            }
        }
        question.setAnswers(answers);

        Question created = questionService.createQuestion(question);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody QuestionRequest request) {
        Question question = new Question();
        question.setContent(request.getContent());
        question.setLevel(request.getLevel());

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        question.setTopic(topic);

        List<Answer> answers = new ArrayList<>();
        if (request.getAnswers() != null) {
            for (Map.Entry<String, QuestionRequest.AnswerData> entry : request.getAnswers().entrySet()) {
                String code = entry.getKey();
                String content = entry.getValue().getContent();
                boolean isCorrect = code.equals(request.getCorrectAnswer());

                Answer answer = new Answer();
                answer.setCode(code);
                answer.setContent(content);
                answer.setIsCorrect(isCorrect);
                answer.setQuestion(question); // Will be handled by service but setting here doesn't hurt
                answers.add(answer);
            }
        }
        question.setAnswers(answers);

        Question updated = questionService.updateQuestion(id, question);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }
}
