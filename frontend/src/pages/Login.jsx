import { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message, Card, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';

const { Title, Text } = Typography;
const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username: values.username,
                password: values.password,
            });
            const { accessToken, user } = response;

            // Lưu vào localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            message.success('Đăng nhập thành công!');

            // Redirect dựa theo role
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role === 'TEACHER') {
                navigate('/teacher/dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            console.error('Login error:', error);
            message.error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <Card style={{
                width: 400,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                borderRadius: 12,
            }}
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Logo & Title */}
                    <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: 8, color: '#667eea' }}>
                            PlanbookAI
                        </Title>
                        <Text type="secondary">Đăng nhập vào hệ thống</Text>
                    </div>

                    {/* Login Form */}
                    <Form
                        name="login"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Tên đăng nhập"
                            name="username"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nhập username hoặc email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Register Link */}
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