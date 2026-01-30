-- =================================================================================
-- 1. LÀM SẠCH DATABASE
-- =================================================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE answers;
TRUNCATE TABLE questions;
TRUNCATE TABLE topics;
TRUNCATE TABLE grades;
TRUNCATE TABLE subjects;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================================
-- 2. TẠO TÀI KHOẢN ADMIN (Thủ công bằng SQL)
-- =================================================================================
-- User: admin / Pass: admin123
-- Lưu ý: Chuỗi hash này là của 'admin123' chuẩn BCrypt
INSERT INTO users (username, email, password, role, status, enabled, phone)
VALUES (
    'admin',
    'admin@planbook.edu.vn',
    '$2a$10$N.zmdr9k7uOCVgFsl.O9C.ec0ishLFib/h05gr9n1U.Z3.f.w.y.i', 
    'ROLE_ADMIN',
    'ACTIVE',
    true,
    '0909000111'
);

-- =================================================================================
-- 3. DỮ LIỆU CÂU HỎI & MÔN HỌC
-- =================================================================================
-- Phần này để trống. 
-- File 'DataSeeder.java' sẽ tự động chạy sau khi server bật
-- để tạo 4 môn học và 400 câu hỏi như bạn yêu cầu.