import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';

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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <Card style={{
                width: 450,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                borderRadius: 12,
                maxHeight: '90vh',
                overflowY: 'auto',
            }}>
                < Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Logo & Title */}
                    <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: 8, color: '#667eea' }}>
                            PlanbookAI
                        </Title>
                        <Text type="secondary">Tạo tài khoản mới</Text>
                    </div>

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
                                placeholder="username123"
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
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* LINK ĐẾN LOGIN */}
                    <div style={{ textAlign: 'center' }}>
                        <Text>Đã có tài khoản? </Text>
                        <Link to="/login">Đăng nhập ngay</Link>
                    </div>
                </ Space>
            </Card>
        </div>
    );
};
export default Register;
