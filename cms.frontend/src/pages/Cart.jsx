import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { getFullImageUrl } from '../api/axiosClient';

function Cart({ cart, currentUser, updateCartQuantity, removeFromCart, clearCart }) {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [successOrder, setSuccessOrder] = useState(null);

    // Form Checkout State
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    // BẢO VỆ ĐĂNG NHẬP: Yêu cầu đăng nhập trước khi mua hàng
    useEffect(() => {
        if (!currentUser) {
            // Chuyển sang trang đăng nhập, kèm theo trạng thái quay lại giỏ hàng sau khi xong
            navigate('/login', { state: { from: '/cart' } });
        }
    }, [currentUser, navigate]);

    // Tự động điền thông tin nếu khách hàng đã đăng nhập
    useEffect(() => {
        if (currentUser) {
            setForm({
                fullName: currentUser.fullName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                notes: ''
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const tempErrors = {};
        if (!form.fullName.trim()) tempErrors.fullName = "Vui lòng nhập họ và tên nhận hàng";
        if (!form.phone.trim()) tempErrors.phone = "Vui lòng nhập số điện thoại nhận hàng";
        if (!form.address.trim()) tempErrors.address = "Vui lòng nhập địa chỉ giao hàng";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const orderData = {
                customerId: currentUser.id, // Gửi CustomerId của tài khoản đã đăng nhập
                notes: form.notes,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await orderService.createOrder(orderData);
            setSuccessOrder({
                orderId: response.orderId,
                customerName: form.fullName,
                totalAmount: totalAmount
            });
            clearCart(); // Xóa sạch giỏ hàng khi đặt hàng thành công
        } catch (error) {
            console.error("Lỗi khi thanh toán đơn hàng:", error);
            const serverMessage = error.response?.data?.message;
            alert(serverMessage || "Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng kiểm tra lại kết nối hoặc thông tin!");
        } finally {
            setSubmitting(false);
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Nếu chưa đăng nhập, hiển thị trống để useEffect xử lý chuyển hướng
    if (!currentUser) {
        return null;
    }

    // MÀN HÌNH ĐẶT HÀNG THÀNH CÔNG
    if (successOrder) {
        return (
            <div style={styles.successPage}>
                <div style={styles.successCard}>
                    <div style={styles.successIcon}>🎉</div>
                    <h2 style={styles.successTitle}>ĐẶT HÀNG THÀNH CÔNG!</h2>
                    <p style={styles.successText}>
                        Cảm ơn <strong>{successOrder.customerName}</strong> đã tin tưởng mua sắm tại cửa hàng.
                    </p>
                    
                    <div style={styles.receiptBox}>
                        <p><strong>Mã đơn hàng:</strong> #{successOrder.orderId}</p>
                        <p><strong>Tổng tiền:</strong> <span style={{color: "#ff2e2e", fontWeight: "bold"}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(successOrder.totalAmount)}</span></p>
                        <p><strong>Trạng thái đơn:</strong> Chờ xử lý</p>
                    </div>

                    <p style={styles.deliveryNote}>
                        Đơn đặt hàng đã được đồng bộ với tài khoản của bạn. Chúng tôi sẽ liên hệ sớm nhất để giao hàng.
                    </p>

                    <button onClick={() => navigate('/')} style={styles.continueBtn}>
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    // GIỎ HÀNG TRỐNG
    if (cart.length === 0) {
        return (
            <div style={styles.emptyPage}>
                <div style={styles.emptyCard}>
                    <div style={styles.emptyIcon}>🛒</div>
                    <h3>Giỏ hàng đang trống</h3>
                    <p>Hãy dạo quanh cửa hàng và chọn những bộ võ phục, thiết bị bảo hộ tốt nhất nhé!</p>
                    <button onClick={() => navigate('/')} style={styles.backShopBtn}>
                        Quay lại cửa hàng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h2 style={styles.title}>GIỎ HÀNG CỦA BẠN</h2>

                <div style={styles.grid}>
                    {/* DANH SÁCH SẢN PHẨM TRONG GIỎ HÀNG */}
                    <div style={styles.cartSection}>
                        {cart.map((item) => (
                            <div key={item.id} style={styles.cartItem}>
                                <img 
                                    src={getFullImageUrl(item.imageUrl)} 
                                    alt={item.name} 
                                    style={styles.itemImage}
                                />
                                <div style={styles.itemDetails}>
                                    <h4 style={styles.itemName}>{item.name}</h4>
                                    <p style={styles.itemPrice}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </p>
                                </div>

                                {/* BỘ CHỌN SỐ LƯỢNG TRONG GIỎ HÀNG */}
                                <div style={styles.quantitySelector}>
                                    <button 
                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)} 
                                        style={styles.qtyBtn}
                                    >-</button>
                                    <span style={styles.qtyValue}>{item.quantity}</span>
                                    <button 
                                        onClick={() => {
                                            const stock = item.stockQuantity ?? item.StockQuantity ?? 0;
                                            if (item.quantity >= stock) {
                                                alert(`Không thể tăng số lượng! Chỉ còn ${stock} sản phẩm trong kho.`);
                                                return;
                                            }
                                            updateCartQuantity(item.id, item.quantity + 1);
                                        }} 
                                        style={styles.qtyBtn}
                                    >+</button>
                                </div>

                                <div style={styles.itemTotal}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                </div>

                                <button 
                                    onClick={() => removeFromCart(item.id)} 
                                    style={styles.removeBtn}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* FORM THANH TOÁN & HÓA ĐƠN TỔNG */}
                    <div style={styles.checkoutSection}>
                        <div style={styles.summaryCard}>
                            <h3 style={styles.summaryTitle}>HÓA ĐƠN CHI TIẾT</h3>
                            <div style={styles.summaryRow}>
                                <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món):</span>
                                <span style={styles.summaryValue}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                </span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Phí giao hàng:</span>
                                <span style={{color: "#28a745", fontWeight: "bold"}}>Miễn phí</span>
                            </div>
                            <div style={styles.divider}></div>
                            <div style={styles.totalRow}>
                                <span>Tổng cộng:</span>
                                <span style={styles.totalValue}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* FORM ĐIỀN THÔNG TIN */}
                        <form onSubmit={handleCheckout} style={styles.formCard}>
                            <h3 style={styles.formTitle}>THÔNG TIN GIAO HÀNG</h3>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Họ và tên người nhận *</label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Nguyễn Văn A"
                                />
                                {errors.fullName && <small style={styles.errorText}>{errors.fullName}</small>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Số điện thoại *</label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="09xx xxx xxx"
                                />
                                {errors.phone && <small style={styles.errorText}>{errors.phone}</small>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Địa chỉ giao hàng *</label>
                                <input 
                                    type="text" 
                                    name="address"
                                    value={form.address}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Số 12, Đường ABC, Quận XYZ..."
                                />
                                {errors.address && <small style={styles.errorText}>{errors.address}</small>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Ghi chú đơn hàng (nếu có)</label>
                                <textarea 
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleInputChange}
                                    style={styles.textarea}
                                    placeholder="Ví dụ: Giao hàng vào giờ hành chính, size quần áo..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting} 
                                style={styles.checkoutBtn}
                            >
                                {submitting ? "Đang xử lý..." : "🎯 XÁC NHẬN ĐẶT HÀNG"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;

const styles = {
    page: {
        background: "#f9f9f9",
        minHeight: "calc(100vh - 60px)",
        padding: "40px 20px"
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto"
    },
    title: {
        fontSize: "24px",
        fontWeight: "800",
        marginBottom: "30px",
        color: "#111"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px",
        alignItems: "start"
    },
    cartSection: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    cartItem: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        paddingBottom: "20px",
        borderBottom: "1px solid #eee",
        position: "relative"
    },
    itemImage: {
        width: "70px",
        height: "70px",
        borderRadius: "8px",
        objectFit: "cover",
        background: "#fdf1f1"
    },
    itemDetails: {
        flex: 1
    },
    itemName: {
        fontSize: "14px",
        fontWeight: "bold",
        margin: "0 0 5px 0",
        color: "#111",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
    },
    itemPrice: {
        color: "#ff2e2e",
        fontSize: "13px",
        fontWeight: "bold",
        margin: 0
    },
    quantitySelector: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ddd",
        borderRadius: "6px",
        background: "#fff"
    },
    qtyBtn: {
        background: "none",
        border: "none",
        width: "28px",
        height: "28px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer"
    },
    qtyValue: {
        padding: "0 10px",
        fontSize: "13px",
        fontWeight: "bold",
        minWidth: "15px",
        textAlign: "center"
    },
    itemTotal: {
        width: "100px",
        textAlign: "right",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#111"
    },
    removeBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px",
        fontSize: "16px",
        marginLeft: "10px"
    },
    checkoutSection: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    summaryCard: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        padding: "25px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
    },
    summaryTitle: {
        fontSize: "16px",
        fontWeight: "800",
        marginBottom: "20px",
        borderBottom: "2px solid #ff2e2e",
        paddingBottom: "10px"
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        color: "#555",
        marginBottom: "12px"
    },
    summaryValue: {
        fontWeight: "bold",
        color: "#111"
    },
    divider: {
        height: "1px",
        background: "#eee",
        margin: "15px 0"
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    totalValue: {
        fontSize: "20px",
        fontWeight: "800",
        color: "#ff2e2e"
    },
    formCard: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        padding: "25px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
    },
    formTitle: {
        fontSize: "16px",
        fontWeight: "800",
        marginBottom: "20px",
        borderBottom: "2px solid #111",
        paddingBottom: "10px"
    },
    formGroup: {
        marginBottom: "15px"
    },
    label: {
        display: "block",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "6px"
    },
    input: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none",
        boxSizing: "border-box"
    },
    textarea: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none",
        minHeight: "80px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        resize: "vertical"
    },
    errorText: {
        color: "#ff2e2e",
        fontSize: "11px",
        marginTop: "4px",
        display: "block"
    },
    checkoutBtn: {
        width: "100%",
        background: "#ff2e2e",
        color: "#fff",
        border: "none",
        padding: "15px 0",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop: "10px"
    },
    emptyPage: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)"
    },
    emptyCard: {
        background: "#ffffff",
        border: "1px solid #eee",
        borderRadius: "16px",
        padding: "40px 30px",
        textAlign: "center",
        maxWidth: "500px",
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
        marginTop: "15px"
    },
    successPage: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)"
    },
    successCard: {
        background: "#ffffff",
        border: "1px solid #eee",
        borderRadius: "16px",
        padding: "40px 30px",
        textAlign: "center",
        maxWidth: "500px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
    },
    successIcon: {
        fontSize: "60px",
        marginBottom: "15px"
    },
    successTitle: {
        color: "#28a745",
        fontWeight: "800",
        fontSize: "22px",
        marginBottom: "15px"
    },
    successText: {
        color: "#555",
        fontSize: "14px",
        lineHeight: "1.6"
    },
    receiptBox: {
        background: "#fdf1f1",
        borderRadius: "8px",
        padding: "15px",
        textAlign: "left",
        margin: "20px 0"
    },
    deliveryNote: {
        fontSize: "12px",
        color: "#888",
        lineHeight: "1.5",
        marginBottom: "20px"
    },
    continueBtn: {
        background: "#111",
        color: "#fff",
        border: "none",
        padding: "12px 30px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer"
    }
};
