import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from './ProductCard';

const ProductList = ({ selectedCategoryId, searchKeyword, addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data = [];
                if (selectedCategoryId) {
                    // Lấy sản phẩm theo danh mục
                    data = await productService.getProductsByCategory(selectedCategoryId);
                } else {
                    // Lấy tất cả sản phẩm
                    data = await productService.getAllProducts();
                }
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]);

    // Hàm chuẩn hóa tiếng Việt: chuyển chữ hoa thành chữ thường và loại bỏ các dấu tiếng Việt
    const normalizeString = (str) => {
        if (!str) return '';
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    // Lọc sản phẩm phía Client-side (nhanh chóng, chính xác, không phân biệt dấu và chữ hoa/thường)
    const filteredProducts = products.filter((item) => {
        if (!searchKeyword) return true;
        const searchNormalized = normalizeString(searchKeyword);
        const nameNormalized = normalizeString(item.name);
        const descNormalized = normalizeString(item.description);
        return nameNormalized.includes(searchNormalized) || descNormalized.includes(searchNormalized);
    });

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
            {filteredProducts.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <div style={styles.emptyIcon}>🔍</div>
                    <h3 style={styles.emptyTitle}>Không tìm thấy sản phẩm</h3>
                    <p style={styles.emptyText}>
                        {searchKeyword 
                            ? `Chúng tôi không tìm thấy sản phẩm nào khớp với từ khóa "${searchKeyword}"` 
                            : "Không có sản phẩm nào thuộc danh mục này."}
                    </p>
                </div>
            ) : (
                filteredProducts.map((item) => (
                    <ProductCard key={item.id} item={item} addToCart={addToCart} />
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
    },
    emptyContainer: {
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "50px 20px",
        background: "#fff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
    },
    emptyIcon: {
        fontSize: "48px",
        color: "#ccc"
    },
    emptyTitle: {
        fontSize: "16px",
        fontWeight: "800",
        color: "#333",
        margin: 0
    },
    emptyText: {
        color: "#888",
        fontSize: "13px",
        margin: 0,
        maxWidth: "350px",
        lineHeight: "1.5"
    }
};