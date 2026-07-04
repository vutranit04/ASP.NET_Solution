import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/product/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import BlogIndex from './pages/blog/index';
import BlogDetail from './pages/blog/BlogDetail';
import Shop from './pages/Shop';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword';

// Component con Header riêng để có thể sử dụng hook useNavigate
function Header({ currentUser, handleLogout, cartCount }) {
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [profileHover, setProfileHover] = useState(false);
    const [ordersHover, setOrdersHover] = useState(false);
    const [logoutHover, setLogoutHover] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Điều hướng sang trang cửa hàng kèm tham số tìm kiếm
            navigate(`/shop?search=${encodeURIComponent(searchVal)}`);
        }
    };

    return (
        <div style={styles.topBar}>
            <Link to="/" style={styles.topBarTitle}>MINH VU MARTIAL ARTS STORE</Link>
            
            {/* THANH TÌM KIẾM TRÊN HEADER CHUNG (YC #40) */}
            <div style={styles.headerSearchContainer}>
                <span style={styles.headerSearchIcon}>🔍</span>
                <input 
                    type="text" 
                    placeholder="Tìm sản phẩm..." 
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    style={styles.headerSearchInput}
                />
            </div>

            <div style={styles.topBarLinks}>
                <Link to="/shop" style={styles.topBarLink}>CỬA HÀNG</Link>
                <Link to="/blog" style={styles.topBarLink}>TIN TỨC (BLOG)</Link>
                
                {/* Hiển thị dựa trên trạng thái Đăng nhập */}
                {currentUser ? (
                    <div ref={dropdownRef} style={styles.userMenuContainer}>
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)} 
                            style={styles.welcomeTextBtn}
                        >
                            👤 Xin chào, <strong>{currentUser.fullName}</strong> ▾
                        </button>

                        {showDropdown && (
                            <div style={styles.dropdownMenu}>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setShowDropdown(false)} 
                                    style={{
                                        ...styles.dropdownItem,
                                        ...(profileHover ? styles.dropdownItemHover : {})
                                    }}
                                    onMouseEnter={() => setProfileHover(true)}
                                    onMouseLeave={() => setProfileHover(false)}
                                >
                                    👤 Thông tin cá nhân
                                </Link>
                                <Link 
                                    to="/orders" 
                                    onClick={() => setShowDropdown(false)} 
                                    style={{
                                        ...styles.dropdownItem,
                                        ...(ordersHover ? styles.dropdownItemHover : {})
                                    }}
                                    onMouseEnter={() => setOrdersHover(true)}
                                    onMouseLeave={() => setOrdersHover(false)}
                                >
                                    📦 Đơn hàng của tôi
                                </Link>
                                <div style={styles.dropdownDivider}></div>
                                <button 
                                    onClick={() => {
                                        handleLogout();
                                        setShowDropdown(false);
                                    }} 
                                    style={{
                                        ...styles.dropdownLogoutBtn,
                                        ...(logoutHover ? styles.dropdownItemHover : {})
                                    }}
                                    onMouseEnter={() => setLogoutHover(true)}
                                    onMouseLeave={() => setLogoutHover(false)}
                                >
                                    🚪 Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" style={styles.topBarLink}>Đăng nhập</Link>
                        <Link to="/register" style={styles.topBarLink}>Đăng ký</Link>
                    </>
                )}

                {/* BIỂU TƯỢNG GIỎ HÀNG CÓ BADGE BONG BÓNG ĐỎ (YC #41) */}
                <Link to="/cart" style={styles.cartLinkWrapper}>
                    <div style={styles.cartBtnContainer}>
                        <span style={styles.cartIconSpan}>🛒</span>
                        {cartCount > 0 && (
                            <span style={styles.cartBadge}>{cartCount}</span>
                        )}
                    </div>
                </Link>
            </div>
        </div>
    );
}

function App() {
    // Quản lý trạng thái Giỏ hàng
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved && saved !== "undefined" ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Lỗi parse giỏ hàng từ localStorage:", e);
            return [];
        }
    });

    // Quản lý trạng thái Khách hàng đã đăng nhập
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('currentUser');
            return saved && saved !== "undefined" ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Lỗi parse thông tin đăng nhập từ localStorage:", e);
            return null;
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        const stock = product.stockQuantity ?? product.StockQuantity ?? 0;
        if (stock <= 0) {
            alert("Sản phẩm này đã hết hàng!");
            return;
        }

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingIndex > -1) {
                const currentQty = prevCart[existingIndex].quantity;
                if (currentQty + quantity > stock) {
                    alert(`Không thể thêm! Tổng số lượng trong giỏ hàng (${currentQty + quantity}) vượt quá số lượng tồn kho (${stock}).`);
                    return prevCart;
                }
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += quantity;
                return newCart;
            }
            if (quantity > stock) {
                alert(`Không thể thêm! Số lượng yêu cầu (${quantity}) vượt quá số lượng tồn kho (${stock}).`);
                return prevCart;
            }
            return [...prevCart, { ...product, quantity }];
        });
    };

    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) => 
            prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <Router>
            <div style={styles.appWrapper}>
                {/* TOP NAV BAR */}
                <Header currentUser={currentUser} handleLogout={handleLogout} cartCount={cartCount} />

                <Routes>
                    <Route path="/" element={<Home addToCart={addToCart} />} />
                    <Route path="/shop" element={<Shop addToCart={addToCart} />} />
                    <Route 
                        path="/product/:id" 
                        element={<ProductDetail addToCart={addToCart} />} 
                    />
                    <Route 
                        path="/cart" 
                        element={
                            <Cart 
                                cart={cart} 
                                currentUser={currentUser}
                                updateCartQuantity={updateCartQuantity} 
                                removeFromCart={removeFromCart} 
                                clearCart={clearCart} 
                            />
                        } 
                    />
                    <Route 
                        path="/login" 
                        element={<Login setCurrentUser={setCurrentUser} />} 
                    />
                    <Route 
                        path="/register" 
                        element={<Register />} 
                    />
                    <Route 
                        path="/forgot-password" 
                        element={<ForgotPassword />} 
                    />
                    <Route 
                        path="/profile" 
                        element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} />} 
                    />
                    <Route 
                        path="/orders" 
                        element={<Orders currentUser={currentUser} />} 
                    />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

const styles = {
    appWrapper: {
        background: "#f9f9f9",
        minHeight: "100vh",
        color: "#111"
    },
    topBar: {
        background: "#ffffff",
        color: "#111",
        padding: "18px 30px",
        fontSize: "13px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        letterSpacing: "1px"
    },
    topBarTitle: {
        color: "#111",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "15px",
        letterSpacing: "0.5px"
    },
    topBarLinks: {
        display: "flex",
        gap: "25px",
        alignItems: "center"
    },
    topBarLink: {
        color: "#555",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "13px",
        letterSpacing: "0.5px",
        transition: "color 0.2s ease"
    },
    cartLink: {
        color: "#ff2e2e",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "13px",
        letterSpacing: "0.5px",
        background: "#fdf1f1",
        padding: "6px 14px",
        borderRadius: "20px",
        transition: "all 0.2s ease"
    },
    userMenuContainer: {
        position: "relative",
        display: "inline-block"
    },
    welcomeTextBtn: {
        background: "none",
        border: "none",
        color: "#333",
        fontSize: "13px",
        fontWeight: "bold",
        cursor: "pointer",
        padding: "5px 0",
        outline: "none"
    },
    dropdownMenu: {
        position: "absolute",
        top: "100%",
        right: 0,
        background: "#ffffff",
        border: "1px solid #eef0f2",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        minWidth: "190px",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        padding: "8px 0",
        marginTop: "5px"
    },
    dropdownItem: {
        padding: "10px 16px",
        color: "#333",
        textDecoration: "none",
        fontSize: "13px",
        textAlign: "left",
        transition: "background 0.2s ease",
        cursor: "pointer"
    },
    dropdownItemHover: {
        background: "#fdf1f1",
        color: "#ff2e2e"
    },
    dropdownDivider: {
        height: "1px",
        background: "#eee",
        margin: "6px 0"
    },
    dropdownLogoutBtn: {
        background: "none",
        border: "none",
        padding: "10px 16px",
        color: "#dc3545",
        fontSize: "13px",
        fontWeight: "bold",
        textAlign: "left",
        transition: "background 0.2s ease",
        cursor: "pointer",
        width: "100%"
    },
    headerSearchContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        flex: 1,
        maxWidth: "400px",
        margin: "0 20px"
    },
    headerSearchIcon: {
        position: "absolute",
        left: "12px",
        color: "#888",
        fontSize: "14px"
    },
    headerSearchInput: {
        width: "100%",
        padding: "8px 12px 8px 35px",
        borderRadius: "20px",
        border: "1px solid #ddd",
        fontSize: "13px",
        outline: "none",
        transition: "all 0.2s ease"
    },
    cartLinkWrapper: {
        textDecoration: "none",
        color: "inherit"
    },
    cartBtnContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        background: "#fdf1f1",
        borderRadius: "50%",
        cursor: "pointer",
        transition: "all 0.2s ease"
    },
    cartIconSpan: {
        fontSize: "18px"
    },
    cartBadge: {
        position: "absolute",
        top: "-5px",
        right: "-5px",
        background: "#ff2e2e",
        color: "#ffffff",
        fontSize: "10px",
        fontWeight: "bold",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #ffffff",
        boxShadow: "0 2px 5px rgba(255, 46, 46, 0.4)"
    }
};