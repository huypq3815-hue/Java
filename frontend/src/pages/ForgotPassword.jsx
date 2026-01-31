import { useState } from 'react';
import { Form, Input, Button, Card, message, Steps, Result, Space } from 'antd';
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { validateEmail } from '../utils/validators';
import { showErrorMessage, showSuccessMessage } from '../utils/errorHandler';
import './Login.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(0); // 0: email, 1: verify, 2: reset, 3: success
    const [userEmail, setUserEmail] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleRequestReset = async (values) => {
        if (!validateEmail(values.email)) {
            message.error('Email không hợp lệ!');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: values.email });
            setUserEmail(values.email);
            showSuccessMessage('Mã xác nhận đã được gửi đến email của bạn!');
            setCurrent(1);
        } catch (error) {
            showErrorMessage(error, 'Không tìm thấy tài khoản với email này!');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (values) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/verify-reset-code', {
                email: userEmail,
                code: values.code
            });
            setResetToken(response.token);
            showSuccessMessage('Xác nhận thành công!');
            setCurrent(2);
            form.resetFields();
        } catch (error) {
            showErrorMessage(error, 'Mã xác nhận không chính xác!');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (values) => {
        if (values.password !== values.confirmPassword) {
            message.error('Mật khẩu không khớp!');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token: resetToken,
                newPassword: values.password
            });
            showSuccessMessage('Mật khẩu đã được đặt lại thành công!');
            setCurrent(3);
        } catch (error) {
            showErrorMessage(error, 'Đặt lại mật khẩu thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="login-container">
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="login-wrapper">
                <Card className="login-card" style={{ maxWidth: '500px' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
                            🔐 Đặt lại mật khẩu
                        </h1>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            PlanbookAI - Cổng công cụ AI cho giáo viên
                        </p>
                    </div>

                    {/* Steps */}
                    <Steps
                        current={current}
                        items={[
                            { title: 'Email' },
                            { title: 'Xác nhận' },
                            { title: 'Mật khẩu' },
                            { title: 'Hoàn tất' }
                        ]}
                        style={{ marginBottom: '32px' }}
                    />

                    {/* Step 0: Email */}
                    {current === 0 && (
                        <Form form={form} layout="vertical" onFinish={handleRequestReset}>
                            <Form.Item
                                label="Nhập email của bạn"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="your.email@example.com"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    size="large"
                                >
                                    Gửi mã xác nhận
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Button
                                    type="link"
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBackToLogin}
                                >
                                    Quay lại đăng nhập
                                </Button>
                            </div>
                        </Form>
                    )}

                    {/* Step 1: Verify Code */}
                    {current === 1 && (
                        <Form form={form} layout="vertical" onFinish={handleVerifyCode}>
                            <Form.Item label={`Mã xác nhận đã gửi tới ${userEmail}`} />

                            <Form.Item
                                label="Nhập mã xác nhận"
                                name="code"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã xác nhận!' },
                                    { len: 6, message: 'Mã xác nhận phải 6 ký tự!' }
                                ]}
                            >
                                <Input
                                    placeholder="000000"
                                    maxLength={6}
                                    size="large"
                                    style={{ letterSpacing: '4px' }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    size="large"
                                >
                                    Xác nhận
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Button type="link" onClick={() => setCurrent(0)}>
                                    ← Quay lại
                                </Button>
                                <span style={{ color: '#999' }}> • </span>
                                <Button type="link" onClick={() => handleRequestReset({ email: userEmail })}>
                                    Gửi lại mã
                                </Button>
                            </div>
                        </Form>
                    )}

                    {/* Step 2: Reset Password */}
                    {current === 2 && (
                        <Form form={form} layout="vertical" onFinish={handleResetPassword}>
                            <Form.Item
                                label="Mật khẩu mới"
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu mới"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Xác nhận mật khẩu"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    size="large"
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {/* Step 3: Success */}
                    {current === 3 && (
                        <Result
                            status="success"
                            title="Mật khẩu đã được đặt lại thành công!"
                            subTitle="Bạn có thể đăng nhập lại với mật khẩu mới."
                            extra={
                                <Button
                                    type="primary"
                                    onClick={handleBackToLogin}
                                    size="large"
                                >
                                    Quay lại đăng nhập
                                </Button>
                            }
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
