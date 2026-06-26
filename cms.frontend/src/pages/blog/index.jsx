import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import BlogCard from '../../components/BlogCard';

const BlogIndex = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await blogService.getBlogCategories();
                setCategories(cats || []);
            } catch (err) {
                console.error("Lỗi khi tải danh mục bài viết:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                let data = [];
                if (selectedCategoryId) {
                    data = await blogService.getPostsByCategory(selectedCategoryId);
                } else {
                    data = await blogService.getAllPosts();
                }
                
                // Sắp xếp bài viết mới nhất lên đầu
                const sorted = (data || []).sort((a, b) => {
                    return new Date(b.createdDate || b.id) - new Date(a.createdDate || a.id);
                });
                setPosts(sorted);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải danh sách bài viết:", err);
                setError("Không thể tải danh sách bài viết lúc này. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [selectedCategoryId]);

    return (
        <div style={styles.page}>
            {/* HEADER BANNER */}
            <div style={styles.banner}>
                <div style={styles.bannerOverlay}></div>
                <div style={styles.bannerContent}>
                    <span style={styles.bannerSubtitle}>CHUYÊN MỤC TIN TỨC</span>
                    <h1 style={styles.bannerTitle}>TIN TỨC & MẸO PHỐI ĐỒ VÕ THUẬT</h1>
                    <p style={styles.bannerDesc}>
                        Nơi chia sẻ kiến thức tập luyện, hướng dẫn lựa chọn võ phục và các xu hướng thời trang thể thao mới nhất.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={styles.container}>
                {/* BREADCRUMB */}
                <div style={styles.breadcrumb}>
                    <Link to="/" style={styles.breadcrumbLink}>Trang Chủ</Link>
                    <span style={styles.breadcrumbSeparator}>&gt;</span>
                    <span style={styles.breadcrumbCurrent}>Blog Tin Tức</span>
                </div>

                {/* CATEGORY SELECTOR */}
                <div style={styles.categoryBar}>
                    <button 
                        style={{
                            ...styles.categoryTab,
                            ...(!selectedCategoryId ? styles.categoryTabActive : {})
                        }}
                        onClick={() => setSelectedCategoryId(null)}
                    >
                        Tất Cả Bài Viết
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            style={{
                                ...styles.categoryTab,
                                ...(selectedCategoryId === cat.id ? styles.categoryTabActive : {})
                            }}
                            onClick={() => setSelectedCategoryId(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* POSTS GRID */}
                {loading ? (
                    <div style={styles.loading}>
                        <div style={styles.spinner}></div>
                        <p>Đang tải danh sách bài viết...</p>
                    </div>
                ) : error ? (
                    <div style={styles.error}>{error}</div>
                ) : posts.length === 0 ? (
                    <div style={styles.noData}>
                        <p style={{ fontSize: "18px", margin: "0 0 10px 0" }}>Chưa có bài viết nào trong danh mục này.</p>
                        <p style={{ color: "#666" }}>Vui lòng quay lại sau hoặc chọn danh mục khác.</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogIndex;

const styles = {
    page: {
        background: "#fcfcfc",
        color: "#111",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif"
    },
    banner: {
        position: "relative",
        height: "260px",
        background: "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200&auto=format&fit=crop') no-repeat center center",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    bannerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
        zIndex: 1
    },
    bannerContent: {
        position: "relative",
        zIndex: 2,
        padding: "0 20px",
        maxWidth: "800px"
    },
    bannerSubtitle: {
        color: "#ff2e2e",
        fontSize: "14px",
        fontWeight: "bold",
        letterSpacing: "3px",
        textTransform: "uppercase"
    },
    bannerTitle: {
        fontSize: "36px",
        fontWeight: "800",
        margin: "12px 0",
        letterSpacing: "1px",
        color: "#fff"
    },
    bannerDesc: {
        color: "#ccc",
        fontSize: "15px",
        lineHeight: "1.6",
        margin: 0
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px 20px 80px 20px"
    },
    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        color: "#666",
        marginBottom: "30px"
    },
    breadcrumbLink: {
        color: "#666",
        textDecoration: "none",
        transition: "color 0.2s"
    },
    breadcrumbSeparator: {
        color: "#ccc"
    },
    breadcrumbCurrent: {
        color: "#ff2e2e",
        fontWeight: "bold"
    },
    categoryBar: {
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "40px",
        borderBottom: "1px solid #eee",
        paddingBottom: "20px"
    },
    categoryTab: {
        background: "#ffffff",
        color: "#555",
        border: "1px solid #e0e0e0",
        padding: "10px 20px",
        borderRadius: "30px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "all 0.3s ease"
    },
    categoryTabActive: {
        background: "#ff2e2e",
        color: "#fff",
        borderColor: "#ff2e2e",
        boxShadow: "0 4px 15px rgba(255, 46, 46, 0.25)"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "30px"
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 0",
        color: "#555",
        gap: "15px"
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #eee",
        borderTop: "4px solid #ff2e2e",
        borderRadius: "50%"
    },
    error: {
        padding: "30px",
        textAlign: "center",
        color: "#ff2e2e",
        background: "#ffffff",
        border: "1px solid #eee",
        borderRadius: "8px"
    },
    noData: {
        padding: "60px 20px",
        textAlign: "center",
        background: "#ffffff",
        border: "1px solid #eee",
        borderRadius: "16px",
        color: "#666"
    }
};
