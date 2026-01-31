import { useState, useEffect } from 'react';
import {
    Table, Button, Space, Tag, Input, Select, message, Popconfirm, Card, Row, Col,
    Modal, Form, InputNumber, Empty, Tooltip, Badge
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined,
    EyeOutlined, LockOutlined
} from '@ant-design/icons';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showErrorMessage, showSuccessMessage } from '../../utils/errorHandler';

const { Search } = Input;
const { Option } = Select;

const UserList = () => {
    // State management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filters
    const [filters, setFilters] = useState({
        role: null,
        status: null
    });

    // Form & Modal
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // create or edit
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // View modal
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null);

    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, [filters, searchText, pagination.current, pagination.pageSize]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current - 1,
                size: pagination.pageSize,
                ...(filters.role && { role: filters.role }),
                ...(searchText && { search: searchText })
            };

            const response = await api.get('/users', { params });

            let data = [];
            let total = 0;

            if (Array.isArray(response)) {
                data = response;
                total = response.length;
            } else if (response.content) {
                data = response.content;
                total = response.totalElements || response.content.length;
            }

            setUsers(data);
            setPagination({
                ...pagination,
                total
            });
        } catch (error) {
            showErrorMessage(error, 'Không thể tải danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        setSelectedUser(user);

        if (mode === 'edit' && user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            });
        } else {
            form.resetFields();
        }

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
        setSelectedUser(null);
    };

    const handleSaveUser = async (values) => {
        setModalLoading(true);
        try {
            if (modalMode === 'create') {
                await api.post('/users', values);
                showSuccessMessage('Tạo người dùng thành công!');
            } else {
                await api.put(`/users/${selectedUser.id}`, values);
                showSuccessMessage('Cập nhật người dùng thành công!');
            }

            handleCloseModal();
            fetchUsers();
        } catch (error) {
            showErrorMessage(error, 'Lưu thất bại!');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            showSuccessMessage('Xóa người dùng thành công!');
            fetchUsers();
        } catch (error) {
            showErrorMessage(error, 'Xóa thất bại!');
        }
    };

    const handleResetPassword = (user) => {
        Modal.confirm({
            title: 'Reset mật khẩu',
            content: `Bạn có chắc muốn reset mật khẩu cho ${user.username}?`,
            okText: 'Reset',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await api.post(`/users/${user.id}/reset-password`);
                    showSuccessMessage('Mật khẩu đã được reset!');
                } catch (error) {
                    showErrorMessage(error, 'Reset mật khẩu thất bại!');
                }
            }
        });
    };

    const handleToggleStatus = (user) => {
        const newStatus = user.enabled ? 'deactivate' : 'activate';
        const actionText = user.enabled ? 'khóa' : 'mở khóa';

        Modal.confirm({
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} tài khoản`,
            content: `Bạn có chắc muốn ${actionText} tài khoản ${user.username}?`,
            okText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const endpoint = user.enabled ? 'deactivate' : 'activate';
                    await api.post(`/users/${user.id}/${endpoint}`);
                    showSuccessMessage(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} tài khoản thành công!`);
                    fetchUsers();
                } catch (error) {
                    showErrorMessage(error, `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thất bại!`);
                }
            }
        });
    };

    const handleViewUser = (user) => {
        setViewUser(user);
        setViewModalOpen(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters({
            ...filters,
            [key]: value
        });
        setPagination({ ...pagination, current: 1 });
    };

    const handleReset = () => {
        setFilters({ role: null, status: null });
        setSearchText('');
        setPagination({ current: 1, pageSize: 10, total: 0 });
    };

    // Statistics
    const stats = {
        total: users.length,
        admin: users.filter(u => u.role === 'ROLE_ADMIN').length,
        teacher: users.filter(u => u.role === 'ROLE_TEACHER').length,
        active: users.filter(u => u.enabled).length
    };

    // Columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 120
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180
        },
        {
            title: 'Tên đầy đủ',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role) => {
                const colors = {
                    'ROLE_ADMIN': 'red',
                    'ROLE_TEACHER': 'blue',
                    'ROLE_MANAGER': 'orange',
                    'ROLE_STAFF': 'cyan'
                };
                const labels = {
                    'ROLE_ADMIN': 'Admin',
                    'ROLE_TEACHER': 'Giáo viên',
                    'ROLE_MANAGER': 'Quản lý',
                    'ROLE_STAFF': 'Nhân viên'
                };
                return <Tag color={colors[role]}>{labels[role]}</Tag>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'enabled',
            key: 'enabled',
            width: 100,
            render: (enabled) => (
                <Tag color={enabled ? 'green' : 'red'}>
                    {enabled ? 'Hoạt động' : 'Bị khóa'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="small" wrap>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewUser(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenModal('edit', record)}
                        />
                    </Tooltip>
                    <Tooltip title="Reset mật khẩu">
                        <Button
                            type="text"
                            size="small"
                            icon={<LockOutlined />}
                            onClick={() => handleResetPassword(record)}
                        />
                    </Tooltip>
                    <Tooltip title={record.enabled ? 'Khóa' : 'Mở khóa'}>
                        <Button
                            type="text"
                            size="small"
                            danger={record.enabled}
                            onClick={() => handleToggleStatus(record)}
                        >
                            {record.enabled ? 'Khóa' : 'Mở'}
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    if (loading && users.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <h1>Quản lý người dùng</h1>
                </Col>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
                        Làm mới
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenModal('create')}
                    >
                        Thêm người dùng
                    </Button>
                </Space>
            </Row>

            {/* Statistics */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={16}>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0891b2' }}>
                                {stats.total}
                            </div>
                            <div style={{ color: '#666' }}>Tổng cộng</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                                {stats.admin}
                            </div>
                            <div style={{ color: '#666' }}>Admin</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                                {stats.teacher}
                            </div>
                            <div style={{ color: '#666' }}>Giáo viên</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                                {stats.active}
                            </div>
                            <div style={{ color: '#666' }}>Hoạt động</div>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <Search
                            placeholder="Tìm kiếm username/email..."
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            enterButton={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo vai trò"
                            allowClear
                            value={filters.role}
                            onChange={(value) => handleFilterChange('role', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="ROLE_ADMIN">Admin</Option>
                            <Option value="ROLE_TEACHER">Giáo viên</Option>
                            <Option value="ROLE_MANAGER">Quản lý</Option>
                            <Option value="ROLE_STAFF">Nhân viên</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            allowClear
                            value={filters.status}
                            onChange={(value) => handleFilterChange('status', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="active">Hoạt động</Option>
                            <Option value="inactive">Bị khóa</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button block onClick={handleReset}>
                            Đặt lại bộ lọc
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                {users.length === 0 ? (
                    <Empty
                        description={searchText || Object.values(filters).some(v => v) ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}
                        style={{ padding: '40px' }}
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={users}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            ...pagination,
                            onChange: (page, pageSize) => {
                                setPagination({ ...pagination, current: page, pageSize });
                            }
                        }}
                        scroll={{ x: 1200 }}
                    />
                )}
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={modalMode === 'create' ? 'Tạo người dùng' : 'Sửa người dùng'}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={modalLoading}
                        onClick={() => form.submit()}
                    >
                        {modalMode === 'create' ? 'Tạo' : 'Cập nhật'}
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveUser}
                >
                    {modalMode === 'create' && (
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                { required: true, message: 'Vui lòng nhập username!' },
                                { min: 3, message: 'Username tối thiểu 3 ký tự!' }
                            ]}
                        >
                            <Input placeholder="Nhập username" />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" type="email" />
                    </Form.Item>

                    <Form.Item
                        label="Tên đầy đủ"
                        name="fullName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên!' },
                            { min: 2, message: 'Tên tối thiểu 2 ký tự!' }
                        ]}
                    >
                        <Input placeholder="Nhập tên đầy đủ" />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Option value="ROLE_ADMIN">Admin</Option>
                            <Option value="ROLE_TEACHER">Giáo viên</Option>
                            <Option value="ROLE_MANAGER">Quản lý</Option>
                            <Option value="ROLE_STAFF">Nhân viên</Option>
                        </Select>
                    </Form.Item>

                    {modalMode === 'create' && (
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* View Details Modal */}
            <Modal
                title="Chi tiết người dùng"
                open={viewModalOpen}
                onCancel={() => setViewModalOpen(false)}
                footer={null}
                width={600}
            >
                {viewUser && (
                    <div>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col xs={12}>
                                <strong>ID:</strong> {viewUser.id}
                            </Col>
                            <Col xs={12}>
                                <strong>Username:</strong> {viewUser.username}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col xs={12}>
                                <strong>Email:</strong> {viewUser.email}
                            </Col>
                            <Col xs={12}>
                                <strong>Tên:</strong> {viewUser.fullName}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginBottom: '16px' }}>
                            <Col xs={12}>
                                <strong>Vai trò:</strong>
                                <Tag color={viewUser.role === 'ROLE_ADMIN' ? 'red' : 'blue'}>
                                    {viewUser.role === 'ROLE_ADMIN' ? 'Admin' : 'Giáo viên'}
                                </Tag>
                            </Col>
                            <Col xs={12}>
                                <strong>Trạng thái:</strong>
                                <Tag color={viewUser.enabled ? 'green' : 'red'}>
                                    {viewUser.enabled ? 'Hoạt động' : 'Bị khóa'}
                                </Tag>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserList;
