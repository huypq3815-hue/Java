A . Các yêu cầu 
Yêu cầu về bài toán & phạm vi
•	Xây dựng hệ thống phần mềm thực tế
•	Có vấn đề rõ ràng (giáo viên tốn thời gian, nhiều việc thủ công)
•	Có giải pháp công nghệ (AI, tự động hóa)
•	Phạm vi phù hợp thời gian → tập trung giáo viên Hóa THPT

 Yêu cầu về chức năng hệ thống
Hệ thống phải có:
•	Quản lý người dùng theo vai trò (Admin, Manager, Staff, Teacher)
•	Hỗ trợ giáo viên:
o	Tạo giáo án
o	Tạo bài tập, đề trắc nghiệm
o	Ngân hàng câu hỏi
o	Chấm bài trắc nghiệm bằng OCR
o	Xem kết quả & phân tích
•	Có AI hỗ trợ (tạo nội dung, đề, gợi ý)

 Yêu cầu về phi chức năng
•	Phân quyền rõ ràng (RBAC)
•	API chuẩn, dễ mở rộng
•	Hiệu năng ổn định
•	Kiến trúc rõ ràng, đúng mô hình phần mềm

 Yêu cầu về tài liệu
Bắt buộc có đầy đủ:
•	URD
•	SRS
•	SAD
•	DDD
•	Tài liệu cài đặt
•	Tài liệu kiểm thử
•	Mã nguồn + hướng dẫn deploy

 Yêu cầu về công nghệ
•	Backend: Spring Boot
•	Frontend: ReactJS
•	API: RESTful
•	DB: MySQL
•	AI / OCR: bên thứ ba (Gemini AI, Supabase)
•	Deploy: Docker + AWS

B.URD
1. Actors Overview
Hệ thống PlanbookAI có 4 nhóm người dùng chính:
•	Admin
•	Manager
•	Staff
•	Teacher

2. User Requirements by Actor
2.1 Admin
Admin cần làm gì?
•	Quản lý tài khoản người dùng (tạo, sửa, khóa, phân quyền)
•	Cấu hình các thiết lập chung của hệ thống
•	Quản lý khung chương trình / template giáo án
•	Theo dõi doanh thu và tình trạng sử dụng hệ thống
Admin mong muốn hệ thống hỗ trợ gì?
•	Giao diện quản trị dễ sử dụng
•	Phân quyền rõ ràng theo vai trò
•	Xem thống kê tổng quan (người dùng, gói dịch vụ, doanh thu)
•	Quản lý hệ thống tập trung, hạn chế lỗi vận hành

2.2 Manager
Manager cần làm gì?
•	Quản lý các gói dịch vụ / gói thuê bao
•	Theo dõi đơn hàng và đăng ký của người dùng
•	Kiểm duyệt nội dung do Staff tạo trước khi đưa vào sử dụng
Manager mong muốn hệ thống hỗ trợ gì?
•	Công cụ quản lý gói dịch vụ đơn giản
•	Theo dõi tình trạng đơn hàng theo thời gian
•	Quy trình duyệt nội dung rõ ràng, nhanh chóng
•	Báo cáo doanh thu và mức độ sử dụng dịch vụ

 2.3 Staff
Staff cần làm gì?
•	Tạo giáo án mẫu theo template có sẵn
•	Xây dựng ngân hàng câu hỏi theo môn học, chủ đề, mức độ
•	Tạo và quản lý các prompt AI dùng cho hệ thống
Staff mong muốn hệ thống hỗ trợ gì?
•	Công cụ soạn giáo án và câu hỏi có cấu trúc rõ ràng
•	Dễ dàng chỉnh sửa và cập nhật nội dung
•	Quản lý nội dung tập trung, tránh trùng lặp
•	Hỗ trợ AI để tăng tốc quá trình tạo nội dung

 2.4 Teacher
Teacher cần làm gì?
•	Tạo giáo án cá nhân dựa trên template và AI
•	Tạo bài tập và đề trắc nghiệm nhanh chóng
•	Sử dụng OCR để số hóa và chấm bài trắc nghiệm
•	Xem kết quả học tập và phân tích tiến độ học sinh
Teacher mong muốn hệ thống hỗ trợ gì?
•	Giảm thời gian soạn giáo án và đề thi
•	Giao diện đơn giản, dễ sử dụng
•	Chấm bài nhanh, chính xác
•	Lưu trữ tài liệu và tài nguyên giảng dạy cá nhân
•	Nhận gợi ý từ AI để cải thiện nội dung giảng dạy


Setup môi trường (Environment Setup):
BƯỚC 1: Infrastructure (Cài đặt Database MySQL bằng Docker)
Trong thư mục gốc PlanbookAI_Project
Mở Terminal tại thư mục docker-compose.yml, chạy lệnh:
docker-compose up -d
Kiểm tra: Mở Docker Desktop hoặc gõ docker ps. Nếu thấy pba-mysql đang chạy (Up) là thành công.(nếu chưa có Docker Desktop thì vào https://www.docker.com/#mcp đẻ tải về )
BƯỚC 2: Backend (Spring Boot)
Chạy thử: Tìm file PlanbookaiApplication.java, chuột phải chọn Run. Nếu Console báo "Started PlanbookaiApplication..." và không có lỗi đỏ lòm là thành công
BƯỚC 3: Frontend (ReactJS + Ant Design)

Mở Terminal tại thư mục gốc PlanbookAI_Project.

Chạy lệnh tạo project React:

Bash

npm create vite@latest frontend -- --template react
Di chuyển vào thư mục frontend:

Bash

cd frontend

Cài đặt các thư viện cần thiết:
Bash

# Cài đặt dependencies cơ bản
npm install

# Cài đặt Ant Design (UI Library)
npm install antd --save

# Cài đặt React Router (để chuyển trang) và Axios (gọi API)
npm install react-router-dom axios

Chạy thử:
Bash

npm run dev
Truy cập http://localhost:5173. Nếu thấy nút bấm màu xanh "Hello Teacher" là xong Frontend!

