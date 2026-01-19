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
            <Card style={{ width: 450, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', borderRadius: 12 }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: 8, color: '#667eea' }}>
                            PlanbookAI
                        </Title>
                        <Text type="secondary">Tạo tài khoản mới</Text>
                    </div>
