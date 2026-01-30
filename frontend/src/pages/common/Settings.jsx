import { useState } from 'react';
import { Card, Form, Switch, Button, Row, Col, Divider, message, Space, Select, Checkbox, Modal } from 'antd';
import { SaveOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../config/api';
import { showErrorMessage, showSuccessMessage } from '../../utils/errorHandler';

const { Option } = Select;

const Settings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        darkMode: false,
        language: 'vi',
        fontSize: 'medium'
    });

    // Load settings from localStorage
    useState(() => {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSettings(parsed);
            form.setFieldsValue(parsed);
        }
    }, [form]);

    const handleSaveSettings = async (values) => {
        setLoading(true);
        try {
            // Save to localStorage
            localStorage.setItem('appSettings', JSON.stringify(values));
            setSettings(values);

            // Optional: sync with backend
            await api.post('/settings', values).catch(() => null);

            showSuccessMessage('Lưu cài đặt thành công!');
        } catch (error) {
            showErrorMessage(error, 'Lưu cài đặt thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSettings = () => {
        Modal.confirm({
            title: 'Đặt lại cài đặt',
            content: 'Bạn có chắc muốn đặt lại tất cả cài đặt về mặc định?',
            okText: 'Đặt lại',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                const defaults = {
                    theme: 'light',
                    notifications: true,
                    emailNotifications: true,
                    darkMode: false,
                    language: 'vi',
                    fontSize: 'medium'
                };
                localStorage.setItem('appSettings', JSON.stringify(defaults));
                setSettings(defaults);
                form.setFieldsValue(defaults);
                showSuccessMessage('Đã đặt lại cài đặt mặc định!');
            }
        });
    };

    const handleClearCache = () => {
        Modal.confirm({
            title: 'Xóa bộ nhớ cache',
            content: 'Bạn có chắc muốn xóa tất cả dữ liệu cache? Hành động này sẽ làm cho ứng dụng chạy chậm hơn lần đầu.',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                // Clear localStorage
                const keysToKeep = ['accessToken', 'user', 'appSettings'];
                const keysToDelete = Object.keys(localStorage).filter(key => !keysToKeep.includes(key));
                keysToDelete.forEach(key => localStorage.removeItem(key));

                showSuccessMessage('Đã xóa cache thành công!');
            }
        });
    };

    const handleLogoutAllDevices = () => {
        Modal.confirm({
            title: 'Đăng xuất trên tất cả thiết bị',
            content: 'Bạn sẽ phải đăng nhập lại trên tất cả thiết bị. Tiếp tục?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await api.post('/auth/logout-all-devices').catch(() => null);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                } catch (error) {
                    showErrorMessage(error, 'Đăng xuất thất bại!');
                }
            }
        });
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '24px' }}>Cài đặt</h1>

            <Form
                form={form}
                layout="vertical"
                initialValues={settings}
                onFinish={handleSaveSettings}
            >
                {/* Display Settings */}
                <Card title="Giao diện" style={{ marginBottom: '16px' }}>
                    <Form.Item
                        label="Chế độ sáng/tối"
                        name="darkMode"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Tối" unCheckedChildren="Sáng" />
                    </Form.Item>

                    <Form.Item
                        label="Kích thước font chữ"
                        name="fontSize"
                    >
                        <Select>
                            <Option value="small">Nhỏ</Option>
                            <Option value="medium">Bình thường</Option>
                            <Option value="large">Lớn</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngôn ngữ"
                        name="language"
                    >
                        <Select>
                            <Option value="vi">Tiếng Việt</Option>
                            <Option value="en">English</Option>
                        </Select>
                    </Form.Item>
                </Card>

                <Divider />

                {/* Notification Settings */}
                <Card title="Thông báo" style={{ marginBottom: '16px' }}>
                    <Form.Item
                        label="Bật thông báo trong ứng dụng"
                        name="notifications"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Bật thông báo qua email"
                        name="emailNotifications"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <div style={{ padding: '12px', backgroundColor: '#f0f2f5', borderRadius: '4px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                            Bạn sẽ nhận được thông báo khi:
                        </p>
                        <Checkbox style={{ display: 'block', marginBottom: '8px' }}>
                            Có câu hỏi mới được thêm vào kho
                        </Checkbox>
                        <Checkbox style={{ display: 'block', marginBottom: '8px' }}>
                            Đề thi được tạo hoặc cập nhật
                        </Checkbox>
                        <Checkbox style={{ display: 'block' }}>
                            Có hoạt động người dùng bất thường
                        </Checkbox>
                    </div>
                </Card>

                <Divider />

                {/* Buttons */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            icon={<SaveOutlined />}
                            loading={loading}
                        >
                            Lưu cài đặt
                        </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Button
                            block
                            icon={<ReloadOutlined />}
                            onClick={handleResetSettings}
                        >
                            Đặt lại mặc định
                        </Button>
                    </Col>
                </Row>

                {/* Danger Zone */}
                <Card title="Vùng nguy hiểm" style={{ borderColor: '#ff4d4f' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                <strong>Xóa bộ nhớ cache</strong>
                            </p>
                            <p style={{ color: '#666', fontSize: '12px', marginBottom: '12px' }}>
                                Xóa dữ liệu cache sẽ giải phóng không gian lưu trữ trên thiết bị của bạn.
                            </p>
                            <Button danger icon={<DeleteOutlined />} onClick={handleClearCache}>
                                Xóa cache
                            </Button>
                        </div>

                        <Divider />

                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                <strong>Đăng xuất trên tất cả thiết bị</strong>
                            </p>
                            <p style={{ color: '#666', fontSize: '12px', marginBottom: '12px' }}>
                                Bạn sẽ phải đăng nhập lại trên tất cả thiết bị khác.
                            </p>
                            <Button danger onClick={handleLogoutAllDevices}>
                                Đăng xuất tất cả
                            </Button>
                        </div>
                    </Space>
                </Card>
            </Form>
        </div>
    );
};

export default Settings;
