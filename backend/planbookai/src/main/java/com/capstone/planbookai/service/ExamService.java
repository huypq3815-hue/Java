package com.capstone.planbookai.service;

import com.capstone.planbookai.dto.*;
import com.capstone.planbookai.entity.*;
import com.capstone.planbookai.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    @Transactional
    public Exam generateExam(GenerateExamRequest req) {
        List<Question> questions = new ArrayList<>();

        questions.addAll(questionRepo.findRandom(req.getTopicId(), "EASY", req.getEasy()));
        questions.addAll(questionRepo.findRandom(req.getTopicId(), "MEDIUM", req.getMedium()));
        questions.addAll(questionRepo.findRandom(req.getTopicId(), "HARD", req.getHard()));

        Collections.shuffle(questions);

        Exam exam = new Exam();
        exam.setTopicId(req.getTopicId());
        exam.setExamCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
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

    public List<Exam> getAllExams() {
        return examRepo.findAll();
    }

    public ExamDetailResponse getExamDetailById(Long examId) {
        Exam exam = examRepo.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<ExamQuestion> eqs = examQuestionRepo.findByExamId(examId);

        ExamDetailResponse res = new ExamDetailResponse();
        res.setId(exam.getId());
        res.setTopicId(exam.getTopicId());
        res.setExamCode(exam.getExamCode());
        res.setTotalQuestions(eqs.size());

        List<ExamDetailResponse.QuestionDetail> questionDetails = new ArrayList<>();

        for (ExamQuestion eq : eqs) {
            Question q = questionRepo.findById(eq.getQuestionId()).orElseThrow();

            ExamDetailResponse.QuestionDetail qd = new ExamDetailResponse.QuestionDetail();
            qd.id = q.getId();
            qd.content = q.getContent();
            qd.level = q.getLevel().toString();

            List<Answer> answers = answerRepo.findByQuestionId(q.getId());
            Map<String, Answer> map = answers.stream()
                    .collect(Collectors.toMap(Answer::getCode, a -> a));

            List<ExamDetailResponse.AnswerDetail> answerDetails = new ArrayList<>();
            for (String code : eq.getAnswerOrder().split(",")) {
                Answer a = map.get(code);
                ExamDetailResponse.AnswerDetail ad = new ExamDetailResponse.AnswerDetail();
                ad.id = a.getId();
                ad.code = a.getCode();
                ad.content = a.getContent();
                ad.isCorrect = a.getIsCorrect();
                answerDetails.add(ad);
            }

            qd.answers = answerDetails;
            questionDetails.add(qd);
        }

        res.setQuestions(questionDetails);
        return res;
    }

    public RenderExamResponse renderExamByCode(String examCode) {
        Exam exam = examRepo.findByExamCode(examCode)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<ExamQuestion> eqs = examQuestionRepo.findByExamId(exam.getId());

        RenderExamResponse res = new RenderExamResponse();
        res.setExamId(exam.getId());

        List<RenderExamResponse.QuestionRender> questionRenders = new ArrayList<>();

        for (ExamQuestion eq : eqs) {
            Question q = questionRepo.findById(eq.getQuestionId()).orElseThrow();

            RenderExamResponse.QuestionRender qr = new RenderExamResponse.QuestionRender();
            qr.id = q.getId();
            qr.content = q.getContent();

            List<Answer> answers = answerRepo.findByQuestionId(q.getId());
            Map<String, Answer> map = answers.stream()
                    .collect(Collectors.toMap(Answer::getCode, a -> a));

            List<RenderExamResponse.AnswerRender> ars = new ArrayList<>();
            for (String code : eq.getAnswerOrder().split(",")) {
                Answer a = map.get(code);
                RenderExamResponse.AnswerRender ar = new RenderExamResponse.AnswerRender();
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

    @Transactional
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

    public StudentResult gradeByOCR(Long examId, Long studentId, MultipartFile file) {
        // TODO: Implement OCR processing
        // Placeholder for now
        StudentResult result = new StudentResult();
        result.setExamId(examId);
        result.setStudentId(studentId);
        result.setScore(0.0);
        return studentResultRepo.save(result);
    }

    public List<StudentResult> getResultsByExamId(Long examId) {
        return studentResultRepo.findByExamId(examId);
    }

    public ExamStatisticsResponse getExamStatistics(Long examId) {
        List<StudentResult> results = studentResultRepo.findByExamId(examId);

        ExamStatisticsResponse stats = new ExamStatisticsResponse();
        stats.setExamId(examId);
        stats.setTotalStudents(results.size());

        if (results.isEmpty()) {
            stats.setAverageScore(0.0);
            stats.setMaxScore(0.0);
            stats.setMinScore(0.0);
            stats.setScoreDistribution(new HashMap<>());
            return stats;
        }

        Double avg = studentResultRepo.getAverageScoreByExamId(examId);
        stats.setAverageScore(avg != null ? avg : 0.0);

        DoubleSummaryStatistics summary = results.stream()
                .mapToDouble(StudentResult::getScore)
                .summaryStatistics();

        stats.setMaxScore(summary.getMax());
        stats.setMinScore(summary.getMin());

        // Score distribution
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("0-2", 0);
        distribution.put("2-4", 0);
        distribution.put("4-6", 0);
        distribution.put("6-8", 0);
        distribution.put("8-10", 0);

        for (StudentResult r : results) {
            double score = r.getScore();
            if (score < 2) distribution.merge("0-2", 1, Integer::sum);
            else if (score < 4) distribution.merge("2-4", 1, Integer::sum);
            else if (score < 6) distribution.merge("4-6", 1, Integer::sum);
            else if (score < 8) distribution.merge("6-8", 1, Integer::sum);
            else distribution.merge("8-10", 1, Integer::sum);
        }

        stats.setScoreDistribution(distribution);
        return stats;
    }

    @Transactional
    public void deleteExam(Long examId) {
        examQuestionRepo.deleteByExamId(examId);
        examRepo.deleteById(examId);
    }
}