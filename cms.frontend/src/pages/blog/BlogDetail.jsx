import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import { getFullImageUrl, IMAGE_BASE_URL } from '../../api/axiosClient';

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(id);
                setPost(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết bài viết:", err);
                setError(err.response?.data?.message || "Không thể tải chi tiết bài viết này. Bài viết có thể không tồn tại hoặc đã bị xóa.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPostDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Đang tải chi tiết bài viết...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div style={styles.container}>
                <div style={styles.errorContainer}>
                    <h2 style={styles.errorTitle}>Lỗi Tải Bài Viết</h2>
                    <p style={styles.errorDesc}>{error || "Bài viết không tồn tại trên hệ thống."}</p>
                    <Link to="/blog" style={styles.backBtn}>
                        ← Quay Lại Blog
                    </Link>
                </div>
            </div>
        );
    }

    const imageUrl = getFullImageUrl(post.imageUrl) !== 'https://placehold.co/300x300?text=No+Image'
        ? getFullImageUrl(post.imageUrl)
        : 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&auto=format&fit=crop'; // Ảnh võ thuật mặc định

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* BREADCRUMB & BACK BUTTON */}
                <div style={styles.topNav}>
                    <Link to="/blog" style={styles.backLink}>
                        ← Quay Lại Blog
                    </Link>
                    <div style={styles.breadcrumb}>
                        <Link to="/" style={styles.breadcrumbLink}>Trang Chủ</Link>
                        <span style={styles.breadcrumbSeparator}>&gt;</span>
                        <Link to="/blog" style={styles.breadcrumbLink}>Blog</Link>
                        <span style={styles.breadcrumbSeparator}>&gt;</span>
                        <span style={styles.breadcrumbCurrent}>{post.title}</span>
                    </div>
                </div>

                {/* ARTICLE HEADER */}
                <article style={styles.article}>
                    <header style={styles.header}>
                        <div style={styles.meta}>
                            {post.categoryName && (
                                <span style={styles.categoryBadge}>{post.categoryName}</span>
                            )}
                            <span style={styles.date}>
                                📅 {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                            </span>
                        </div>
                        <h1 style={styles.title}>{post.title}</h1>
                    </header>

                    {/* FEATURED COVER IMAGE */}
                    <div style={styles.coverContainer}>
                        <img src={imageUrl} alt={post.title} style={styles.coverImage} />
                    </div>

                    {/* ARTICLE BODY CONTENT */}
                    <div 
                        className="blog-main-content blog-body-content"
                        style={styles.body}
                        dangerouslySetInnerHTML={{ 
                            __html: post.content ? post.content.replace(/(src=["'])\/images\//g, `$1${IMAGE_BASE_URL}/images/`) : '' 
                        }}
                    />
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;

const styles = {
    page: {
        background: "#fcfcfc",
        color: "#111",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif"
    },
    container: {
        maxWidth: "850px",
        margin: "0 auto",
        padding: "40px 20px 80px 20px"
    },
    topNav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        marginBottom: "35px",
        borderBottom: "1px solid #eee",
        paddingBottom: "15px"
    },
    backLink: {
        color: "#ff2e2e",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "15px",
        transition: "color 0.2s"
    },
    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "#666"
    },
    breadcrumbLink: {
        color: "#888",
        textDecoration: "none"
    },
    breadcrumbSeparator: {
        color: "#ccc"
    },
    breadcrumbCurrent: {
        color: "#444",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "200px"
    },
    article: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "20px",
        padding: "40px 30px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.03)"
    },
    header: {
        marginBottom: "30px"
    },
    meta: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "15px"
    },
    categoryBadge: {
        background: "linear-gradient(135deg, #ff2e2e 0%, #a70000 100%)",
        color: "#fff",
        padding: "4px 12px",
        fontSize: "11px",
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "20px",
        letterSpacing: "0.5px"
    },
    date: {
        color: "#666",
        fontSize: "13px"
    },
    title: {
        fontSize: "32px",
        fontWeight: "800",
        lineHeight: "1.35",
        margin: 0,
        color: "#111"
    },
    coverContainer: {
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "35px"
    },
    coverImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    body: {
        fontSize: "17px",
        lineHeight: "1.8",
        color: "#333",
        letterSpacing: "0.2px"
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#fcfcfc",
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
    errorContainer: {
        padding: "60px 40px",
        textAlign: "center",
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "20px",
        marginTop: "40px"
    },
    errorTitle: {
        color: "#ff2e2e",
        fontSize: "24px",
        marginBottom: "15px",
        fontWeight: "bold"
    },
    errorDesc: {
        color: "#666",
        fontSize: "16px",
        marginBottom: "30px"
    },
    backBtn: {
        display: "inline-block",
        background: "#ff2e2e",
        color: "#fff",
        padding: "12px 30px",
        borderRadius: "30px",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "15px"
    }
};
