import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import customerService from '../services/customerService';

function Login({ setCurrentUser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Xác định trang cần quay lại sau khi đăng nhập thành công
    const fromPath = location.state?.from || '/';

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("Vui lòng điền đầy đủ email và mật khẩu");
            return;
        }

        try {
            setLoading(true);
            setError('');
            const data = await customerService.login({ email, password });
            
            if (data && data.success) {
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                setCurrentUser(data.user);
                
                // Chuyển hướng về trang trước đó
                navigate(fromPath);
            } else {
                setError(data?.message || "Email hoặc mật khẩu không chính xác!");
            }
        } catch (err) {
            console.error("Đăng nhập thất bại:", err);
            setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h3 style={styles.title}>ĐĂNG NHẬP KHÁCH HÀNG</h3>
                    <p style={styles.subtitle}>Đăng nhập để tiếp tục thanh toán và quản lý đơn hàng</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Địa chỉ Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="tranminhvu123@gmail.com"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Mật khẩu</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="******"
                            required
                        />
                        <div style={{ textAlign: 'right', marginTop: '5px' }}>
                            <Link to="/forgot-password" style={styles.link}>Quên mật khẩu?</Link>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.btn}>
                        {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>Chưa có tài khoản? </span>
                    <Link to="/register" state={{ from: fromPath }} style={styles.link}>
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)",
        background: "#f9f9f9",
        padding: "20px"
    },
    card: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        padding: "40px 30px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        boxSizing: "border-box"
    },
    header: {
        textAlign: "center",
        marginBottom: "25px"
    },
    title: {
        fontSize: "20px",
        fontWeight: "800",
        margin: "0 0 8px 0",
        color: "#111"
    },
    subtitle: {
        fontSize: "13px",
        color: "#666",
        margin: 0,
        lineHeight: "1.4"
    },
    errorBox: {
        background: "#fdf1f1",
        color: "#ff2e2e",
        border: "1px solid #ff2e2e",
        borderRadius: "8px",
        padding: "12px",
        fontSize: "13px",
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "bold"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },
    label: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#333"
    },
    input: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none",
        transition: "border-color 0.2s ease"
    },
    btn: {
        background: "#111",
        color: "#fff",
        border: "none",
        padding: "14px 0",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop: "10px"
    },
    footer: {
        textAlign: "center",
        marginTop: "25px",
        fontSize: "13px",
        color: "#555"
    },
    link: {
        color: "#ff2e2e",
        textDecoration: "none",
        fontWeight: "bold"
    }
};
