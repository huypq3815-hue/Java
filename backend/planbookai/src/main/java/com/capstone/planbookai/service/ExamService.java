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
    private final TopicRepository topicRepo; // Thêm để lấy tên chủ đề nếu cần

    public ExamService(
            ExamRepository examRepo,
            ExamQuestionRepository examQuestionRepo,
            QuestionRepository questionRepo,
            AnswerRepository answerRepo,
            StudentResultRepository studentResultRepo,
            TopicRepository topicRepo
    ) {
        this.examRepo = examRepo;
        this.examQuestionRepo = examQuestionRepo;
        this.questionRepo = questionRepo;
        this.answerRepo = answerRepo;
        this.studentResultRepo = studentResultRepo;
        this.topicRepo = topicRepo;
    }

    // --- 1. TẠO ĐỀ THI TỰ ĐỘNG ---
    @Transactional
    public Exam generateExam(GenerateExamRequest req) {
        // Lấy câu hỏi ngẫu nhiên từ ngân hàng
        List<Question> questions = new ArrayList<>();
        questions.addAll(questionRepo.findRandom(req.getTopicId(), "EASY", req.getEasy()));
        questions.addAll(questionRepo.findRandom(req.getTopicId(), "MEDIUM", req.getMedium()));
        questions.addAll(questionRepo.findRandom(req.getTopicId(), "HARD", req.getHard()));

        // Trộn ngẫu nhiên thứ tự câu hỏi
        Collections.shuffle(questions);

        // Tạo đối tượng Exam
        Exam exam = new Exam();
        exam.setTopicId(req.getTopicId());
        
        // LƯU QUAN TRỌNG: Tên đề và Thời gian
        exam.setExamName(req.getExamName());
        exam.setDuration(req.getDuration());
        
        // Tạo mã đề ngẫu nhiên (8 ký tự)
        exam.setExamCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        exam = examRepo.save(exam);

        // Lưu danh sách câu hỏi vào bảng trung gian
        for (Question q : questions) {
            // Trộn thứ tự đáp án (A, B, C, D)
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

    // --- 2. LẤY TẤT CẢ ĐỀ THI ---
    public List<Exam> getAllExams() {
        return examRepo.findAll();
    }

    // --- 3. LẤY CHI TIẾT ĐỀ THI (Cho Giáo viên xem & In) ---
    public ExamDetailResponse getExamDetailById(Long examId) {
        Exam exam = examRepo.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Lấy danh sách câu hỏi
        List<ExamQuestion> eqs = examQuestionRepo.findByExamId(examId);

        // Lấy thông tin Topic (để hiển thị tên chủ đề)
        Topic topic = topicRepo.findById(exam.getTopicId()).orElse(null);

        ExamDetailResponse res = new ExamDetailResponse();
        res.setId(exam.getId());
        res.setTopicId(exam.getTopicId());
        res.setTopicTitle(topic != null ? topic.getTitle() : ""); // Bổ sung nếu DTO có trường này
        res.setExamCode(exam.getExamCode());
        
        // TRẢ VỀ TÊN VÀ THỜI GIAN ĐỂ IN
        res.setExamName(exam.getExamName());
        res.setDuration(exam.getDuration());
        
        res.setTotalQuestions(eqs.size());

        List<ExamDetailResponse.QuestionDetail> questionDetails = new ArrayList<>();

        for (ExamQuestion eq : eqs) {
            Question q = questionRepo.findById(eq.getQuestionId()).orElseThrow();

            ExamDetailResponse.QuestionDetail qd = new ExamDetailResponse.QuestionDetail();
            qd.id = q.getId();
            qd.content = q.getContent();
            qd.level = q.getLevel().toString();

            // Lấy đáp án và map theo Code (A, B, C, D)
            List<Answer> answers = answerRepo.findByQuestionId(q.getId());
            Map<String, Answer> map = answers.stream()
                    .collect(Collectors.toMap(Answer::getCode, a -> a));

            List<ExamDetailResponse.AnswerDetail> answerDetails = new ArrayList<>();
            // Duyệt theo thứ tự đã trộn trong ExamQuestion
            for (String code : eq.getAnswerOrder().split(",")) {
                Answer a = map.get(code);
                if (a != null) {
                    ExamDetailResponse.AnswerDetail ad = new ExamDetailResponse.AnswerDetail();
                    ad.id = a.getId();
                    ad.code = a.getCode();
                    ad.content = a.getContent();
                    ad.isCorrect = a.getIsCorrect(); // Giáo viên cần thấy đáp án đúng
                    answerDetails.add(ad);
                }
            }

            qd.answers = answerDetails;
            questionDetails.add(qd);
        }

        res.setQuestions(questionDetails);
        return res;
    }

    // --- 4. LẤY ĐỀ THI ĐỂ LÀM BÀI (Cho Học sinh - Không lộ đáp án đúng) ---
    public RenderExamResponse renderExamByCode(String examCode) {
        Exam exam = examRepo.findByExamCode(examCode)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<ExamQuestion> eqs = examQuestionRepo.findByExamId(exam.getId());

        RenderExamResponse res = new RenderExamResponse();
        res.setExamId(exam.getId());
        res.setExamName(exam.getExamName()); // Hiển thị tên đề
        res.setDuration(exam.getDuration()); // Hiển thị thời gian

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
                if (a != null) {
                    RenderExamResponse.AnswerRender ar = new RenderExamResponse.AnswerRender();
                    ar.id = a.getId();
                    ar.content = a.getContent();
                    // KHÔNG TRẢ VỀ isCorrect Ở ĐÂY
                    ars.add(ar);
                }
            }
            qr.answers = ars;
            questionRenders.add(qr);
        }

        res.setQuestions(questionRenders);
        return res;
    }

    // --- 5. NỘP BÀI ---
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

        double score = total > 0 ? ((double) correct / total) * 10 : 0;

        StudentResult result = new StudentResult();
        result.setExamId(req.getExamId());
        result.setStudentId(req.getStudentId());
        result.setScore(score);

        return studentResultRepo.save(result);
    }

    // --- CÁC HÀM PHỤ TRỢ KHÁC ---

    // Placeholder cho OCR (Chưa implement logic xử lý ảnh)
    public StudentResult gradeByOCR(Long examId, Long studentId, MultipartFile file) {
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

        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("0-2", 0); distribution.put("2-4", 0);
        distribution.put("4-6", 0); distribution.put("6-8", 0);
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