import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from './ProductCard';

const BestSellingProducts = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSelling = async () => {
            try {
                setLoading(true);
                const data = await productService.getBestSellingProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm bán chạy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSelling();
    }, []);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Đang tải sản phẩm bán chạy...</p>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div style={styles.section}>
            <div style={styles.header}>
                <h2 style={styles.title}>🔥 SẢN PHẨM BÁN CHẠY</h2>
                <p style={styles.subtitle}>Những sản phẩm được khách hàng yêu thích và mua nhiều nhất</p>
            </div>
            <div style={styles.grid}>
                {products.map((item) => (
                    <ProductCard key={item.id} item={item} addToCart={addToCart} />
                ))}
            </div>
        </div>
    );
};

export default BestSellingProducts;

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
