import axiosClient from '../api/axiosClient';

const customerService = {
    // Đăng ký tài khoản khách hàng mới
    register: (customerData) => {
        const url = '/ApiCustomers/register';
        return axiosClient.post(url, customerData);
    },

    // Kiểm tra trùng lặp email
    checkEmail: (email) => {
        const url = `/ApiCustomers/check-email?email=${encodeURIComponent(email)}`;
        return axiosClient.get(url);
    },

    // Khôi phục mật khẩu
    forgotPassword: (email) => {
        const url = '/ApiCustomers/forgot-password';
        return axiosClient.post(url, { email });
    },

    // Đăng nhập khách hàng
    login: (credentials) => {
        const url = '/ApiCustomers/login';
        return axiosClient.post(url, credentials);
    },

    // Cập nhật thông tin hồ sơ
    updateProfile: (updateData) => {
        const url = '/ApiCustomers/update';
        return axiosClient.put(url, updateData);
    }
};

export default customerService;
