import axios from 'axios';

const axiosClient = axios.create({
  // Địa chỉ Backend Spring Boot
  baseURL: 'http://localhost:8080/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Xử lý dữ liệu trả về từ Backend cho gọn
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Log lỗi hoặc xử lý chung
    console.error("API Error: - axiosClient.js:21", error);
    return Promise.reject(error);
  }
);

export default axiosClient;