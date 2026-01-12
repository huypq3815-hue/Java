-- 1. Thêm Môn học (Môn Hóa)
INSERT INTO subjects (name) VALUES ('Hóa học');

-- 2. Thêm Khối lớp
INSERT INTO grades (name) VALUES ('Lớp 10');
INSERT INTO grades (name) VALUES ('Lớp 11');
INSERT INTO grades (name) VALUES ('Lớp 12');

-- 3. Thêm Chủ đề (Topic)
-- Topic 1: Halogen (Thuộc môn Hóa (id=1) và Lớp 10 (id=1))
INSERT INTO topics (title, subject_id, grade_id) VALUES ('Nhóm Halogen', 1, 1);
-- Topic 2: Nitơ (Thuộc môn Hóa (id=1) và Lớp 11 (id=2))
INSERT INTO topics (title, subject_id, grade_id) VALUES ('Nitơ và Hợp chất', 1, 2);
-- Topic 3: Este (Thuộc môn Hóa (id=1) và Lớp 12 (id=3))
INSERT INTO topics (title, subject_id, grade_id) VALUES ('Este - Lipit', 1, 3);

-- 4. Thêm Câu hỏi mẫu (Có chứa HTML)
-- Câu 1 (Thuộc chủ đề Halogen - id=1, Mức độ EASY)
INSERT INTO questions (content, level, topic_id)
VALUES ('<p>Nguyên tố nào sau đây thuộc nhóm <strong>Halogen</strong>?</p>', 'EASY', 1);

-- Câu 2 (Thuộc chủ đề Nitơ - id=2, Mức độ MEDIUM, có công thức hóa học)
INSERT INTO questions (content, level, topic_id)
VALUES ('<p>Công thức hóa học của khí cười là gì? (Gợi ý: N<sub>2</sub>O)</p>', 'MEDIUM', 2);

-- 5. Thêm Đáp án cho Câu 1
INSERT INTO answers (content, is_correct, question_id) VALUES ('Natri (Na)', false, 1);
INSERT INTO answers (content, is_correct, question_id) VALUES ('Clo (Cl)', true, 1); -- Đúng
INSERT INTO answers (content, is_correct, question_id) VALUES ('Sắt (Fe)', false, 1);
INSERT INTO answers (content, is_correct, question_id) VALUES ('Oxi (O)', false, 1);

-- 6. Thêm Đáp án cho Câu 2
INSERT INTO answers (content, is_correct, question_id) VALUES ('NO', false, 2);
INSERT INTO answers (content, is_correct, question_id) VALUES ('NO<sub>2</sub>', false, 2);
INSERT INTO answers (content, is_correct, question_id) VALUES ('N<sub>2</sub>O', true, 2); -- Đúng
INSERT INTO answers (content, is_correct, question_id) VALUES ('NH<sub>3</sub>', false, 2);