import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from './ProductCard';

const LatestProducts = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                setLoading(true);
                const data = await productService.getLatestProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm mới nhất:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Đang tải sản phẩm mới nhất...</p>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div style={styles.section}>
            <div style={styles.header}>
                <h2 style={styles.title}>🆕 SẢN PHẨM MỚI NHẤT</h2>
                <p style={styles.subtitle}>Các sản phẩm vừa được cập nhật gần đây nhất</p>
            </div>
            <div style={styles.grid}>
                {products.map((item) => (
                    <ProductCard key={item.id} item={item} addToCart={addToCart} />
                ))}
            </div>
        </div>
    );
};

export default LatestProducts;

const styles = {
    section: {
        marginBottom: "40px"
    },
    header: {
        textAlign: "center",
        marginBottom: "25px"
    },
    title: {
        fontSize: "22px",
        fontWeight: "800",
        color: "#111",
        margin: "0 0 8px 0"
    },
    subtitle: {
        fontSize: "14px",
        color: "#666",
        margin: 0
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20
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
