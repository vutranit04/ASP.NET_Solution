import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '../api/axiosClient';

const ProductCard = ({ item, addToCart }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [buyHovered, setBuyHovered] = useState(false);

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item, 1);
        navigate('/cart');
    };

    return (
        <div 
            style={{
                ...styles.card,
                ...(hovered ? styles.cardHover : {})
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={styles.badge}>WKF APPROVED</div>

            <div style={styles.imageContainer}>
                {item.imageUrl ? (
                    <img 
                        src={getFullImageUrl(item.imageUrl)} 
                        alt={item.name} 
                        style={{
                            ...styles.image,
                            ...(hovered ? styles.imageHover : {})
                        }} 
                    />
                ) : (
                    <div style={styles.productIcon}>🥋</div>
                )}
            </div>

            <h4 style={styles.name}>{item.name}</h4>
            <div style={styles.stockLabel}>
                {(item.stockQuantity ?? item.StockQuantity ?? 0) > 0 ? (
                    <span>Còn lại: <strong style={{ color: '#28a745' }}>{item.stockQuantity ?? item.StockQuantity ?? 0}</strong></span>
                ) : (
                    <span style={{ color: '#ff2e2e', fontWeight: 'bold' }}>Hết hàng</span>
                )}
            </div>

            <div style={styles.metaRow}>
                <p style={styles.price}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(item.price)}
                </p>
            </div>

            <div style={styles.btnGroup}>
                <Link 
                    to={`/product/${item.id}`}
                    style={styles.detailBtn}
                >
                    Chi Tiết
                </Link>
                <button 
                    onClick={handleBuyNow}
                    style={{
                        ...styles.buyBtn,
                        ...(buyHovered ? styles.buyBtnHover : {})
                    }}
                    onMouseEnter={() => setBuyHovered(true)}
                    onMouseLeave={() => setBuyHovered(false)}
                >
                    Mua Ngay
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

const styles = {
    card: {
        background: "#ffffff",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#eef0f2",
        borderRadius: 16,
        padding: 20,
        position: "relative",
        color: "#111",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
    },
    cardHover: {
        transform: "translateY(-5px)",
        borderColor: "#ff2e2e",
        boxShadow: "0 10px 25px rgba(255, 46, 46, 0.08)"
    },
    badge: {
        position: "absolute",
        top: 15,
        right: 15,
        background: "#ff2e2e",
        color: "#fff",
        padding: "4px 10px",
        fontSize: 10,
        fontWeight: "bold",
        borderRadius: 20,
        letterSpacing: "0.5px",
        zIndex: 5
    },
    imageContainer: {
        width: "100%",
        height: "180px",
        overflow: "hidden",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fdf1f1",
        marginBottom: "15px",
        position: "relative"
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.5s ease"
    },
    imageHover: {
        transform: "scale(1.08)"
    },
    productIcon: {
        fontSize: "40px",
        background: "#fdf1f1",
        width: "70px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
    },
    name: {
        color: "#111",
        fontSize: "15px",
        fontWeight: "bold",
        margin: "10px 0",
        textAlign: "center",
        minHeight: "44px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textDecoration: "none"
    },
    stockLabel: {
        fontSize: "12px",
        color: "#666",
        marginTop: "-5px",
        marginBottom: "10px",
        textAlign: "center"
    },
    metaRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "10px",
        marginBottom: "15px",
        borderTop: "1px dashed #eee",
        paddingTop: "12px"
    },
    price: {
        color: "#ff2e2e",
        fontWeight: "800",
        fontSize: "15px",
        margin: 0
    },
    stock: {
        color: "#666",
        fontSize: 11,
        margin: 0
    },
    btnGroup: {
        display: "flex",
        gap: "10px",
        width: "100%"
    },
    detailBtn: {
        flex: 1,
        textAlign: "center",
        padding: "10px 0",
        background: "#f5f5f5",
        border: "1px solid #ddd",
        color: "#333",
        cursor: "pointer",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
        textDecoration: "none",
        transition: "all 0.3s ease",
        boxSizing: "border-box"
    },
    buyBtn: {
        flex: 1.2,
        textAlign: "center",
        padding: "10px 0",
        background: "#111",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#111",
        color: "white",
        cursor: "pointer",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "13px",
        transition: "all 0.3s ease",
        boxSizing: "border-box"
    },
    buyBtnHover: {
        background: "#ff2e2e",
        borderColor: "#ff2e2e",
        boxShadow: "0 4px 12px rgba(255, 46, 46, 0.2)"
    }
};
