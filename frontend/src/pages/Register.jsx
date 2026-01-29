import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, Select, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import './Register.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            //Api 
            await api.post('/auth/register', {
                username: values.username,
                email: values.email,
                password: values.password,
                phone: values.phone,
                role: 'TEACHER', // Mặc định đăng ký là giáo viên
            });
            message.success('Đăng ký thành công!');
            navigate('/login');
        } catch (error) {
            console.error('Register error:', error);
            message.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại!');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="register-container">
            {/* Animated Background Elements */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <Card className="register-card" style={{
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                borderRadius: 16,
                border: 'none',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                maxHeight: '90vh',
                overflowY: 'auto',
            }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Logo & Title */}
                    <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                        <div style={{
                            marginBottom: 16,
                            fontSize: 40,
                            animation: 'bounce 2s infinite',
                        }}>
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
                            Tạo tài khoản mới
                        </Text>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    {/* Registration Form */}
                    <Form
                        name="register"
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"
                    >
                        {/* HỌ VÀ TÊN */}
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ tên!' },
                                { min: 3, message: 'Họ tên tối thiểu 3 ký tự!' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nguyễn Văn A"
                                size="large"
                            />
                        </Form.Item>

                        {/* TÊN ĐĂNG NHẬP */}
                        <Form.Item
                            label="Tên đăng nhập"
                            name="username"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                { min: 4, message: 'Tên đăng nhập tối thiểu 4 ký tự!' },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!',
                                }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                size="large"
                            />
                        </Form.Item>

                        {/* EMAIL */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="nguyenvana@example.com"
                                size="large"
                            />
                        </Form.Item>

                        {/* SỐ ĐIỆN THOẠI */}
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                {
                                    pattern: /^[0-9]{10}$/,
                                    message: 'Số điện thoại phải là 10 chữ số'
                                }
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="0123456789"
                                size="large"
                            />
                        </Form.Item>

                        {/* MẬT KHẨU */}
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu"
                                size="large"
                            />
                        </Form.Item>

                        {/* XÁC NHẬN MẬT KHẨU */}
                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Xác nhận mật khẩu"
                                size="large"
                            />
                        </Form.Item>

                        {/* Nút đăng kí */}
                        <Form.Item style={{ marginBottom: 16 }}>
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
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.4)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* LINK ĐẾN LOGIN */}
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{
                        textAlign: 'center',
                        padding: '8px 0',
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                        borderRadius: 8,
                    }}>
                        <Text style={{ fontSize: 14 }}>Đã có tài khoản? </Text>
                        <Link to="/login" style={{
                            fontWeight: 700,
                            color: '#047857',
                            fontSize: 15,
                            transition: 'all 0.3s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#0891b2';
                                e.target.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#047857';
                                e.target.style.textDecoration = 'none';
                            }}
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default Register;
