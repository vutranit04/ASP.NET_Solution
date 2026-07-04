import axiosClient from '../api/axiosClient';

const blogService = {
    // Hàm gọi API lấy danh mục các chủ đề bài viết
    getBlogCategories: () => {
        const url = '/ApiCategories'; // Khớp với Route quản lý chuyên mục ở Backend (ApiCategoriesController)
        return axiosClient.get(url);
    },

    // Hàm gọi API lấy toàn bộ các bài viết (Slide 17)
    getAllPosts: () => {
        const url = '/ApiPosts'; // Khớp với Route quản lý bài viết ở Backend (ApiPostsController)
        return axiosClient.get(url);
    },

    // Hàm lấy 3 bài viết mới nhất
    getLatestPosts: () => {
        const url = '/ApiPosts/latest';
        return axiosClient.get(url);
    },

    // Hàm lấy chi tiết bài viết theo ID (Slide 19)
    getPostById: (id) => {
        const url = `/ApiPosts/${id}`; // Khớp với Route chi tiết bài viết ở Backend: api/ApiPosts/{id}
        return axiosClient.get(url);
    },

    // Hàm lấy danh sách bài viết theo danh mục
    getPostsByCategory: (categoryId) => {
        const url = `/ApiPosts/category/${categoryId}`; // Khớp với Route danh mục bài viết ở Backend: api/ApiPosts/category/{categoryId}
        return axiosClient.get(url);
    }
};

export default blogService;
