package com.capstone.planbookai.exam.service;

import com.capstone.planbookai.exam.dto.GenerateExamRequest;
import com.capstone.planbookai.exam.dto.RenderExamResponse;
import com.capstone.planbookai.exam.dto.SubmitExamRequest;
import com.capstone.planbookai.exam.entity.Exam;
import com.capstone.planbookai.exam.entity.ExamQuestion;
import com.capstone.planbookai.exam.entity.StudentResult;
import com.capstone.planbookai.exam.repository.ExamQuestionRepository;
import com.capstone.planbookai.exam.repository.ExamRepository;
import com.capstone.planbookai.exam.repository.StudentResultRepository;
import com.capstone.planbookai.question.entity.Answer;
import com.capstone.planbookai.question.entity.Question;
import com.capstone.planbookai.question.repository.AnswerRepository;
import com.capstone.planbookai.question.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamService {

    private final ExamRepository examRepo;
    private final ExamQuestionRepository examQuestionRepo;
    private final QuestionRepository questionRepo;
    private final AnswerRepository answerRepo;
    private final StudentResultRepository studentResultRepo;

    public ExamService(
            ExamRepository examRepo,
            ExamQuestionRepository examQuestionRepo,
            QuestionRepository questionRepo,
            AnswerRepository answerRepo,
            StudentResultRepository studentResultRepo
    ) {
        this.examRepo = examRepo;
        this.examQuestionRepo = examQuestionRepo;
        this.questionRepo = questionRepo;
        this.answerRepo = answerRepo;
        this.studentResultRepo = studentResultRepo;
    }

    // =======================
    // GENERATE EXAM (ADMIN)
    // =======================
    public Exam generateExam(GenerateExamRequest req) {

        List<Question> questions = new ArrayList<>();

        questions.addAll(questionRepo.findRandom(req.getTopicId(), "EASY", req.getEasy()));
        questions.addAll(questionRepo.findRandom(req.getTopicId(), "MEDIUM", req.getMedium()));
        questions.addAll(questionRepo.findRandom(req.getTopicId(), "HARD", req.getHard()));

        Collections.shuffle(questions);

        Exam exam = new Exam();
        exam.setTopicId(req.getTopicId());
        exam.setExamCode(UUID.randomUUID().toString().substring(0, 5));
        exam = examRepo.save(exam);

        for (Question q : questions) {

            List<String> order = new ArrayList<>(List.of("A", "B", "C", "D"));
            Collections.shuffle(order);

            ExamQuestion eq = new ExamQuestion();
            eq.setExamId(exam.getId());
            eq.setQuestionId(q.getId());
            eq.setAnswerOrder(String.join(",", order));

            examQuestionRepo.save(eq);
        }

        return exam;
    }

    // =======================
    // RENDER EXAM BY CODE (STUDENT)
    // =======================
    public RenderExamResponse renderExamByCode(String examCode) {

        Exam exam = examRepo.findByExamCode(examCode)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Long examId = exam.getId();

        List<ExamQuestion> eqs = examQuestionRepo.findByExamId(examId);

        RenderExamResponse res = new RenderExamResponse();
        res.setExamId(examId);

        List<RenderExamResponse.QuestionRender> questionRenders = new ArrayList<>();

        for (ExamQuestion eq : eqs) {

            Question q = questionRepo.findById(eq.getQuestionId()).orElseThrow();

            RenderExamResponse.QuestionRender qr =
                    new RenderExamResponse.QuestionRender();

            qr.id = q.getId();
            qr.content = q.getContent();

            List<Answer> answers = answerRepo.findByQuestionId(q.getId());

            Map<String, Answer> map = answers.stream()
                    .collect(Collectors.toMap(Answer::getCode, a -> a));

            List<RenderExamResponse.AnswerRender> ars = new ArrayList<>();

            for (String code : eq.getAnswerOrder().split(",")) {
                Answer a = map.get(code);

                RenderExamResponse.AnswerRender ar =
                        new RenderExamResponse.AnswerRender();

                ar.id = a.getId();
                ar.content = a.getContent();

                ars.add(ar);
            }

            qr.answers = ars;
            questionRenders.add(qr);
        }

        res.setQuestions(questionRenders);
        return res;
    }

    // =======================
    // SUBMIT EXAM
    // =======================
    public StudentResult submitExam(SubmitExamRequest req) {

        int correct = 0;
        int total = req.getAnswers().size();

        for (SubmitExamRequest.AnswerSubmit a : req.getAnswers()) {

            List<Answer> answers = answerRepo.findByQuestionId(a.getQuestionId());

            Answer right = answers.stream()
                    .filter(ans -> Boolean.TRUE.equals(ans.getIsCorrect()))
                    .findFirst()
                    .orElse(null);

            if (right != null && right.getCode().equals(a.getSelectedCode())) {
                correct++;
            }
        }

        double score = ((double) correct / total) * 10;

        StudentResult result = new StudentResult();
        result.setExamId(req.getExamId());
        result.setStudentId(req.getStudentId());
        result.setScore(score);

        return studentResultRepo.save(result);
    }
}
