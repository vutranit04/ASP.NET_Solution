import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách võ phục, dụng cụ bảo hộ, phụ kiện
    getAllProducts: () => {
        const url = '/apiProducts'; // Phải khớp chính xác với Router trong ProductsController phía Backend
        return axiosClient.get(url);
    }
};

export default productService;
