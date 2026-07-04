import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* CỘT 1: THÔNG TIN THƯƠNG HIỆU */}
                <div style={styles.column}>
                    <h3 style={styles.brandTitle}>MINH VU MARTIAL ARTS</h3>
                    <p style={styles.brandDesc}>
                        Hệ thống phân phối võ phục và trang thiết bị võ thuật Karatedo cao cấp hàng đầu Việt Nam. Sản phẩm đạt tiêu chuẩn thi đấu Liên đoàn Karatedo Thế giới (WKF).
                    </p>
                    <div style={styles.socials}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" style={styles.socialIcon}>🌐 Facebook</a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" style={styles.socialIcon}>🎥 Youtube</a>
                    </div>
                </div>

                {/* CỘT 2: CHÍNH SÁCH */}
                <div style={styles.column}>
                    <h4 style={styles.title}>CHÍNH SÁCH</h4>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <Link to="/" style={styles.link}>Chính sách giao nhận hàng</Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/" style={styles.link}>Chính sách bảo hành đổi trả 1-1</Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/" style={styles.link}>Chính sách bảo mật thông tin</Link>
                        </li>
                        <li style={styles.listItem}>
                            <Link to="/" style={styles.link}>Điều khoản & Điều kiện giao dịch</Link>
                        </li>
                    </ul>
                </div>

                {/* CỘT 3: LIÊN HỆ */}
                <div style={styles.column}>
                    <h4 style={styles.title}>LIÊN HỆ</h4>
                    <ul style={styles.list}>
                        <li style={styles.contactItem}>
                            📍 Địa chỉ: Võ phục Minh Vũ, Quận 1, TP. Hồ Chí Minh
                        </li>
                        <li style={styles.contactItem}>
                            📞 Hotline: 0983867979 (Hỗ trợ 24/7)
                        </li>
                        <li style={styles.contactItem}>
                            ✉️ Email: support@minhvukarate.vn
                        </li>
                        <li style={styles.contactItem}>
                            🥋 Giờ làm việc: 08:00 - 21:00 hàng ngày
                        </li>
                    </ul>
                </div>
            </div>

            {/* DÒNG BẢN QUYỀN CUỐI TRANG */}
            <div style={styles.bottomBar}>
                <p style={styles.copyText}>
                    © {new Date().getFullYear()} <strong>MINH VU Martial Arts</strong>. All Rights Reserved. Designed for Professional Athletes.
                </p>
            </div>
        </footer>
    );
}

export default Footer;

const styles = {
    footer: {
        background: "#111111",
        color: "#ffffff",
        padding: "60px 0 20px 0",
        borderTop: "3px solid #ff2e2e",
        fontFamily: "Arial, sans-serif"
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "40px",
        paddingBottom: "40px"
    },
    column: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    brandTitle: {
        fontSize: "20px",
        fontWeight: "800",
        margin: 0,
        color: "#ff2e2e",
        letterSpacing: "1px"
    },
    brandDesc: {
        fontSize: "13px",
        lineHeight: "1.6",
        color: "#aaa",
        margin: 0
    },
    socials: {
        display: "flex",
        gap: "15px",
        marginTop: "10px"
    },
    socialIcon: {
        color: "#ccc",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: "bold",
        transition: "color 0.2s ease"
    },
    title: {
        fontSize: "14px",
        fontWeight: "bold",
        margin: 0,
        color: "#fff",
        letterSpacing: "1px",
        borderBottom: "1px solid #333",
        paddingBottom: "10px"
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    listItem: {
        margin: 0
    },
    link: {
        color: "#aaa",
        textDecoration: "none",
        fontSize: "13px",
        transition: "all 0.2s ease"
    },
    contactItem: {
        fontSize: "13px",
        color: "#aaa",
        lineHeight: "1.5"
    },
    bottomBar: {
        borderTop: "1px solid #222",
        paddingTop: "20px",
        textAlign: "center"
    },
    copyText: {
        fontSize: "12px",
        color: "#666",
        margin: 0
    }
};
