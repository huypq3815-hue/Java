import { Card, Form, Input, Button, Avatar, Upload, message, Typography } from 'antd';
import { UserOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const onFinish = (values) => {
        // Cập nhật local storage giả lập
        const updatedUser = { ...user, ...values };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        message.success('Cập nhật hồ sơ thành công! Vui lòng tải lại trang.');
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Card title="Hồ sơ cá nhân">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Avatar size={100} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                    <div style={{ marginTop: 16 }}>
                        <Upload showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Đổi ảnh đại diện</Button>
                        </Upload>
                    </div>
                </div>

                <Form layout="vertical" initialValues={user} onFinish={onFinish}>
                    <Form.Item label="Tên hiển thị" name="fullName" rules={[{ required: true }]}>
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input size="large" disabled />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone">
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item label="Trường / Đơn vị công tác" name="school">
                        <Input size="large" placeholder="Nhập tên trường..." />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block icon={<SaveOutlined />}>
                        Lưu thay đổi
                    </Button>
                </Form>
            </Card>
        </div>
    );
};
export default Profile;