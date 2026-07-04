import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { getFullImageUrl } from '../../api/axiosClient';

function ProductDetail({ addToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [buyHovered, setBuyHovered] = useState(false);
    const [addHovered, setAddHovered] = useState(false);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    const handleIncrement = () => {
        const stock = product.stockQuantity ?? product.StockQuantity ?? 0;
        if (quantity >= stock) {
            alert(`Không thể mua quá số lượng tồn kho hiện tại (${stock} sản phẩm).`);
            return;
        }
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleAddToCart = () => {
        const stock = product.stockQuantity ?? product.StockQuantity ?? 0;
        if (stock <= 0) {
            alert("Sản phẩm đã hết hàng!");
            return;
        }
        if (quantity > stock) {
            alert(`Số lượng yêu cầu vượt quá tồn kho hiện tại (${stock} sản phẩm).`);
            return;
        }
        addToCart(product, quantity);
        alert(`Đã thêm thành công ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        const stock = product.stockQuantity ?? product.StockQuantity ?? 0;
        if (stock <= 0) {
            alert("Sản phẩm đã hết hàng!");
            return;
        }
        if (quantity > stock) {
            alert(`Số lượng yêu cầu vượt quá tồn kho hiện tại (${stock} sản phẩm).`);
            return;
        }
        addToCart(product, quantity);
        navigate('/cart');
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Đang tải chi tiết sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={styles.errorContainer}>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Sản phẩm này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                <button onClick={() => navigate('/')} style={styles.backBtn}>
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    const stock = product.stockQuantity ?? product.StockQuantity ?? 0;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button onClick={() => navigate(-1)} style={styles.backLink}>
                    ← Quay lại cửa hàng
                </button>

                <div style={styles.detailsCard}>
                    {/* HÌNH ẢNH SẢN PHẨM */}
                    <div style={styles.imageSection}>
                        {product.imageUrl ? (
                            <img 
                                src={getFullImageUrl(product.imageUrl)} 
                                alt={product.name} 
                                style={styles.image} 
                            />
                        ) : (
                            <div style={styles.noImage}>
                                <span style={styles.noImageIcon}>🥋</span>
                                <p>Không có hình ảnh</p>
                            </div>
                        )}
                    </div>

                    {/* THÔNG TIN CHI TIẾT */}
                    <div style={styles.infoSection}>
                        <span style={styles.badge}>WKF APPROVED</span>
                        <h2 style={styles.productName}>{product.name}</h2>
                        
                        <div style={styles.priceRow}>
                            <span style={styles.priceLabel}>Giá bán:</span>
                            <span style={styles.priceValue}>
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(product.price)}
                            </span>
                        </div>

                        <div style={styles.metaInfo}>
                            <p><strong>Loại sản phẩm:</strong> Thiết bị bảo hộ & Võ phục Karatedo</p>
                            <p>
                                <strong>Tình trạng:</strong>{' '}
                                {stock > 0 ? (
                                    <span style={{color: "#28a745", fontWeight: "bold"}}>Còn hàng ({stock} sản phẩm)</span>
                                ) : (
                                    <span style={{color: "#ff2e2e", fontWeight: "bold"}}>Hết hàng</span>
                                )}
                            </p>
                            <p><strong>Tiêu chuẩn:</strong> Đạt tiêu chuẩn thi đấu Liên đoàn Karatedo Thế giới (WKF)</p>
                        </div>

                        {/* BỘ CHỌN SỐ LƯỢNG */}
                        {stock > 0 && (
                            <div style={styles.quantityRow}>
                                <span style={styles.quantityLabel}>Số lượng:</span>
                                <div style={styles.quantitySelector}>
                                    <button onClick={handleDecrement} style={styles.qtyBtn}>-</button>
                                    <span style={styles.qtyValue}>{quantity}</span>
                                    <button onClick={handleIncrement} style={styles.qtyBtn}>+</button>
                                </div>
                            </div>
                        )}

                        <div style={styles.divider}></div>

                        <div style={styles.descriptionSection}>
                            <h4 style={styles.subTitle}>Mô tả sản phẩm</h4>
                            <p style={styles.descriptionText}>
                                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này. Võ phục và trang thiết bị Karatedo của chúng tôi luôn đảm bảo chất lượng may mặc tốt nhất, tạo sự thoải mái tối đa cho võ sĩ trong lúc tập luyện và thi đấu đối kháng."}
                            </p>
                        </div>

                        {/* NÚT THAO TÁC */}
                        <div style={styles.actionBtnGroup}>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={stock <= 0}
                                style={{
                                    ...styles.addToCartBtn,
                                    ...(addHovered ? styles.addToCartBtnHover : {}),
                                    ...(stock <= 0 ? { opacity: 0.5, cursor: "not-allowed" } : {})
                                }}
                                onMouseEnter={() => setAddHovered(true)}
                                onMouseLeave={() => setAddHovered(false)}
                            >
                                Thêm Vào Giỏ Hàng
                            </button>
                            <button 
                                onClick={handleBuyNow} 
                                disabled={stock <= 0}
                                style={{
                                    ...styles.buyNowBtn,
                                    ...(buyHovered ? styles.buyNowBtnHover : {}),
                                    ...(stock <= 0 ? { opacity: 0.5, cursor: "not-allowed" } : {})
                                }}
                                onMouseEnter={() => setBuyHovered(true)}
                                onMouseLeave={() => setBuyHovered(false)}
                            >
                                Mua Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;

const styles = {
    page: {
        background: "#f9f9f9",
        minHeight: "calc(100vh - 60px)",
        padding: "40px 20px"
    },
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    backLink: {
        alignSelf: "flex-start",
        background: "none",
        border: "none",
        color: "#666",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        padding: 0,
        transition: "color 0.2s ease"
    },
    detailsCard: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        overflow: "hidden"
    },
    imageSection: {
        background: "#fdf1f1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        borderRight: "1px solid #eef0f2",
        minHeight: "350px"
    },
    image: {
        width: "100%",
        maxWidth: "350px",
        height: "auto",
        maxHeight: "400px",
        borderRadius: "12px",
        objectFit: "contain",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
    },
    noImage: {
        textAlign: "center",
        color: "#999"
    },
    noImageIcon: {
        fontSize: "70px",
        display: "block",
        marginBottom: "10px"
    },
    infoSection: {
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    badge: {
        alignSelf: "flex-start",
        background: "#ff2e2e",
        color: "#fff",
        padding: "4px 10px",
        fontSize: "10px",
        fontWeight: "bold",
        borderRadius: "20px",
        letterSpacing: "0.5px",
        marginBottom: "15px"
    },
    productName: {
        fontSize: "26px",
        fontWeight: "800",
        margin: "0 0 15px 0",
        color: "#111"
    },
    priceRow: {
        background: "#fdf1f1",
        borderRadius: "8px",
        padding: "15px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
    },
    priceLabel: {
        color: "#666",
        fontSize: "14px"
    },
    priceValue: {
        color: "#ff2e2e",
        fontSize: "22px",
        fontWeight: "800"
    },
    metaInfo: {
        fontSize: "14px",
        color: "#444",
        lineHeight: "1.8",
        margin: "0 0 15px 0"
    },
    quantityRow: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        margin: "15px 0"
    },
    quantityLabel: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333"
    },
    quantitySelector: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fff"
    },
    qtyBtn: {
        background: "none",
        border: "none",
        width: "35px",
        height: "35px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        color: "#333",
        transition: "background 0.2s ease"
    },
    qtyValue: {
        padding: "0 15px",
        fontSize: "15px",
        fontWeight: "bold",
        color: "#111",
        minWidth: "20px",
        textAlign: "center"
    },
    divider: {
        height: "1px",
        background: "#eee",
        margin: "20px 0"
    },
    subTitle: {
        fontSize: "15px",
        fontWeight: "bold",
        margin: "0 0 10px 0",
        color: "#111"
    },
    descriptionSection: {
        marginBottom: "25px"
    },
    descriptionText: {
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#666",
        margin: 0
    },
    actionBtnGroup: {
        display: "flex",
        gap: "15px",
        width: "100%"
    },
    addToCartBtn: {
        flex: 1,
        background: "#fff",
        color: "#111",
        border: "1px solid #111",
        padding: "15px 0",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease"
    },
    addToCartBtnHover: {
        background: "#f5f5f5"
    },
    buyNowBtn: {
        flex: 1.2,
        background: "#111",
        color: "#fff",
        border: "1px solid #111",
        padding: "15px 0",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease"
    },
    buyNowBtnHover: {
        background: "#ff2e2e",
        borderColor: "#ff2e2e",
        boxShadow: "0 4px 12px rgba(255, 46, 46, 0.2)"
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
    errorContainer: {
        maxWidth: "600px",
        margin: "80px auto",
        textAlign: "center",
        padding: "40px",
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
    },
    backBtn: {
        background: "#ff2e2e",
        color: "#fff",
        border: "none",
        padding: "10px 25px",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "15px"
    }
};
