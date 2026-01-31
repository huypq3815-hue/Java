import { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message, Card, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import api from '../config/api';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook điều hướng

    const onFinish = async (values) => {
        setLoading(true);

        try {
            // 1. Gọi API đăng nhập
            // api.js đã config interceptor trả về response.data, nên biến response ở đây chứa dữ liệu luôn
            const data = await api.post('/auth/login', {
                username: values.username,
                password: values.password,
            });

            console.log('LOGIN SUCCESS: - Login.jsx:25', data);

            // 2. Kiểm tra token
            if (!data.token) {
                throw new Error('Không nhận được token từ server!');
            }

            // 3. Xử lý Role (Lấy role đầu tiên trong list)
            const rawRole = data.roles && data.roles.length > 0 ? data.roles[0] : "ROLE_TEACHER";
            // Chuẩn hóa role (bỏ tiền tố ROLE_ để dễ so sánh)
            const role = rawRole.replace("ROLE_", "");

            // 4. Tạo object user
            const user = {
                id: data.id,
                username: data.username,
                email: data.email,
                fullName: data.username, 
                role: role // Lưu dạng "ADMIN", "TEACHER"
            };

            // 5. Lưu vào localStorage
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('user', JSON.stringify(user));

            message.success('Đăng nhập thành công!');

            // 6. Điều hướng dựa trên Role (Không reload trang)
            if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (role === 'TEACHER') {
                navigate('/teacher/dashboard'); // Đảm bảo route này tồn tại trong App.jsx
            } else {
                navigate('/dashboard'); // Fallback
            }

        } catch (error) {
            console.error('LOGIN ERROR: - Login.jsx:62', error);
            const errorMsg = error.message || 'Tài khoản hoặc mật khẩu không đúng!';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <Card className="login-card" style={{
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                borderRadius: 16,
                border: 'none',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
            }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                        <div style={{ marginBottom: 16, fontSize: 40, animation: 'bounce 2s infinite' }}>
                            <BookOutlined style={{ color: '#06b6d4' }} />
                        </div>
                        <Title level={2} style={{
                            marginBottom: 4,
                            background: 'linear-gradient(135deg, #047857 0%, #06b6d4 50%, #0891b2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontWeight: 900,
                            letterSpacing: '0.5px',
                            textShadow: '0 2px 10px rgba(4, 120, 87, 0.3)',
                            filter: 'drop-shadow(0 4px 8px rgba(6, 182, 212, 0.2))',
                        }}>
                            Planbook AI
                        </Title>
                        <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>
                            Nền tảng quản lý và tạo đề thi thông minh
                        </Text>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
                        <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                            <Input placeholder="Nhập username hoặc email" size="large" prefix={<UserOutlined />} />
                        </Form.Item>

                        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Checkbox style={{ fontWeight: 500 }}>Ghi nhớ đăng nhập</Checkbox>
                                <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 500 }}>Quên mật khẩu?</Link>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                style={{
                                    height: 44,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                                    border: 'none',
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider />

                    <div style={{ textAlign: 'center' }}>
                        <Text>Chưa có tài khoản? </Text>
                        <Link to="/register">Đăng ký ngay</Link>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default Login;