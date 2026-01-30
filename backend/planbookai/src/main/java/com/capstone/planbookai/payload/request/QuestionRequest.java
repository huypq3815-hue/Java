package com.capstone.planbookai.payload.request;

import com.capstone.planbookai.entity.QuestionLevel;
import lombok.Data;
import java.util.List; // Import List

@Data
public class QuestionRequest {
    private Long topicId;
    private String content;
    private QuestionLevel level;
    
    // SỬA: Dùng List thay vì Map để khớp với JSON từ Frontend
    private List<AnswerDTO> answers; 

    // Field này không cần thiết nữa nếu dùng List<AnswerDTO> có field isCorrect
    // private String correctAnswer; 

    @Data
    public static class AnswerDTO {
        private String code;      // "A", "B", "C", "D"
        private String content;   // Nội dung câu trả lời
        private Boolean isCorrect; // Frontend gửi trực tiếp true/false vào đây
    }
}