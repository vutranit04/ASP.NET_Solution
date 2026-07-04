import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import customerService from '../services/customerService';

function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Thu nhận trang cần chuyển sau khi đăng ký -> đăng nhập
    const fromPath = location.state?.from || '/';

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === 'email') {
            setEmailError('');
        }
    };

    const handleEmailBlur = async (e) => {
        const email = e.target.value.trim();
        if (!email) {
            setEmailError('');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Định dạng email không hợp lệ!');
            return;
        }

        try {
            const res = await customerService.checkEmail(email);
            if (res.exists) {
                setEmailError('Email này đã được sử dụng. Vui lòng chọn email khác!');
            } else {
                setEmailError('');
            }
        } catch (err) {
            console.error("Kiểm tra email thất bại:", err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Kiểm tra cơ bản
        if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
            setError("Vui lòng điền các thông tin bắt buộc (*)");
            return;
        }

        if (emailError) {
            setError("Vui lòng sửa lỗi trùng lặp email trước khi đăng ký!");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            await customerService.register({
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                address: form.address,
                password: form.password
            });

            alert("Đăng ký tài khoản thành công! Bạn sẽ được chuyển sang trang Đăng nhập.");
            navigate('/login', { state: { from: fromPath } });
        } catch (err) {
            console.error("Đăng ký thất bại:", err);
            setError(err.response?.data?.message || "Đăng ký không thành công. Email này có thể đã được đăng ký!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h3 style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</h3>
                    <p style={styles.subtitle}>Tạo tài khoản để mua sắm và theo dõi đơn hàng của bạn</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Họ và tên *</label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={form.fullName}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Địa chỉ Email *</label>
                        <input 
                            type="email" 
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            onBlur={handleEmailBlur}
                            style={{
                                ...styles.input,
                                borderColor: emailError ? '#ff2e2e' : '#ddd',
                            }}
                            placeholder="email@viethung.com"
                            required
                        />
                        {emailError && <span style={styles.fieldError}>{emailError}</span>}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Số điện thoại</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={form.phone}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="09xx xxx xxx"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Địa chỉ nhận hàng</label>
                        <input 
                            type="text" 
                            name="address"
                            value={form.address}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Số nhà, Tên đường, Quận/Huyện..."
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Mật khẩu *</label>
                        <input 
                            type="password" 
                            name="password"
                            value={form.password}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="******"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Xác nhận mật khẩu *</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="******"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.btn}>
                        {loading ? "Đang xử lý..." : "ĐĂNG KÝ NGAY"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>Đã có tài khoản? </span>
                    <Link to="/login" state={{ from: fromPath }} style={styles.link}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;

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
        padding: "35px 30px",
        width: "100%",
        maxWidth: "460px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        boxSizing: "border-box"
    },
    header: {
        textAlign: "center",
        marginBottom: "20px"
    },
    title: {
        fontSize: "20px",
        fontWeight: "800",
        margin: "0 0 6px 0",
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
        marginBottom: "15px",
        textAlign: "center",
        fontWeight: "bold"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    label: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#333"
    },
    input: {
        padding: "10px 12px",
        borderRadius: "8px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#ddd",
        fontSize: "13px",
        outline: "none"
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
        marginTop: "20px",
        fontSize: "13px",
        color: "#555"
    },
    link: {
        color: "#ff2e2e",
        textDecoration: "none",
        fontWeight: "bold"
    },
    fieldError: {
        color: "#ff2e2e",
        fontSize: "12px",
        marginTop: "4px",
        fontWeight: "600",
        textAlign: "left"
    }
};
