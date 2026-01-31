package com.capstone.planbookai.database;

import com.capstone.planbookai.entity.*;
import com.capstone.planbookai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private SubjectRepository subjectRepository;
    @Autowired private GradeRepository gradeRepository;
    @Autowired private TopicRepository topicRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private AnswerRepository answerRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Kiểm tra nếu đã có câu hỏi thì không tạo thêm
        if (questionRepository.count() > 0) {
            System.out.println(">>> Dữ liệu đã tồn tại. Bỏ qua DataSeeder. - DataSeeder.java:27");
            return;
        }

        System.out.println(">>> BẮT ĐẦU TẠO DỮ LIỆU: 4 CHỦ ĐỀ CHÍNH (TOÁN, LÝ, HÓA, ANH)... - DataSeeder.java:31");

        // 1. Tạo Khối Lớp
        Grade g10 = createGrade("Lớp 10");
        Grade g11 = createGrade("Lớp 11");
        Grade g12 = createGrade("Lớp 12");
        List<Grade> grades = List.of(g10, g11, g12);

        // 2. Tạo Môn học và Chủ đề (Mỗi môn chỉ có 1 chủ đề trùng tên)
        createSubjectData("Toán", grades, List.of("Toán"));
        createSubjectData("Vật lí", grades, List.of("Vật lí"));
        createSubjectData("Hóa học", grades, List.of("Hóa học"));
        createSubjectData("Tiếng Anh", grades, List.of("Tiếng Anh"));

        System.out.println(">>> HOÀN TẤT TẠO DỮ LIỆU MẪU! - DataSeeder.java:45");
    }

    private Grade createGrade(String name) {
        return gradeRepository.findAll().stream()
                .filter(g -> g.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    Grade g = new Grade();
                    g.setName(name);
                    return gradeRepository.save(g);
                });
    }

    private void createSubjectData(String subjectName, List<Grade> grades, List<String> topicTitles) {
        Subject subject = new Subject();
        subject.setName(subjectName);
        subject = subjectRepository.save(subject);

        Random random = new Random();
        
        for (String title : topicTitles) {
            // Random khối lớp
            Grade randomGrade = grades.get(random.nextInt(grades.size()));
            
            Topic topic = new Topic();
            // --- SỬA ĐỔI QUAN TRỌNG: Chỉ lấy title, KHÔNG cộng thêm tên môn học ---
            topic.setTitle(title); 
            topic.setSubject(subject);
            topic.setGrade(randomGrade);
            topic = topicRepository.save(topic);

            // Tạo 25 câu hỏi mẫu cho chủ đề này
            generateQuestionsForTopic(topic, 25);
        }
    }

    private void generateQuestionsForTopic(Topic topic, int count) {
        Random rand = new Random(); 
        for (int i = 1; i <= count; i++) {
            Question question = new Question();
            
            int difficulty = rand.nextInt(100);
            if (difficulty < 50) question.setLevel(QuestionLevel.EASY);
            else if (difficulty < 80) question.setLevel(QuestionLevel.MEDIUM);
            else question.setLevel(QuestionLevel.HARD);

            question.setContent("<p>Câu hỏi số " + i + ": Kiểm tra kiến thức về <strong>" 
                                + topic.getTitle() + "</strong> (" + question.getLevel() + ")</p>");
            question.setTopic(topic);
            
            question = questionRepository.save(question);
            createAnswersForQuestion(question);
        }
    }

    private void createAnswersForQuestion(Question question) {
        Random rand = new Random();
        int correctAnswerIndex = rand.nextInt(4);
        String[] codes = {"A", "B", "C", "D"};
        
        for (int i = 0; i < 4; i++) {
            Answer answer = new Answer();
            answer.setCode(codes[i]);
            answer.setContent("Phương án " + codes[i]);
            answer.setIsCorrect(i == correctAnswerIndex); 
            answer.setQuestion(question);
            answerRepository.save(answer);
        }
    }
}