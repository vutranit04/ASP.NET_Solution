import axios from 'axios';

// Đọc cấu hình từ file .env (REACT_APP_API_URL, REACT_APP_IMAGE_BASE_URL)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7298/api';
export const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7298';

// Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
});

// Helper lấy URL đầy đủ cho hình ảnh (hỗ trợ ảnh tải lên từ Backend)
export const getFullImageUrl = (path) => {
    if (!path) return 'https://placehold.co/300x300?text=No+Image';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${IMAGE_BASE_URL}${path}`;
};

// Giải thích: Interceptor giúp chúng ta can thiệp vào dữ liệu trước khi trả về cho component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, bóc tách lấy thẳng cục data bên trong dữ liệu JSON
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung tại đây (Ví dụ: Server sập, lỗi 404, lỗi 500)
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
