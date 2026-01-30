package com.capstone.planbookai.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardResponse {
    // Số liệu thống kê
    private long totalQuestions;
    private long totalExams;
    private long totalResults;
    
    // Danh sách hoạt động
    private List<RecentActivity> activities;

    @Data
    public static class RecentActivity {
        private String title;
        private String description;
        private String time;
        private String type;
        private Long id;
    }
}