import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductCard = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);

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

            <div style={styles.productIcon}>🥋</div>

            <h4 style={styles.name}>{item.name}</h4>

            <div style={styles.metaRow}>
                <p style={styles.price}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(item.price)}
                </p>
                <p style={styles.stock}>
                    Còn: {item.stock} cái
                </p>
            </div>

            <button 
                style={{
                    ...styles.btn,
                    ...(btnHovered ? styles.btnHover : {})
                }}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
            >
                Mua Ngay
            </button>
        </div>
    );
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div style={styles.grid}>
            {products.length === 0 ? (
                <p style={{ color: "#888" }}>Không tìm thấy sản phẩm nào</p>
            ) : (
                products.map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))
            )}
        </div>
    );
};

export default ProductList;

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 20
    },
    card: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
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
        letterSpacing: "0.5px"
    },
    productIcon: {
        fontSize: "40px",
        margin: "15px 0 5px 0",
        textAlign: "center",
        background: "#fdf1f1",
        width: "70px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        alignSelf: "center"
    },
    name: {
        color: "#111",
        fontSize: "16px",
        fontWeight: "bold",
        margin: "10px 0",
        textAlign: "center",
        minHeight: "44px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
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
    btn: {
        width: "100%",
        padding: "12px",
        background: "#111",
        border: "1px solid #111",
        color: "white",
        cursor: "pointer",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "all 0.3s ease"
    },
    btnHover: {
        background: "#ff2e2e",
        borderColor: "#ff2e2e",
        boxShadow: "0 4px 12px rgba(255, 46, 46, 0.2)"
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
        color: "#666",
        gap: "10px"
    },
    spinner: {
        width: "30px",
        height: "30px",
        border: "3px solid #eee",
        borderTop: "3px solid #ff2e2e",
        borderRadius: "50%"
    }
};