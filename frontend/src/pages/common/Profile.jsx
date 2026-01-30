import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Row, Col, Divider, message, Spin, Avatar, Space, Modal } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../config/api';
import { showErrorMessage, showSuccessMessage } from '../../utils/errorHandler';
import { validatePassword } from '../../utils/validators';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwordForm] = Form.useForm();
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/me');
            setUser(response);
            form.setFieldsValue({
                username: response.username,
                email: response.email,
                fullName: response.fullName,
                phone: response.phone || ''
            });
        } catch (error) {
            showErrorMessage(error, 'Không thể tải thông tin hồ sơ!');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (values) => {
        setLoading(true);
        try {
            await api.put('/users/me', {
                fullName: values.fullName,
                phone: values.phone
            });
            setUser({ ...user, ...values });
            setEditing(false);
            showSuccessMessage('Cập nhật hồ sơ thành công!');
        } catch (error) {
            showErrorMessage(error, 'Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (values) => {
        if (!validatePassword(values.newPassword)) {
            message.error('Mật khẩu phải có ít nhất 6 ký tự và 1 số!');
            return;
        }

        if (values.newPassword !== values.confirmPassword) {
            message.error('Mật khẩu không khớp!');
            return;
        }

        setPasswordLoading(true);
        try {
            await api.post('/users/me/change-password', {
                oldPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            showSuccessMessage('Đổi mật khẩu thành công!');
            setPasswordModalOpen(false);
            passwordForm.resetFields();
        } catch (error) {
            showErrorMessage(error, 'Đổi mật khẩu thất bại!');
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '24px' }}>Hồ sơ của tôi</h1>

            {/* Profile Header */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={24} align="middle">
                    <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                        <Avatar
                            size={120}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#0891b2' }}
                        />
                    </Col>
                    <Col xs={24} sm={18}>
                        <h2 style={{ margin: '0 0 8px 0' }}>{user?.fullName || user?.username}</h2>
                        <p style={{ margin: '0 0 4px 0', color: '#666' }}>
                            Email: {user?.email}
                        </p>
                        <p style={{ margin: '0 0 16px 0', color: '#666' }}>
                            ID: {user?.id}
                        </p>
                        <Space>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => setEditing(!editing)}
                            >
                                {editing ? 'Hủy' : 'Sửa thông tin'}
                            </Button>
                            <Button
                                icon={<LockOutlined />}
                                onClick={() => setPasswordModalOpen(true)}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Profile Form */}
            <Card title="Thông tin cá nhân">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                    >
                        <Input
                            prefix={<UserOutlined />}
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input
                            prefix={<MailOutlined />}
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tên đầy đủ"
                        name="fullName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên!' },
                            { min: 2, message: 'Tên tối thiểu 2 ký tự!' }
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên đầy đủ"
                            disabled={!editing}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Nhập số điện thoại"
                            disabled={!editing}
                        />
                    </Form.Item>

                    {editing && (
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                block
                            >
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </Card>

            <Divider />

            {/* Account Info */}
            <Card title="Thông tin tài khoản">
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Vai trò:</strong>
                            <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                                {user?.role?.replace('ROLE_', '') || '-'}
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Trạng thái:</strong>
                            <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                                {user?.enabled ? '✅ Hoạt động' : '❌ Bị khóa'}
                            </p>
                        </div>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <div>
                            <strong>Ngày tạo:</strong>
                            <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div>
                            <strong>Lần đăng nhập cuối:</strong>
                            <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : '-'}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Change Password Modal */}
            <Modal
                title="Đổi mật khẩu"
                open={passwordModalOpen}
                onCancel={() => {
                    setPasswordModalOpen(false);
                    passwordForm.resetFields();
                }}
                footer={[
                    <Button key="cancel" onClick={() => setPasswordModalOpen(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={passwordLoading}
                        onClick={() => passwordForm.submit()}
                    >
                        Đổi mật khẩu
                    </Button>
                ]}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
