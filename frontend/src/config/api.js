import axios from 'axios';
import { message } from 'antd';

// Base URL của API - thay đổi theo environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Tạo instance của axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - Tự động gắn JWT token vào mỗi request
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('accessToken');

        // Nếu có token, gắn vào header Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request để debug (có thể tắt ở production)
        console.log('🚀 Request:', config.method.toUpperCase(), config.url);

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Xử lý response và errors
axiosInstance.interceptors.response.use(
    (response) => {
        // Log response để debug
        console.log('✅ Response:', response.config.url, response.status);

        // Return data trực tiếp để dễ sử dụng
        return response.data;
    },
    (error) => {
        console.error('❌ Response Error:', error);

        // Xử lý các loại lỗi khác nhau
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401: // Unauthorized - Token hết hạn hoặc không hợp lệ
                    message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');

                    // Xóa token và redirect về login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userInfo');

                    // Redirect về trang login
                    window.location.href = '/login';
                    break;

                case 403: // Forbidden - Không có quyền truy cập
                    message.error('Bạn không có quyền truy cập chức năng này!');
                    break;

                case 404: // Not Found
                    message.error('Không tìm thấy dữ liệu!');
                    break;

                case 500: // Internal Server Error
                    message.error('Lỗi hệ thống! Vui lòng thử lại sau.');
                    break;

                default:
                    // Hiển thị message lỗi từ backend nếu có
                    const errorMessage = data?.message || 'Đã có lỗi xảy ra!';
                    message.error(errorMessage);
            }

            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Request được gửi nhưng không nhận được response
            message.error('Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng.');
            return Promise.reject({ message: 'Network Error' });
        } else {
            // Lỗi khác
            message.error('Đã có lỗi xảy ra!');
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;