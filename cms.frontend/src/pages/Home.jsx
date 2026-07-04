import React, { useState } from 'react';
import CategoryProductList from '../components/CategoryProductList';
import ProductList from '../components/ProductList';
import LatestBlog from '../components/LatestBlog';
import HeroBanner from '../components/HeroBanner';
import LatestProducts from '../components/LatestProducts';
import BestSellingProducts from '../components/BestSellingProducts';

function Home({ addToCart }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    return (
        <div style={styles.page}>
            {/* HERO BANNER SECTION */}
            <HeroBanner onSelectCategory={setSelectedCategoryId} />

            {/* FEATURES BAR */}
            <div style={styles.featuresRow}>
                <div style={styles.featureItem}>
                    <div style={styles.featureIcon}>🥋</div>
                    <div>
                        <h4 style={styles.featureTitle}>ĐẠT CHUẨN QUỐC TẾ</h4>
                        <p style={styles.featureDesc}>Võ phục chuẩn WKF thi đấu</p>
                    </div>
                </div>
                <div style={styles.featureItem}>
                    <div style={styles.featureIcon}>🛡️</div>
                    <div>
                        <h4 style={styles.featureTitle}>BẢO VỆ TỐI ĐA</h4>
                        <p style={styles.featureDesc}>Thiết bị bảo hộ chuẩn quốc tế</p>
                    </div>
                </div>
                <div style={styles.featureItem}>
                    <div style={styles.featureIcon}>⚡</div>
                    <div>
                        <h4 style={styles.featureTitle}>GIAO HÀNG TỐC HÀNH</h4>
                        <p style={styles.featureDesc}>Hỗ trợ đổi trả trong 7 ngày</p>
                    </div>
                </div>
            </div>

            {/* SẢN PHẨM MỚI NHẤT (YC #36) */}
            <div style={styles.storeSection}>
                <LatestProducts addToCart={addToCart} />
            </div>

            {/* SẢN PHẨM BÁN CHẠY (YC #37) */}
            <div style={styles.storeSection}>
                <BestSellingProducts addToCart={addToCart} />
            </div>

            {/* STORE SECTION */}
            <div id="products-section" style={styles.storeSection}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>SẢN PHẨM NỔI BẬT</h3>
                    <p style={styles.sectionSubtitle}>Các trang thiết bị võ thuật được tuyển chọn chất lượng hàng đầu</p>
                </div>

                {/* HORIZONTAL CATEGORY BAR */}
                <CategoryProductList 
                    selectedCategoryId={selectedCategoryId} 
                    onSelectCategory={(id) => {
                        setSelectedCategoryId(id);
                        setSearchKeyword(''); // Reset ô tìm kiếm khi chọn danh mục
                    }} 
                />

                {/* FILTER & SEARCH BAR */}
                <div style={styles.filterRow}>
                    <div style={styles.sort}>
                        Sắp xếp: <span style={{ borderBottom: "2px solid #ff2e2e", fontWeight: "bold", paddingBottom: "2px", cursor: "pointer" }}>
                            Mới nhất
                        </span>
                    </div>

                    {/* Ô TÌM KIẾM */}
                    <div style={styles.searchContainer}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Tìm tên hoặc mô tả sản phẩm..." 
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.perPage}>
                        Hiển thị: <input style={styles.input} value="15" readOnly /> sản phẩm / trang
                    </div>
                </div>

                {/* MAIN CONTENT - FULL WIDTH */}
                <div style={styles.productsFullWidth}>
                    <ProductList 
                        selectedCategoryId={selectedCategoryId} 
                        searchKeyword={searchKeyword}
                        addToCart={addToCart}
                    />
                </div>
            </div>

            {/* BLOG SECTION */}
            <div style={styles.blog}>
                <LatestBlog />
            </div>
        </div>
    );
}

export default Home;

const styles = {
    page: {
        background: "#f9f9f9",
        color: "#111",
        fontFamily: "Arial, sans-serif"
    },
    hero: {
        position: "relative",
        height: "450px",
        background: "url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&auto=format&fit=crop') no-repeat center center",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        padding: "0 50px",
        color: "#fff",
        overflow: "hidden"
    },
    heroOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)",
        zIndex: 1
    },
    heroContent: {
        position: "relative",
        zIndex: 2,
        maxWidth: "600px"
    },
    heroBadge: {
        background: "#ff2e2e",
        color: "#fff",
        padding: "5px 12px",
        fontSize: "11px",
        fontWeight: "bold",
        borderRadius: "4px",
        letterSpacing: "1px",
        display: "inline-block",
        marginBottom: "15px"
    },
    heroTitle: {
        fontSize: "44px",
        fontWeight: "900",
        margin: "0 0 15px 0",
        letterSpacing: "1px",
        lineHeight: "1.2",
        textShadow: "0 2px 10px rgba(0,0,0,0.5)"
    },
    heroText: {
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#ddd",
        margin: "0 0 30px 0"
    },
    heroBtn: {
        display: "inline-block",
        background: "#ff2e2e",
        color: "#fff",
        padding: "14px 35px",
        borderRadius: "30px",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "15px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 15px rgba(255, 46, 46, 0.4)",
        border: "none",
        cursor: "pointer"
    },
    featuresRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        padding: "25px 30px",
        background: "#ffffff",
        borderBottom: "1px solid #eee",
        maxWidth: "1100px",
        margin: "0 auto",
        marginTop: "-40px",
        position: "relative",
        zIndex: 3,
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
    },
    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "5px"
    },
    featureIcon: {
        fontSize: "26px",
        background: "#fdf1f1",
        width: "55px",
        height: "55px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        color: "#ff2e2e"
    },
    featureTitle: {
        margin: "0 0 4px 0",
        fontSize: "13px",
        fontWeight: "800",
        color: "#111",
        letterSpacing: "0.5px"
    },
    featureDesc: {
        margin: 0,
        fontSize: "12px",
        color: "#666"
    },
    storeSection: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "70px 20px 20px 20px"
    },
    sectionHeader: {
        textAlign: "center",
        marginBottom: "35px"
    },
    sectionTitle: {
        fontSize: "28px",
        fontWeight: "800",
        margin: "0 0 8px 0",
        color: "#111",
        letterSpacing: "0.5px"
    },
    sectionSubtitle: {
        fontSize: "14px",
        color: "#666",
        margin: 0
    },
    filterRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: "12px",
        marginBottom: "30px",
        fontSize: "14px"
    },
    sort: {
        color: "#333",
        flex: 1
    },
    searchContainer: {
        flex: 2,
        position: "relative",
        margin: "0 20px",
        display: "flex",
        alignItems: "center"
    },
    searchIcon: {
        position: "absolute",
        left: "12px",
        color: "#888",
        fontSize: "14px"
    },
    searchInput: {
        width: "100%",
        padding: "8px 12px 8px 35px",
        borderRadius: "20px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none",
        transition: "border-color 0.2s ease"
    },
    perPage: {
        color: "#333",
        flex: 1,
        textAlign: "right"
    },
    input: {
        width: "40px",
        textAlign: "center",
        border: "1px solid #ccc",
        margin: "0 5px",
        borderRadius: "4px",
        padding: "2px"
    },
    productsFullWidth: {
        width: "100%"
    },
    blog: {
        padding: "40px 20px 60px 20px",
        background: "#f9f9f9"
    }
};
