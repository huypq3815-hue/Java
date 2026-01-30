package com.capstone.planbookai.service;

import com.capstone.planbookai.dto.DashboardResponse;
import com.capstone.planbookai.entity.*;
import com.capstone.planbookai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private QuestionRepository questionRepo;
    @Autowired private ExamRepository examRepo;
    @Autowired private StudentResultRepository resultRepo;

    public DashboardResponse getDashboardData() {
        DashboardResponse response = new DashboardResponse();

        // 1. Lấy số lượng tổng
        response.setTotalQuestions(questionRepo.count());
        response.setTotalExams(examRepo.count());
        response.setTotalResults(resultRepo.count());

        List<DashboardResponse.RecentActivity> activities = new ArrayList<>();

        List<Exam> recentExams = examRepo.findTop5ByOrderByIdDesc();
        for (Exam e : recentExams) {
            DashboardResponse.RecentActivity act = new DashboardResponse.RecentActivity();
            act.setId(e.getId());
            act.setType("EXAM");
            act.setTitle("Đề thi mới được tạo");
            act.setDescription(e.getExamName() + " (" + e.getExamCode() + ")");
            act.setTime("Mới tạo"); 
            activities.add(act);
        }


        List<Question> recentQuestions = questionRepo.findTop5ByOrderByIdDesc();
        for (Question q : recentQuestions) {
            DashboardResponse.RecentActivity act = new DashboardResponse.RecentActivity();
            act.setId(q.getId());
            act.setType("QUESTION");
            act.setTitle("Câu hỏi mới được thêm");

            String content = q.getContent().replaceAll("<[^>]*>", ""); // Bỏ thẻ HTML
            if (content.length() > 50) content = content.substring(0, 50) + "...";
            act.setDescription(content);
            act.setTime("Mới thêm");
            activities.add(act);
        }

        List<StudentResult> recentResults = resultRepo.findTop5ByOrderByIdDesc();
        for (StudentResult r : recentResults) {
            DashboardResponse.RecentActivity act = new DashboardResponse.RecentActivity();
            act.setId(r.getId());
            act.setType("RESULT");
            act.setTitle("Đã chấm bài thi");
            act.setDescription("HS: " + r.getStudentId() + " - Điểm: " + String.format("%.2f", r.getScore()));
            act.setTime("Vừa chấm");
            activities.add(act);
        }

        List<DashboardResponse.RecentActivity> sortedActivities = activities.stream()
                .sorted(Comparator.comparing(DashboardResponse.RecentActivity::getId).reversed())
                .limit(6)
                .collect(Collectors.toList());

        response.setActivities(sortedActivities);

        return response;
    }
}