import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách sản phẩm (hỗ trợ tìm kiếm và lọc giá)
    getAllProducts: (search, minPrice, maxPrice) => {
        let params = [];
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') params.push(`minPrice=${minPrice}`);
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') params.push(`maxPrice=${maxPrice}`);
        const queryString = params.length > 0 ? `?${params.join('&')}` : '';
        const url = `/ApiProducts${queryString}`;
        return axiosClient.get(url);
    },

    // Lấy chi tiết sản phẩm theo ID
    getProductById: (id) => {
        const url = `/ApiProducts/${id}`;
        return axiosClient.get(url);
    },

    // Lấy sản phẩm theo danh mục sản phẩm
    getProductsByCategory: (categoryId) => {
        const url = `/ApiProducts/categoryproduct/${categoryId}`;
        return axiosClient.get(url);
    },

    // Lấy 3 sản phẩm mới nhất (YC #36)
    getLatestProducts: () => {
        const url = '/ApiProducts/latest';
        return axiosClient.get(url);
    },

    // Lấy 3 sản phẩm bán chạy nhất (YC #37)
    getBestSellingProducts: () => {
        const url = '/ApiProducts/bestselling';
        return axiosClient.get(url);
    }
};

export default productService;
