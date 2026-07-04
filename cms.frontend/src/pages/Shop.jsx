import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import CategoryProductList from '../components/CategoryProductList';

function Shop({ addToCart }) {
    const [searchParams] = useSearchParams();
    const searchFromUrl = searchParams.get('search') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState(searchFromUrl);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Cập nhật searchKeyword khi URL search param thay đổi
    useEffect(() => {
        setSearchKeyword(searchFromUrl);
    }, [searchFromUrl]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                if (selectedCategoryId) {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                    // Lọc giá phía client nếu dùng category filter
                    if (minPrice) data = data.filter(p => p.price >= Number(minPrice));
                    if (maxPrice) data = data.filter(p => p.price <= Number(maxPrice));
                } else {
                    data = await productService.getAllProducts(searchKeyword, minPrice, maxPrice);
                }
                setProducts(data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce: chờ 300ms trước khi gọi API
        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [selectedCategoryId, searchKeyword, minPrice, maxPrice]);

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>CỬA HÀNG</h2>
                    <p style={styles.subtitle}>Khám phá toàn bộ sản phẩm võ thuật của chúng tôi</p>
                </div>

                {/* DANH MỤC SẢN PHẨM */}
                <CategoryProductList 
                    selectedCategoryId={selectedCategoryId} 
                    onSelectCategory={(id) => {
                        setSelectedCategoryId(id);
                    }} 
                />

                {/* THANH LỌC & TÌM KIẾM */}
                <div style={styles.filterBar}>
                    {/* Ô tìm kiếm */}
                    <div style={styles.searchBox}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sản phẩm..." 
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {/* Bộ lọc giá Range */}
                    <div style={styles.priceFilter}>
                        <span style={styles.priceLabel}>Lọc giá:</span>
                        <input 
                            type="number" 
                            placeholder="Từ (VND)" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={styles.priceInput}
                        />
                        <span style={styles.priceSeparator}>—</span>
                        <input 
                            type="number" 
                            placeholder="Đến (VND)" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={styles.priceInput}
                        />
                    </div>
                </div>

                {/* KẾT QUẢ TÌM KIẾM */}
                <div style={styles.resultInfo}>
                    <span>Tìm thấy <strong>{products.length}</strong> sản phẩm</span>
                    {(searchKeyword || minPrice || maxPrice) && (
                        <button 
                            onClick={() => { setSearchKeyword(''); setMinPrice(''); setMaxPrice(''); setSelectedCategoryId(null); }}
                            style={styles.clearBtn}
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </div>

                {/* DANH SÁCH SẢN PHẨM */}
                {loading ? (
                    <div style={styles.loading}>
                        <div style={styles.spinner}></div>
                        <p>Đang tải sản phẩm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <div style={styles.emptyIcon}>🔍</div>
                        <h3 style={styles.emptyTitle}>Không tìm thấy sản phẩm</h3>
                        <p style={styles.emptyText}>
                            Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn. 
                            Hãy thử thay đổi từ khóa hoặc điều chỉnh khoảng giá.
                        </p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {products.map((item) => (
                            <ProductCard key={item.id} item={item} addToCart={addToCart} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Shop;

const styles = {
    page: {
        background: "#f9f9f9",
        minHeight: "calc(100vh - 60px)",
        padding: "40px 20px"
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto"
    },
    header: {
        textAlign: "center",
        marginBottom: "30px"
    },
    title: {
        fontSize: "28px",
        fontWeight: "800",
        margin: "0 0 8px 0",
        color: "#111"
    },
    subtitle: {
        fontSize: "14px",
        color: "#666",
        margin: 0
    },
    filterBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "15px 20px",
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: "12px",
        marginBottom: "20px",
        flexWrap: "wrap"
    },
    searchBox: {
        flex: 1,
        position: "relative",
        display: "flex",
        alignItems: "center",
        minWidth: "200px"
    },
    searchIcon: {
        position: "absolute",
        left: "12px",
        color: "#888",
        fontSize: "14px"
    },
    searchInput: {
        width: "100%",
        padding: "10px 12px 10px 35px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none"
    },
    priceFilter: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap"
    },
    priceLabel: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#333"
    },
    priceInput: {
        width: "120px",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none"
    },
    priceSeparator: {
        color: "#999",
        fontSize: "16px"
    },
    resultInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px",
        color: "#666",
        marginBottom: "20px",
        padding: "0 5px"
    },
    clearBtn: {
        background: "none",
        border: "1px solid #ff2e2e",
        color: "#ff2e2e",
        padding: "6px 16px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "bold",
        cursor: "pointer"
    },
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
        padding: "60px 0",
        color: "#666",
        gap: "10px"
    },
    spinner: {
        width: "35px",
        height: "35px",
        border: "4px solid #eee",
        borderTop: "4px solid #ff2e2e",
        borderRadius: "50%"
    },
    emptyContainer: {
        textAlign: "center",
        padding: "60px 20px",
        background: "#fff",
        border: "1px solid #eef0f2",
        borderRadius: "16px"
    },
    emptyIcon: {
        fontSize: "60px",
        marginBottom: "15px"
    },
    emptyTitle: {
        fontSize: "18px",
        fontWeight: "800",
        color: "#333",
        margin: "0 0 10px 0"
    },
    emptyText: {
        color: "#888",
        fontSize: "14px",
        margin: 0,
        maxWidth: "400px",
        marginLeft: "auto",
        marginRight: "auto",
        lineHeight: "1.6"
    }
};
