-- ===============================
-- CLEAN (TRÁNH DUPLICATE KHI RESTART)
-- ===============================
DELETE FROM answers;
DELETE FROM questions;
DELETE FROM topics;
DELETE FROM grades;
DELETE FROM subjects;

-- ===============================
-- SUBJECT
-- ===============================
INSERT INTO subjects (name)
VALUES ('Hóa học');

-- ===============================
-- GRADES
-- ===============================
INSERT INTO grades (name) VALUES ('Lớp 10');
INSERT INTO grades (name) VALUES ('Lớp 11');
INSERT INTO grades (name) VALUES ('Lớp 12');

-- ===============================
-- TOPICS
-- ===============================
INSERT INTO topics (title, subject_id, grade_id)
VALUES (
    'Nhóm Halogen',
    (SELECT id FROM subjects WHERE name = 'Hóa học'),
    (SELECT id FROM grades WHERE name = 'Lớp 10')
);

INSERT INTO topics (title, subject_id, grade_id)
VALUES (
    'Nitơ và Hợp chất',
    (SELECT id FROM subjects WHERE name = 'Hóa học'),
    (SELECT id FROM grades WHERE name = 'Lớp 11')
);

INSERT INTO topics (title, subject_id, grade_id)
VALUES (
    'Este - Lipit',
    (SELECT id FROM subjects WHERE name = 'Hóa học'),
    (SELECT id FROM grades WHERE name = 'Lớp 12')
);

-- ===============================
-- QUESTIONS
-- ===============================
INSERT INTO questions (content, level, topic_id)
VALUES (
    '<p>Nguyên tố nào sau đây thuộc nhóm <strong>Halogen</strong>?</p>',
    'EASY',
    (SELECT id FROM topics WHERE title = 'Nhóm Halogen')
);

INSERT INTO questions (content, level, topic_id)
VALUES (
    '<p>Công thức hóa học của khí cười là gì? (Gợi ý: N<sub>2</sub>O)</p>',
    'MEDIUM',
    (SELECT id FROM topics WHERE title = 'Nitơ và Hợp chất')
);

-- ===============================
-- ANSWERS – QUESTION 1
-- ===============================
INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('A', 'Natri (Na)', false, (SELECT id FROM questions WHERE level = 'EASY' LIMIT 1));

INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('B', 'Clo (Cl)', true, (SELECT id FROM questions WHERE level = 'EASY' LIMIT 1));

INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('C', 'Sắt (Fe)', false, (SELECT id FROM questions WHERE level = 'EASY' LIMIT 1));

INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('D', 'Oxi (O)', false, (SELECT id FROM questions WHERE level = 'EASY' LIMIT 1));

-- ===============================
-- ANSWERS – QUESTION 2
-- ===============================
INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('A', 'NO', false, (SELECT id FROM questions WHERE level = 'MEDIUM' LIMIT 1));

INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('B', 'NO<sub>2</sub>', false, (SELECT id FROM questions WHERE level = 'MEDIUM' LIMIT 1));

INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('C', 'N<sub>2</sub>O', true, (SELECT id FROM questions WHERE level = 'MEDIUM' LIMIT 1));

INSERT INTO answers (code, content, is_correct, question_id)
VALUES ('D', 'NH<sub>3</sub>', false, (SELECT id FROM questions WHERE level = 'MEDIUM' LIMIT 1));