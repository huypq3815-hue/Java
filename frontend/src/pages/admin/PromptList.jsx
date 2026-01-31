import { useState, useEffect } from 'react';
import {
    Table, Button, Space, Tag, Input, message, Popconfirm, Card, Row, Col,
    Modal, Form, Empty, Tooltip, Badge
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import api from '../../config/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showErrorMessage, showSuccessMessage } from '../../utils/errorHandler';

const { Search } = Input;

const PromptList = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [form] = Form.useForm();
    const [modalLoading, setModalLoading] = useState(false);

    // View modal
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewPrompt, setViewPrompt] = useState(null);

    useEffect(() => {
        fetchPrompts();
    }, [pagination.current, pagination.pageSize, searchText]);

    const fetchPrompts = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current - 1,
                size: pagination.pageSize,
                ...(searchText && { search: searchText })
            };

            const response = await api.get('/prompts', { params });

            let data = [];
            let total = 0;

            if (Array.isArray(response)) {
                data = response;
                total = response.length;
            } else if (response.content) {
                data = response.content;
                total = response.totalElements || response.content.length;
            }

            setPrompts(data);
            setPagination({ ...pagination, total });
        } catch (error) {
            showErrorMessage(error, 'Không thể tải danh sách prompts!');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, prompt = null) => {
        setModalMode(mode);
        setSelectedPrompt(prompt);

        if (mode === 'edit' && prompt) {
            form.setFieldsValue({
                name: prompt.name,
                description: prompt.description,
                content: prompt.content,
                category: prompt.category
            });
        } else {
            form.resetFields();
        }

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
        setSelectedPrompt(null);
    };

    const handleSavePrompt = async (values) => {
        setModalLoading(true);
        try {
            if (modalMode === 'create') {
                await api.post('/prompts', values);
                showSuccessMessage('Tạo prompt thành công!');
            } else {
                await api.put(`/prompts/${selectedPrompt.id}`, values);
                showSuccessMessage('Cập nhật prompt thành công!');
            }

            handleCloseModal();
            fetchPrompts();
        } catch (error) {
            showErrorMessage(error, 'Lưu prompt thất bại!');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/prompts/${id}`);
            showSuccessMessage('Xóa prompt thành công!');
            fetchPrompts();
        } catch (error) {
            showErrorMessage(error, 'Xóa thất bại!');
        }
    };

    const handleViewPrompt = (prompt) => {
        setViewPrompt(prompt);
        setViewModalOpen(true);
    };

    const handleReset = () => {
        setSearchText('');
        setPagination({ current: 1, pageSize: 10, total: 0 });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60
        },
        {
            title: 'Tên Prompt',
            dataIndex: 'name',
            key: 'name',
            width: 150
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (text) => (
                <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {text || '-'}
                </div>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            render: (category) => {
                const colors = {
                    'question_generation': 'blue',
                    'lesson_planning': 'green',
                    'grading': 'orange',
                    'other': 'default'
                };
                const labels = {
                    'question_generation': 'Tạo câu hỏi',
                    'lesson_planning': 'Giáo án',
                    'grading': 'Chấm bài',
                    'other': 'Khác'
                };
                return <Tag color={colors[category] || 'default'}>{labels[category] || category}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewPrompt(record)}
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
                    <Popconfirm
                        title="Xóa prompt"
                        description="Bạn có chắc muốn xóa prompt này?"
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

    const stats = {
        total: prompts.length,
        questionGen: prompts.filter(p => p.category === 'question_generation').length,
        lessonPlan: prompts.filter(p => p.category === 'lesson_planning').length,
        grading: prompts.filter(p => p.category === 'grading').length
    };

    if (loading && prompts.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <h1>Quản lý Prompt AI</h1>
                </Col>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchPrompts} loading={loading}>
                        Làm mới
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenModal('create')}
                    >
                        Thêm Prompt
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
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                                {stats.questionGen}
                            </div>
                            <div style={{ color: '#666' }}>Tạo câu hỏi</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                                {stats.lessonPlan}
                            </div>
                            <div style={{ color: '#666' }}>Giáo án</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                                {stats.grading}
                            </div>
                            <div style={{ color: '#666' }}>Chấm bài</div>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Filters */}
            <Card style={{ marginBottom: '24px' }}>
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={12} md={12}>
                        <Search
                            placeholder="Tìm kiếm prompt..."
                            onSearch={text => {
                                setSearchText(text);
                                setPagination({ ...pagination, current: 1 });
                            }}
                            enterButton={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                        <Button block onClick={handleReset}>
                            Đặt lại bộ lọc
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                {prompts.length === 0 ? (
                    <Empty description="Chưa có prompt nào" style={{ padding: '40px' }} />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={prompts}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            ...pagination,
                            onChange: (page, pageSize) => {
                                setPagination({ ...pagination, current: page, pageSize });
                            }
                        }}
                        scroll={{ x: 1000 }}
                    />
                )}
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={modalMode === 'create' ? 'Tạo Prompt' : 'Sửa Prompt'}
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
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleSavePrompt}>
                    <Form.Item
                        label="Tên Prompt"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên prompt!' },
                            { min: 3, message: 'Tên tối thiểu 3 ký tự!' }
                        ]}
                    >
                        <Input placeholder="Nhập tên prompt" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Nhập mô tả prompt" />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung Prompt"
                        name="content"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung prompt!' }]}
                    >
                        <Input.TextArea
                            rows={6}
                            placeholder="Nhập prompt (VD: Hãy tạo 1 câu hỏi trắc nghiệm về Hóa học...)"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="category"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                    >
                        <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                            <option value="question_generation">Tạo câu hỏi</option>
                            <option value="lesson_planning">Giáo án</option>
                            <option value="grading">Chấm bài</option>
                            <option value="other">Khác</option>
                        </select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal
                title="Chi tiết Prompt"
                open={viewModalOpen}
                onCancel={() => setViewModalOpen(false)}
                footer={null}
                width={700}
            >
                {viewPrompt && (
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Tên:</strong> {viewPrompt.name}
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Mô tả:</strong> {viewPrompt.description}
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Danh mục:</strong>
                            <Tag color="blue" style={{ marginLeft: '8px' }}>
                                {viewPrompt.category}
                            </Tag>
                        </div>
                        <div>
                            <strong>Nội dung:</strong>
                            <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', marginTop: '8px', maxHeight: '300px', overflow: 'auto' }}>
                                {viewPrompt.content}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PromptList;
