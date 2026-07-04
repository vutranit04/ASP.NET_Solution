import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../services/customerService';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Vui lòng nhập địa chỉ Email!");
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');
            
            const res = await customerService.forgotPassword(email);
            setSuccess(res.message || "Mật khẩu mới đã được gửi thành công về Email của bạn. Vui lòng kiểm tra hộp thư!");
            setEmail('');
        } catch (err) {
            console.error("Khôi phục mật khẩu thất bại:", err);
            setError(err.response?.data?.message || "Khôi phục mật khẩu không thành công. Vui lòng kiểm tra lại Email!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h3 style={styles.title}>QUÊN MẬT KHẨU?</h3>
                    <p style={styles.subtitle}>Nhập địa chỉ Email của bạn để nhận lại mật khẩu khôi phục ngẫu nhiên</p>
                </div>

                {success && <div style={styles.successBox}>{success}</div>}
                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleResetPassword} style={styles.form}>
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

                    <button type="submit" disabled={loading} style={styles.btn}>
                        {loading ? "Đang xử lý..." : "KHÔI PHỤC MẬT KHẨU"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>Quay lại trang </span>
                    <Link to="/login" style={styles.link}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

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
        maxWidth: "440px",
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
    successBox: {
        background: "#f4fdf6",
        color: "#28a745",
        border: "1px solid #28a745",
        borderRadius: "8px",
        padding: "12px",
        fontSize: "13px",
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "bold"
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
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#ddd",
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
