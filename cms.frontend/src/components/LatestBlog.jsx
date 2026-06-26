import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import BlogCard from './BlogCard';

const LatestBlog = () => {
    const [latestPosts, setLatestPosts] = useState([]); // Slide 25
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        blogService.getAllPosts() // Slide 25
            .then(res => {
                setLatestPosts(res.slice(0, 3)); // Lấy 3 bài viết mới nhất (Slide 25)
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi tải bài viết mới nhất:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Đang tải tin tức...</p> {/* Slide 26 */}
            </div>
        );
    }

    if (latestPosts.length === 0) {
        return null;
    }

    return (
        <section style={styles.section}>
            <div style={styles.header}>
                <div style={styles.titleArea}>
                    <span style={styles.subtitle}>TIN TỨC & SỰ KIỆN</span>
                    <h2 style={styles.title}>BÀI VIẾT MỚI NHẤT</h2>
                </div>
                <Link to="/blog" style={styles.viewAllBtn}>
                    Xem Tất Cả
                </Link>
            </div>

            {/* Bố cục lưới Bootstrap 4 (Slide 26) */}
            <div className="row" style={styles.rowOverride}>
                {latestPosts.map(item => (
                    <div className="col-md-4 mb-4" key={item.id}> {/* key={item.id} và col-md-4 (Slide 26) */}
                        <BlogCard post={item} />
                    </div>
                ))}
            </div>

            <div style={styles.mobileFooter}>
                <Link to="/blog" style={styles.viewAllBtnMobile}>
                    Xem Tất Cả Bài Viết
                </Link>
            </div>
        </section>
    );
};

export default LatestBlog;

const styles = {
    section: {
        padding: "45px 20px",
        background: "#fcfcfc",
        borderTop: "1px solid #eee"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "35px"
    },
    titleArea: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    subtitle: {
        color: "#ff2e2e",
        fontSize: "13px",
        fontWeight: "bold",
        letterSpacing: "2px"
    },
    title: {
        color: "#111",
        fontSize: "32px",
        fontWeight: "800",
        margin: 0,
        letterSpacing: "1px"
    },
    viewAllBtn: {
        background: "transparent",
        color: "#111",
        border: "1px solid #ddd",
        padding: "10px 24px",
        borderRadius: "30px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "all 0.3s ease",
        cursor: "pointer"
    },
    rowOverride: {
        marginRight: "-15px",
        marginLeft: "-15px"
    },
    mobileFooter: {
        display: "flex",
        justifyContent: "center",
        marginTop: "10px"
    },
    viewAllBtnMobile: {
        display: "none",
        background: "transparent",
        color: "#ff2e2e",
        border: "1px solid #ff2e2e",
        padding: "12px 30px",
        borderRadius: "30px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center"
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        color: "#666",
        gap: "12px"
    },
    spinner: {
        width: "35px",
        height: "35px",
        border: "3px solid #eee",
        borderTop: "3px solid #ff2e2e",
        borderRadius: "50%"
    }
};
