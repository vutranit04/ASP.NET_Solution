import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryItem = ({ item }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div 
            style={{
                ...styles.item,
                ...(hovered ? styles.itemHover : {})
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span>{item.name}</span>
            <span style={{
                ...styles.arrow,
                ...(hovered ? styles.arrowHover : {})
            }}>›</span>
        </div>
    );
};

const CategoryProductList = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Đang tải danh mục...</p>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <span style={styles.title}>🥋 DANH MỤC SẢN PHẨM</span>
            </div>

            <div>
                {categoryProducts.length === 0 ? (
                    <div style={styles.empty}>Không tìm thấy danh mục nào</div>
                ) : (
                    categoryProducts.map((item) => (
                        <CategoryItem key={item.id} item={item} />
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryProductList;

const styles = {
    wrapper: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: 16,
        padding: 18,
        color: "#111",
        boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
    },
    header: {
        borderBottom: "2px solid #ff2e2e",
        paddingBottom: 12,
        marginBottom: 12
    },
    title: {
        color: "#111",
        fontWeight: "800",
        fontSize: "14px",
        letterSpacing: 0.5
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 10px",
        borderBottom: "1px solid #f6f6f6",
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderRadius: "8px",
        fontWeight: "500",
        fontSize: "14px"
    },
    itemHover: {
        background: "#fdf1f1",
        color: "#ff2e2e",
        paddingLeft: "14px"
    },
    arrow: {
        color: "#aaa",
        fontSize: "18px",
        transition: "all 0.2s ease"
    },
    arrowHover: {
        color: "#ff2e2e",
        transform: "translateX(2px)"
    },
    empty: {
        color: "#777",
        padding: 10,
        textAlign: "center"
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        color: "#666",
        padding: "20px 0"
    },
    spinner: {
        width: "20px",
        height: "20px",
        border: "2px solid #eee",
        borderTop: "2px solid #ff2e2e",
        borderRadius: "50%"
    }
};