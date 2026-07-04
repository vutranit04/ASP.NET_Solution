import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';
import { getFullImageUrl } from '../api/axiosClient';

const CategoryItem = ({ item, isSelected, onClick }) => {
    const [hovered, setHovered] = useState(false);

    // Hình ảnh nền: dùng imageUrl nếu có, không thì dùng gradient làm fallback
    const bgImage = item.imageUrl
        ? `url(${getFullImageUrl(item.imageUrl)})`
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    return (
        <div 
            style={styles.item}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
          
            <div 
                style={{
                    ...styles.imageWrapper,
                    backgroundImage: bgImage,
                    ...(isSelected ? styles.imageSelected : (hovered ? styles.imageHover : {}))
                }}
            >
                {!item.imageUrl && (
                    <span style={styles.fallbackIcon}>🥋</span>
                )}
            </div>
            
            {/* Chữ tên danh mục màu đen nằm bên dưới ảnh */}
            <span 
                style={{
                    ...styles.itemText,
                    ...(isSelected ? styles.itemTextSelected : (hovered ? styles.itemTextHover : {}))
                }}
            >
                {item.name}
            </span>
        </div>
    );
};

const CategoryProductList = ({ selectedCategoryId, onSelectCategory }) => {
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
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.grid}>
                {/* Mục "Tất cả sản phẩm" */}
                <CategoryItem 
                    item={{ id: null, name: "TẤT CẢ SẢN PHẨM", imageUrl: null }} 
                    isSelected={selectedCategoryId === null}
                    onClick={() => onSelectCategory(null)}
                />

                {categoryProducts.map((item) => (
                    <CategoryItem 
                        key={item.id} 
                        item={item} 
                        isSelected={selectedCategoryId === item.id}
                        onClick={() => onSelectCategory(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryProductList;

const styles = {
    wrapper: {
        width: "100%",
        marginBottom: "35px",
        marginTop: "15px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "20px"
    },
    item: {
        display: "flex",
        flexDirection: "column",
        cursor: "pointer"
    },
    imageWrapper: {
        height: "110px",
        borderRadius: "12px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        border: "2px solid #eef0f2"
    },
    imageHover: {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        borderColor: "#cbd5e1"
    },
    imageSelected: {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 20px rgba(255, 46, 46, 0.2)",
        borderColor: "#ff2e2e"
    },
    fallbackIcon: {
        fontSize: "32px",
        color: "#ffffff"
    },
    itemText: {
        marginTop: "10px",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#111111", // Chữ đen mặc định nằm dưới ảnh danh mục
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        textAlign: "center",
        transition: "color 0.2s ease"
    },
    itemTextHover: {
        color: "#ff2e2e"
    },
    itemTextSelected: {
        color: "#ff2e2e"
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        padding: "20px 0"
    },
    spinner: {
        width: "25px",
        height: "25px",
        border: "3px solid #eee",
        borderTop: "3px solid #ff2e2e",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    }
};