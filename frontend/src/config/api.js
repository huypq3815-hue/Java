import axios from 'axios';
import { message } from 'antd';

// Base URL của API - thay đổi theo environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Tạo instance của axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - Tự động gắn JWT token vào mỗi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request: - api.js:23', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error: - api.js:27', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Xử lý response và errors
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response: - api.js:35', response.config.url, response.status);
        return response.data;
    },
    (error) => {
        console.error('Response Error: - api.js:39', error);

        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    console.warn('401 Unauthorized detected on: - api.js:46', error.config.url);
                    message.warning('401: Token không hợp lệ hoặc hết hạn (đang debug, không tự redirect)');
                    // KHÔNG XÓA TOKEN, KHÔNG REDIRECT TỰ ĐỘNG
                    break;

                case 403:
                    message.error('Bạn không có quyền truy cập chức năng này!');
                    break;

                case 404:
                    message.error('Không tìm thấy dữ liệu!');
                    break;

                case 500:
                    message.error('Lỗi hệ thống! Vui lòng thử lại sau.');
                    break;

                default:
                    const errorMessage = data?.message || 'Đã có lỗi xảy ra!';
                    message.error(errorMessage);
            }

            return Promise.reject(error.response.data);
        } else if (error.request) {
            message.error('Không thể kết nối đến server! Vui lòng kiểm tra kết nối mạng.');
            return Promise.reject({ message: 'Network Error' });
        } else {
            message.error('Đã có lỗi xảy ra!');
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;