import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Switch, Card, message } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../config/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ GỌI API LẤY DANH SÁCH USER (API CỦA HUY)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response || []);
        } catch (error) {
            console.error('❌ Fetch users error:', error);
            message.error('Không thể tải danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ✅ TOGGLE ACTIVE/INACTIVE
    const handleToggleActive = async (userId, currentStatus) => {
        try {
            await api.put(`/admin/users/${userId}/toggle-active`);
            message.success(
                currentStatus ? 'Đã vô hiệu hóa tài khoản!' : 'Đã kích hoạt tài khoản!'
            );
            fetchUsers();
        } catch (error) {
            message.error('Cập nhật thất bại!');
        }
    };

    // ✅ TABLE COLUMNS
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                const color = role === 'ADMIN' ? 'red' : role === 'TEACHER' ? 'blue' : 'green';
                return <Tag color={color}>{role}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleActive(record.id, isActive)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                />
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                >
                    Sửa
                </Button>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ marginBottom: 16 }}>
                <h2>Quản lý người dùng</h2>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey="id"
                pagination={{
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} người dùng`,
                }}
            />
        </Card>
    );
};

export default UserList;