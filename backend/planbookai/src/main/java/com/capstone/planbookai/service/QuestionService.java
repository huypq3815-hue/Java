package com.capstone.planbookai.service;

import com.capstone.planbookai.entity.Question;
import com.capstone.planbookai.entity.Answer;
import com.capstone.planbookai.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestionService {

  @Autowired
  private QuestionRepository questionRepository;

  @Autowired
  private com.capstone.planbookai.repository.ExamQuestionRepository examQuestionRepository;

  // Hàm lấy tất cả câu hỏi
  public List<Question> getAllQuestions() {
    return questionRepository.findAll();
  }

  @Transactional
  public Question createQuestion(Question question) {

    List<Answer> answers = question.getAnswers();
    if (answers != null && !answers.isEmpty()) {
      for (Answer answer : answers) {
        answer.setQuestion(question);
      }
    }

    return questionRepository.save(question);
  }

  // 3. API Xem chi tiết: Tìm câu hỏi theo ID
  public Question getQuestionById(Long id) {
    return questionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy câu hỏi có ID: " + id));
  }

  // 4. API Cập nhật
  @Transactional
  public Question updateQuestion(Long id, Question newData) {
    Question existingQuestion = getQuestionById(id);

    existingQuestion.setContent(newData.getContent());
    existingQuestion.setLevel(newData.getLevel());
    existingQuestion.setTopic(newData.getTopic());

    existingQuestion.getAnswers().clear();

    if (newData.getAnswers() != null) {
      for (Answer answer : newData.getAnswers()) {
        answer.setQuestion(existingQuestion); // Gắn lại cha cho con mới
        existingQuestion.getAnswers().add(answer);
      }
    }

    return questionRepository.save(existingQuestion);
  }

  // 5. API Xóa câu hỏi
  @Transactional
  public void deleteQuestion(Long id) {
    if (questionRepository.existsById(id)) {
      // Cascade delete manually for ExamQuestion
      examQuestionRepository.deleteByQuestionId(id);
      questionRepository.deleteById(id);
    } else {
      throw new RuntimeException("Không tìm thấy câu hỏi để xóa với ID: " + id);
    }
  }
}
