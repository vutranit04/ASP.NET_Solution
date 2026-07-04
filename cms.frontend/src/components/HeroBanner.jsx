import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import blogService from '../services/blogService';
import { getFullImageUrl } from '../api/axiosClient';

function HeroBanner() {
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                setLoading(true);
                // Gọi song song 2 API thực tế
                const [productsData, postsData] = await Promise.all([
                    productService.getAllProducts(),
                    blogService.getAllPosts()
                ]);

                const compiledSlides = [];

                // 1. Lấy tối đa 2 sản phẩm đầu làm Slide
                if (productsData && productsData.length > 0) {
                    productsData.slice(0, 2).forEach((prod, index) => {
                        compiledSlides.push({
                            id: `prod-${prod.id}`,
                            title: prod.name,
                            subtitle: `SẢN PHẨM MỚI NỔI BẬT`,
                            description: prod.description || "Võ phục và trang bị bảo hộ võ thuật cao cấp, may mặc chuẩn phom võ sĩ.",
                            image: prod.imageUrl,
                            link: `/product/${prod.id}`,
                            type: 'product',
                            actionText: 'MUA NGAY',
                            priceText: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)
                        });
                    });
                }

                // 2. Lấy tối đa 2 bài viết tin tức mới làm Slide
                if (postsData && postsData.length > 0) {
                    postsData.slice(0, 2).forEach((post) => {
                        // Trích xuất nội dung ngắn
                        let summary = post.content || "";
                        if (summary.length > 120) {
                            summary = summary.replace(/<[^>]*>/g, '').substring(0, 120) + "...";
                        }

                        compiledSlides.push({
                            id: `post-${post.id}`,
                            title: post.title,
                            subtitle: `TIN TỨC & SỰ KIỆN VÕ THUẬT`,
                            description: summary || "Xem các bản tin võ thuật mới nhất từ liên đoàn và các giải đấu lớn toàn quốc.",
                            image: post.imageUrl,
                            link: `/blog/${post.id}`,
                            type: 'post',
                            actionText: 'ĐỌC NGAY'
                        });
                    });
                }

                // 3. Fallback Slide mặc định nếu database rỗng
                if (compiledSlides.length === 0) {
                    compiledSlides.push({
                        id: 'fallback-1',
                        title: "VÕ PHỤC KARATEDO VIỆT HÙNG",
                        subtitle: "UY TÍN & CHẤT LƯỢNG",
                        description: "Chuyên cung cấp đai võ, võ phục Karatedo chuẩn thi đấu WKF và phụ kiện tập luyện chuyên nghiệp.",
                        image: null,
                        link: '#products-section',
                        type: 'fallback',
                        actionText: 'MUA SẮM NGAY'
                    });
                }

                setSlides(compiledSlides);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu banner:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBannerData();
    }, []);

    // Tự động chuyển Slide mỗi 5 giây
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides]);

    const handlePrev = () => {
        setActiveIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIdx((prev) => (prev + 1) % slides.length);
    };

    const handleActionClick = (slide) => {
        if (slide.link.startsWith('/')) {
            navigate(slide.link);
        } else {
            // Cuộn xuống phần sản phẩm nếu link là hash
            const element = document.querySelector(slide.link);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    if (loading || slides.length === 0) {
        return (
            <div style={styles.loadingBanner}>
                <div style={styles.spinner}></div>
            </div>
        );
    }

    const currentSlide = slides[activeIdx];

    return (
        <div style={styles.bannerWrapper}>
            {/* VÙNG CHỨA SLIDE CHÍNH */}
            <div style={styles.slideContainer}>
                {/* ẢNH NỀN BANNER CHUYỂN ĐỘNG MỀM MẠI */}
                <div 
                    style={{
                        ...styles.backgroundImage,
                        backgroundImage: currentSlide.image 
                            ? `url(${getFullImageUrl(currentSlide.image)})`
                            : 'linear-gradient(135deg, #111 0%, #333 100%)',
                    }}
                />
                
                {/* LỚP PHỦ MỜ/TỐI ĐỂ TĂNG ĐỘ NỔI BẬT CHO CHỮ */}
                <div style={styles.overlay} />

                {/* NỘI DUNG SLIDE CHỮ */}
                <div style={styles.slideContent}>
                    <span style={styles.subtitle}>{currentSlide.subtitle}</span>
                    <h1 style={styles.title}>{currentSlide.title}</h1>
                    <p style={styles.description}>{currentSlide.description}</p>
                    
                    {currentSlide.priceText && (
                        <div style={styles.priceTag}>
                            Giá ưu đãi: <span style={styles.priceVal}>{currentSlide.priceText}</span>
                        </div>
                    )}

                    <button 
                        onClick={() => handleActionClick(currentSlide)} 
                        style={styles.actionBtn}
                    >
                        {currentSlide.actionText} →
                    </button>
                </div>

                {/* NÚT CHUYỂN SLIDE PHẢI / TRÁI */}
                {slides.length > 1 && (
                    <>
                        <button onClick={handlePrev} style={{ ...styles.navBtn, left: 20 }}>‹</button>
                        <button onClick={handleNext} style={{ ...styles.navBtn, right: 20 }}>›</button>
                    </>
                )}

                {/* DẤU CHẤM TRANG DƯỚI SLIDE */}
                {slides.length > 1 && (
                    <div style={styles.dotsRow}>
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIdx(idx)}
                                style={{
                                    ...styles.dot,
                                    background: idx === activeIdx ? "#ff2e2e" : "rgba(255,255,255,0.4)"
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HeroBanner;

const styles = {
    bannerWrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: "30px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },
    slideContainer: {
        position: "relative",
        width: "100%",
        height: "440px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
    },
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "all 0.8s ease-in-out"
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(to right, rgba(0, 0, 0, 0.85) 30%, rgba(0, 0, 0, 0.4) 100%)",
        zIndex: 2
    },
    slideContent: {
        position: "relative",
        zIndex: 3,
        maxWidth: "600px",
        padding: "0 60px",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    subtitle: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#ff2e2e",
        letterSpacing: "2px"
    },
    title: {
        fontSize: "36px",
        fontWeight: "800",
        margin: 0,
        lineHeight: "1.2",
        textTransform: "uppercase"
    },
    description: {
        fontSize: "14px",
        color: "#ccc",
        lineHeight: "1.6",
        margin: 0
    },
    priceTag: {
        fontSize: "14px",
        color: "#eee"
    },
    priceVal: {
        color: "#ff2e2e",
        fontSize: "20px",
        fontWeight: "800"
    },
    actionBtn: {
        alignSelf: "flex-start",
        background: "#ff2e2e",
        color: "#fff",
        border: "none",
        padding: "12px 28px",
        borderRadius: "30px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop: "10px"
    },
    navBtn: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(0,0,0,0.5)",
        color: "#fff",
        border: "none",
        width: "45px",
        height: "45px",
        fontSize: "24px",
        borderRadius: "50%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 4,
        transition: "background 0.3s ease"
    },
    dotsRow: {
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "10px",
        zIndex: 4
    },
    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        border: "none",
        padding: 0,
        cursor: "pointer",
        transition: "background 0.3s ease"
    },
    categoryBar: {
        background: "#111",
        color: "#fff",
        padding: "12px 30px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap"
    },
    barLabel: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ff2e2e",
        letterSpacing: "0.5px"
    },
    catsRow: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },
    catBadge: {
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        border: "none",
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s ease"
    },
    loadingBanner: {
        width: "100%",
        height: "440px",
        background: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px"
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #444",
        borderTop: "4px solid #ff2e2e",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    }
};
