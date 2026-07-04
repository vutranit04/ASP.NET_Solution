import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';

function Profile({ currentUser, setCurrentUser }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Bảo vệ trang: Yêu cầu đăng nhập
    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: '/profile' } });
        } else {
            setForm({
                fullName: currentUser.fullName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.fullName.trim()) {
            setError("Họ và tên không được để trống!");
            return;
        }

        if (form.password && form.password !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const updateData = {
                id: currentUser.id,
                fullName: form.fullName,
                phone: form.phone,
                address: form.address
            };

            // Nếu người dùng nhập mật khẩu mới, mới gửi đi
            if (form.password.trim()) {
                updateData.password = form.password;
            }

            const updatedUser = await customerService.updateProfile(updateData);
            
            // Cập nhật lại session
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            setSuccess("Cập nhật thông tin tài khoản thành công!");
            setForm(prev => ({ ...prev, password: '', confirmPassword: '' })); // reset mật khẩu
        } catch (err) {
            console.error("Cập nhật hồ sơ thất bại:", err);
            setError(err.response?.data?.message || "Lỗi hệ thống khi cập nhật thông tin!");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h3 style={styles.title}>THÔNG TIN CÁ NHÂN</h3>
                    <p style={styles.subtitle}>Xem và cập nhật thông tin tài khoản của bạn</p>
                </div>

                {success && <div style={styles.successBox}>{success}</div>}
                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleUpdate} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Địa chỉ Email (Không thể thay đổi)</label>
                        <input 
                            type="email" 
                            value={form.email}
                            style={{ ...styles.input, ...styles.disabledInput }}
                            disabled
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Họ và tên *</label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={form.fullName}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Số điện thoại</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={form.phone}
                            onChange={handleInputChange}
                            style={styles.input}
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
                        />
                    </div>

                    <div style={styles.divider}></div>
                    <p style={styles.sectionSubtitle}>Đổi mật khẩu (Để trống nếu không muốn thay đổi)</p>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Mật khẩu mới</label>
                        <input 
                            type="password" 
                            name="password"
                            value={form.password}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="******"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Xác nhận mật khẩu mới</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="******"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.btn}>
                        {loading ? "Đang lưu..." : "CẬP NHẬT THÔNG TIN"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 60px)",
        background: "#f9f9f9",
        padding: "40px 20px"
    },
    card: {
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "16px",
        padding: "40px 30px",
        width: "100%",
        maxWidth: "480px",
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
        margin: 0
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
        gap: "15px"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },
    label: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#555"
    },
    input: {
        padding: "11px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none",
        color: "#333"
    },
    disabledInput: {
        background: "#f5f5f5",
        color: "#888",
        cursor: "not-allowed",
        border: "1px solid #eee"
    },
    divider: {
        height: "1px",
        background: "#eee",
        margin: "10px 0"
    },
    sectionSubtitle: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ff2e2e",
        margin: "0 0 5px 0"
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
        marginTop: "15px"
    }
};
