import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = "https://localhost:7298"; // Port Backend C# (Slide 22)

const BlogCard = ({ post }) => {
    const [hovered, setHovered] = useState(false);

    // Cắt bớt nội dung HTML/Text để hiển thị tóm tắt ngắn gọn nếu không có post.summary (Slide 23)
    const getSummary = (htmlContent) => {
        if (!htmlContent) return 'Không có mô tả...';
        const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
        const text = doc.body.textContent || "";
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
    };

    return (
        <div 
            className="card h-100 shadow-sm border-0"
            style={{
                ...styles.card,
                ...(hovered ? styles.cardHover : {})
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={styles.imgContainer}>
                <img 
                    src={post.imageUrl 
                        ? `${IMAGE_BASE_URL}${post.imageUrl}` 
                        : 'https://via.placeholder.com/400x250'} // Fallback (Slide 22)
                    className="card-img-top"
                    alt={post.title} 
                    style={{
                        ...styles.img,
                        ...(hovered ? styles.imgHover : {})
                    }} 
                />
                {post.categoryName && (
                    <span className="badge badge-danger" style={styles.badge}>{post.categoryName}</span>
                )}
            </div>

            <div className="card-body d-flex flex-column" style={styles.content}>
                <div style={styles.date}>
                    📅 {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                </div>
                
                <h5 className="card-title font-weight-bold" style={styles.title}>{post.title}</h5>
                
                <p className="card-text text-muted flex-grow-1" style={styles.desc}>
                    {post.summary || getSummary(post.content)}
                </p>
                
                <Link to={`/blog/${post.id}`} className="btn btn-outline-danger btn-block font-weight-bold mt-3" style={styles.link}>
                    <span>Đọc bài viết</span>
                    <span style={{
                        ...styles.arrow,
                        ...(hovered ? styles.arrowHover : {})
                    }}>→</span>
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;

const styles = {
    card: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        overflow: "hidden",
        color: "#111",
        transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.04)"
    },
    cardHover: {
        transform: "translateY(-6px)",
        border: "1px solid #ff2e2e",
        boxShadow: "0 12px 30px rgba(255, 46, 46, 0.08)"
    },
    imgContainer: {
        position: "relative",
        width: "100%",
        height: "200px",
        overflow: "hidden"
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.5s ease"
    },
    imgHover: {
        transform: "scale(1.08)"
    },
    badge: {
        position: "absolute",
        top: "12px",
        left: "12px",
        background: "linear-gradient(135deg, #ff2e2e 0%, #a70000 100%)",
        color: "#fff",
        padding: "4px 10px",
        fontSize: "11px",
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "20px",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 2
    },
    content: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    },
    date: {
        fontSize: "12px",
        color: "#777",
        marginBottom: "8px"
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#111",
        margin: "0 0 10px 0",
        lineHeight: "1.4",
        height: "50px",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical"
    },
    desc: {
        fontSize: "14px",
        color: "#444",
        lineHeight: "1.6",
        margin: "0 0 18px 0",
        flexGrow: 1,
        height: "65px",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical"
    },
    link: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        color: "#ff2e2e",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "all 0.2s ease"
    },
    arrow: {
        display: "inline-block",
        transition: "transform 0.3s ease"
    },
    arrowHover: {
        transform: "translateX(4px)"
    }
};
