import axiosClient from '../api/axiosClient';

const orderService = {
    // Gửi yêu cầu đặt hàng (Checkout) lên backend
    createOrder: (orderData) => {
        const url = '/ApiOrders'; // Khớp chính xác với ApiOrdersController phía Backend
        return axiosClient.post(url, orderData);
    },

    // Lấy lịch sử đơn hàng của khách hàng
    getCustomerOrders: (customerId) => {
        const url = `/ApiOrders/customer/${customerId}`;
        return axiosClient.get(url);
    }
};

export default orderService;
