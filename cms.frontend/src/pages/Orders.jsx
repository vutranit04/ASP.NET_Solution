import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { getFullImageUrl } from '../api/axiosClient';

function Orders({ currentUser }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Bảo vệ trang: Yêu cầu đăng nhập
    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/orders' } });
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await orderService.getCustomerOrders(currentUser.id);
                setOrders(data || []);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser, navigate]);

    // Trạng thái đơn hàng: ánh xạ số -> chuỗi mô tả
    const getStatusText = (status) => {
        switch (status) {
            case 0: return { text: "Chờ xử lý", color: "#fd7e14", bg: "#fff3cd" };
            case 1: return { text: "Đang giao hàng", color: "#007bff", bg: "#cce5ff" };
            case 2: return { text: "Đã hoàn thành", color: "#28a745", bg: "#d4edda" };
            case 3: return { text: "Đã hủy", color: "#dc3545", bg: "#f8d7da" };
            default: return { text: "Chờ xử lý", color: "#fd7e14", bg: "#fff3cd" };
        }
    };

    if (!currentUser) return null;

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Đang tải lịch sử đơn hàng của bạn...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h2 style={styles.title}>ĐƠN HÀNG CỦA TÔI</h2>

                {orders.length === 0 ? (
                    <div style={styles.emptyCard}>
                        <div style={styles.emptyIcon}>📦</div>
                        <h3>Chưa có đơn hàng nào</h3>
                        <p>Bạn chưa thực hiện giao dịch nào. Hãy bắt đầu chọn sản phẩm để đặt mua nhé!</p>
                        <button onClick={() => navigate('/')} style={styles.backShopBtn}>
                            Quay lại cửa hàng
                        </button>
                    </div>
                ) : (
                    <div style={styles.ordersList}>
                        {orders.map((order) => {
                            const status = getStatusText(order.status);
                            const orderTotal = order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

                            return (
                                <div key={order.id} style={styles.orderCard}>
                                    {/* PHẦN ĐẦU ĐƠN HÀNG */}
                                    <div style={styles.orderHeader}>
                                        <div>
                                            <span style={styles.orderId}>Đơn hàng #{order.id}</span>
                                            <span style={styles.orderDate}>
                                                Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')} {new Date(order.orderDate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <span 
                                            style={{ 
                                                ...styles.statusBadge, 
                                                color: status.color, 
                                                background: status.bg 
                                            }}
                                        >
                                            {status.text}
                                        </span>
                                    </div>

                                    {/* CHI TIẾT SẢN PHẨM */}
                                    <div style={styles.itemsList}>
                                        {order.items.map((item) => (
                                            <div key={item.id} style={styles.itemRow}>
                                                <img 
                                                    src={getFullImageUrl(item.productImageUrl)} 
                                                    alt={item.productName} 
                                                    style={styles.productImage}
                                                />
                                                <div style={styles.productDetails}>
                                                    <span style={styles.productName}>{item.productName}</span>
                                                    <span style={styles.productQty}>Số lượng: x{item.quantity}</span>
                                                </div>
                                                <div style={styles.productSubtotal}>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* PHẦN CUỐI ĐƠN HÀNG */}
                                    <div style={styles.orderFooter}>
                                        {order.notes && (
                                            <div style={styles.notesBox}>
                                                <strong>Ghi chú giao hàng:</strong> {order.notes}
                                            </div>
                                        )}
                                        <div style={styles.totalRow}>
                                            <span>Thành tiền:</span>
                                            <span style={styles.totalValue}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;

const styles = {
    page: {
        background: "#f9f9f9",
        minHeight: "calc(100vh - 60px)",
        padding: "40px 20px"
    },
    container: {
        maxWidth: "800px",
        margin: "0 auto"
    },
    title: {
        fontSize: "24px",
        fontWeight: "800",
        marginBottom: "30px",
        color: "#111"
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "400px",
        color: "#666",
        gap: "15px"
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #eee",
        borderTop: "4px solid #ff2e2e",
        borderRadius: "50%"
    },
    emptyCard: {
        background: "#ffffff",
        border: "1px solid #eee",
        borderRadius: "16px",
        padding: "50px 30px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
    },
    emptyIcon: {
        fontSize: "60px",
        marginBottom: "15px"
    },
    backShopBtn: {
        background: "#ff2e2e",
        color: "#fff",
        border: "none",
        padding: "12px 30px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "20px"
    },
    ordersList: {
        display: "flex",
        flexDirection: "column",
        gap: "25px"
    },
    orderCard: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
        overflow: "hidden"
    },
    orderHeader: {
        padding: "15px 20px",
        background: "#fafbfc",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    orderId: {
        fontWeight: "bold",
        fontSize: "15px",
        color: "#111",
        marginRight: "15px"
    },
    orderDate: {
        fontSize: "12px",
        color: "#888"
    },
    statusBadge: {
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 12px",
        borderRadius: "20px"
    },
    itemsList: {
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column"
    },
    itemRow: {
        display: "flex",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #f6f6f6",
        gap: "15px"
    },
    productImage: {
        width: "50px",
        height: "50px",
        borderRadius: "6px",
        objectFit: "cover",
        background: "#fdf1f1"
    },
    productDetails: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "3px"
    },
    productName: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333"
    },
    productQty: {
        fontSize: "12px",
        color: "#777"
    },
    productSubtotal: {
        fontWeight: "bold",
        fontSize: "14px",
        color: "#111"
    },
    orderFooter: {
        padding: "15px 20px",
        borderTop: "1px solid #f6f6f6",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    notesBox: {
        background: "#f8f9fa",
        borderRadius: "6px",
        padding: "10px 15px",
        fontSize: "13px",
        color: "#555"
    },
    totalRow: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "15px",
        fontSize: "14px",
        fontWeight: "bold"
    },
    totalValue: {
        fontSize: "18px",
        fontWeight: "800",
        color: "#ff2e2e"
    }
};
