import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div style={styles.loading}>Loading news...</div>;
    }

    return (
        <div style={styles.container}>
            {posts.length === 0 ? (
                <p style={{ color: "#ffff" }}>No news available</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} style={styles.card}>

                        <h3 style={styles.title}>{post.title}</h3>

                        <div
                            style={styles.desc}
                            dangerouslySetInnerHTML={{ __html: post.content || "Martial arts update..." }}
                        />

                        <div style={styles.footer}>
                            <span>
                                📅 {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                            </span>

                            <span style={styles.tag}>READ</span>
                        </div>

                    </div>
                ))
            )}
        </div>
    );
};

export default PostList;

const styles = {
    container: {
        display: "grid",
        gap: 12
    },
    card: {
        background: "#111",
        border: "1px solid #222",
        borderRadius: 10,
        padding: 15,
        color: "white"
    },
    title: {
        color: "#ff2e2e"
    },
    desc: {
        color: "#aaa",
        fontSize: 13
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 10,
        fontSize: 12,
        color: "#888"
    },
    tag: {
        background: "#ff2e2e",
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: 10
    },
    loading: {
        color: "#aaa"
    }
};